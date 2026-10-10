package com.boda.planner.repository;

import com.boda.planner.model.GuestGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GuestGroupRepository extends JpaRepository<GuestGroup, Long> {

    List<GuestGroup> findByWeddingId(Long weddingId);

    Optional<GuestGroup> findByAccessToken(UUID accessToken);

}
