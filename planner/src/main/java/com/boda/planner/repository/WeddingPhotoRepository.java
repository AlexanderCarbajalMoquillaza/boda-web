package com.boda.planner.repository;

import com.boda.planner.model.WeddingPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeddingPhotoRepository extends JpaRepository<WeddingPhoto, Long> {

    List<WeddingPhoto> findByWeddingIdAndVisibleTrueOrderByDisplayOrderAsc(Long weddingId);

    List<WeddingPhoto> findByWeddingIdOrderByDisplayOrderAsc(Long weddingId);
}
