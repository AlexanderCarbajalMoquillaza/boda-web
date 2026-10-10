package com.boda.planner.service;

import com.boda.planner.dto.LoginRequest;
import com.boda.planner.dto.LoginResponse;
import com.boda.planner.exception.BusinessRuleException;
import com.boda.planner.model.AppUser;
import com.boda.planner.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessRuleException("Credenciales invalidas"));

        if (!matchesPassword(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("Credenciales invalidas");
        }

        String token = jwtService.generateToken(user);
        return new LoginResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    private boolean matchesPassword(String rawPassword, String storedPassword) {
        if (storedPassword != null && storedPassword.startsWith("$2")) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        return rawPassword.equals(storedPassword);
    }
}
