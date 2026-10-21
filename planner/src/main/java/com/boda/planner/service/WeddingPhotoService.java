package com.boda.planner.service;

import com.boda.planner.dto.WeddingPhotoRequest;
import com.boda.planner.dto.WeddingPhotoResponse;
import com.boda.planner.exception.ResourceNotFoundException;
import com.boda.planner.model.Wedding;
import com.boda.planner.model.WeddingPhoto;
import com.boda.planner.repository.WeddingPhotoRepository;
import com.boda.planner.repository.WeddingRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.List;

@Service
public class WeddingPhotoService {
    private final WeddingPhotoRepository photoRepository;
    private final WeddingRepository weddingRepository;
    private final Path uploadRoot = resolveUploadRoot();

    public WeddingPhotoService(WeddingPhotoRepository photoRepository, WeddingRepository weddingRepository) {
        this.photoRepository = photoRepository;
        this.weddingRepository = weddingRepository;
    }

    public List<WeddingPhotoResponse> findVisibleBySlug(String slug) {
        Wedding wedding = findWeddingBySlug(slug);
        return photoRepository.findByWeddingIdAndVisibleTrueOrderByDisplayOrderAsc(wedding.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<WeddingPhotoResponse> findAllForOwner(Long weddingId, String email) {
        Wedding wedding = findOwnedWedding(weddingId, email);
        return photoRepository.findByWeddingIdOrderByDisplayOrderAsc(wedding.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public WeddingPhotoResponse create(Long weddingId, WeddingPhotoRequest request, String email) {
        Wedding wedding = findOwnedWedding(weddingId, email);
        WeddingPhoto photo = new WeddingPhoto();
        photo.setWedding(wedding);
        apply(photo, request);
        return toResponse(photoRepository.save(photo));
    }

    @Transactional
    public WeddingPhotoResponse upload(Long weddingId, MultipartFile file, String caption, String section, String email) {
        Wedding wedding = findOwnedWedding(weddingId, email);
        validateImage(file);

        try {
            Path weddingFolder = uploadRoot.resolve("weddings").resolve(String.valueOf(weddingId));
            Files.createDirectories(weddingFolder);
            String extension = extensionOf(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            byte[] bytes = file.getBytes();
            Files.write(weddingFolder.resolve(filename), bytes, java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.TRUNCATE_EXISTING);

            WeddingPhoto photo = new WeddingPhoto();
            photo.setWedding(wedding);
            photo.setImageUrl("/uploads/weddings/" + weddingId + "/" + filename);
            photo.setCaption(caption);
            photo.setDisplayOrder(nextOrder(weddingId));
            photo.setVisible(true);
            photo.setSection(section == null || section.isBlank() ? "GALLERY" : section);
            photo.setFeatured(false);
            photo.setContentType(file.getContentType());
            photo.setImageBytes(bytes);
            return toResponse(photoRepository.save(photo));
        } catch (IOException exception) {
            throw new IllegalStateException("No se pudo guardar la imagen", exception);
        }
    }

    @Transactional
    public WeddingPhotoResponse update(Long photoId, WeddingPhotoRequest request, String email) {
        WeddingPhoto photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Foto no encontrada"));
        verifyOwner(photo.getWedding(), email);
        apply(photo, request);
        return toResponse(photoRepository.save(photo));
    }

    public void delete(Long photoId, String email) {
        WeddingPhoto photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Foto no encontrada"));
        verifyOwner(photo.getWedding(), email);
        photoRepository.delete(photo);
    }

    private void apply(WeddingPhoto photo, WeddingPhotoRequest request) {
        photo.setImageUrl(request.getImageUrl());
        photo.setCaption(request.getCaption());
        photo.setDisplayOrder(request.getDisplayOrder());
        photo.setVisible(request.getVisible() == null || request.getVisible());
        photo.setSection(request.getSection() == null ? "GALLERY" : request.getSection());
        photo.setFeatured(request.getFeatured() != null && request.getFeatured());
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Debes seleccionar una imagen");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("La imagen no puede superar los 5 MB");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Solo se permiten archivos de imagen");
        }
    }

    private String extensionOf(String originalName) {
        if (originalName == null || !originalName.contains(".")) return ".jpg";
        return originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
    }

    private int nextOrder(Long weddingId) {
        return photoRepository.findByWeddingIdOrderByDisplayOrderAsc(weddingId).size();
    }

    private Path resolveUploadRoot() {
        Path projectRootUploads = Paths.get("planner", "uploads");
        if (Files.exists(projectRootUploads) || Files.exists(Paths.get("planner"))) {
            return projectRootUploads;
        }
        return Paths.get("uploads");
    }

    private Wedding findOwnedWedding(Long id, String email) {
        Wedding wedding = weddingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boda no encontrada"));
        verifyOwner(wedding, email);
        return wedding;
    }

    private Wedding findWeddingBySlug(String slug) {
        return weddingRepository.findByInvitationSlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Invitacion no encontrada"));
    }

    private void verifyOwner(Wedding wedding, String email) {
        if (!wedding.getOwnerUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("No tienes permiso para gestionar esta boda");
        }
    }

    private WeddingPhotoResponse toResponse(WeddingPhoto photo) {
        return new WeddingPhotoResponse(photo.getId(), photo.getImageUrl(), photo.getCaption(), photo.getDisplayOrder(), photo.getVisible(), photo.getSection(), photo.getFeatured(), photo.getCreatedAt());
    }
}
