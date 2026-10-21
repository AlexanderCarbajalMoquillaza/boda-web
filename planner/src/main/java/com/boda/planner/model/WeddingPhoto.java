package com.boda.planner.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "wedding_photo")
public class WeddingPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "wedding_id", nullable = false)
    private Wedding wedding;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 180)
    private String caption;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_visible", nullable = false)
    private Boolean visible = true;

    @Column(nullable = false, length = 30)
    private String section = "GALLERY";

    @Column(name = "is_featured", nullable = false)
    private Boolean featured = false;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "image_bytes", columnDefinition = "bytea")
    private byte[] imageBytes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Wedding getWedding() { return wedding; }
    public void setWedding(Wedding wedding) { this.wedding = wedding; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Boolean getVisible() { return visible; }
    public void setVisible(Boolean visible) { this.visible = visible; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public byte[] getImageBytes() { return imageBytes; }
    public void setImageBytes(byte[] imageBytes) { this.imageBytes = imageBytes; }
}
