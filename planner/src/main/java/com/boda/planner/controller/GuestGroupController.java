package com.boda.planner.controller;

import com.boda.planner.dto.GuestGroupRequest;
import com.boda.planner.dto.GuestGroupResponse;
import com.boda.planner.service.GuestGroupService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/weddings/{weddingId}/guest-groups")
public class GuestGroupController {

    private final GuestGroupService guestGroupService;

    public GuestGroupController(GuestGroupService guestGroupService) {
        this.guestGroupService = guestGroupService;
    }

    @GetMapping
    public List<GuestGroupResponse> findByWedding(@PathVariable Long weddingId, Authentication authentication) {
        return guestGroupService.findByWedding(weddingId, authentication.getName());
    }

    @PostMapping
    public GuestGroupResponse create(
            @PathVariable Long weddingId,
            @Valid @RequestBody GuestGroupRequest request,
            Authentication authentication
    ) {
        return guestGroupService.create(weddingId, request, authentication.getName());
    }

    @PostMapping("/checkin/toggle")
    public void toggleCheckIn(
            @PathVariable Long weddingId,
            @RequestBody com.boda.planner.dto.ToggleCheckInRequest request,
            Authentication authentication
    ) {
        guestGroupService.toggleCheckIn(weddingId, request.getGuestId(), request.getGroupId(), request.getCheckedIn(), authentication.getName());
    }
}
