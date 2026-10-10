package com.boda.planner.config;

import com.boda.planner.model.AppUser;
import com.boda.planner.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrapConfig {
    @Bean
    CommandLineRunner createConfiguredAdmin(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String email,
            @Value("${app.admin.password:}") String password,
            @Value("${app.admin.full-name:Administrador}") String fullName
    ) {
        return args -> {
            if (email.isBlank() || password.isBlank()) return;
            AppUser admin = userRepository.findByEmail(email).orElseGet(AppUser::new);
            admin.setFullName(fullName);
            admin.setEmail(email);
            admin.setPasswordHash(passwordEncoder.encode(password));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        };
    }
}
