package com.boda.planner.controller;

import com.boda.planner.dto.WeddingAudioResponse;
import com.boda.planner.service.WeddingAudioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/invitations")
public class PublicAudioController {
    private final WeddingAudioService service;
    public PublicAudioController(WeddingAudioService service) { this.service = service; }
    @GetMapping("/{slug}/audio")
    public WeddingAudioResponse find(@PathVariable String slug) { return service.findPublic(slug); }
}
