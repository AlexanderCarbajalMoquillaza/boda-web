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

    @PutMapping("/{groupId}")
    public GuestGroupResponse update(
            @PathVariable Long weddingId,
            @PathVariable Long groupId,
            @Valid @RequestBody GuestGroupRequest request,
            Authentication authentication
    ) {
        return guestGroupService.update(weddingId, groupId, request, authentication.getName());
    }

    @DeleteMapping("/{groupId}")
    public java.util.Map<String, String> delete(
            @PathVariable Long weddingId,
            @PathVariable Long groupId,
            Authentication authentication
    ) {
        guestGroupService.delete(weddingId, groupId, authentication.getName());
        return java.util.Map.of("message", "Grupo familiar eliminado correctamente");
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
