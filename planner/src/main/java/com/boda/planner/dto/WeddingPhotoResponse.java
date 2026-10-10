package com.boda.planner.dto;

import java.time.LocalDateTime;

public class WeddingPhotoResponse {
    private Long id;
    private String imageUrl;
    private String caption;
    private Integer displayOrder;
    private Boolean visible;
    private String section;
    private Boolean featured;
    private LocalDateTime createdAt;

    public WeddingPhotoResponse(Long id, String imageUrl, String caption, Integer displayOrder, Boolean visible, String section, Boolean featured, LocalDateTime createdAt) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.displayOrder = displayOrder;
        this.visible = visible;
        this.section = section;
        this.featured = featured;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getImageUrl() { return imageUrl; }
    public String getCaption() { return caption; }
    public Integer getDisplayOrder() { return displayOrder; }
    public Boolean getVisible() { return visible; }
    public String getSection() { return section; }
    public Boolean getFeatured() { return featured; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
