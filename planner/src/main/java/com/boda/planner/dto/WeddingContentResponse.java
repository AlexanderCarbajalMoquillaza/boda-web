package com.boda.planner.dto;

public class WeddingContentResponse extends WeddingContentRequest {
    private Long id;
    private String invitationSlug;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getInvitationSlug() { return invitationSlug; }
    public void setInvitationSlug(String invitationSlug) { this.invitationSlug = invitationSlug; }
}
