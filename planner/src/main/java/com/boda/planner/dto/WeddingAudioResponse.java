package com.boda.planner.dto;

public class WeddingAudioResponse {
    private String audioUrl;
    private String title;
    private String fileName;
    private Boolean enabled;
    public WeddingAudioResponse(String audioUrl, String title, String fileName, Boolean enabled) { this.audioUrl = audioUrl; this.title = title; this.fileName = fileName; this.enabled = enabled; }
    public String getAudioUrl() { return audioUrl; }
    public String getTitle() { return title; }
    public String getFileName() { return fileName; }
    public Boolean getEnabled() { return enabled; }
}
