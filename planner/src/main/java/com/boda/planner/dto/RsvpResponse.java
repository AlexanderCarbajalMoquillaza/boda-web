package com.boda.planner.dto;

import java.util.List;
import java.util.UUID;

public class RsvpResponse {

    private Long guestGroupId;
    private String contactName;
    private UUID accessToken;
    private Integer maxGuestsAllowed;
    private String status;
    private String weddingTitle;
    private List<GuestResponse> guests;

    public RsvpResponse(
            Long guestGroupId,
            String contactName,
            UUID accessToken,
            Integer maxGuestsAllowed,
            String status,
            String weddingTitle,
            List<GuestResponse> guests
    ) {
        this.guestGroupId = guestGroupId;
        this.contactName = contactName;
        this.accessToken = accessToken;
        this.maxGuestsAllowed = maxGuestsAllowed;
        this.status = status;
        this.weddingTitle = weddingTitle;
        this.guests = guests;
    }

    public Long getGuestGroupId() {
        return guestGroupId;
    }

    public String getContactName() {
        return contactName;
    }

    public UUID getAccessToken() {
        return accessToken;
    }

    public Integer getMaxGuestsAllowed() {
        return maxGuestsAllowed;
    }

    public String getStatus() {
        return status;
    }

    public String getWeddingTitle() {
        return weddingTitle;
    }

    public List<GuestResponse> getGuests() {
        return guests;
    }
}
