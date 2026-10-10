package com.boda.planner.controller;

import com.boda.planner.dto.WeddingAudioResponse;
import com.boda.planner.service.WeddingAudioService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/weddings/{weddingId}/audio")
public class WeddingAudioController {
    private final WeddingAudioService service;
    public WeddingAudioController(WeddingAudioService service) { this.service = service; }
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public WeddingAudioResponse upload(@PathVariable Long weddingId, @RequestPart("file") MultipartFile file, @RequestPart(value = "title", required = false) String title, Authentication authentication) { return service.upload(weddingId, file, title, authentication.getName()); }
}
