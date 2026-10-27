package com.boda.planner.dto;

import java.time.LocalDate;

public class PublicInvitationResponse {

    private String title;
    private String partnerOneName;
    private String partnerTwoName;
    private LocalDate weddingDate;
    private String venueName;
    private String venueAddress;
    private String locationsJson;
    private String invitationSlug;
    private String welcomeMessage;
    private String storyText;
    private String dressCode;
    private String dressCodePreset;
    private String dressCodeImageUrl;
    private Boolean showDressCodePalette;
    private String dressCodeColorsJson;
    private String mapUrl;
    private String giftRegistryUrl;
    private String giftOptionsJson;
    private String scheduleJson;
    private String faqJson;
    private String tablesJson;
    private Boolean showWelcome;
    private Boolean showStory;
    private Boolean showSchedule;
    private Boolean showDressCode;
    private Boolean showLocation;
    private Boolean showGiftRegistry;
    private Boolean showFaq;
    private Boolean showTables;
    private String primaryColor;
    private String accentColor;
    private String backgroundColor;
    private String lateralColor;
    private String templateId;
    private String brideFatherName;
    private String brideMotherName;
    private String groomFatherName;
    private String groomMotherName;
    private String godfatherName;
    private String godmotherName;
    private String welcomeCitation;
    private String customLogoUrl;

    public PublicInvitationResponse(
            String title,
            String partnerOneName,
            String partnerTwoName,
            LocalDate weddingDate,
            String venueName,
            String venueAddress,
            String locationsJson,
            String invitationSlug,
            String welcomeMessage,
            String storyText,
            String dressCode,
            String dressCodePreset,
            String dressCodeImageUrl,
            Boolean showDressCodePalette,
            String dressCodeColorsJson,
            String mapUrl,
            String giftRegistryUrl,
            String giftOptionsJson,
            String scheduleJson,
            String faqJson,
            String tablesJson,
            Boolean showWelcome,
            Boolean showStory,
            Boolean showSchedule,
            Boolean showDressCode,
            Boolean showLocation,
            Boolean showGiftRegistry,
            Boolean showFaq,
            Boolean showTables,
            String primaryColor,
            String accentColor,
            String backgroundColor,
            String templateId
    ) {
        this.title = title;
        this.partnerOneName = partnerOneName;
        this.partnerTwoName = partnerTwoName;
        this.weddingDate = weddingDate;
        this.venueName = venueName;
        this.venueAddress = venueAddress;
        this.locationsJson = locationsJson;
        this.invitationSlug = invitationSlug;
        this.welcomeMessage = welcomeMessage;
        this.storyText = storyText;
        this.dressCode = dressCode;
        this.dressCodePreset = dressCodePreset;
        this.dressCodeImageUrl = dressCodeImageUrl;
        this.showDressCodePalette = showDressCodePalette;
        this.dressCodeColorsJson = dressCodeColorsJson;
        this.mapUrl = mapUrl;
        this.giftRegistryUrl = giftRegistryUrl;
        this.giftOptionsJson = giftOptionsJson;
        this.scheduleJson = scheduleJson;
        this.faqJson = faqJson;
        this.tablesJson = tablesJson;
        this.showWelcome = showWelcome;
        this.showStory = showStory;
        this.showSchedule = showSchedule;
        this.showDressCode = showDressCode;
        this.showLocation = showLocation;
        this.showGiftRegistry = showGiftRegistry;
        this.showFaq = showFaq;
        this.showTables = showTables;
        this.primaryColor = primaryColor;
        this.accentColor = accentColor;
        this.backgroundColor = backgroundColor;
        this.templateId = templateId;
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

    public String getVenueName() {
        return venueName;
    }

    public String getVenueAddress() {
        return venueAddress;
    }
    public String getLocationsJson() { return locationsJson; }

    public String getInvitationSlug() {
        return invitationSlug;
    }
    public String getWelcomeMessage() { return welcomeMessage; }
    public String getStoryText() { return storyText; }
    public String getDressCode() { return dressCode; }
    public String getDressCodePreset() { return dressCodePreset; }
    public String getDressCodeImageUrl() { return dressCodeImageUrl; }
    public String getMapUrl() { return mapUrl; }
    public String getGiftRegistryUrl() { return giftRegistryUrl; }
    public String getGiftOptionsJson() { return giftOptionsJson; }
    public String getScheduleJson() { return scheduleJson; }
    public String getFaqJson() { return faqJson; }
    public String getTablesJson() { return tablesJson; }
    public Boolean getShowWelcome() { return showWelcome; }
    public Boolean getShowStory() { return showStory; }
    public Boolean getShowSchedule() { return showSchedule; }
    public Boolean getShowDressCode() { return showDressCode; }
    public Boolean getShowLocation() { return showLocation; }
    public Boolean getShowGiftRegistry() { return showGiftRegistry; }
    public Boolean getShowFaq() { return showFaq; }
    public Boolean getShowTables() { return showTables; }
    public String getPrimaryColor() { return primaryColor; }
    public String getAccentColor() { return accentColor; }
    public String getBackgroundColor() { return backgroundColor; }
    public String getLateralColor() { return lateralColor; }
    public void setLateralColor(String value) { this.lateralColor = value; }
    public String getTemplateId() { return templateId; }
    public Boolean getShowDressCodePalette() { return showDressCodePalette; }
    public String getDressCodeColorsJson() { return dressCodeColorsJson; }

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
