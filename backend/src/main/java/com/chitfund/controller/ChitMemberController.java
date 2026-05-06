package com.chitfund.controller;

import com.chitfund.model.ChitMember;
import com.chitfund.repository.ChitMemberRepository;
import com.chitfund.repository.ChitPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/chit-plans/{planId}/members")
@CrossOrigin(origins = "*")
public class ChitMemberController {

    @Autowired
    private ChitMemberRepository chitMemberRepository;

    @Autowired
    private ChitPlanRepository chitPlanRepository;

    // ── GET /admin/chit-plans/{planId}/members ────────────────────────────
    // Returns all members for the given chit plan
    @GetMapping
    public ResponseEntity<List<ChitMember>> getMembers(@PathVariable Long planId) {
        if (!chitPlanRepository.existsById(planId))
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(chitMemberRepository.findByChitPlanId(planId));
    }

    // ── POST /admin/chit-plans/{planId}/members ───────────────────────────
    // Adds a new member to the given chit plan
    @PostMapping
    public ResponseEntity<String> addMember(@PathVariable Long planId,
                                            @RequestBody ChitMember member) {
        if (!chitPlanRepository.existsById(planId))
            return ResponseEntity.badRequest().body("Chit plan not found.");

        // ── Member limit check ──
        int totalMonths = chitPlanRepository.findById(planId).get().getTotalMonths();
        long currentCount = chitMemberRepository.findByChitPlanId(planId).size();
        if (currentCount >= totalMonths)
            return ResponseEntity.badRequest()
                .body("Member limit reached. This plan allows max " + totalMonths + " members.");

        // ── Validation ──
        if (member.getMemberName() == null || member.getMemberName().isBlank())
            return ResponseEntity.badRequest().body("Member name is required.");
        if (!member.getMemberName().matches("[a-zA-Z ]+"))
            return ResponseEntity.badRequest().body("Member name must contain letters only.");
        if (member.getMemberName().length() > 60)
            return ResponseEntity.badRequest().body("Member name must be 60 characters or less.");
        if (member.getMemberContact() == null || !member.getMemberContact().matches("\\d{10}"))
            return ResponseEntity.badRequest().body("Member contact must be exactly 10 digits.");
        if (member.getMemberEmail() != null && !member.getMemberEmail().isBlank()) {
            if (!member.getMemberEmail().matches("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
                return ResponseEntity.badRequest().body("Invalid email format.");
        }

        member.setChitPlanId(planId);
        chitMemberRepository.save(member);
        return ResponseEntity.ok("Member added successfully.");
    }

    // ── DELETE /admin/chit-plans/{planId}/members/{memberId} ─────────────
    // Removes a single member from a chit plan
    @DeleteMapping("/{memberId}")
    public ResponseEntity<String> deleteMember(@PathVariable Long planId,
                                               @PathVariable Long memberId) {
        if (!chitPlanRepository.existsById(planId))
            return ResponseEntity.notFound().build();

        if (!chitMemberRepository.existsById(memberId))
            return ResponseEntity.notFound().build();

        chitMemberRepository.deleteById(memberId);
        return ResponseEntity.ok("Member removed successfully.");
    }

    // ── PUT /admin/chit-plans/{planId}/members/{memberId} ─────────────────
    // Updates memberName, memberEmail, winningMonth
    @PutMapping("/{memberId}")
    public ResponseEntity<String> updateMember(
            @PathVariable Long planId,
            @PathVariable Long memberId,
            @RequestBody Map<String, String> body) {
    
        if (!chitPlanRepository.existsById(planId))
            return ResponseEntity.notFound().build();
    
        return chitMemberRepository.findById(memberId).map(member -> {
            String name = body.get("memberName");
            String email = body.get("memberEmail");
            String winningMonth = body.get("winningMonth");
    
            if (name != null && !name.isBlank()) {
                if (!name.matches("[a-zA-Z ]+"))
                    return ResponseEntity.badRequest().body("Member name must contain letters only.");
                if (name.length() > 60)
                    return ResponseEntity.badRequest().body("Member name must be 60 characters or less.");
                member.setMemberName(name);
            }
            if (email != null && !email.isBlank()) {
                if (!email.matches("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
                    return ResponseEntity.badRequest().body("Invalid email format.");
                member.setMemberEmail(email);
            }
            if (winningMonth != null)
                member.setWinningMonth(winningMonth);  // add this field to ChitMember entity
    
            chitMemberRepository.save(member);
            return ResponseEntity.ok("Member updated successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }

}