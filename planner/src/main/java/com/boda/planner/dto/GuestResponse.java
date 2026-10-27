package com.boda.planner.dto;

public class GuestResponse {

    private Long id;
    private String fullName;
    private String ageGroup;
    private String menuOption;
    private String allergies;
    private String attendanceStatus;
    private Boolean checkedIn = false;
    private java.time.LocalDateTime checkedInAt;

    public GuestResponse(
            Long id,
            String fullName,
            String ageGroup,
            String menuOption,
            String allergies,
            String attendanceStatus
    ) {
        this(id, fullName, ageGroup, menuOption, allergies, attendanceStatus, false, null);
    }

    public GuestResponse(
            Long id,
            String fullName,
            String ageGroup,
            String menuOption,
            String allergies,
            String attendanceStatus,
            Boolean checkedIn,
            java.time.LocalDateTime checkedInAt
    ) {
        this.id = id;
        this.fullName = fullName;
        this.ageGroup = ageGroup;
        this.menuOption = menuOption;
        this.allergies = allergies;
        this.attendanceStatus = attendanceStatus;
        this.checkedIn = checkedIn != null ? checkedIn : false;
        this.checkedInAt = checkedInAt;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public String getMenuOption() {
        return menuOption;
    }

    public String getAllergies() {
        return allergies;
    }

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public Boolean getCheckedIn() {
        return checkedIn != null ? checkedIn : false;
    }

    public java.time.LocalDateTime getCheckedInAt() {
        return checkedInAt;
    }
}
