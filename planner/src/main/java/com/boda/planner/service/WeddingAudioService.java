package com.boda.planner.service;

import com.boda.planner.dto.WeddingAudioResponse;
import com.boda.planner.exception.ResourceNotFoundException;
import com.boda.planner.model.Wedding;
import com.boda.planner.model.WeddingAudio;
import com.boda.planner.repository.WeddingAudioRepository;
import com.boda.planner.repository.WeddingRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class WeddingAudioService {
    private final WeddingAudioRepository audioRepository;
    private final WeddingRepository weddingRepository;
    public WeddingAudioService(WeddingAudioRepository audioRepository, WeddingRepository weddingRepository) { this.audioRepository = audioRepository; this.weddingRepository = weddingRepository; }
    public WeddingAudioResponse findPublic(String slug) {
        Wedding wedding = weddingRepository.findByInvitationSlug(slug).orElseThrow(() -> new ResourceNotFoundException("Boda no encontrada"));
        return audioRepository.findByWeddingId(wedding.getId()).filter(a -> Boolean.TRUE.equals(a.getEnabled())).map(this::toResponse).orElse(null);
    }
    public WeddingAudioResponse upload(Long weddingId, MultipartFile file, String title, String email) {
        Wedding wedding = owned(weddingId, email);
        if (file == null || file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("audio/")) throw new IllegalArgumentException("Selecciona un archivo de audio válido");
        try {
            Path folder = Files.exists(Paths.get("planner")) ? Paths.get("planner", "uploads", "weddings", String.valueOf(weddingId)) : Paths.get("uploads", "weddings", String.valueOf(weddingId));
            Files.createDirectories(folder);
            String extension = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".") ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')).toLowerCase() : ".mp3";
            String name = UUID.randomUUID() + extension;
            Files.copy(file.getInputStream(), folder.resolve(name), StandardCopyOption.REPLACE_EXISTING);
            WeddingAudio audio = audioRepository.findByWeddingId(weddingId).orElseGet(WeddingAudio::new);
            audio.setWedding(wedding); audio.setAudioUrl("/uploads/weddings/" + weddingId + "/" + name); audio.setTitle(title); audio.setFileName(file.getOriginalFilename()); audio.setEnabled(true);
            return toResponse(audioRepository.save(audio));
        } catch (IOException e) { throw new IllegalStateException("No se pudo guardar el audio", e); }
    }
    private Wedding owned(Long id, String email) { Wedding w = weddingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Boda no encontrada")); if (!w.getOwnerUser().getEmail().equalsIgnoreCase(email)) throw new AccessDeniedException("No tienes permiso"); return w; }
    private WeddingAudioResponse toResponse(WeddingAudio a) { return new WeddingAudioResponse(a.getAudioUrl(), a.getTitle(), a.getFileName(), a.getEnabled()); }
}
