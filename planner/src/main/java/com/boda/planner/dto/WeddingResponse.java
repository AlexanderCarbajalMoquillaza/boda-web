package com.boda.planner.dto;

import java.time.LocalDate;

public class WeddingResponse {
    private Long id;
    private String title;
    private String partnerOneName;
    private String partnerTwoName;
    private LocalDate weddingDate;
    private String invitationSlug;
    private Integer maxRegisteredGuests;
    private String ownerFullName;

    public WeddingResponse(
            Long id,
            String title,
            String partnerOneName,
            String partnerTwoName,
            LocalDate weddingDate,
            String invitationSlug,
            Integer maxRegisteredGuests,
            String ownerFullName
    ) {
        this.id = id;
        this.title = title;
        this.partnerOneName = partnerOneName;
        this.partnerTwoName = partnerTwoName;
        this.weddingDate = weddingDate;
        this.invitationSlug = invitationSlug;
        this.maxRegisteredGuests = maxRegisteredGuests;
        this.ownerFullName = ownerFullName;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getPartnerOneName() {
        return partnerOneName;
    }

    public String getPartnerTwoName() {
        return partnerTwoName;
    }

    public LocalDate getWeddingDate() {
        return weddingDate;
    }

    public String getInvitationSlug() {
        return invitationSlug;
    }

    public Integer getMaxRegisteredGuests() {
        return maxRegisteredGuests;
    }

    public String getOwnerFullName() {
        return ownerFullName;
    }
}
