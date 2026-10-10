package com.boda.planner.controller;

import com.boda.planner.dto.PublicInvitationResponse;
import com.boda.planner.service.PublicInvitationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/invitations")
public class PublicInvitationController {

    private final PublicInvitationService publicInvitationService;

    public PublicInvitationController(PublicInvitationService publicInvitationService) {
        this.publicInvitationService = publicInvitationService;
    }

    @GetMapping("/{slug}")
    public PublicInvitationResponse findBySlug(@PathVariable String slug) {
        return publicInvitationService.findBySlug(slug);
    }

}
