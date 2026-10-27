package com.boda.planner.controller;

import com.boda.planner.dto.DoorAccessResponse;
import com.boda.planner.dto.ToggleCheckInRequest;
import com.boda.planner.exception.ResourceNotFoundException;
import com.boda.planner.model.Guest;
import com.boda.planner.model.GuestGroup;
import com.boda.planner.model.Wedding;
import com.boda.planner.repository.GuestGroupRepository;
import com.boda.planner.repository.GuestRepository;
import com.boda.planner.repository.WeddingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/door-access")
public class DoorAccessController {

    private final WeddingRepository weddingRepository;
    private final GuestGroupRepository guestGroupRepository;
    private final GuestRepository guestRepository;

    public DoorAccessController(
            WeddingRepository weddingRepository,
            GuestGroupRepository guestGroupRepository,
            GuestRepository guestRepository
    ) {
        this.weddingRepository = weddingRepository;
        this.guestGroupRepository = guestGroupRepository;
        this.guestRepository = guestRepository;
    }

    private Wedding validateAccess(String slug, String doorKey) {
        Wedding wedding = weddingRepository.findByInvitationSlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Boda no encontrada con el enlace especificado"));
        String expectedKey = wedding.getDoorAccessKey();
        if (expectedKey == null || doorKey == null || !expectedKey.trim().equalsIgnoreCase(doorKey.trim())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso no autorizado al control de ingreso");
        }
        return wedding;
    }

    @GetMapping("/{slug}/{doorKey}")
    public DoorAccessResponse getDoorAccessData(@PathVariable String slug, @PathVariable String doorKey) {
        Wedding wedding = validateAccess(slug, doorKey);

        List<GuestGroup> groups = guestGroupRepository.findByWeddingId(wedding.getId());
        List<DoorAccessResponse.GuestDoorItem> items = new ArrayList<>();

        for (GuestGroup group : groups) {
            List<Guest> guests = guestRepository.findByGuestGroupId(group.getId());
            if (guests != null && !guests.isEmpty()) {
                for (Guest guest : guests) {
                    DoorAccessResponse.GuestDoorItem item = new DoorAccessResponse.GuestDoorItem();
                    item.setId("guest-" + guest.getId());
                    item.setGuestId(guest.getId());
                    item.setGroupId(group.getId());
                    item.setGuestName(guest.getFullName());
                    item.setGroupName(group.getContactName());
                    item.setStatus(guest.getAttendanceStatus());
                    item.setCheckedIn(Boolean.TRUE.equals(guest.getCheckedIn()));
                    item.setCheckedInAt(guest.getCheckedInAt());
                    item.setIsHolderOnly(false);
                    items.add(item);
                }
            } else {
                DoorAccessResponse.GuestDoorItem item = new DoorAccessResponse.GuestDoorItem();
                item.setId("group-" + group.getId());
                item.setGuestId(null);
                item.setGroupId(group.getId());
                item.setGuestName(group.getContactName());
                item.setGroupName(group.getContactName());
                item.setStatus(group.getStatus());
                item.setCheckedIn(Boolean.TRUE.equals(group.getCheckedIn()));
                item.setCheckedInAt(group.getCheckedInAt());
                item.setIsHolderOnly(true);
                items.add(item);
            }
        }

        return new DoorAccessResponse(
                wedding.getId(),
                wedding.getTitle(),
                wedding.getPartnerOneName(),
                wedding.getPartnerTwoName(),
                wedding.getWeddingDate(),
                wedding.getTablesJson(),
                wedding.getPrimaryColor(),
                wedding.getAccentColor(),
                wedding.getBackgroundColor(),
                items
        );
    }

    @PostMapping("/{slug}/{doorKey}/toggle")
    public Map<String, Object> toggleCheckIn(
            @PathVariable String slug,
            @PathVariable String doorKey,
            @RequestBody ToggleCheckInRequest request
    ) {
        Wedding wedding = validateAccess(slug, doorKey);

        boolean target = request.getCheckedIn() != null ? request.getCheckedIn() : true;
        LocalDateTime now = target ? LocalDateTime.now() : null;

        if (request.getGuestId() != null) {
            Guest guest = guestRepository.findById(request.getGuestId())
                    .orElseThrow(() -> new ResourceNotFoundException("Invitado no encontrado"));
            if (!guest.getGuestGroup().getWedding().getId().equals(wedding.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El invitado no pertenece a esta boda");
            }
            guest.setCheckedIn(target);
            guest.setCheckedInAt(now);
            guestRepository.save(guest);
        } else if (request.getGroupId() != null) {
            GuestGroup group = guestGroupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Grupo familiar no encontrado"));
            if (!group.getWedding().getId().equals(wedding.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El grupo no pertenece a esta boda");
            }
            group.setCheckedIn(target);
            group.setCheckedInAt(now);
            guestGroupRepository.save(group);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Se requiere guestId o groupId");
        }

        return Map.of("success", true, "checkedIn", target);
    }
}
