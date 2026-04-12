package com.chitfund.controller;

import com.chitfund.model.ChitPlan;
import com.chitfund.repository.ChitMemberRepository;
import com.chitfund.repository.ChitPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class ChitPlanController {

    @Autowired
    private ChitPlanRepository chitPlanRepository;

    @Autowired
    private ChitMemberRepository chitMemberRepository;

    // ── POST /admin/chit-plans ─────────────────────────────────────────────
    @PostMapping("/chit-plans")
    public ResponseEntity<String> createChitPlan(@RequestBody ChitPlan chitPlan) {
        try {
            if (chitPlan.getChitPlanName() == null || chitPlan.getChitPlanName().isBlank())
                return ResponseEntity.badRequest().body("Chit plan name is required.");
            if (chitPlan.getChitPlanName().length() > 50)
                return ResponseEntity.badRequest().body("Chit plan name must be 50 characters or less.");
            if (chitPlan.getTotalAmount() == null)
                return ResponseEntity.badRequest().body("Total amount is required.");
            if (chitPlan.getMonthlyPay() == null || chitPlan.getMonthlyPay().toString().length() > 9)
                return ResponseEntity.badRequest().body("Monthly pay must be less than 10 digits.");
            if (chitPlan.getTotalMonths() == null || chitPlan.getTotalMonths().toString().length() > 2)
                return ResponseEntity.badRequest().body("Total months must be less than 3 digits.");
            if (chitPlan.getStartDate() == null || chitPlan.getStartDate().isBlank())
                return ResponseEntity.badRequest().body("Start date is required.");
            if (chitPlan.getEndDate() == null || chitPlan.getEndDate().isBlank())
                return ResponseEntity.badRequest().body("End date is required.");
            if (chitPlan.getEndDate().compareTo(chitPlan.getStartDate()) <= 0)
                return ResponseEntity.badRequest().body("End date must be after start date.");
            if (chitPlan.getAdminName() == null || chitPlan.getAdminName().isBlank())
                return ResponseEntity.badRequest().body("Admin name is required.");
            if (!chitPlan.getAdminName().matches("[a-zA-Z ]+"))
                return ResponseEntity.badRequest().body("Admin name must contain letters only.");
            if (chitPlan.getAdminName().length() > 50)
                return ResponseEntity.badRequest().body("Admin name must be 50 characters or less.");
            if (chitPlan.getAdminContact() == null || !chitPlan.getAdminContact().matches("\\d{10}"))
                return ResponseEntity.badRequest().body("Admin contact must be exactly 10 digits.");

            chitPlanRepository.save(chitPlan);
            return ResponseEntity.ok("Chit plan created successfully.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong: " + e.getMessage());
        }
    }

    // ── GET /admin/chit-plans ──────────────────────────────────────────────
    @GetMapping("/chit-plans")
    public ResponseEntity<List<ChitPlan>> getAllChitPlans() {
        return ResponseEntity.ok(chitPlanRepository.findAll());
    }

    // ── DELETE /admin/chit-plans/{id} ─────────────────────────────────────
    // Also deletes all members linked to this plan (cascade via repository)
    @DeleteMapping("/chit-plans/{id}")
    @Transactional
    public ResponseEntity<String> deleteChitPlan(@PathVariable Long id) {
        if (!chitPlanRepository.existsById(id))
            return ResponseEntity.notFound().build();

        // Delete all members of this plan first
        chitMemberRepository.deleteByChitPlanId(id);

        // Then delete the plan itself
        chitPlanRepository.deleteById(id);

        return ResponseEntity.ok("Chit plan and its members deleted successfully.");
    }
}