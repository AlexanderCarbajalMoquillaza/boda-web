package com.boda.planner.controller;

import com.boda.planner.dto.WeddingRequest;
import com.boda.planner.dto.WeddingResponse;
import com.boda.planner.dto.WeddingContentRequest;
import com.boda.planner.dto.WeddingContentResponse;
import com.boda.planner.model.Wedding;
import com.boda.planner.repository.WeddingRepository;
import com.boda.planner.service.WeddingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weddings")
public class WeddingController {
    private final WeddingService weddingService;


    public WeddingController(WeddingService weddingService) {
        this.weddingService = weddingService;
    }
    @GetMapping
    public List<WeddingResponse> findAll() {
        return weddingService.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<WeddingResponse> findByUser(@PathVariable Long userId) {
        return weddingService.findByUser(userId);
    }

    @PostMapping
    public WeddingResponse create(@Valid @RequestBody WeddingRequest request) {
        return weddingService.create(request);
    }

    @GetMapping("/{weddingId}/content")
    public WeddingContentResponse getContent(@PathVariable Long weddingId, Authentication authentication) {
        return weddingService.getContent(weddingId, authentication.getName());
    }

    @PutMapping("/{weddingId}/content")
    public WeddingContentResponse updateContent(@PathVariable Long weddingId, @Valid @RequestBody WeddingContentRequest request, Authentication authentication) {
        return weddingService.updateContent(weddingId, request, authentication.getName());
    }

    @PostMapping(value = "/{weddingId}/dress-code-image/upload", consumes = "multipart/form-data")
    public Map<String, String> uploadDressCodeImage(@PathVariable Long weddingId, @RequestPart("file") MultipartFile file, Authentication authentication) {
        return Map.of("imageUrl", weddingService.uploadDressCodeImage(weddingId, file, authentication.getName()));
    }

    @PostMapping(value = "/{weddingId}/logo/upload", consumes = "multipart/form-data")
    public Map<String, String> uploadCustomLogo(@PathVariable Long weddingId, @RequestPart("file") MultipartFile file, Authentication authentication) {
        return Map.of("imageUrl", weddingService.uploadCustomLogo(weddingId, file, authentication.getName()));
    }
}
