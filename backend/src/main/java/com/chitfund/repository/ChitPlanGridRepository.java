package com.chitfund.repository;
 
import com.chitfund.model.ChitPlanGrid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
 
public interface ChitPlanGridRepository extends JpaRepository<ChitPlanGrid, Long> {
    List<ChitPlanGrid>      findByChitPlanId(Long chitPlanId);
    Optional<ChitPlanGrid>  findByChitPlanIdAndMemberIdAndMonthIndex(Long chitPlanId, Long memberId, Integer monthIndex);
    void                    deleteByChitPlanId(Long chitPlanId);
}