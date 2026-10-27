package com.boda.planner.service;

import com.boda.planner.dto.WeddingRequest;
import com.boda.planner.dto.WeddingResponse;
import com.boda.planner.dto.WeddingContentRequest;
import com.boda.planner.dto.WeddingContentResponse;
import com.boda.planner.exception.ResourceNotFoundException;
import com.boda.planner.model.AppUser;
import com.boda.planner.model.Wedding;
import com.boda.planner.repository.AppUserRepository;
import com.boda.planner.repository.WeddingRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class WeddingService {
    private final WeddingRepository weddingRepository;
    private final AppUserRepository appUserRepository;

    public WeddingService(WeddingRepository weddingRepository, AppUserRepository appUserRepository) {
        this.weddingRepository = weddingRepository;
        this.appUserRepository = appUserRepository;
    }

    public List<WeddingResponse> findAll() {
        return weddingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<WeddingResponse> findByUser(Long userId) {
        return weddingRepository.findByOwnerUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public WeddingResponse create(WeddingRequest request) {
        AppUser ownerUser = appUserRepository.findById(request.getOwnerUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Wedding wedding = new Wedding();
        wedding.setOwnerUser(ownerUser);
        wedding.setTitle(request.getTitle());
        wedding.setPartnerOneName(request.getPartnerOneName());
        wedding.setPartnerTwoName(request.getPartnerTwoName());
        wedding.setWeddingDate(request.getWeddingDate());
        wedding.setVenueName(request.getVenueName());
        wedding.setVenueAddress(request.getVenueAddress());
        wedding.setInvitationSlug(generateUniqueInvitationSlug(request));
        wedding.setMaxRegisteredGuests(request.getMaxRegisteredGuests());

        Wedding savedWedding = weddingRepository.save(wedding);

        return toResponse(savedWedding);
    }

    public WeddingContentResponse getContent(Long weddingId, String email) {
        Wedding wedding = owned(weddingId, email);
        return toContentResponse(wedding);
    }

    public WeddingContentResponse updateContent(Long weddingId, WeddingContentRequest request, String email) {
        Wedding wedding = owned(weddingId, email);
        if (request.getTitle() != null && !request.getTitle().isBlank()) wedding.setTitle(request.getTitle());
        if (request.getPartnerOneName() != null && !request.getPartnerOneName().isBlank()) wedding.setPartnerOneName(request.getPartnerOneName());
        if (request.getPartnerTwoName() != null && !request.getPartnerTwoName().isBlank()) wedding.setPartnerTwoName(request.getPartnerTwoName());
        if (request.getWeddingDate() != null) wedding.setWeddingDate(request.getWeddingDate());
        wedding.setVenueName(request.getVenueName() != null ? request.getVenueName() : "");
        wedding.setVenueAddress(request.getVenueAddress() != null ? request.getVenueAddress() : "");
        wedding.setLocationsJson(request.getLocationsJson() != null ? request.getLocationsJson() : "[]");
        if (request.getMaxRegisteredGuests() != null) wedding.setMaxRegisteredGuests(request.getMaxRegisteredGuests());
        wedding.setWelcomeMessage(request.getWelcomeMessage());
        wedding.setStoryText(request.getStoryText());
        wedding.setDressCode(request.getDressCode());
        wedding.setDressCodePreset(request.getDressCodePreset());
        wedding.setDressCodeImageUrl(request.getDressCodeImageUrl());
        wedding.setShowDressCodePalette(Boolean.TRUE.equals(request.getShowDressCodePalette()));
        wedding.setDressCodeColorsJson(request.getDressCodeColorsJson() != null ? request.getDressCodeColorsJson() : "[]");
        wedding.setMapUrl(request.getMapUrl() != null ? request.getMapUrl() : "");
        wedding.setGiftRegistryUrl(request.getGiftRegistryUrl() != null ? request.getGiftRegistryUrl() : "");
        wedding.setGiftOptionsJson(request.getGiftOptionsJson() != null ? request.getGiftOptionsJson() : "[]");
        wedding.setScheduleJson(request.getScheduleJson() != null ? request.getScheduleJson() : "[]");
        wedding.setFaqJson(request.getFaqJson() != null ? request.getFaqJson() : "[]");
        wedding.setTablesJson(request.getTablesJson() != null ? request.getTablesJson() : "[]");
        wedding.setShowWelcome(request.getShowWelcome() != null ? request.getShowWelcome() : true);
        wedding.setShowStory(request.getShowStory() != null ? request.getShowStory() : true);
        wedding.setShowSchedule(request.getShowSchedule() != null ? request.getShowSchedule() : true);
        wedding.setShowDressCode(request.getShowDressCode() != null ? request.getShowDressCode() : true);
        wedding.setShowLocation(request.getShowLocation() != null ? request.getShowLocation() : true);
        wedding.setShowGiftRegistry(request.getShowGiftRegistry() != null ? request.getShowGiftRegistry() : true);
        wedding.setShowFaq(request.getShowFaq() != null ? request.getShowFaq() : true);
        wedding.setShowTables(request.getShowTables() != null ? request.getShowTables() : false);
        if (request.getPrimaryColor() != null && !request.getPrimaryColor().isBlank()) wedding.setPrimaryColor(request.getPrimaryColor());
        if (request.getAccentColor() != null && !request.getAccentColor().isBlank()) wedding.setAccentColor(request.getAccentColor());
        if (request.getBackgroundColor() != null && !request.getBackgroundColor().isBlank()) wedding.setBackgroundColor(request.getBackgroundColor());
        if (request.getLateralColor() != null && !request.getLateralColor().isBlank()) wedding.setLateralColor(request.getLateralColor());
        if (request.getTemplateId() != null && !request.getTemplateId().isBlank()) wedding.setTemplateId(request.getTemplateId());
        wedding.setBrideFatherName(request.getBrideFatherName());
        wedding.setBrideMotherName(request.getBrideMotherName());
        wedding.setGroomFatherName(request.getGroomFatherName());
        wedding.setGroomMotherName(request.getGroomMotherName());
        wedding.setGodfatherName(request.getGodfatherName());
        wedding.setGodmotherName(request.getGodmotherName());
        wedding.setWelcomeCitation(request.getWelcomeCitation());
        wedding.setCustomLogoUrl(request.getCustomLogoUrl());
        return toContentResponse(weddingRepository.save(wedding));
    }

    public String uploadDressCodeImage(Long weddingId, MultipartFile file, String email) {
        Wedding wedding = owned(weddingId, email);
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Debes seleccionar una imagen");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("La imagen no puede superar los 5 MB");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Solo se permiten archivos de imagen");
        }

        try {
            Path root = Files.exists(Paths.get("planner")) ? Paths.get("planner", "uploads") : Paths.get("uploads");
            Path weddingFolder = root.resolve("weddings").resolve(String.valueOf(weddingId));
            Files.createDirectories(weddingFolder);
            String extension = extensionOf(file.getOriginalFilename());
            String filename = "dress-code-" + UUID.randomUUID() + extension;
            byte[] bytes = file.getBytes();
            Files.write(weddingFolder.resolve(filename), bytes, java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.TRUNCATE_EXISTING);
            String imageUrl = "/uploads/weddings/" + weddingId + "/" + filename;
            wedding.setDressCodeImageUrl(imageUrl);
            wedding.setDressCodeImageContentType(file.getContentType());
            wedding.setDressCodeImageBytes(bytes);
            weddingRepository.save(wedding);
            return imageUrl;
        } catch (IOException exception) {
            throw new IllegalStateException("No se pudo guardar la imagen del código de vestimenta", exception);
        }
    }

    public String uploadCustomLogo(Long weddingId, MultipartFile file, String email) {
        Wedding wedding = owned(weddingId, email);
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Debes seleccionar una imagen");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("La imagen no puede superar los 5 MB");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Solo se permiten archivos de imagen");
        }

        try {
            Path root = Files.exists(Paths.get("planner")) ? Paths.get("planner", "uploads") : Paths.get("uploads");
            Path weddingFolder = root.resolve("weddings").resolve(String.valueOf(weddingId));
            Files.createDirectories(weddingFolder);
            String extension = extensionOf(file.getOriginalFilename());
            String filename = "logo-" + UUID.randomUUID() + extension;
            byte[] bytes = file.getBytes();
            Files.write(weddingFolder.resolve(filename), bytes, java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.TRUNCATE_EXISTING);
            String imageUrl = "/uploads/weddings/" + weddingId + "/" + filename;
            wedding.setCustomLogoUrl(imageUrl);
            wedding.setCustomLogoContentType(file.getContentType());
            wedding.setCustomLogoBytes(bytes);
            weddingRepository.save(wedding);
            return imageUrl;
        } catch (IOException exception) {
            throw new IllegalStateException("No se pudo guardar el logo personalizado", exception);
        }
    }

    private Wedding owned(Long weddingId, String email) {
        Wedding wedding = weddingRepository.findById(weddingId)
                .orElseThrow(() -> new ResourceNotFoundException("Boda no encontrada"));
        if (!wedding.getOwnerUser().getEmail().equalsIgnoreCase(email)) {
            throw new org.springframework.security.access.AccessDeniedException("No tienes permiso para gestionar esta boda");
        }
        return wedding;
    }

    private WeddingContentResponse toContentResponse(Wedding wedding) {
        WeddingContentResponse response = new WeddingContentResponse();
        response.setId(wedding.getId());
        response.setInvitationSlug(wedding.getInvitationSlug());
        response.setTitle(wedding.getTitle());
        response.setPartnerOneName(wedding.getPartnerOneName());
        response.setPartnerTwoName(wedding.getPartnerTwoName());
        response.setWeddingDate(wedding.getWeddingDate());
        response.setVenueName(wedding.getVenueName());
        response.setVenueAddress(wedding.getVenueAddress());
        response.setLocationsJson(wedding.getLocationsJson());
        response.setMaxRegisteredGuests(wedding.getMaxRegisteredGuests());
        response.setWelcomeMessage(wedding.getWelcomeMessage());
        response.setStoryText(wedding.getStoryText());
        response.setDressCode(wedding.getDressCode());
        response.setDressCodePreset(wedding.getDressCodePreset());
        response.setDressCodeImageUrl(wedding.getDressCodeImageUrl());
        response.setShowDressCodePalette(Boolean.TRUE.equals(wedding.getShowDressCodePalette()));
        response.setDressCodeColorsJson(wedding.getDressCodeColorsJson() != null ? wedding.getDressCodeColorsJson() : "[]");
        response.setMapUrl(wedding.getMapUrl());
        response.setGiftRegistryUrl(wedding.getGiftRegistryUrl());
        response.setGiftOptionsJson(wedding.getGiftOptionsJson());
        response.setScheduleJson(wedding.getScheduleJson());
        response.setFaqJson(wedding.getFaqJson());
        response.setTablesJson(wedding.getTablesJson());
        response.setShowWelcome(wedding.getShowWelcome());
        response.setShowStory(wedding.getShowStory());
        response.setShowSchedule(wedding.getShowSchedule());
        response.setShowDressCode(wedding.getShowDressCode());
        response.setShowLocation(wedding.getShowLocation());
        response.setShowGiftRegistry(wedding.getShowGiftRegistry());
        response.setShowFaq(wedding.getShowFaq());
        response.setShowTables(wedding.getShowTables());
        response.setPrimaryColor(wedding.getPrimaryColor());
        response.setAccentColor(wedding.getAccentColor());
        response.setBackgroundColor(wedding.getBackgroundColor());
        response.setLateralColor(wedding.getLateralColor() != null ? wedding.getLateralColor() : "#e8efe9");
        response.setTemplateId(wedding.getTemplateId() != null ? wedding.getTemplateId() : "FLORAL_ROMANCE");
        response.setBrideFatherName(wedding.getBrideFatherName());
        response.setBrideMotherName(wedding.getBrideMotherName());
        response.setGroomFatherName(wedding.getGroomFatherName());
        response.setGroomMotherName(wedding.getGroomMotherName());
        response.setGodfatherName(wedding.getGodfatherName());
        response.setGodmotherName(wedding.getGodmotherName());
        response.setWelcomeCitation(wedding.getWelcomeCitation());
        response.setCustomLogoUrl(wedding.getCustomLogoUrl());
        response.setDoorAccessKey(wedding.getDoorAccessKey());
        return response;
    }

    private String generateUniqueInvitationSlug(WeddingRequest request) {
        String year = String.valueOf(request.getWeddingDate().getYear());
        String baseSlug = toSlug(request.getPartnerOneName() + " y " + request.getPartnerTwoName() + " " + year);
        String candidateSlug = baseSlug;
        int counter = 2;

        while (weddingRepository.existsByInvitationSlug(candidateSlug)) {
            candidateSlug = baseSlug + "-" + counter;
            counter++;
        }

        return candidateSlug;
    }

    private String toSlug(String value) {
        String withoutAccents = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        String slug = withoutAccents.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");

        if (slug.isBlank()) {
            return "boda";
        }

        return slug;
    }

    private String extensionOf(String originalName) {
        if (originalName == null || !originalName.contains(".")) return ".jpg";
        return originalName.substring(originalName.lastIndexOf('.')).toLowerCase(Locale.ROOT);
    }

    private WeddingResponse toResponse(Wedding wedding) {
        return new WeddingResponse(
                wedding.getId(),
                wedding.getTitle(),
                wedding.getPartnerOneName(),
                wedding.getPartnerTwoName(),
                wedding.getWeddingDate(),
                wedding.getInvitationSlug(),
                wedding.getMaxRegisteredGuests(),
                wedding.getOwnerUser().getFullName()
        );
    }
}
