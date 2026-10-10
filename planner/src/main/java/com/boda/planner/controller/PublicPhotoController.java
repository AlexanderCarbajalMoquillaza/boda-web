package com.boda.planner.controller;

import com.boda.planner.dto.WeddingPhotoResponse;
import com.boda.planner.service.WeddingPhotoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/invitations")
public class PublicPhotoController {
    private final WeddingPhotoService service;

    public PublicPhotoController(WeddingPhotoService service) { this.service = service; }

    @GetMapping("/{slug}/photos")
    public List<WeddingPhotoResponse> findVisible(@PathVariable String slug) {
        return service.findVisibleBySlug(slug);
    }
}
