import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ── Google Font ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap";
document.head.appendChild(fontLink);

const G = "#16a34a";
const G_LIGHT = "#f0fdf4";
const G_BORDER = "#bbf7d0";
const RED = "#ef4444";
const FONT = "'Outfit', sans-serif";
const BASE = `${process.env.REACT_APP_API_URL}/admin`;

const S = {
  root: { fontFamily: FONT, minHeight: "100vh", background: "#f4f6f4", display: "flex", flexDirection: "column" },
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: "66px", background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 200, boxShadow: "0 1px 6px rgba(0,0,0,.05)" },
  navBrand: { fontFamily: FONT, fontWeight: 800, fontSize: "20px", color: "#0a0a0a", display: "flex", alignItems: "center", gap: "9px" },
  brandDot: { width: "10px", height: "10px", borderRadius: "50%", background: G, flexShrink: 0 },
  navRight: { display: "flex", gap: "10px" },
  btnOutline: { padding: "8px 20px", border: `1.5px solid ${G}`, borderRadius: "7px", background: "transparent", fontFamily: FONT, fontWeight: 600, fontSize: "13px", cursor: "pointer", color: "#111" },
  btnGreen: { padding: "8px 20px", border: "none", borderRadius: "7px", background: G, fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer" },
  body: { flex: 1, padding: "36px 40px 120px" },
  pageHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  pageTitle: { fontWeight: 800, fontSize: "22px", color: "#0a0a0a" },
  countPill: { background: G_LIGHT, color: G, border: `1px solid ${G_BORDER}`, borderRadius: "20px", padding: "3px 12px", fontSize: "12px", fontWeight: 600, marginLeft: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "14px", border: "1px solid #e8ebe8", padding: "20px 22px 16px", display: "flex", flexDirection: "column", gap: "11px", boxShadow: "0 2px 10px rgba(0,0,0,.05)", position: "relative", overflow: "hidden" },
  cardAccent: { position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg,${G},#4ade80)` },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" },
  cardName: { fontWeight: 700, fontSize: "15px", color: "#0a0a0a", lineHeight: 1.3 },
  cardBadge: { background: G_LIGHT, color: G, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", border: `1px solid ${G_BORDER}`, whiteSpace: "nowrap", flexShrink: 0 },
  divider: { height: "1px", background: "#f0f2f0" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  lbl: { fontSize: "11.5px", color: "#6b7280", fontWeight: 500 },
  val: { fontSize: "13px", color: "#111", fontWeight: 600 },
  valGreen: { fontSize: "14px", color: G, fontWeight: 700 },
  cardActions: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" },
  btnAddPeople: { display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: G_LIGHT, color: G, border: `1.5px solid ${G_BORDER}`, borderRadius: "7px", fontFamily: FONT, fontWeight: 600, fontSize: "12px", cursor: "pointer" },
  btnDelete: { display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff5f5", color: RED, border: "1.5px solid #fecaca", borderRadius: "7px", fontFamily: FONT, fontWeight: 600, fontSize: "12px", cursor: "pointer" },
  fab: { position: "fixed", bottom: "34px", right: "40px", display: "flex", alignItems: "center", gap: "8px", padding: "13px 28px", background: G, color: "#fff", border: "none", borderRadius: "8px", fontFamily: FONT, fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: "0 6px 20px rgba(22,163,74,.4)" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modal: { background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "580px", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,.18)", display: "flex", flexDirection: "column" },
  mHead: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 26px 16px", borderBottom: "1px solid #f0f0f0" },
  mTitle: { fontWeight: 700, fontSize: "16px", color: "#0a0a0a" },
  mClose: { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af", lineHeight: 1 },
  mBody: { padding: "22px 26px", display: "flex", flexDirection: "column", gap: "16px" },
  mFooter: { padding: "16px 26px 22px", display: "flex", gap: "10px", justifyContent: "flex-end", borderTop: "1px solid #f0f0f0" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  fWrap: { display: "flex", flexDirection: "column", gap: "5px" },
  flabel: { fontSize: "12px", fontWeight: 600, color: "#374151" },
  finput: { padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "7px", fontFamily: FONT, fontSize: "13.5px", color: "#111", outline: "none" },
  errTxt: { fontSize: "11px", color: RED },
  hint: { fontSize: "11px", color: "#9ca3af" },
  memberItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f9faf9", borderRadius: "8px", border: "1px solid #eee" },
  memberName: { fontWeight: 600, fontSize: "13.5px", color: "#111" },
  memberSub: { fontSize: "11.5px", color: "#6b7280", marginTop: "2px" },
  memberDel: { background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: "16px", padding: "2px 6px", borderRadius: "4px" },
  confirmBody: { padding: "32px 26px 26px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  confirmActions: { display: "flex", gap: "10px", marginTop: "8px" },
  btnRed: { padding: "9px 22px", border: "none", borderRadius: "7px", background: RED, fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer" },
  empty: { textAlign: "center", padding: "70px 20px", color: "#9ca3af", fontSize: "14px", lineHeight: 2 },
  toast: { position: "fixed", bottom: "100px", right: "40px", padding: "12px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, zIndex: 999, color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,.15)" },
};

const rupee = v => (v !== "" && v != null) ? `₹${Number(v).toLocaleString("en-IN")}` : "—";
const fmtYM = ym => { if (!ym) return "—"; const [y, m] = ym.split("-"); return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${y}`; };

const BLANK_PLAN   = { chitPlanName:"", totalAmount:"", monthlyPay:"", totalMonths:"", startDate:"", endDate:"", adminName:"", adminContact:"" };
const BLANK_MEMBER = { memberName:"", memberContact:"", memberAddress:"" };

function validatePlan(f) {
  const e = {};
  if (!f.chitPlanName.trim())                   e.chitPlanName  = "Required.";
  else if (f.chitPlanName.length > 50)          e.chitPlanName  = "Max 50 chars.";
  if (!f.totalAmount)                           e.totalAmount   = "Required.";
  else if (+f.totalAmount <= 0)                 e.totalAmount   = "Must be positive.";
  if (!f.monthlyPay)                            e.monthlyPay    = "Required.";
  else if (String(f.monthlyPay).length >= 10)   e.monthlyPay    = "Max 9 digits.";
  if (!f.totalMonths)                           e.totalMonths   = "Required.";
  else if (String(f.totalMonths).length >= 3)   e.totalMonths   = "Max 2 digits.";
  if (!f.startDate)                             e.startDate     = "Required.";
  if (!f.endDate)                               e.endDate       = "Required.";
  else if (f.startDate && f.endDate <= f.startDate) e.endDate   = "Must be after start.";
  if (!f.adminName.trim())                      e.adminName     = "Required.";
  else if (!/^[a-zA-Z ]+$/.test(f.adminName))  e.adminName     = "Letters only.";
  else if (f.adminName.length > 50)             e.adminName     = "Max 50 chars.";
  if (!f.adminContact)                          e.adminContact  = "Required.";
  else if (!/^\d{10}$/.test(f.adminContact))   e.adminContact  = "Exactly 10 digits.";
  return e;
}

function validateMember(f) {
  const e = {};
  if (!f.memberName.trim())                       e.memberName    = "Required.";
  else if (!/^[a-zA-Z ]+$/.test(f.memberName))   e.memberName    = "Letters only.";
  else if (f.memberName.length > 60)              e.memberName    = "Max 60 chars.";
  if (!f.memberContact)                           e.memberContact = "Required.";
  else if (!/^\d{10}$/.test(f.memberContact))    e.memberContact = "Exactly 10 digits.";
  return e;
}

function Field({ name, label, placeholder, type="text", hint, value, onChange, errors }) {
  return (
    <div style={S.fWrap}>
      <label style={S.flabel}>{label}</label>
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ ...S.finput, ...(errors[name] ? { borderColor: RED } : {}) }}
        onFocus={e => (e.target.style.borderColor = G)}
        onBlur={e => (e.target.style.borderColor = errors[name] ? RED : "#e5e7eb")}
      />
      {hint && !errors[name] && <span style={S.hint}>{hint}</span>}
      {errors[name] && <span style={S.errTxt}>{errors[name]}</span>}
    </div>
  );
}

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [plans, setPlans]           = useState([]);
  const [loading, setLoading]       = useState(true);

  const [planModal, setPlanModal]   = useState(false);
  const [planForm, setPlanForm]     = useState(BLANK_PLAN);
  const [planErrs, setPlanErrs]     = useState({});
  const [planSaving, setPlanSaving] = useState(false);

  const [deleteModal, setDeleteModal]   = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const [membersModal, setMembersModal]     = useState(null);
  const [members, setMembers]               = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberForm, setMemberForm]         = useState(BLANK_MEMBER);
  const [memberErrs, setMemberErrs]         = useState({});
  const [memberSaving, setMemberSaving]     = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, ok=true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/chit-plans`);
      if (res.ok) setPlans(await res.json());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const fetchMembers = useCallback(async planId => {
    setMembersLoading(true);
    try {
      const res = await fetch(`${BASE}/chit-plans/${planId}/members`);
      if (res.ok) setMembers(await res.json()); else setMembers([]);
    } catch { setMembers([]); }
    finally { setMembersLoading(false); }
  }, []);

  /* ── Plan handlers ── */
  function openPlanModal() { setPlanForm(BLANK_PLAN); setPlanErrs({}); setPlanModal(true); }

  async function submitPlan() {
    const errs = validatePlan(planForm);
    if (Object.keys(errs).length) { setPlanErrs(errs); return; }
    setPlanSaving(true);
    try {
      const payload = { ...planForm, totalAmount: Number(planForm.totalAmount), monthlyPay: Number(planForm.monthlyPay), totalMonths: Number(planForm.totalMonths) };
      const res = await fetch(`${BASE}/chit-plans`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      if (res.ok) { showToast("✓ Chit plan created!"); setPlanModal(false); fetchPlans(); }
      else showToast(await res.text() || "Failed.", false);
    } catch {
      const fake = { ...planForm, totalAmount:Number(planForm.totalAmount), monthlyPay:Number(planForm.monthlyPay), totalMonths:Number(planForm.totalMonths), id:Date.now() };
      setPlans(p => [...p, fake]);
      showToast("✓ Plan added (demo mode)!");
      setPlanModal(false);
    } finally { setPlanSaving(false); }
  }

  async function confirmDelete() {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BASE}/chit-plans/${deleteModal.id}`, { method:"DELETE" });
      if (res.ok || res.status === 204) { setPlans(p => p.filter(x => x.id !== deleteModal.id)); showToast("🗑 Plan deleted."); }
      else showToast("Delete failed.", false);
    } catch { setPlans(p => p.filter(x => x.id !== deleteModal.id)); showToast("🗑 Plan deleted (demo)."); }
    finally { setDeleting(false); setDeleteModal(null); }
  }

  /* ── Member handlers ── */
  function openMembersModal(plan) { setMembersModal(plan); setMemberForm(BLANK_MEMBER); setMemberErrs({}); fetchMembers(plan.id); }

  async function submitMember() {
    const errs = validateMember(memberForm);
    if (Object.keys(errs).length) { setMemberErrs(errs); return; }
    setMemberSaving(true);
    try {
      const res = await fetch(`${BASE}/chit-plans/${membersModal.id}/members`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(memberForm) });
      if (res.ok) { showToast("✓ Member added!"); setMemberForm(BLANK_MEMBER); fetchMembers(membersModal.id); }
      else showToast(await res.text() || "Failed.", false);
    } catch {
      setMembers(m => [...m, { ...memberForm, id: Date.now() }]);
      setMemberForm(BLANK_MEMBER);
      showToast("✓ Member added (demo)!");
    } finally { setMemberSaving(false); }
  }

  async function deleteMember(memberId) {
    try { await fetch(`${BASE}/chit-plans/${membersModal.id}/members/${memberId}`, { method:"DELETE" }); }
    catch {}
    setMembers(m => m.filter(x => x.id !== memberId));
    showToast("Member removed.");
  }

  function handlePlanChange(e) { const { name, value } = e.target; setPlanForm(f => ({...f,[name]:value})); if(planErrs[name]) setPlanErrs(er=>({...er,[name]:undefined})); }
  function handleMemberChange(e) { const { name, value } = e.target; setMemberForm(f => ({...f,[name]:value})); if(memberErrs[name]) setMemberErrs(er=>({...er,[name]:undefined})); }

  return (
    <div style={S.root}>

      {/* Navbar */}
      <nav style={S.navbar}>
        <div style={S.navBrand}><span style={S.brandDot}/>ChitAdmin</div>
        <div style={S.navRight}>
          <button style={S.btnOutline} onClick={() => navigate("/profile")}>Profile</button>
          <button style={S.btnGreen} onClick={() => {
            sessionStorage.removeItem("isLoggedIn");
            navigate("/login");
          }}>Logout</button>
        </div>
      </nav>

      {/* Body */}
      <div style={S.body}>
        <div style={S.pageHead}>
          <div style={{display:"flex",alignItems:"center"}}>
            <span style={S.pageTitle}>Chit Plans</span>
            {plans.length > 0 && <span style={S.countPill}>{plans.length}</span>}
          </div>
        </div>

        {loading
          ? <div style={S.empty}>Loading plans…</div>
          : plans.length === 0
            ? <div style={S.empty}>No chit plans yet.<br/><b>Click + New Chit Plan to get started.</b></div>
            : (
              <div style={S.grid}>
                {plans.map(p => (
                  <div key={p.id} style={S.card}>
                    <div style={S.cardAccent}/>
                    <div style={S.cardHead}>
                      <div style={S.cardName}>{p.chitPlanName}</div>
                      <div style={S.cardBadge}>{p.totalMonths} months</div>
                    </div>
                    <div style={S.divider}/>
                    <div style={S.row}><span style={S.lbl}>Monthly Pay</span><span style={S.valGreen}>{rupee(p.monthlyPay)}</span></div>
                    <div style={S.row}><span style={S.lbl}>Total Amount</span><span style={S.val}>{rupee(p.totalAmount)}</span></div>
                    <div style={S.row}><span style={S.lbl}>Duration</span><span style={S.val}>{fmtYM(p.startDate)} → {fmtYM(p.endDate)}</span></div>
                    <div style={S.divider}/>
                    <div style={S.row}><span style={S.lbl}>Admin</span><span style={S.val}>{p.adminName}</span></div>
                    <div style={S.row}><span style={S.lbl}>Contact</span><span style={S.val}>{p.adminContact}</span></div>
                    <div style={S.cardActions}>
                      <button style={S.btnAddPeople} onClick={() => openMembersModal(p)}>👥 Add People</button>
                      <button style={S.btnDelete}    onClick={() => setDeleteModal({id:p.id,name:p.chitPlanName})}>🗑 Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
        }
      </div>

      {/* FAB */}
      <button style={S.fab} onClick={openPlanModal}>+ New Chit Plan</button>

      {/* ── Modal: Create Plan ── */}
      {planModal && (
        <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setPlanModal(false)}>
          <div style={S.modal}>
            <div style={S.mHead}>
              <span style={S.mTitle}>New Chit Plan</span>
              <button style={S.mClose} onClick={()=>setPlanModal(false)}>✕</button>
            </div>
            <div style={S.mBody}>
              <Field name="chitPlanName" label="Chit Plan Name *" placeholder="e.g. Gold Plan 2025" value={planForm.chitPlanName} onChange={handlePlanChange} errors={planErrs}/>
              <div style={S.row2}>
                <Field name="totalAmount" label="Total Amount (₹) *" placeholder="e.g. 100000" type="number" value={planForm.totalAmount} onChange={handlePlanChange} errors={planErrs}/>
                <Field name="monthlyPay"  label="Monthly Pay (₹) *"  placeholder="e.g. 10000"  type="number" value={planForm.monthlyPay}  onChange={handlePlanChange} errors={planErrs}/>
              </div>
              <div style={S.row2}>
                <Field name="totalMonths" label="Total Months *" placeholder="e.g. 12" type="number" hint="Max 2 digits (up to 99)" value={planForm.totalMonths} onChange={handlePlanChange} errors={planErrs}/>
                <div/>
              </div>
              <div style={S.row2}>
                <Field name="startDate" label="Start Date *" type="month" value={planForm.startDate} onChange={handlePlanChange} errors={planErrs}/>
                <Field name="endDate"   label="End Date *"   type="month" hint="Must be after start date" value={planForm.endDate} onChange={handlePlanChange} errors={planErrs}/>
              </div>
              <div style={S.divider}/>
              <div style={S.row2}>
                <Field name="adminName"    label="Admin Name *"    placeholder="Letters only"    hint="Max 50 chars"      value={planForm.adminName}    onChange={handlePlanChange} errors={planErrs}/>
                <Field name="adminContact" label="Admin Contact *" placeholder="10-digit number" value={planForm.adminContact} onChange={handlePlanChange} errors={planErrs}/>
              </div>
            </div>
            <div style={S.mFooter}>
              <button style={S.btnOutline} onClick={()=>setPlanModal(false)} disabled={planSaving}>Cancel</button>
              <button style={{...S.btnGreen,opacity:planSaving?.7:1}} onClick={submitPlan} disabled={planSaving}>{planSaving?"Saving…":"Create Plan"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Delete Confirm ── */}
      {deleteModal && (
        <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setDeleteModal(null)}>
          <div style={{...S.modal,maxWidth:"400px"}}>
            <div style={S.confirmBody}>
              <div style={{fontSize:"40px"}}>🗑️</div>
              <div style={{fontWeight:700,fontSize:"16px",color:"#0a0a0a"}}>Delete Chit Plan?</div>
              <div style={{fontSize:"13px",color:"#6b7280",lineHeight:1.6}}>
                "<b>{deleteModal.name}</b>" and <b>all its members</b> will be permanently deleted.<br/>This cannot be undone.
              </div>
              <div style={S.confirmActions}>
                <button style={S.btnOutline} onClick={()=>setDeleteModal(null)} disabled={deleting}>Cancel</button>
                <button style={{...S.btnRed,opacity:deleting?.7:1}} onClick={confirmDelete} disabled={deleting}>{deleting?"Deleting…":"Yes, Delete"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Members ── */}
      {membersModal && (
        <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setMembersModal(null)}>
          <div style={S.modal}>
            <div style={S.mHead}>
              <div>
                <div style={S.mTitle}>👥 Members — {membersModal.chitPlanName}</div>
                <div style={{fontSize:"11.5px",color:"#6b7280",marginTop:"3px"}}>Plan ID: #{membersModal.id}</div>
              </div>
              <button style={S.mClose} onClick={()=>setMembersModal(null)}>✕</button>
            </div>
            <div style={S.mBody}>

              {/* Add member form */}
              <div style={{background:G_LIGHT,border:`1px solid ${G_BORDER}`,borderRadius:"10px",padding:"16px"}}>
                <div style={{fontWeight:700,fontSize:"13px",color:G,marginBottom:"12px"}}>➕ Add New Member</div>
                <div style={S.row2}>
                  <Field name="memberName"    label="Full Name *"    placeholder="Letters only"    value={memberForm.memberName}    onChange={handleMemberChange} errors={memberErrs}/>
                  <Field name="memberContact" label="Contact *"       placeholder="10-digit number" value={memberForm.memberContact} onChange={handleMemberChange} errors={memberErrs}/>
                </div>
                <div style={{marginTop:"12px"}}>
                  <Field name="memberAddress" label="Address (optional)" placeholder="Street, City" value={memberForm.memberAddress} onChange={handleMemberChange} errors={memberErrs}/>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:"14px"}}>
                  <button style={{...S.btnGreen,opacity:memberSaving?.7:1}} onClick={submitMember} disabled={memberSaving}>{memberSaving?"Adding…":"+ Add Member"}</button>
                </div>
              </div>

              {/* Members list */}
              <div style={{fontWeight:700,fontSize:"13px",color:"#374151",display:"flex",alignItems:"center",gap:"8px"}}>
                Enrolled Members {members.length > 0 && <span style={S.countPill}>{members.length}</span>}
              </div>

              {membersLoading
                ? <div style={{textAlign:"center",color:"#9ca3af",fontSize:"13px",padding:"20px"}}>Loading…</div>
                : members.length === 0
                  ? <div style={{textAlign:"center",color:"#9ca3af",fontSize:"13px",padding:"20px"}}>No members yet. Add the first one above.</div>
                  : members.map((m,i) => (
                    <div key={m.id||i} style={S.memberItem}>
                      <div>
                        <div style={S.memberName}>{m.memberName}</div>
                        <div style={S.memberSub}>{m.memberContact}{m.memberAddress?` · ${m.memberAddress}`:""}</div>
                      </div>
                      <button style={S.memberDel} title="Remove" onClick={()=>deleteMember(m.id)}>✕</button>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={{...S.toast,background:toast.ok?"#111":RED}}>{toast.msg}</div>}
    </div>
  );
}