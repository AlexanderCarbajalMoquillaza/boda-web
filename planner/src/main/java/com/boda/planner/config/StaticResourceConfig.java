package com.boda.planner.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        java.nio.file.Path p1 = java.nio.file.Paths.get("uploads").toAbsolutePath().normalize();
        java.nio.file.Path p2 = java.nio.file.Paths.get("planner", "uploads").toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(
                        p1.toUri().toString(),
                        p2.toUri().toString(),
                        "file:/app/uploads/",
                        "file:uploads/",
                        "file:planner/uploads/"
                );
    }
}
