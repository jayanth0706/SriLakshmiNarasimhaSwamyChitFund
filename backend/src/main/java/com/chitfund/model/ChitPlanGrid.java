package com.chitfund.model;
 
import jakarta.persistence.*;
 
@Entity
@Table(
    name = "chit_plan_grid",
    uniqueConstraints = @UniqueConstraint(columnNames = {"chit_plan_id", "member_id", "month_index"})
)
public class ChitPlanGrid {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(name = "chit_plan_id", nullable = false)
    private Long chitPlanId;
 
    @Column(name = "member_id", nullable = false)
    private Long memberId;
 
    @Column(name = "month_index", nullable = false)
    private Integer monthIndex;   // 0-based (0 = 1st month, 1 = 2nd month, …)
 
    @Column(name = "cell_value", length = 500)
    private String cellValue;     // free text / payment note
 
    // ── Getters & Setters ──────────────────────────────────────────────────
    public Long    getId()                       { return id; }
    public void    setId(Long id)                { this.id = id; }
 
    public Long    getChitPlanId()               { return chitPlanId; }
    public void    setChitPlanId(Long chitPlanId){ this.chitPlanId = chitPlanId; }
 
    public Long    getMemberId()                 { return memberId; }
    public void    setMemberId(Long memberId)    { this.memberId = memberId; }
 
    public Integer getMonthIndex()                        { return monthIndex; }
    public void    setMonthIndex(Integer monthIndex)      { this.monthIndex = monthIndex; }
 
    public String  getCellValue()                         { return cellValue; }
    public void    setCellValue(String cellValue)         { this.cellValue = cellValue; }
}