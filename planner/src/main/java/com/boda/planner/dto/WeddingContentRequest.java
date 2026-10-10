package com.boda.planner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class WeddingContentRequest {
    @NotBlank private String title;
    @NotBlank private String partnerOneName;
    @NotBlank private String partnerTwoName;
    @NotNull private LocalDate weddingDate;
    private String venueName;
    private String venueAddress;
    private String locationsJson = "[]";
    private Integer maxRegisteredGuests;
    private String welcomeMessage;
    private String storyText;
    private String dressCode;
    private String dressCodePreset;
    private String dressCodeImageUrl;
    private String mapUrl;
    private String giftRegistryUrl;
    private String giftOptionsJson = "[]";
    private String scheduleJson = "[]";
    private String faqJson = "[]";
    private String tablesJson = "[]";
    private Boolean showWelcome = true;
    private Boolean showStory = true;
    private Boolean showSchedule = true;
    private Boolean showDressCode = true;
    private Boolean showLocation = true;
    private Boolean showGiftRegistry = true;
    private Boolean showFaq = true;
    private Boolean showTables = true;
    private String primaryColor = "#7fb3a8";
    private String accentColor = "#b79a62";
    private String backgroundColor = "#f4f1ea";

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPartnerOneName() { return partnerOneName; }
    public void setPartnerOneName(String value) { this.partnerOneName = value; }
    public String getPartnerTwoName() { return partnerTwoName; }
    public void setPartnerTwoName(String value) { this.partnerTwoName = value; }
    public LocalDate getWeddingDate() { return weddingDate; }
    public void setWeddingDate(LocalDate value) { this.weddingDate = value; }
    public String getVenueName() { return venueName; }
    public void setVenueName(String value) { this.venueName = value; }
    public String getVenueAddress() { return venueAddress; }
    public void setVenueAddress(String value) { this.venueAddress = value; }
    public String getLocationsJson() { return locationsJson; }
    public void setLocationsJson(String value) { this.locationsJson = value; }
    public Integer getMaxRegisteredGuests() { return maxRegisteredGuests; }
    public void setMaxRegisteredGuests(Integer value) { this.maxRegisteredGuests = value; }
    public String getWelcomeMessage() { return welcomeMessage; }
    public void setWelcomeMessage(String value) { this.welcomeMessage = value; }
    public String getStoryText() { return storyText; }
    public void setStoryText(String value) { this.storyText = value; }
    public String getDressCode() { return dressCode; }
    public void setDressCode(String value) { this.dressCode = value; }
    public String getDressCodePreset() { return dressCodePreset; }
    public void setDressCodePreset(String value) { this.dressCodePreset = value; }
    public String getDressCodeImageUrl() { return dressCodeImageUrl; }
    public void setDressCodeImageUrl(String value) { this.dressCodeImageUrl = value; }
    public String getMapUrl() { return mapUrl; }
    public void setMapUrl(String value) { this.mapUrl = value; }
    public String getGiftRegistryUrl() { return giftRegistryUrl; }
    public void setGiftRegistryUrl(String value) { this.giftRegistryUrl = value; }
    public String getGiftOptionsJson() { return giftOptionsJson; }
    public void setGiftOptionsJson(String value) { this.giftOptionsJson = value; }
    public String getScheduleJson() { return scheduleJson; }
    public void setScheduleJson(String value) { this.scheduleJson = value; }
    public String getFaqJson() { return faqJson; }
    public void setFaqJson(String value) { this.faqJson = value; }
    public String getTablesJson() { return tablesJson; }
    public void setTablesJson(String value) { this.tablesJson = value; }
    public Boolean getShowWelcome() { return showWelcome; }
    public void setShowWelcome(Boolean value) { this.showWelcome = value; }
    public Boolean getShowStory() { return showStory; }
    public void setShowStory(Boolean value) { this.showStory = value; }
    public Boolean getShowSchedule() { return showSchedule; }
    public void setShowSchedule(Boolean value) { this.showSchedule = value; }
    public Boolean getShowDressCode() { return showDressCode; }
    public void setShowDressCode(Boolean value) { this.showDressCode = value; }
    public Boolean getShowLocation() { return showLocation; }
    public void setShowLocation(Boolean value) { this.showLocation = value; }
    public Boolean getShowGiftRegistry() { return showGiftRegistry; }
    public void setShowGiftRegistry(Boolean value) { this.showGiftRegistry = value; }
    public Boolean getShowFaq() { return showFaq; }
    public void setShowFaq(Boolean value) { this.showFaq = value; }
    public Boolean getShowTables() { return showTables; }
    public void setShowTables(Boolean value) { this.showTables = value; }
    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String value) { this.primaryColor = value; }
    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String value) { this.accentColor = value; }
    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String value) { this.backgroundColor = value; }
}
