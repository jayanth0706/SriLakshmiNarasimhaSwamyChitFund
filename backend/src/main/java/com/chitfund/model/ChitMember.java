package com.chitfund.model;

import jakarta.persistence.*;

@Entity
@Table(name = "chit_members")
public class ChitMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK → chit_plans.id
    @Column(name = "chit_plan_id", nullable = false)
    private Long chitPlanId;

    @Column(name = "member_name", nullable = false, length = 60)
    private String memberName;

    @Column(name = "member_contact", nullable = false, length = 10)
    private String memberContact;

    @Column(name = "member_email", length = 100)
    private String memberEmail;

    @Column(name = "member_address", length = 200)
    private String memberAddress;

    // ── Getters & Setters ──────────────────────────────────────
    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }

    public Long getChitPlanId()                  { return chitPlanId; }
    public void setChitPlanId(Long chitPlanId)   { this.chitPlanId = chitPlanId; }

    public String getMemberName()                        { return memberName; }
    public void   setMemberName(String memberName)       { this.memberName = memberName; }

    public String getMemberContact()                     { return memberContact; }
    public void   setMemberContact(String memberContact) { this.memberContact = memberContact; }

    public String getMemberEmail()                   { return memberEmail; }
    public void   setMemberEmail(String memberEmail) { this.memberEmail = memberEmail; }

    public String getMemberAddress()                     { return memberAddress; }
    public void   setMemberAddress(String memberAddress) { this.memberAddress = memberAddress; }
}