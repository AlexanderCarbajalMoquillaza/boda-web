package com.boda.planner.service;

import com.boda.planner.model.AppUser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.security.MessageDigest;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final String secret;
    private final Long expirationMinutes;
    private final ObjectMapper objectMapper;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes}") Long expirationMinutes,
            ObjectMapper objectMapper
    ) {
        this.secret = secret;
        this.expirationMinutes = expirationMinutes;
        this.objectMapper = objectMapper;
    }

    public String generateToken(AppUser user) {
        try {
            Map<String, Object> header = new LinkedHashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            Instant now = Instant.now();

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", user.getEmail());
            payload.put("userId", user.getId());
            payload.put("fullName", user.getFullName());
            payload.put("role", user.getRole());
            payload.put("iat", now.getEpochSecond());
            payload.put("exp", now.plusSeconds(expirationMinutes * 60).getEpochSecond());

            String encodedHeader = base64Url(objectMapper.writeValueAsBytes(header));
            String encodedPayload = base64Url(objectMapper.writeValueAsBytes(payload));
            String unsignedToken = encodedHeader + "." + encodedPayload;
            String signature = sign(unsignedToken);

            return unsignedToken + "." + signature;
        } catch (Exception exception) {
            throw new IllegalStateException("No se pudo generar el token", exception);
        }
    }

    public String validateAndGetEmail(String token) {
        try {
            if (token == null || token.isBlank()) {
                log.warn("JWT rechazado: token vacío");
                return null;
            }

            String[] parts = token.trim().split("\\.", -1);
            if (parts.length != 3) {
                log.warn("JWT rechazado: cantidad de partes incorrecta: {}", parts.length);
                return null;
            }

            String unsignedToken = parts[0] + "." + parts[1];
            String expectedSignature = sign(unsignedToken);

            if (!constantTimeEquals(expectedSignature, parts[2])) {
                log.warn("JWT rechazado: firma inválida");
                return null;
            }

            JsonNode payload = objectMapper.readTree(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode expirationNode = payload.get("exp");
            JsonNode subjectNode = payload.get("sub");
            if (expirationNode == null || subjectNode == null || subjectNode.asText().isBlank()) {
                log.warn("JWT rechazado: faltan las claims exp o sub");
                return null;
            }

            long expiration = expirationNode.asLong();

            if (Instant.now().getEpochSecond() > expiration) {
                log.warn("JWT rechazado: token expirado");
                return null;
            }

            return subjectNode.asText();
        } catch (Exception exception) {
            log.warn("JWT rechazado: no se pudo validar el token ({})", exception.getClass().getSimpleName());
            return null;
        }
    }

    private String sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        return base64Url(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    private String base64Url(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private boolean constantTimeEquals(String first, String second) {
        return MessageDigest.isEqual(
                first.getBytes(StandardCharsets.UTF_8),
                second.getBytes(StandardCharsets.UTF_8)
        );
    }
}
