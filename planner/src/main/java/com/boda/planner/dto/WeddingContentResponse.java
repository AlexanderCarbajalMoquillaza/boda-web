package com.boda.planner.dto;

public class WeddingContentResponse extends WeddingContentRequest {
    private Long id;
    private String invitationSlug;
    private String doorAccessKey;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getInvitationSlug() { return invitationSlug; }
    public void setInvitationSlug(String invitationSlug) { this.invitationSlug = invitationSlug; }
    public String getDoorAccessKey() { return doorAccessKey; }
    public void setDoorAccessKey(String doorAccessKey) { this.doorAccessKey = doorAccessKey; }
}
