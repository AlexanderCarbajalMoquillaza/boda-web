package com.boda.planner.dto;

public class ToggleCheckInRequest {

    private Long guestId;
    private Long groupId;
    private Boolean checkedIn;

    public ToggleCheckInRequest() {}

    public ToggleCheckInRequest(Long guestId, Long groupId, Boolean checkedIn) {
        this.guestId = guestId;
        this.groupId = groupId;
        this.checkedIn = checkedIn;
    }

    public Long getGuestId() {
        return guestId;
    }

    public void setGuestId(Long guestId) {
        this.guestId = guestId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Boolean getCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(Boolean checkedIn) {
        this.checkedIn = checkedIn;
    }
}
