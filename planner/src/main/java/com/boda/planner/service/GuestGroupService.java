package com.boda.planner.service;

import com.boda.planner.dto.GuestGroupRequest;
import com.boda.planner.dto.GuestGroupResponse;
import com.boda.planner.dto.GuestResponse;
import com.boda.planner.exception.ResourceNotFoundException;
import com.boda.planner.model.GuestGroup;
import com.boda.planner.model.Wedding;
import com.boda.planner.repository.GuestGroupRepository;
import com.boda.planner.repository.GuestRepository;
import com.boda.planner.repository.WeddingRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
public class GuestGroupService {

    private final GuestGroupRepository guestGroupRepository;
    private final WeddingRepository weddingRepository;
    private final GuestRepository guestRepository;

    public GuestGroupService(GuestGroupRepository guestGroupRepository, WeddingRepository weddingRepository, GuestRepository guestRepository) {
        this.guestGroupRepository = guestGroupRepository;
        this.weddingRepository = weddingRepository;
        this.guestRepository = guestRepository;
    }

    public List<GuestGroupResponse> findByWedding(Long weddingId, String email) {
        verifyOwner(weddingId, email);
        return guestGroupRepository.findByWeddingId(weddingId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public GuestGroupResponse create(Long weddingId, GuestGroupRequest request, String email) {
        Wedding wedding = weddingRepository.findById(weddingId)
                .orElseThrow(() -> new ResourceNotFoundException("Boda no encontrada"));
        verifyOwner(wedding, email);

        GuestGroup guestGroup = new GuestGroup();
        guestGroup.setWedding(wedding);
        guestGroup.setContactName(request.getContactName());
        guestGroup.setContactEmail(request.getContactEmail());
        guestGroup.setContactPhone(request.getContactPhone());
        guestGroup.setMaxGuestsAllowed(request.getMaxGuestsAllowed());
        guestGroup.setStatus("PENDING");

        GuestGroup savedGuestGroup = guestGroupRepository.save(guestGroup);
        return toResponse(savedGuestGroup);
    }

    private void verifyOwner(Long weddingId, String email) {
        Wedding wedding = weddingRepository.findById(weddingId)
                .orElseThrow(() -> new ResourceNotFoundException("Boda no encontrada"));
        verifyOwner(wedding, email);
    }

    private void verifyOwner(Wedding wedding, String email) {
        if (!wedding.getOwnerUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("No tienes permiso para gestionar esta boda");
        }
    }

    private GuestGroupResponse toResponse(GuestGroup guestGroup) {
        List<GuestResponse> guests = guestRepository.findByGuestGroupId(guestGroup.getId())
                .stream()
                .map(guest -> new GuestResponse(guest.getId(), guest.getFullName(), guest.getAgeGroup(), guest.getMenuOption(), guest.getAllergies(), guest.getAttendanceStatus()))
                .toList();
        int confirmedGuests = (int) guests.stream()
                .filter(guest -> "CONFIRMED".equals(guest.getAttendanceStatus()))
                .count();
        return new GuestGroupResponse(
                guestGroup.getId(),
                guestGroup.getWedding().getId(),
                guestGroup.getContactName(),
                guestGroup.getContactEmail(),
                guestGroup.getContactPhone(),
                guestGroup.getAccessToken(),
                guestGroup.getMaxGuestsAllowed(),
                guestGroup.getStatus(),
                guests.size(),
                confirmedGuests,
                guests
        );
    }
}
