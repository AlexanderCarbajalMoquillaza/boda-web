package com.boda.planner.repository;

import com.boda.planner.model.Wedding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WeddingRepository extends JpaRepository<Wedding, Long> {
    List<Wedding> findByOwnerUserId(Long ownerUserId);

    Optional<Wedding> findByInvitationSlug(String invitationSlug);

    boolean existsByInvitationSlug(String invitationSlug);
}
