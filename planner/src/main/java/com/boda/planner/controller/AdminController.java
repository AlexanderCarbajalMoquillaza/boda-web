package com.boda.planner.controller;

import com.boda.planner.repository.AppUserRepository;
import com.boda.planner.repository.WeddingRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AppUserRepository userRepository;
    private final WeddingRepository weddingRepository;

    public AdminController(AppUserRepository userRepository, WeddingRepository weddingRepository) {
        this.userRepository = userRepository;
        this.weddingRepository = weddingRepository;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview(Authentication authentication) {
        requireAdmin(authentication);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("users", userRepository.findAll().stream().map(user -> Map.of(
                "id", user.getId(), "fullName", user.getFullName(), "email", user.getEmail(), "role", user.getRole())).toList());
        response.put("weddings", weddingRepository.findAll().stream().map(wedding -> Map.of(
                "id", wedding.getId(), "title", wedding.getTitle(), "slug", wedding.getInvitationSlug(),
                "ownerEmail", wedding.getOwnerUser().getEmail(), "public", Boolean.TRUE.equals(wedding.getInvitationPublic()))).toList());
        response.put("userCount", userRepository.count());
        response.put("weddingCount", weddingRepository.count());
        return response;
    }

    private void requireAdmin(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities().stream().noneMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))) {
            throw new AccessDeniedException("Se requiere una cuenta de administrador");
        }
    }
}
