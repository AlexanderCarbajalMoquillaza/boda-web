package com.boda.planner.service;

import com.boda.planner.dto.PublicInvitationResponse;
import com.boda.planner.exception.BusinessRuleException;
import com.boda.planner.exception.ResourceNotFoundException;
import com.boda.planner.model.Wedding;
import com.boda.planner.repository.WeddingRepository;
import org.springframework.stereotype.Service;

@Service
public class PublicInvitationService {

    private final WeddingRepository weddingRepository;
    public PublicInvitationService(WeddingRepository weddingRepository) {
        this.weddingRepository = weddingRepository;
    }

    public PublicInvitationResponse findBySlug(String slug) {
        Wedding wedding = findPublicWeddingBySlug(slug);

        PublicInvitationResponse resp = new PublicInvitationResponse(
                wedding.getTitle(),
                wedding.getPartnerOneName(),
                wedding.getPartnerTwoName(),
                wedding.getWeddingDate(),
                wedding.getVenueName(),
                wedding.getVenueAddress(),
                wedding.getLocationsJson(),
                wedding.getInvitationSlug(),
                wedding.getWelcomeMessage(), wedding.getStoryText(), wedding.getDressCode(),
                wedding.getDressCodePreset(), wedding.getDressCodeImageUrl(),
                Boolean.TRUE.equals(wedding.getShowDressCodePalette()),
                wedding.getDressCodeColorsJson() != null ? wedding.getDressCodeColorsJson() : "[]",
                wedding.getMapUrl(), wedding.getGiftRegistryUrl(), wedding.getGiftOptionsJson(), wedding.getScheduleJson(),
                wedding.getFaqJson(), wedding.getTablesJson(), wedding.getShowWelcome(),
                wedding.getShowStory(), wedding.getShowSchedule(), wedding.getShowDressCode(),
                wedding.getShowLocation(), wedding.getShowGiftRegistry(), wedding.getShowFaq(),
                wedding.getShowTables(), wedding.getPrimaryColor(), wedding.getAccentColor(), wedding.getBackgroundColor(),
                wedding.getTemplateId() != null ? wedding.getTemplateId() : "FLORAL_ROMANCE"
        );
        resp.setBrideFatherName(wedding.getBrideFatherName());
        resp.setBrideMotherName(wedding.getBrideMotherName());
        resp.setGroomFatherName(wedding.getGroomFatherName());
        resp.setGroomMotherName(wedding.getGroomMotherName());
        resp.setGodfatherName(wedding.getGodfatherName());
        resp.setGodmotherName(wedding.getGodmotherName());
        resp.setWelcomeCitation(wedding.getWelcomeCitation());
        resp.setCustomLogoUrl(wedding.getCustomLogoUrl());
        return resp;
    }

    private Wedding findPublicWeddingBySlug(String slug) {
        Wedding wedding = weddingRepository.findByInvitationSlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Invitacion no encontrada"));

        if (!Boolean.TRUE.equals(wedding.getInvitationPublic())) {
            throw new BusinessRuleException("La invitacion no esta disponible");
        }

        return wedding;
    }
}
