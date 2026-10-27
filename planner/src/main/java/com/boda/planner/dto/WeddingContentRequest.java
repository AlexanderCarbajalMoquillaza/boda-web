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
    private Boolean showDressCodePalette = false;
    private String dressCodeColorsJson = "[]";
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
    private String lateralColor = "#e8efe9";
    private String templateId = "FLORAL_ROMANCE";
    private String brideFatherName;
    private String brideMotherName;
    private String groomFatherName;
    private String groomMotherName;
    private String godfatherName;
    private String godmotherName;
    private String welcomeCitation;
    private String customLogoUrl;
    private String notificationEmail;

    public String getNotificationEmail() { return notificationEmail; }
    public void setNotificationEmail(String notificationEmail) { this.notificationEmail = notificationEmail; }

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
    public Boolean getShowDressCodePalette() { return showDressCodePalette; }
    public void setShowDressCodePalette(Boolean value) { this.showDressCodePalette = value; }
    public String getDressCodeColorsJson() { return dressCodeColorsJson; }
    public void setDressCodeColorsJson(String value) { this.dressCodeColorsJson = value; }
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
    public String getLateralColor() { return lateralColor; }
    public void setLateralColor(String value) { this.lateralColor = value; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String value) { this.templateId = value; }

    public String getBrideFatherName() { return brideFatherName; }
    public void setBrideFatherName(String value) { this.brideFatherName = value; }
    public String getBrideMotherName() { return brideMotherName; }
    public void setBrideMotherName(String value) { this.brideMotherName = value; }
    public String getGroomFatherName() { return groomFatherName; }
    public void setGroomFatherName(String value) { this.groomFatherName = value; }
    public String getGroomMotherName() { return groomMotherName; }
    public void setGroomMotherName(String value) { this.groomMotherName = value; }
    public String getGodfatherName() { return godfatherName; }
    public void setGodfatherName(String value) { this.godfatherName = value; }
    public String getGodmotherName() { return godmotherName; }
    public void setGodmotherName(String value) { this.godmotherName = value; }
    public String getWelcomeCitation() { return welcomeCitation; }
    public void setWelcomeCitation(String value) { this.welcomeCitation = value; }
    public String getCustomLogoUrl() { return customLogoUrl; }
    public void setCustomLogoUrl(String value) { this.customLogoUrl = value; }
}
