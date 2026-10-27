package com.boda.planner.service;

import com.boda.planner.model.Guest;
import com.boda.planner.model.GuestGroup;
import com.boda.planner.model.Wedding;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final ObjectMapper objectMapper;

    @Value("${app.mail.resend-api-key:}")
    private String resendApiKey;

    @Value("${app.mail.from:Boda <onboarding@resend.dev>}")
    private String resendFrom;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider, ObjectMapper objectMapper) {
        this.mailSenderProvider = mailSenderProvider;
        this.objectMapper = objectMapper;
    }

    /**
     * Envía de forma asíncrona una alerta por correo electrónico a los novios
     * informando de la confirmación de asistencia, cantidad de personas y el mensaje dedicado.
     */
    public void sendRsvpNotificationAsync(Wedding wedding, GuestGroup group, List<Guest> guests) {
        CompletableFuture.runAsync(() -> {
            try {
                sendRsvpNotification(wedding, group, guests);
            } catch (Exception e) {
                log.warn("No se pudo enviar la alerta de confirmación por correo: {}", e.getMessage());
            }
        });
    }

    private void sendRsvpNotification(Wedding wedding, GuestGroup group, List<Guest> guests) {
        // Determinar correo(s) de destino: el registrado en la boda o el correo de la cuenta de novios
        String targetEmails = wedding.getNotificationEmail();
        if (targetEmails == null || targetEmails.isBlank()) {
            if (wedding.getOwnerUser() != null && wedding.getOwnerUser().getEmail() != null) {
                targetEmails = wedding.getOwnerUser().getEmail();
            }
        }

        if (targetEmails == null || targetEmails.isBlank()) {
            log.info("Omitiendo alerta de correo: no hay correo de notificación registrado para la boda ID {}", wedding.getId());
            return;
        }

        String[] recipients = Arrays.stream(targetEmails.split("[,;]"))
                .map(String::trim)
                .filter(email -> email.contains("@"))
                .toArray(String[]::new);

        if (recipients.length == 0) {
            log.warn("Ninguna dirección de correo válida encontrada en: {}", targetEmails);
            return;
        }

        long confirmedCount = guests.stream()
                .filter(g -> "CONFIRMED".equalsIgnoreCase(g.getAttendanceStatus()))
                .count();

        String coupleNames = wedding.getPartnerOneName() + " & " + wedding.getPartnerTwoName();
        String subject = "💌 ¡Nueva confirmación para tu boda! · " + group.getContactName();
        String htmlBody = buildHtmlAlert(wedding, coupleNames, group, guests, confirmedCount);

        // 1. Intentar envío prioritario mediante Resend API (HTTP REST, sin necesidad de SMTP)
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            boolean success = sendViaResend(coupleNames, recipients, subject, htmlBody);
            if (success) {
                return;
            }
        }

        // 2. Fallback a SMTP (JavaMailSender) si está configurado
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender != null && mailHost != null && !mailHost.isBlank() && mailUsername != null && !mailUsername.isBlank() && mailPassword != null && !mailPassword.isBlank()) {
            sendViaSmtp(mailSender, coupleNames, recipients, subject, htmlBody);
            return;
        }

        log.info("Alerta de correo no enviada: Ni RESEND_API_KEY ni las variables SMTP están configuradas en el servidor.");
    }

    private boolean sendViaResend(String coupleNames, String[] recipients, String subject, String htmlBody) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            Map<String, Object> payload = new LinkedHashMap<>();
            String from = (resendFrom != null && !resendFrom.isBlank()) ? resendFrom : "Boda <onboarding@resend.dev>";
            payload.put("from", from);
            payload.put("to", recipients);
            payload.put("subject", subject);
            payload.put("html", htmlBody);

            String jsonPayload = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Alerta de confirmación enviada con éxito vía Resend a: {}", Arrays.toString(recipients));
                return true;
            } else {
                log.error("Error al enviar correo vía Resend API (HTTP {}): {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            log.error("Fallo al enviar correo vía Resend: {}", e.getMessage(), e);
            return false;
        }
    }

    private void sendViaSmtp(JavaMailSender mailSender, String coupleNames, String[] recipients, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String sender = (mailUsername != null && !mailUsername.isBlank()) ? mailUsername : "notificaciones@bodas.app";
            helper.setFrom(sender, "Boda " + coupleNames);
            helper.setTo(recipients);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Alerta de confirmación enviada con éxito a: {}", Arrays.toString(recipients));
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("authentication failed")) {
                log.error("Error de autenticación SMTP: Las credenciales fueron rechazadas. Si usas Gmail (smtp.gmail.com), recuerda usar una Contraseña de Aplicación de 16 caracteres generada en https://myaccount.google.com/apppasswords en SPRING_MAIL_PASSWORD, no tu contraseña normal de Google.");
            } else {
                log.error("Error al despachar el correo de confirmación: {}", e.getMessage(), e);
            }
        }
    }

    private String buildHtmlAlert(Wedding wedding, String coupleNames, GuestGroup group, List<Guest> guests, long confirmedCount) {
        StringBuilder guestRows = new StringBuilder();
        for (Guest g : guests) {
            boolean isConfirmed = "CONFIRMED".equalsIgnoreCase(g.getAttendanceStatus());
            String statusBadge = isConfirmed
                    ? "<span style=\"display:inline-block;padding:3px 10px;border-radius:12px;background:#eaf5ea;color:#1b6329;font-weight:bold;font-size:12px;\">✓ Asiste</span>"
                    : "<span style=\"display:inline-block;padding:3px 10px;border-radius:12px;background:#fdeeed;color:#b91c1c;font-weight:bold;font-size:12px;\">✕ No asiste</span>";

            String extraInfo = "";
            if (g.getMenuOption() != null && !g.getMenuOption().isBlank()) {
                extraInfo += " · Menú: " + escapeHtml(g.getMenuOption());
            }
            if (g.getAllergies() != null && !g.getAllergies().isBlank()) {
                extraInfo += " · Alergias: " + escapeHtml(g.getAllergies());
            }

            guestRows.append("<li style=\"margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #f0eee8;\">")
                    .append("<strong>").append(escapeHtml(g.getFullName())).append("</strong> ")
                    .append(statusBadge)
                    .append("<div style=\"font-size:12px;color:#666;margin-top:2px;\">").append(extraInfo).append("</div>")
                    .append("</li>");
        }

        String messageBlock = "";
        if (group.getMessage() != null && !group.getMessage().trim().isBlank()) {
            messageBlock = """
                <div style="margin:25px 0;background:#faf6f0;border-left:4px solid #b79a62;padding:16px 20px;border-radius:0 12px 12px 0;">
                    <p style="margin:0 0 6px 0;font-size:11px;font-weight:bold;color:#b79a62;text-transform:uppercase;letter-spacing:1px;">💌 Mensaje para los novios:</p>
                    <p style="margin:0;font-size:15px;color:#2c2c2c;font-style:italic;line-height:1.5;">&ldquo;%s&rdquo;</p>
                </div>
            """.formatted(escapeHtml(group.getMessage().trim()));
        }

        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f4f1ea;padding:25px 15px;margin:0;color:#2c2c2c;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.06);margin:0 auto;border:1px solid #e7e2d8;">
                    <tr>
                        <td style="background:#243328;padding:32px 24px;text-align:center;color:#ffffff;">
                            <p style="margin:0 0 6px 0;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#d8cbb6;">Nuestra Boda</p>
                            <h1 style="margin:0;font-size:26px;font-family:Georgia,serif;font-weight:normal;color:#ffffff;letter-spacing:1px;">%s</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 24px;">
                            <div style="background:#f9f8f5;border-radius:12px;padding:16px 20px;margin-bottom:24px;border:1px solid #eee9e0;">
                                <p style="margin:0;font-size:14px;color:#777;">Grupo Familiar / Invitado:</p>
                                <p style="margin:4px 0 0 0;font-size:18px;font-weight:bold;color:#1e293b;">%s</p>
                                <div style="margin-top:12px;display:flex;gap:12px;font-size:13px;color:#555;">
                                    <span><strong>Confirmados:</strong> %d de %d pase(s)</span>
                                </div>
                            </div>

                            %s

                            <h3 style="font-size:15px;color:#1e293b;margin:20px 0 12px 0;border-bottom:1px solid #e5e5e5;padding-bottom:6px;">Detalle de Asistentes:</h3>
                            <ul style="list-style:none;padding:0;margin:0;">
                                %s
                            </ul>

                            <div style="margin-top:30px;padding-top:20px;border-top:1px solid #f0eee8;text-align:center;color:#888;font-size:12px;">
                                <p style="margin:0;">Este correo es una notificación automática del sistema de gestión de tu boda.</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        """.formatted(
                escapeHtml(coupleNames),
                escapeHtml(group.getContactName()),
                confirmedCount,
                group.getMaxGuestsAllowed(),
                messageBlock,
                guestRows.toString()
        );
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
