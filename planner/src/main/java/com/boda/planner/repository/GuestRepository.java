package com.boda.planner.repository;

import com.boda.planner.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long> {

    List<Guest> findByGuestGroupId(Long guestGroupId);
}
