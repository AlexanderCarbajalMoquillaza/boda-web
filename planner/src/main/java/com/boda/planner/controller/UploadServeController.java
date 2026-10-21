package com.boda.planner.controller;

import com.boda.planner.model.Wedding;
import com.boda.planner.model.WeddingAudio;
import com.boda.planner.model.WeddingPhoto;
import com.boda.planner.repository.WeddingAudioRepository;
import com.boda.planner.repository.WeddingPhotoRepository;
import com.boda.planner.repository.WeddingRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
public class UploadServeController {

    private final WeddingRepository weddingRepository;
    private final WeddingAudioRepository audioRepository;
    private final WeddingPhotoRepository photoRepository;

    public UploadServeController(
            WeddingRepository weddingRepository,
            WeddingAudioRepository audioRepository,
            WeddingPhotoRepository photoRepository
    ) {
        this.weddingRepository = weddingRepository;
        this.audioRepository = audioRepository;
        this.photoRepository = photoRepository;
    }

    @GetMapping("/uploads/weddings/{weddingId}/{filename}")
    public ResponseEntity<Resource> serveUpload(
            @PathVariable Long weddingId,
            @PathVariable String filename,
            HttpServletRequest request
    ) {
        // 1. Check local disk locations
        Path diskPath = resolveDiskPath(weddingId, filename);
        if (diskPath != null && Files.isRegularFile(diskPath)) {
            try {
                String contentType = Files.probeContentType(diskPath);
                if (contentType == null) contentType = inferContentType(filename);
                Resource resource = new FileSystemResource(diskPath);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                        .body(resource);
            } catch (Exception ignored) {}
        }

        // 2. If missing from disk (e.g. Render restarted container), rehydrate from Database!
        // 2a. Check if it's audio
        Optional<WeddingAudio> audioOpt = audioRepository.findByWeddingId(weddingId);
        if (audioOpt.isPresent()) {
            WeddingAudio audio = audioOpt.get();
            if (audio.getAudioUrl() != null && audio.getAudioUrl().endsWith(filename) && audio.getAudioBytes() != null && audio.getAudioBytes().length > 0) {
                persistToDisk(weddingId, filename, audio.getAudioBytes());
                String contentType = audio.getContentType() != null ? audio.getContentType() : "audio/mpeg";
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                        .body(new ByteArrayResource(audio.getAudioBytes()));
            }
        }

        // 2b. Check if it's a gallery photo
        List<WeddingPhoto> photos = photoRepository.findByWeddingIdOrderByDisplayOrderAsc(weddingId);
        for (WeddingPhoto photo : photos) {
            if (photo.getImageUrl() != null && photo.getImageUrl().endsWith(filename) && photo.getImageBytes() != null && photo.getImageBytes().length > 0) {
                persistToDisk(weddingId, filename, photo.getImageBytes());
                String contentType = photo.getContentType() != null ? photo.getContentType() : inferContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=604800")
                        .body(new ByteArrayResource(photo.getImageBytes()));
            }
        }

        // 2c. Check if it's the dress code image or custom logo on wedding
        Optional<Wedding> weddingOpt = weddingRepository.findById(weddingId);
        if (weddingOpt.isPresent()) {
            Wedding wedding = weddingOpt.get();
            if (wedding.getDressCodeImageUrl() != null && wedding.getDressCodeImageUrl().endsWith(filename) && wedding.getDressCodeImageBytes() != null && wedding.getDressCodeImageBytes().length > 0) {
                persistToDisk(weddingId, filename, wedding.getDressCodeImageBytes());
                String contentType = wedding.getDressCodeImageContentType() != null ? wedding.getDressCodeImageContentType() : inferContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=604800")
                        .body(new ByteArrayResource(wedding.getDressCodeImageBytes()));
            }
            if (wedding.getCustomLogoUrl() != null && wedding.getCustomLogoUrl().endsWith(filename) && wedding.getCustomLogoBytes() != null && wedding.getCustomLogoBytes().length > 0) {
                persistToDisk(weddingId, filename, wedding.getCustomLogoBytes());
                String contentType = wedding.getCustomLogoContentType() != null ? wedding.getCustomLogoContentType() : inferContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=604800")
                        .body(new ByteArrayResource(wedding.getCustomLogoBytes()));
            }
        }

        return ResponseEntity.notFound().build();
    }

    private Path resolveDiskPath(Long weddingId, String filename) {
        Path p1 = Paths.get("uploads", "weddings", String.valueOf(weddingId), filename);
        if (Files.isRegularFile(p1)) return p1;
        Path p2 = Paths.get("planner", "uploads", "weddings", String.valueOf(weddingId), filename);
        if (Files.isRegularFile(p2)) return p2;
        return null;
    }

    private void persistToDisk(Long weddingId, String filename, byte[] bytes) {
        try {
            Path targetDir = Files.exists(Paths.get("planner"))
                    ? Paths.get("planner", "uploads", "weddings", String.valueOf(weddingId))
                    : Paths.get("uploads", "weddings", String.valueOf(weddingId));
            Files.createDirectories(targetDir);
            Files.write(targetDir.resolve(filename), bytes);
        } catch (Exception ignored) {}
    }

    private String inferContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".mp3")) return "audio/mpeg";
        if (lower.endsWith(".m4a")) return "audio/mp4";
        if (lower.endsWith(".wav")) return "audio/wav";
        if (lower.endsWith(".ogg")) return "audio/ogg";
        return "application/octet-stream";
    }
}
