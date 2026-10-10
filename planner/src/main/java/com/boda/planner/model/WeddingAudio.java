package com.boda.planner.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wedding_audio")
public class WeddingAudio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false) @JoinColumn(name = "wedding_id", nullable = false, unique = true)
    private Wedding wedding;
    @Column(name = "audio_url", nullable = false, length = 500)
    private String audioUrl;
    private String title;
    @Column(name = "file_name", length = 255)
    private String fileName;
    @Column(name = "is_enabled", nullable = false)
    private Boolean enabled = true;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate public void preUpdate() { updatedAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public Wedding getWedding() { return wedding; }
    public void setWedding(Wedding wedding) { this.wedding = wedding; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}
