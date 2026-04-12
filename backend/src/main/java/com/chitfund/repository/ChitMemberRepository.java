package com.chitfund.repository;

import com.chitfund.model.ChitMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChitMemberRepository extends JpaRepository<ChitMember, Long> {

    // Returns all members belonging to a specific chit plan
    List<ChitMember> findByChitPlanId(Long chitPlanId);

    // Deletes all members when a chit plan is deleted
    void deleteByChitPlanId(Long chitPlanId);
}