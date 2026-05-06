import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap";
document.head.appendChild(fontLink);

const G = "#16a34a";
const G_LIGHT = "#f0fdf4";
const G_BORDER = "#bbf7d0";
const RED = "#ef4444";
const BLUE = "#2563eb";
const BLUE_LIGHT = "#eff6ff";
const BLUE_BORDER = "#bfdbfe";
const GRAY = "#6b7280";
const GRAY_LIGHT = "#f9fafb";
const GRAY_BORDER = "#e5e7eb";
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
  pageHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  pageTitle: { fontWeight: 800, fontSize: "22px", color: "#0a0a0a" },
  cardClickable: { cursor: "pointer", transition: "transform 0.12s, box-shadow 0.12s" },

  // Section styles
  section: { marginBottom: "40px" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" },
  sectionTitle: { fontWeight: 700, fontSize: "16px", color: "#0a0a0a" },
  sectionDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 },
  countPill: { borderRadius: "20px", padding: "3px 12px", fontSize: "12px", fontWeight: 600 },
  sectionDivider: { height: "1px", background: "#e5e7eb", marginBottom: "18px" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "14px", border: "1px solid #e8ebe8", padding: "20px 22px 16px", display: "flex", flexDirection: "column", gap: "11px", boxShadow: "0 2px 10px rgba(0,0,0,.05)", position: "relative", overflow: "hidden" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" },
  cardName: { fontWeight: 700, fontSize: "15px", color: "#0a0a0a", lineHeight: 1.3 },
  cardBadge: { fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap", flexShrink: 0 },
  divider: { height: "1px", background: "#f0f2f0" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  lbl: { fontSize: "11.5px", color: "#6b7280", fontWeight: 500 },
  val: { fontSize: "13px", color: "#111", fontWeight: 600 },
  valGreen: { fontSize: "14px", color: G, fontWeight: 700 },
  valBlue: { fontSize: "14px", color: BLUE, fontWeight: 700 },
  valGray: { fontSize: "14px", color: GRAY, fontWeight: 700 },

  cardActions: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px", flexWrap: "wrap" },
  btnAddPeople: { display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: G_LIGHT, color: G, border: `1.5px solid ${G_BORDER}`, borderRadius: "7px", fontFamily: FONT, fontWeight: 600, fontSize: "12px", cursor: "pointer" },
  btnEdit: { display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: BLUE_LIGHT, color: BLUE, border: `1.5px solid ${BLUE_BORDER}`, borderRadius: "7px", fontFamily: FONT, fontWeight: 600, fontSize: "12px", cursor: "pointer" },
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
  btnBlue: { padding: "9px 22px", border: "none", borderRadius: "7px", background: BLUE, fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer" },
  empty: { textAlign: "center", padding: "30px 20px", color: "#9ca3af", fontSize: "13px", background: "#fafafa", borderRadius: "10px", border: "1px dashed #e5e7eb" },
  toast: { position: "fixed", bottom: "100px", right: "40px", padding: "12px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, zIndex: 999, color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,.15)" },
};

const rupee = v => (v !== "" && v != null) ? `₹${Number(v).toLocaleString("en-IN")}` : "—";
const fmtYM = ym => {
  if (!ym) return "—";
  const [y, m] = ym.split("-");
  return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${y}`;
};

// Returns "YYYY-MM" for today
const todayYM = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
};

const classifyPlan = (plan) => {
  const today = todayYM();
  if (plan.endDate < today) return "completed";
  if (plan.startDate > today) return "upcoming";
  return "ongoing";
};

const BLANK_PLAN   = { chitPlanName:"", totalAmount:"", monthlyPay:"", totalMonths:"", startDate:"", endDate:"", adminName:"", adminContact:"" };
const BLANK_MEMBER = { memberName:"", memberContact:"", memberAddress:"", memberEmail:"" };

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
  if (f.memberEmail && f.memberEmail.trim())
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(f.memberEmail))
      e.memberEmail = "Invalid email format.";
  return e;
}

function Field({ name, label, placeholder, type="text", hint, value, onChange, errors }) {
  return (
    <div style={S.fWrap}>
      <label style={S.flabel}>{label}</label>
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ ...S.finput, ...(errors[name] ? { borderColor: RED } : {}) }}
        onFocus={e => (e.target.style.borderColor = BLUE)}
        onBlur={e => (e.target.style.borderColor = errors[name] ? RED : "#e5e7eb")}
      />
      {hint && !errors[name] && <span style={S.hint}>{hint}</span>}
      {errors[name] && <span style={S.errTxt}>{errors[name]}</span>}
    </div>
  );
}

// Section config
const SECTIONS = [
  {
    key: "ongoing",
    label: "Active Chit Plans",
    dot: G,
    pillBg: G_LIGHT, pillColor: G, pillBorder: G_BORDER,
    accentColor: G,
    badgeBg: G_LIGHT, badgeColor: G, badgeBorder: G_BORDER,
    valColor: G,
    emptyMsg: "No active chit plans at the moment.",
  },
  {
    key: "upcoming",
    label: "Upcoming Chit Plans",
    dot: BLUE,
    pillBg: BLUE_LIGHT, pillColor: BLUE, pillBorder: BLUE_BORDER,
    accentColor: BLUE,
    badgeBg: BLUE_LIGHT, badgeColor: BLUE, badgeBorder: BLUE_BORDER,
    valColor: BLUE,
    emptyMsg: "No upcoming chit plans scheduled.",
  },
  {
    key: "completed",
    label: "Completed Chit Plans",
    dot: GRAY,
    pillBg: GRAY_LIGHT, pillColor: GRAY, pillBorder: GRAY_BORDER,
    accentColor: GRAY,
    badgeBg: GRAY_LIGHT, badgeColor: GRAY, badgeBorder: GRAY_BORDER,
    valColor: GRAY,
    emptyMsg: "No completed chit plans yet.",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [plans, setPlans]           = useState([]);
  const [loading, setLoading]       = useState(true);

  // Create modal
  const [planModal, setPlanModal]   = useState(false);
  const [planForm, setPlanForm]     = useState(BLANK_PLAN);
  const [planErrs, setPlanErrs]     = useState({});
  const [planSaving, setPlanSaving] = useState(false);

  // Edit modal
  const [editModal, setEditModal]   = useState(null); // holds plan being edited
  const [editForm, setEditForm]     = useState(BLANK_PLAN);
  const [editErrs, setEditErrs]     = useState({});
  const [editSaving, setEditSaving] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  // Members modal
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

  // ── Create Plan ──
  function openPlanModal() { setPlanForm(BLANK_PLAN); setPlanErrs({}); setPlanModal(true); }

  async function submitPlan() {
    const errs = validatePlan(planForm);
    if (Object.keys(errs).length) { setPlanErrs(errs); return; }
    setPlanSaving(true);
    try {
      const payload = { ...planForm, totalAmount: Number(planForm.totalAmount), monthlyPay: Number(planForm.monthlyPay), totalMonths: Number(planForm.totalMonths) };
      const res = await fetch(`${BASE}/chit-plans`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      if (res.ok) { showToast("Chit plan created successfully!"); setPlanModal(false); fetchPlans(); }
      else showToast(await res.text() || "Failed.", false);
    } catch {
      const fake = { ...planForm, totalAmount:Number(planForm.totalAmount), monthlyPay:Number(planForm.monthlyPay), totalMonths:Number(planForm.totalMonths), id:Date.now() };
      setPlans(p => [...p, fake]);
      showToast("Plan added (demo mode)!");
      setPlanModal(false);
    } finally { setPlanSaving(false); }
  }

  // ── Edit Plan ──
  function openEditModal(plan) {
    setEditModal(plan);
    setEditForm({
      chitPlanName: plan.chitPlanName,
      totalAmount: plan.totalAmount,
      monthlyPay: plan.monthlyPay,
      totalMonths: plan.totalMonths,
      startDate: plan.startDate,
      endDate: plan.endDate,
      adminName: plan.adminName,
      adminContact: plan.adminContact,
    });
    setEditErrs({});
  }

  async function submitEdit() {
    const errs = validatePlan(editForm);
    if (Object.keys(errs).length) { setEditErrs(errs); return; }
    setEditSaving(true);
    try {
      const payload = { ...editForm, totalAmount: Number(editForm.totalAmount), monthlyPay: Number(editForm.monthlyPay), totalMonths: Number(editForm.totalMonths) };
      const res = await fetch(`${BASE}/chit-plans/${editModal.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      if (res.ok) {
        showToast("Chit plan updated successfully!");
        setEditModal(null);
        fetchPlans();
      } else {
        // Optimistic update if backend PUT not yet implemented
        setPlans(p => p.map(x => x.id === editModal.id ? { ...x, ...payload } : x));
        showToast("Plan updated (demo mode)!");
        setEditModal(null);
      }
    } catch {
      setPlans(p => p.map(x => x.id === editModal.id ? { ...x, ...editForm, totalAmount:Number(editForm.totalAmount), monthlyPay:Number(editForm.monthlyPay), totalMonths:Number(editForm.totalMonths) } : x));
      showToast("Plan updated (demo mode)!");
      setEditModal(null);
    } finally { setEditSaving(false); }
  }

  // ── Delete Plan ──
  async function confirmDelete() {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BASE}/chit-plans/${deleteModal.id}`, { method:"DELETE" });
      if (res.ok || res.status === 204) { setPlans(p => p.filter(x => x.id !== deleteModal.id)); showToast("Plan deleted successfully."); }
      else showToast("Delete failed.", false);
    } catch { setPlans(p => p.filter(x => x.id !== deleteModal.id)); showToast("Plan deleted (demo)."); }
    finally { setDeleting(false); setDeleteModal(null); }
  }

  // ── Members ──
  function openMembersModal(plan) { setMembersModal(plan); setMemberForm(BLANK_MEMBER); setMemberErrs({}); fetchMembers(plan.id); }

  async function submitMember() {
    const errs = validateMember(memberForm);
    if (Object.keys(errs).length) { setMemberErrs(errs); return; }
    setMemberSaving(true);
    try {
      const res = await fetch(`${BASE}/chit-plans/${membersModal.id}/members`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(memberForm) });
      if (res.ok) { showToast("Member added!"); setMemberForm(BLANK_MEMBER); fetchMembers(membersModal.id); }
      else showToast(await res.text() || "Failed.", false);
    } catch {
      setMembers(m => [...m, { ...memberForm, id: Date.now() }]);
      setMemberForm(BLANK_MEMBER);
      showToast("Member added (demo)!");
    } finally { setMemberSaving(false); }
  }

  async function deleteMember(memberId) {
    try { await fetch(`${BASE}/chit-plans/${membersModal.id}/members/${memberId}`, { method:"DELETE" }); }
    catch {}
    setMembers(m => m.filter(x => x.id !== memberId));
    showToast("Member removed.");
  }

  function handlePlanChange(e) { const { name, value } = e.target; setPlanForm(f => ({...f,[name]:value})); if(planErrs[name]) setPlanErrs(er=>({...er,[name]:undefined})); }
  function handleEditChange(e) { const { name, value } = e.target; setEditForm(f => ({...f,[name]:value})); if(editErrs[name]) setEditErrs(er=>({...er,[name]:undefined})); }
  function handleMemberChange(e) { const { name, value } = e.target; setMemberForm(f => ({...f,[name]:value})); if(memberErrs[name]) setMemberErrs(er=>({...er,[name]:undefined})); }

  // Categorize plans
  const grouped = { ongoing: [], upcoming: [], completed: [] };
  plans.forEach(p => { grouped[classifyPlan(p)].push(p); });

  const renderCard = (p, sec) => (
    <div
      key={p.id}
      style={{
        ...S.card,
        cursor: "pointer",
        transition: "transform 0.12s, box-shadow 0.12s",
      }}
      onClick={() => navigate(`/admin/chit-plans/${p.id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.10)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,.05)";
      }}
    >
      // Top accent bar
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", background: sec.accentColor, borderRadius:"14px 14px 0 0" }}/>
 
      <div style={S.cardHead}>
        <div style={S.cardName}>{p.chitPlanName}</div>
        <div style={{ ...S.cardBadge, background: sec.badgeBg, color: sec.badgeColor, border: `1px solid ${sec.badgeBorder}` }}>
          {p.totalMonths} months
        </div>
      </div>
 
      <div style={S.divider}/>
      <div style={S.row}><span style={S.lbl}>Monthly Payment</span><span style={{ ...S.valGreen, color: sec.valColor }}>{rupee(p.monthlyPay)}</span></div>
      <div style={S.row}><span style={S.lbl}>Total Amount</span><span style={S.val}>{rupee(p.totalAmount)}</span></div>
      <div style={S.row}><span style={S.lbl}>Duration</span><span style={S.val}>{fmtYM(p.startDate)} → {fmtYM(p.endDate)}</span></div>
      <div style={S.divider}/>
      <div style={S.row}><span style={S.lbl}>Administrator</span><span style={S.val}>{p.adminName}</span></div>
      <div style={S.row}><span style={S.lbl}>Contact</span><span style={S.val}>{p.adminContact}</span></div>
 
      <div style={S.cardActions}>
        <button style={S.btnAddPeople} onClick={e => { e.stopPropagation(); openMembersModal(p); }}>👥 Members</button>
        <button style={S.btnEdit} onClick={e => { e.stopPropagation(); openEditModal(p); }}>✏️ Edit</button>
        <button style={S.btnDelete} onClick={e => { e.stopPropagation(); setDeleteModal({id:p.id,name:p.chitPlanName}); }}>🗑 Delete</button>
      </div>
    </div>
  );

  return (
    <div style={S.root}>

      {/* Navbar */}
      <nav style={S.navbar}>
        <div style={S.navBrand}><span style={S.brandDot}/>ChitAdmin</div>
        <div style={S.navRight}>
          <button style={S.btnOutline} onClick={() => navigate("/profile")}>Profile</button>
          <button style={S.btnGreen} onClick={() => { sessionStorage.removeItem("isLoggedIn"); navigate("/login"); }}>Logout</button>
        </div>
      </nav>

      {/* Body */}
      <div style={S.body}>
        <div style={S.pageHead}>
          <span style={S.pageTitle}>Chit Plans</span>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"70px 20px", color:"#9ca3af", fontSize:"14px" }}>Loading plans…</div>
        ) : (
          SECTIONS.map(sec => (
            <div key={sec.key} style={S.section}>
              <div style={S.sectionHeader}>
                <span style={{ ...S.sectionDot, background: sec.dot }}/>
                <span style={S.sectionTitle}>{sec.label}</span>
                {grouped[sec.key].length > 0 && (
                  <span style={{ ...S.countPill, background: sec.pillBg, color: sec.pillColor, border: `1px solid ${sec.pillBorder}` }}>
                    {grouped[sec.key].length}
                  </span>
                )}
              </div>
              <div style={S.sectionDivider}/>
              {grouped[sec.key].length === 0
                ? <div style={S.empty}>{sec.emptyMsg}</div>
                : <div style={S.grid}>{grouped[sec.key].map(p => renderCard(p, sec))}</div>
              }
            </div>
          ))
        )}
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
                <Field name="adminName"    label="Admin Name *"    placeholder="Letters only" hint="Max 50 chars" value={planForm.adminName} onChange={handlePlanChange} errors={planErrs}/>
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

      {/* ── Modal: Edit Plan ── */}
      {editModal && (
        <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setEditModal(null)}>
          <div style={S.modal}>
            <div style={S.mHead}>
              <span style={S.mTitle}>Edit Chit Plan</span>
              <button style={S.mClose} onClick={()=>setEditModal(null)}>✕</button>
            </div>
            <div style={S.mBody}>
              <Field name="chitPlanName" label="Chit Plan Name *" placeholder="e.g. Gold Plan 2025" value={editForm.chitPlanName} onChange={handleEditChange} errors={editErrs}/>
              <div style={S.row2}>
                <Field name="totalAmount" label="Total Amount (₹) *" placeholder="e.g. 100000" type="number" value={editForm.totalAmount} onChange={handleEditChange} errors={editErrs}/>
                <Field name="monthlyPay"  label="Monthly Pay (₹) *"  placeholder="e.g. 10000"  type="number" value={editForm.monthlyPay}  onChange={handleEditChange} errors={editErrs}/>
              </div>
              <div style={S.row2}>
                <Field name="totalMonths" label="Total Months *" placeholder="e.g. 12" type="number" hint="Max 2 digits (up to 99)" value={editForm.totalMonths} onChange={handleEditChange} errors={editErrs}/>
                <div/>
              </div>
              <div style={S.row2}>
                <Field name="startDate" label="Start Date *" type="month" value={editForm.startDate} onChange={handleEditChange} errors={editErrs}/>
                <Field name="endDate"   label="End Date *"   type="month" hint="Must be after start date" value={editForm.endDate} onChange={handleEditChange} errors={editErrs}/>
              </div>
              <div style={S.divider}/>
              <div style={S.row2}>
                <Field name="adminName"    label="Admin Name *"    placeholder="Letters only" hint="Max 50 chars" value={editForm.adminName} onChange={handleEditChange} errors={editErrs}/>
                <Field name="adminContact" label="Admin Contact *" placeholder="10-digit number" value={editForm.adminContact} onChange={handleEditChange} errors={editErrs}/>
              </div>
            </div>
            <div style={S.mFooter}>
              <button style={S.btnOutline} onClick={()=>setEditModal(null)} disabled={editSaving}>Cancel</button>
              <button style={{...S.btnBlue,opacity:editSaving?.7:1}} onClick={submitEdit} disabled={editSaving}>{editSaving?"Saving…":"Save Changes"}</button>
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
              {/* Member count indicator */}
              <div style={{fontSize:"12px", color: members.length >= membersModal.totalMonths ? RED : G, fontWeight:600, marginBottom:"4px"}}>
                {members.length} / {membersModal.totalMonths} members enrolled
              </div>

              <div style={{background:G_LIGHT,border:`1px solid ${G_BORDER}`,borderRadius:"10px",padding:"16px", opacity: members.length >= membersModal.totalMonths ? 0.5 : 1}}>
                <div style={{fontWeight:700,fontSize:"13px",color:G,marginBottom:"12px"}}>➕ Add New Member</div>
                <div style={S.row2}>
                  <Field name="memberName"    label="Full Name *"    placeholder="Letters only"    value={memberForm.memberName}    onChange={handleMemberChange} errors={memberErrs}/>
                  <Field name="memberContact" label="Contact *"      placeholder="10-digit number" value={memberForm.memberContact} onChange={handleMemberChange} errors={memberErrs}/>
                </div>
                <div style={{marginTop:"12px"}}>
                  <Field name="memberEmail"   label="Email (optional)" placeholder="example@email.com" value={memberForm.memberEmail} onChange={handleMemberChange} errors={memberErrs}/>
                </div>
                <div style={{marginTop:"12px"}}>
                  <Field name="memberAddress" label="Address (optional)" placeholder="Street, City" value={memberForm.memberAddress} onChange={handleMemberChange} errors={memberErrs}/>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:"14px"}}>
                  <button 
                    style={{...S.btnGreen, opacity: memberSaving || members.length >= membersModal.totalMonths ? 0.5 : 1}} 
                    onClick={submitMember} 
                    disabled={memberSaving || members.length >= membersModal.totalMonths}
                  >
                    {memberSaving ? "Adding…" : members.length >= membersModal.totalMonths ? "Limit Reached" : "+ Add Member"}
                  </button>
                </div>
              </div>

              <div style={{fontWeight:700,fontSize:"13px",color:"#374151",display:"flex",alignItems:"center",gap:"8px"}}>
                Enrolled Members
                {members.length > 0 && <span style={{...S.countPill,background:G_LIGHT,color:G,border:`1px solid ${G_BORDER}`}}>{members.length}</span>}
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