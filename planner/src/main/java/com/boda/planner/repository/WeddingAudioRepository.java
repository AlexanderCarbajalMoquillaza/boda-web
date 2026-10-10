package com.boda.planner.repository;

import com.boda.planner.model.WeddingAudio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WeddingAudioRepository extends JpaRepository<WeddingAudio, Long> {
    Optional<WeddingAudio> findByWeddingId(Long weddingId);
}
