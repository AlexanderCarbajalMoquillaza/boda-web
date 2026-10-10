package com.boda.planner.service;

import com.boda.planner.dto.GuestRequest;
import com.boda.planner.dto.GuestResponse;
import com.boda.planner.dto.RsvpRequest;
import com.boda.planner.dto.RsvpResponse;
import com.boda.planner.exception.BusinessRuleException;
import com.boda.planner.exception.ResourceNotFoundException;
import com.boda.planner.model.Guest;
import com.boda.planner.model.GuestGroup;
import com.boda.planner.repository.GuestGroupRepository;
import com.boda.planner.repository.GuestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RsvpService {

    private final GuestGroupRepository guestGroupRepository;
    private final GuestRepository guestRepository;

    public RsvpService(GuestGroupRepository guestGroupRepository, GuestRepository guestRepository) {
        this.guestGroupRepository = guestGroupRepository;
        this.guestRepository = guestRepository;
    }

    public RsvpResponse findByToken(UUID token) {
        GuestGroup guestGroup = findGuestGroupByToken(token);
        List<GuestResponse> guests = guestRepository.findByGuestGroupId(guestGroup.getId())
                .stream()
                .map(this::toGuestResponse)
                .toList();

        return toRsvpResponse(guestGroup, guests);
    }

    public RsvpResponse findBySlugAndToken(String slug, UUID token) {
        GuestGroup guestGroup = findGuestGroupByToken(token);
        if (!guestGroup.getWedding().getInvitationSlug().equals(slug)) {
            throw new ResourceNotFoundException("La invitación no corresponde a este grupo familiar");
        }
        List<GuestResponse> guests = guestRepository.findByGuestGroupId(guestGroup.getId())
                .stream()
                .map(this::toGuestResponse)
                .toList();
        return toRsvpResponse(guestGroup, guests);
    }

    @Transactional
    public RsvpResponse submitBySlugAndToken(String slug, UUID token, RsvpRequest request) {
        GuestGroup guestGroup = findGuestGroupByToken(token);
        if (!guestGroup.getWedding().getInvitationSlug().equals(slug)) {
            throw new ResourceNotFoundException("La invitación no corresponde a este grupo familiar");
        }
        return submit(token, request);
    }

    @Transactional
    public RsvpResponse submit(UUID token, RsvpRequest request) {
        GuestGroup guestGroup = findGuestGroupByToken(token);

        if (request.getGuests().size() > guestGroup.getMaxGuestsAllowed()) {
            throw new BusinessRuleException("El grupo solo tiene " + guestGroup.getMaxGuestsAllowed() + " pases disponibles");
        }

        List<Guest> existingGuests = guestRepository.findByGuestGroupId(guestGroup.getId());
        guestRepository.deleteAll(existingGuests);

        List<Guest> savedGuests = request.getGuests()
                .stream()
                .map(guestRequest -> toGuest(guestGroup, guestRequest))
                .map(guestRepository::save)
                .toList();

        guestGroup.setMessage(request.getMessage());
        guestGroup.setStatus(calculateGroupStatus(savedGuests));
        guestGroupRepository.save(guestGroup);

        List<GuestResponse> guestResponses = savedGuests.stream()
                .map(this::toGuestResponse)
                .toList();

        return toRsvpResponse(guestGroup, guestResponses);
    }

    private GuestGroup findGuestGroupByToken(UUID token) {
        return guestGroupRepository.findByAccessToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invitacion no encontrada"));
    }

    private Guest toGuest(GuestGroup guestGroup, GuestRequest request) {
        Guest guest = new Guest();
        guest.setGuestGroup(guestGroup);
        guest.setFullName(request.getFullName());
        guest.setAgeGroup(defaultIfBlank(request.getAgeGroup(), "ADULT"));
        guest.setMenuOption(request.getMenuOption());
        guest.setAllergies(request.getAllergies());
        guest.setAttendanceStatus(defaultIfBlank(request.getAttendanceStatus(), "PENDING"));
        return guest;
    }

    private GuestResponse toGuestResponse(Guest guest) {
        return new GuestResponse(
                guest.getId(),
                guest.getFullName(),
                guest.getAgeGroup(),
                guest.getMenuOption(),
                guest.getAllergies(),
                guest.getAttendanceStatus()
        );
    }

    private RsvpResponse toRsvpResponse(GuestGroup guestGroup, List<GuestResponse> guests) {
        return new RsvpResponse(
                guestGroup.getId(),
                guestGroup.getContactName(),
                guestGroup.getAccessToken(),
                guestGroup.getMaxGuestsAllowed(),
                guestGroup.getStatus(),
                guestGroup.getWedding().getTitle(),
                guests
        );
    }

    private String calculateGroupStatus(List<Guest> guests) {
        boolean hasConfirmedGuest = guests.stream()
                .anyMatch(guest -> "CONFIRMED".equals(guest.getAttendanceStatus()));

        if (hasConfirmedGuest) {
            return "CONFIRMED";
        }

        return "DECLINED";
    }

    private String defaultIfBlank(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return value;
    }
}
