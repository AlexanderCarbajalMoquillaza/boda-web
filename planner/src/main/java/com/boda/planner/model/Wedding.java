package com.boda.planner.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="wedding")
public class Wedding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private AppUser ownerUser;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(name = "partner_one_name", nullable = false, length = 100)
    private String partnerOneName;

    @Column(name = "partner_two_name", nullable = false, length = 100)
    private String partnerTwoName;

    @Column(name = "wedding_date", nullable = false)
    private LocalDate weddingDate;

    @Column(name = "venue_name", length = 160)
    private String venueName;

    @Column(name = "venue_address", length = 255)
    private String venueAddress;

    @Column(name = "locations_json", columnDefinition = "TEXT")
    private String locationsJson = "[]";

    @Column(name = "invitation_slug", nullable = false, unique = true, length = 120)
    private String invitationSlug;

    @Column(name = "max_registered_guests", nullable = false)
    private Integer maxRegisteredGuests = 0;

    @Column(name = "is_invitation_public", nullable = false)
    private Boolean invitationPublic = true;

    @Column(name = "welcome_message", columnDefinition = "TEXT")
    private String welcomeMessage;

    @Column(name = "story_text", columnDefinition = "TEXT")
    private String storyText;

    @Column(name = "dress_code", length = 255)
    private String dressCode;

    @Column(name = "dress_code_preset", length = 80)
    private String dressCodePreset;

    @Column(name = "dress_code_image_url", length = 500)
    private String dressCodeImageUrl;

    @Column(name = "map_url", length = 500)
    private String mapUrl;

    @Column(name = "gift_registry_url", length = 500)
    private String giftRegistryUrl;

    @Column(name = "gift_options_json", columnDefinition = "TEXT")
    private String giftOptionsJson = "[]";

    @Column(name = "schedule_json", columnDefinition = "TEXT")
    private String scheduleJson = "[]";

    @Column(name = "faq_json", columnDefinition = "TEXT")
    private String faqJson = "[]";

    @Column(name = "tables_json", columnDefinition = "TEXT")
    private String tablesJson = "[]";

    @Column(name = "show_welcome", nullable = false)
    private Boolean showWelcome = true;

    @Column(name = "show_story", nullable = false)
    private Boolean showStory = true;

    @Column(name = "show_schedule", nullable = false)
    private Boolean showSchedule = true;

    @Column(name = "show_dress_code", nullable = false)
    private Boolean showDressCode = true;

    @Column(name = "show_location", nullable = false)
    private Boolean showLocation = true;

    @Column(name = "show_gift_registry", nullable = false)
    private Boolean showGiftRegistry = true;

    @Column(name = "show_faq", nullable = false)
    private Boolean showFaq = true;

    @Column(name = "show_tables", nullable = false)
    private Boolean showTables = true;

    @Column(name = "primary_color", length = 20)
    private String primaryColor = "#7fb3a8";
    @Column(name = "accent_color", length = 20)
    private String accentColor = "#b79a62";
    @Column(name = "background_color", length = 20)
    private String backgroundColor = "#f4f1ea";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppUser getOwnerUser() {
        return ownerUser;
    }

    public void setOwnerUser(AppUser ownerUser) {
        this.ownerUser = ownerUser;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPartnerOneName() {
        return partnerOneName;
    }

    public void setPartnerOneName(String partnerOneName) {
        this.partnerOneName = partnerOneName;
    }

    public String getPartnerTwoName() {
        return partnerTwoName;
    }

    public void setPartnerTwoName(String partnerTwoName) {
        this.partnerTwoName = partnerTwoName;
    }

    public LocalDate getWeddingDate() {
        return weddingDate;
    }

    public void setWeddingDate(LocalDate weddingDate) {
        this.weddingDate = weddingDate;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getVenueAddress() {
        return venueAddress;
    }

    public void setVenueAddress(String venueAddress) {
        this.venueAddress = venueAddress;
    }
    public String getLocationsJson() { return locationsJson; }
    public void setLocationsJson(String locationsJson) { this.locationsJson = locationsJson; }

    public String getInvitationSlug() {
        return invitationSlug;
    }

    public void setInvitationSlug(String invitationSlug) {
        this.invitationSlug = invitationSlug;
    }

    public Integer getMaxRegisteredGuests() {
        return maxRegisteredGuests;
    }

    public void setMaxRegisteredGuests(Integer maxRegisteredGuests) {
        this.maxRegisteredGuests = maxRegisteredGuests;
    }

    public Boolean getInvitationPublic() {
        return invitationPublic;
    }

    public void setInvitationPublic(Boolean invitationPublic) {
        this.invitationPublic = invitationPublic;
    }

    public String getWelcomeMessage() { return welcomeMessage; }
    public void setWelcomeMessage(String welcomeMessage) { this.welcomeMessage = welcomeMessage; }
    public String getStoryText() { return storyText; }
    public void setStoryText(String storyText) { this.storyText = storyText; }
    public String getDressCode() { return dressCode; }
    public void setDressCode(String dressCode) { this.dressCode = dressCode; }
    public String getDressCodePreset() { return dressCodePreset; }
    public void setDressCodePreset(String dressCodePreset) { this.dressCodePreset = dressCodePreset; }
    public String getDressCodeImageUrl() { return dressCodeImageUrl; }
    public void setDressCodeImageUrl(String dressCodeImageUrl) { this.dressCodeImageUrl = dressCodeImageUrl; }
    public String getMapUrl() { return mapUrl; }
    public void setMapUrl(String mapUrl) { this.mapUrl = mapUrl; }
    public String getGiftRegistryUrl() { return giftRegistryUrl; }
    public void setGiftRegistryUrl(String giftRegistryUrl) { this.giftRegistryUrl = giftRegistryUrl; }
    public String getGiftOptionsJson() { return giftOptionsJson; }
    public void setGiftOptionsJson(String giftOptionsJson) { this.giftOptionsJson = giftOptionsJson; }
    public String getScheduleJson() { return scheduleJson; }
    public void setScheduleJson(String scheduleJson) { this.scheduleJson = scheduleJson; }
    public String getFaqJson() { return faqJson; }
    public void setFaqJson(String faqJson) { this.faqJson = faqJson; }
    public String getTablesJson() { return tablesJson; }
    public void setTablesJson(String tablesJson) { this.tablesJson = tablesJson; }
    public Boolean getShowWelcome() { return showWelcome; }
    public void setShowWelcome(Boolean showWelcome) { this.showWelcome = showWelcome; }
    public Boolean getShowStory() { return showStory; }
    public void setShowStory(Boolean showStory) { this.showStory = showStory; }
    public Boolean getShowSchedule() { return showSchedule; }
    public void setShowSchedule(Boolean showSchedule) { this.showSchedule = showSchedule; }
    public Boolean getShowDressCode() { return showDressCode; }
    public void setShowDressCode(Boolean showDressCode) { this.showDressCode = showDressCode; }
    public Boolean getShowLocation() { return showLocation; }
    public void setShowLocation(Boolean showLocation) { this.showLocation = showLocation; }
    public Boolean getShowGiftRegistry() { return showGiftRegistry; }
    public void setShowGiftRegistry(Boolean showGiftRegistry) { this.showGiftRegistry = showGiftRegistry; }
    public Boolean getShowFaq() { return showFaq; }
    public void setShowFaq(Boolean showFaq) { this.showFaq = showFaq; }
    public Boolean getShowTables() { return showTables; }
    public void setShowTables(Boolean showTables) { this.showTables = showTables; }
    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }
    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }
    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
