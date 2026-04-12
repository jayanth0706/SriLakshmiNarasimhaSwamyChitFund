package com.chitfund.model;

import jakarta.persistence.*;

@Entity
@Table(name = "chit_plans")
public class ChitPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chit_plan_name", nullable = false, length = 50)
    private String chitPlanName;

    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    @Column(name = "monthly_pay", nullable = false)
    private Long monthlyPay;

    @Column(name = "total_months", nullable = false)
    private Integer totalMonths;

    @Column(name = "start_date", nullable = false)
    private String startDate;   // stored as "YYYY-MM"

    @Column(name = "end_date", nullable = false)
    private String endDate;     // stored as "YYYY-MM"

    @Column(name = "admin_name", nullable = false, length = 50)
    private String adminName;

    @Column(name = "admin_contact", nullable = false, length = 10)
    private String adminContact;

    // ── Getters & Setters ──────────────────────────────────────
    public Long getId()                  { return id; }
    public void setId(Long id)           { this.id = id; }

    public String getChitPlanName()                  { return chitPlanName; }
    public void   setChitPlanName(String chitPlanName) { this.chitPlanName = chitPlanName; }

    public Long getTotalAmount()                  { return totalAmount; }
    public void setTotalAmount(Long totalAmount)  { this.totalAmount = totalAmount; }

    public Long getMonthlyPay()                  { return monthlyPay; }
    public void setMonthlyPay(Long monthlyPay)   { this.monthlyPay = monthlyPay; }

    public Integer getTotalMonths()                    { return totalMonths; }
    public void    setTotalMonths(Integer totalMonths) { this.totalMonths = totalMonths; }

    public String getStartDate()                 { return startDate; }
    public void   setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate()               { return endDate; }
    public void   setEndDate(String endDate) { this.endDate = endDate; }

    public String getAdminName()                 { return adminName; }
    public void   setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminContact()                    { return adminContact; }
    public void   setAdminContact(String adminContact) { this.adminContact = adminContact; }
}