package com.boda.planner.controller;

import com.boda.planner.dto.WeddingPhotoRequest;
import com.boda.planner.dto.WeddingPhotoResponse;
import com.boda.planner.service.WeddingPhotoService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/weddings/{weddingId}/photos")
public class WeddingPhotoController {
    private final WeddingPhotoService service;

    public WeddingPhotoController(WeddingPhotoService service) { this.service = service; }

    @GetMapping
    public List<WeddingPhotoResponse> findAll(@PathVariable Long weddingId, Authentication authentication) {
        return service.findAllForOwner(weddingId, authentication.getName());
    }

    @PostMapping
    public WeddingPhotoResponse create(@PathVariable Long weddingId, @Valid @RequestBody WeddingPhotoRequest request, Authentication authentication) {
        return service.create(weddingId, request, authentication.getName());
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public WeddingPhotoResponse upload(
            @PathVariable Long weddingId,
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "caption", required = false) String caption,
            @RequestPart(value = "section", required = false) String section,
            Authentication authentication
    ) {
        return service.upload(weddingId, file, caption, section, authentication.getName());
    }

    @PutMapping("/{photoId}")
    public WeddingPhotoResponse update(@PathVariable Long photoId, @Valid @RequestBody WeddingPhotoRequest request, Authentication authentication) {
        return service.update(photoId, request, authentication.getName());
    }

    @DeleteMapping("/{photoId}")
    public void delete(@PathVariable Long photoId, Authentication authentication) {
        service.delete(photoId, authentication.getName());
    }
}
