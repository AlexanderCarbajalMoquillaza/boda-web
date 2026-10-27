package com.boda.planner.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DoorAccessResponse {

    private Long weddingId;
    private String weddingTitle;
    private String partnerOneName;
    private String partnerTwoName;
    private LocalDate weddingDate;
    private String tablesJson;
    private String primaryColor;
    private String accentColor;
    private String backgroundColor;
    private List<GuestDoorItem> guests;

    public DoorAccessResponse() {}

    public DoorAccessResponse(
            Long weddingId,
            String weddingTitle,
            String partnerOneName,
            String partnerTwoName,
            LocalDate weddingDate,
            String tablesJson,
            String primaryColor,
            String accentColor,
            String backgroundColor,
            List<GuestDoorItem> guests
    ) {
        this.weddingId = weddingId;
        this.weddingTitle = weddingTitle;
        this.partnerOneName = partnerOneName;
        this.partnerTwoName = partnerTwoName;
        this.weddingDate = weddingDate;
        this.tablesJson = tablesJson;
        this.primaryColor = primaryColor;
        this.accentColor = accentColor;
        this.backgroundColor = backgroundColor;
        this.guests = guests;
    }

    public Long getWeddingId() { return weddingId; }
    public void setWeddingId(Long weddingId) { this.weddingId = weddingId; }

    public String getWeddingTitle() { return weddingTitle; }
    public void setWeddingTitle(String weddingTitle) { this.weddingTitle = weddingTitle; }

    public String getPartnerOneName() { return partnerOneName; }
    public void setPartnerOneName(String partnerOneName) { this.partnerOneName = partnerOneName; }

    public String getPartnerTwoName() { return partnerTwoName; }
    public void setPartnerTwoName(String partnerTwoName) { this.partnerTwoName = partnerTwoName; }

    public LocalDate getWeddingDate() { return weddingDate; }
    public void setWeddingDate(LocalDate weddingDate) { this.weddingDate = weddingDate; }

    public String getTablesJson() { return tablesJson; }
    public void setTablesJson(String tablesJson) { this.tablesJson = tablesJson; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }

    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }

    public List<GuestDoorItem> getGuests() { return guests; }
    public void setGuests(List<GuestDoorItem> guests) { this.guests = guests; }

    public static class GuestDoorItem {
        private String id;
        private Long guestId;
        private Long groupId;
        private String guestName;
        private String groupName;
        private String status;
        private Boolean checkedIn;
        private LocalDateTime checkedInAt;
        private Boolean isHolderOnly;

        public GuestDoorItem() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public Long getGuestId() { return guestId; }
        public void setGuestId(Long guestId) { this.guestId = guestId; }

        public Long getGroupId() { return groupId; }
        public void setGroupId(Long groupId) { this.groupId = groupId; }

        public String getGuestName() { return guestName; }
        public void setGuestName(String guestName) { this.guestName = guestName; }

        public String getGroupName() { return groupName; }
        public void setGroupName(String groupName) { this.groupName = groupName; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Boolean getCheckedIn() { return checkedIn != null ? checkedIn : false; }
        public void setCheckedIn(Boolean checkedIn) { this.checkedIn = checkedIn; }

        public LocalDateTime getCheckedInAt() { return checkedInAt; }
        public void setCheckedInAt(LocalDateTime checkedInAt) { this.checkedInAt = checkedInAt; }

        public Boolean getIsHolderOnly() { return isHolderOnly != null ? isHolderOnly : false; }
        public void setIsHolderOnly(Boolean isHolderOnly) { this.isHolderOnly = isHolderOnly; }
    }
}
