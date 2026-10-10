package com.boda.planner.controller;

import com.boda.planner.dto.RsvpRequest;
import com.boda.planner.dto.RsvpResponse;
import com.boda.planner.service.RsvpService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/public/rsvp")
public class PublicRsvpController {

    private final RsvpService rsvpService;

    public PublicRsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @GetMapping("/{slug}/{token}")
    public RsvpResponse findBySlugAndToken(
            @PathVariable String slug,
            @PathVariable UUID token
    ) {
        return rsvpService.findBySlugAndToken(slug, token);
    }

    @PostMapping("/{slug}/{token}")
    public RsvpResponse submitBySlugAndToken(
            @PathVariable String slug,
            @PathVariable UUID token,
            @Valid @RequestBody RsvpRequest request
    ) {
        return rsvpService.submitBySlugAndToken(slug, token, request);
    }
}
