package com.chitfund.controller;
 
import com.chitfund.model.ChitPlanGrid;
import com.chitfund.repository.ChitPlanGridRepository;
import com.chitfund.repository.ChitPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/admin/chit-plans/{planId}")
@CrossOrigin(origins = "*")
public class GridController {
 
    @Autowired private ChitPlanGridRepository gridRepo;
    @Autowired private ChitPlanRepository     planRepo;
 
    // ── GET /admin/chit-plans/{planId}/grid ───────────────────────────────
    @GetMapping("/grid")
    public ResponseEntity<List<ChitPlanGrid>> getGrid(@PathVariable Long planId) {
        if (!planRepo.existsById(planId))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(gridRepo.findByChitPlanId(planId));
    }
 
    // ── POST /admin/chit-plans/{planId}/grid ──────────────────────────────
    @PostMapping("/grid")
    @Transactional
    public ResponseEntity<String> saveGrid(
            @PathVariable Long planId,
            @RequestBody Map<String, Object> body) {
 
        if (!planRepo.existsById(planId))
            return ResponseEntity.notFound().build();
 
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rows = (List<Map<String, Object>>) body.get("rows");
        if (rows == null) return ResponseEntity.badRequest().body("rows field required.");
 
        for (Map<String, Object> row : rows) {
            Long memberId = Long.valueOf(row.get("memberId").toString());
 
            @SuppressWarnings("unchecked")
            List<String> months = (List<String>) row.get("months");
            if (months == null) continue;
 
            for (int i = 0; i < months.size(); i++) {
                String val = months.get(i);
                final int idx = i;
 
                ChitPlanGrid cell = gridRepo
                    .findByChitPlanIdAndMemberIdAndMonthIndex(planId, memberId, idx)
                    .orElseGet(() -> {
                        ChitPlanGrid c = new ChitPlanGrid();
                        c.setChitPlanId(planId);
                        c.setMemberId(memberId);
                        c.setMonthIndex(idx);
                        return c;
                    });
 
                cell.setCellValue(val == null ? "" : val);
                gridRepo.save(cell);
            }
        }
 
        return ResponseEntity.ok("Grid saved successfully.");
    }
}