package com.boda.planner.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "guest")
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "guest_group_id", nullable = false)
    private GuestGroup guestGroup;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(name = "age_group", nullable = false, length = 30)
    private String ageGroup = "ADULT";

    @Column(name = "menu_option", length = 60)
    private String menuOption;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "attendance_status", nullable = false, length = 30)
    private String attendanceStatus = "PENDING";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public GuestGroup getGuestGroup() {
        return guestGroup;
    }

    public void setGuestGroup(GuestGroup guestGroup) {
        this.guestGroup = guestGroup;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getMenuOption() {
        return menuOption;
    }

    public void setMenuOption(String menuOption) {
        this.menuOption = menuOption;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
}
