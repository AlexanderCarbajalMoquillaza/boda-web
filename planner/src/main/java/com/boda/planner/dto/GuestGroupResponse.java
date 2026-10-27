package com.boda.planner.dto;

import java.util.UUID;
import java.util.List;

public class GuestGroupResponse {

    private Long id;
    private Long weddingId;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private UUID accessToken;
    private Integer maxGuestsAllowed;
    private String status;
    private Integer registeredGuests;
    private Integer confirmedGuests;
    private List<GuestResponse> guests;
    private Boolean checkedIn = false;
    private String message;

    public GuestGroupResponse(
            Long id,
            Long weddingId,
            String contactName,
            String contactEmail,
            String contactPhone,
            UUID accessToken,
            Integer maxGuestsAllowed,
            String status,
            Integer registeredGuests,
            Integer confirmedGuests,
            List<GuestResponse> guests
    ) {
        this.id = id;
        this.weddingId = weddingId;
        this.contactName = contactName;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.accessToken = accessToken;
        this.maxGuestsAllowed = maxGuestsAllowed;
        this.status = status;
        this.registeredGuests = registeredGuests;
        this.confirmedGuests = confirmedGuests;
        this.guests = guests;
    }

    public Long getId() {
        return id;
    }

    public Long getWeddingId() {
        return weddingId;
    }

    public String getContactName() {
        return contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
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

    public Integer getRegisteredGuests() { return registeredGuests; }
    public Integer getConfirmedGuests() { return confirmedGuests; }
    public List<GuestResponse> getGuests() { return guests; }
    public Boolean getCheckedIn() { return checkedIn != null ? checkedIn : false; }
    public void setCheckedIn(Boolean checkedIn) { this.checkedIn = checkedIn; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
