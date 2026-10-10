package com.boda.planner.controller;

import com.boda.planner.dto.CreateUserRequest;
import com.boda.planner.exception.BusinessRuleException;
import com.boda.planner.exception.ResourceNotFoundException;
import com.boda.planner.model.AppUser;
import com.boda.planner.repository.AppUserRepository;
import com.boda.planner.repository.WeddingRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AppUserRepository userRepository;
    private final WeddingRepository weddingRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(
            AppUserRepository userRepository,
            WeddingRepository weddingRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.weddingRepository = weddingRepository;
        this.passwordEncoder = passwordEncoder;
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

    @PostMapping("/users")
    public Map<String, Object> createUser(@Valid @RequestBody CreateUserRequest request, Authentication authentication) {
        requireAdmin(authentication);
        String normalizedEmail = request.getEmail().toLowerCase().trim();
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new BusinessRuleException("Ya existe una cuenta registrada con el correo " + normalizedEmail);
        }

        AppUser user = new AppUser();
        user.setFullName(request.getFullName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null && !request.getRole().isBlank() ? request.getRole() : "COUPLE");

        AppUser saved = userRepository.save(user);

        return Map.of(
                "id", saved.getId(),
                "fullName", saved.getFullName(),
                "email", saved.getEmail(),
                "role", saved.getRole()
        );
    }

    @DeleteMapping("/users/{id}")
    public Map<String, String> deleteUser(@PathVariable Long id, Authentication authentication) {
        requireAdmin(authentication);
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if ("ADMIN".equalsIgnoreCase(user.getRole()) && user.getEmail().equalsIgnoreCase(authentication.getName())) {
            throw new BusinessRuleException("No puedes eliminar tu propia cuenta de administrador");
        }

        userRepository.delete(user);
        return Map.of("message", "Usuario eliminado correctamente");
    }

    private void requireAdmin(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities().stream().noneMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))) {
            throw new AccessDeniedException("Se requiere una cuenta de administrador");
        }
    }
}
