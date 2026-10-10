package com.boda.planner.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PublicRateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS = 30;
    private static final long WINDOW_SECONDS = 60;

    private final Map<String, RequestWindow> requestsByIp = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (!request.getRequestURI().startsWith("/api/public/rsvp/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = request.getRemoteAddr();
        RequestWindow window = requestsByIp.compute(clientIp, (ip, current) -> {
            long now = Instant.now().getEpochSecond();
            if (current == null || now - current.startedAt >= WINDOW_SECONDS) {
                return new RequestWindow(now, 1);
            }
            return new RequestWindow(current.startedAt, current.count + 1);
        });

        if (window.count > MAX_REQUESTS) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"status\":429,\"message\":\"Demasiadas solicitudes. Intenta nuevamente en un minuto.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private record RequestWindow(long startedAt, int count) {
    }
}
