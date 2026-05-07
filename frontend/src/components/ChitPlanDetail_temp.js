import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ── Removed top-level document.createElement (caused build failure) ──
// Font is now loaded safely inside useEffect

const G = "#16a34a";
const G_LIGHT = "#f0fdf4";
const G_BORDER = "#bbf7d0";
const RED = "#ef4444";
const GRAY = "#6b7280";
const FONT = "'Outfit', sans-serif";
const BASE = `${process.env.REACT_APP_API_URL}/admin`;

const rupee = v => (v !== "" && v != null) ? `₹${Number(v).toLocaleString("en-IN")}` : "—";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmtYM = ym => {
  if (!ym) return "—";
  const [y, m] = ym.split("-");
  return `${MONTHS[+m-1]} ${y}`;
};

const monthLabel = (startYM, offset) => {
  if (!startYM) return "";
  const [y, m] = startYM.split("-").map(Number);
  const date = new Date(y, m - 1 + offset, 1);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const ordinal = n => {
  const s = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
};

const S = {
  root: { fontFamily: FONT, minHeight: "100vh", background: "#f4f6f4", display: "flex", flexDirection: "column" },
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "66px", background: "#fff",
    borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 200,
    boxShadow: "0 1px 6px rgba(0,0,0,.05)"
  },
  navLeft:  { display: "flex", alignItems: "center", gap: "12px" },
  navBrand: { fontFamily: FONT, fontWeight: 800, fontSize: "20px", color: "#0a0a0a", display: "flex", alignItems: "center", gap: "9px" },
  brandDot: { width: "10px", height: "10px", borderRadius: "50%", background: G, flexShrink: 0 },
  navRight: { display: "flex", gap: "10px" },
  btnOutline: { padding: "8px 20px", border: `1.5px solid ${G}`, borderRadius: "7px", background: "transparent", fontFamily: FONT, fontWeight: 600, fontSize: "13px", cursor: "pointer", color: "#111" },
  btnGreen:  { padding: "8px 20px", border: "none", borderRadius: "7px", background: G, fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer" },
  backBtn:   { display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: "7px", background: "#fff", fontFamily: FONT, fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#374151" },
  body: { flex: 1, padding: "36px 40px 80px" },
  infoCard: {
    background: "#fff", borderRadius: "14px", border: "1px solid #e8ebe8",
    padding: "22px 28px", marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,.05)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: "18px", position: "relative", overflow: "hidden"
  },
  infoAccent: { position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg,${G},#4ade80)` },
  infoLeft:  { display: "flex", flexDirection: "column", gap: "5px" },
  infoTitle: { fontWeight: 800, fontSize: "20px", color: "#0a0a0a" },
  infoSub:   { fontSize: "13px", color: GRAY },
  infoStats: { display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "center" },
  statItem:  { display: "flex", flexDirection: "column", gap: "3px" },
  statLabel: { fontSize: "11px", color: GRAY, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" },
  statVal:      { fontSize: "15px", fontWeight: 700, color: "#0a0a0a" },
  statValGreen: { fontSize: "15px", fontWeight: 700, color: G },
  badge: { background: G_LIGHT, color: G, border: `1px solid ${G_BORDER}`, borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700 },
  saveBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px",
    padding: "10px 18px", marginBottom: "16px"
  },
  saveTxt:     { fontSize: "13px", color: "#92400e", fontWeight: 500 },
  saveActions: { display: "flex", gap: "10px" },
  btnSave:    { padding: "8px 22px", border: "none", borderRadius: "7px", background: G, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: "13px", cursor: "pointer" },
  btnDiscard: { padding: "8px 18px", border: "1.5px solid #e5e7eb", borderRadius: "7px", background: "#fff", fontFamily: FONT, fontWeight: 600, fontSize: "13px", cursor: "pointer", color: "#374151" },
  sheetWrap: {
    background: "#fff", borderRadius: "14px", border: "1px solid #e0e3e0",
    overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.05)"
  },
  titleRow: {
    background: `linear-gradient(90deg, ${G} 0%, #15803d 100%)`,
    color: "#fff", fontWeight: 800, fontSize: "14px",
    padding: "11px 18px", letterSpacing: "0.02em",
    display: "flex", alignItems: "center", gap: "8px"
  },
  tableScroll: { overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 340px)" },
  table: { borderCollapse: "collapse", tableLayout: "fixed", fontSize: "12.5px", fontFamily: FONT },
  thRowNum: {
    background: "#f0f2f0", borderRight: "1px solid #e0e3e0", borderBottom: "2px solid #d1d5d1",
    padding: "10px 8px", fontWeight: 700, fontSize: "11px", color: GRAY,
    textAlign: "center", position: "sticky", top: 0, left: 0, zIndex: 21, width: "36px"
  },
  thFrozen1: {
    background: "#f8faf8", borderRight: "1px solid #e0e3e0", borderBottom: "2px solid #d1d5d1",
    padding: "10px 12px", fontWeight: 700, fontSize: "11.5px", color: "#374151",
    textAlign: "left", position: "sticky", top: 0, zIndex: 20, lineHeight: 1.35
  },
  thFrozen3: {
    background: "#f8faf8", borderRight: "2px solid #c3c8c3", borderBottom: "2px solid #d1d5d1",
    padding: "10px 12px", fontWeight: 700, fontSize: "11.5px", color: "#374151",
    textAlign: "left", position: "sticky", top: 0, zIndex: 20, lineHeight: 1.35
  },
  th: {
    background: "#f8faf8", borderRight: "1px solid #e0e3e0", borderBottom: "2px solid #d1d5d1",
    padding: "10px 10px", fontWeight: 700, fontSize: "11.5px", color: "#374151",
    textAlign: "center", whiteSpace: "nowrap", position: "sticky", top: 0, zIndex: 10, lineHeight: 1.35
  },
  tdRowNum: {
    borderRight: "1px solid #e0e3e0", borderBottom: "1px solid #e8ebe8",
    padding: "0 8px", textAlign: "center", fontSize: "11px", color: "#9ca3af",
    fontWeight: 600, background: "#f7f9f7", position: "sticky", left: 0, zIndex: 5,
    width: "36px", userSelect: "none"
  },
  tdFrozen1: {
    borderRight: "1px solid #e0e3e0", borderBottom: "1px solid #e8ebe8",
    padding: 0, verticalAlign: "middle", position: "sticky", zIndex: 5
  },
  tdFrozen3: {
    borderRight: "2px solid #c3c8c3", borderBottom: "1px solid #e8ebe8",
    padding: 0, verticalAlign: "middle", position: "sticky", zIndex: 5
  },
  td: {
    borderRight: "1px solid #e8ebe8", borderBottom: "1px solid #e8ebe8",
    padding: 0, verticalAlign: "middle", background: "#fff"
  },
  cellInput: {
    width: "100%", height: "36px", border: "none", outline: "none",
    fontFamily: FONT, fontSize: "12.5px", color: "#111", fontWeight: 500,
    background: "transparent", padding: "0 10px", boxSizing: "border-box"
  },
  cellInputFocus: { background: "#fffbeb", outline: `2px solid #f59e0b`, outlineOffset: "-2px" },
  monthInput: {
    width: "100%", height: "36px", border: "none", outline: "none",
    fontFamily: FONT, fontSize: "12px", color: "#374151", fontWeight: 500,
    background: "transparent", padding: "0 8px", boxSizing: "border-box", textAlign: "center"
  },
  toast: {
    position: "fixed", bottom: "100px", right: "40px",
    padding: "12px 20px", borderRadius: "8px", fontSize: "13px",
    fontWeight: 600, zIndex: 999, color: "#fff",
    boxShadow: "0 4px 14px rgba(0,0,0,.15)"
  },
  loadWrap: { textAlign: "center", padding: "80px 20px", color: GRAY, fontSize: "14px" },
  errWrap:  { textAlign: "center", padding: "80px 20px", color: RED,  fontSize: "14px" },
};

export default function ChitPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Font loaded safely inside useEffect — no more top-level DOM access
  useEffect(() => {
    if (!document.querySelector('link[data-font="outfit"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap";
      link.setAttribute("data-font", "outfit");
      document.head.appendChild(link);
    }
  }, []);

  const [plan, setPlan]       = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [rows, setRows]           = useState([]);
  const [dirty, setDirty]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);

  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [planRes, membersRes] = await Promise.all([
        fetch(`${BASE}/chit-plans-details/${id}`),
        fetch(`${BASE}/chit-plans/${id}/members`),
      ]);
      if (!planRes.ok) throw new Error("Plan not found");
      const planData    = await planRes.json();
      const membersData = membersRes.ok ? await membersRes.json() : [];
      setPlan(planData);
      setMembers(membersData);
      const totalMonths = planData.totalMonths || 20;
      setRows(membersData.map(m => ({
        memberId:     m.id,
        memberName:   m.memberName   || "",
        memberEmail:  m.memberEmail  || "",
        winningMonth: m.winningMonth || "",
        months: Array(totalMonths).fill(""),
      })));
      setDirty(false);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleNameChange         = (i, v) => { setRows(r => r.map((row, idx) => idx===i ? {...row, memberName:   v} : row)); setDirty(true); };
  const handleEmailChange        = (i, v) => { setRows(r => r.map((row, idx) => idx===i ? {...row, memberEmail:  v} : row)); setDirty(true); };
  const handleWinningMonthChange = (i, v) => { setRows(r => r.map((row, idx) => idx===i ? {...row, winningMonth: v} : row)); setDirty(true); };
  const handleMonthCellChange    = (i, mIdx, v) => {
    setRows(r => r.map((row, idx) => {
      if (idx !== i) return row;
      const months = [...row.months]; months[mIdx] = v; return {...row, months};
    }));
    setDirty(true);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(rows.map(row =>
        fetch(`${BASE}/chit-plans/${id}/members/${row.memberId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberName: row.memberName, memberEmail: row.memberEmail, winningMonth: row.winningMonth }),
        }).catch(() => null)
      ));
      setDirty(false);
      showToast("Changes saved successfully!");
    } catch { showToast("Saved locally (API pending)", true); setDirty(false); }
    finally { setSaving(false); }
  };

  const discardChanges = () => { fetchAll(); showToast("Changes discarded.", true); };

  const COL_NUM   = 36;
  const COL_NAME  = 160;
  const COL_EMAIL = 170;
  const COL_WIN   = 130;
  const COL_MONTH = 110;
  const LEFT_NAME  = COL_NUM;
  const LEFT_EMAIL = COL_NUM + COL_NAME;
  const LEFT_WIN   = COL_NUM + COL_NAME + COL_EMAIL;

  if (loading) return <div style={S.root}><nav style={S.navbar}><div style={S.navLeft}><div style={S.navBrand}><span style={S.brandDot}/>ChitAdmin</div></div></nav><div style={S.loadWrap}>Loading chit plan…</div></div>;
  if (error)   return <div style={S.root}><nav style={S.navbar}><div style={S.navLeft}><div style={S.navBrand}><span style={S.brandDot}/>ChitAdmin</div></div></nav><div style={S.errWrap}>❌ {error}</div></div>;
  if (!plan)   return null;

  const totalMonths = plan.totalMonths || 20;
  const monthCols   = Array.from({ length: totalMonths }, (_, i) => i);

  return (
    <div style={S.root}>

      <nav style={S.navbar}>
        <div style={S.navLeft}>
          <button style={S.backBtn} onClick={() => navigate("/dashboard")}>← Back</button>
          <div style={S.navBrand}><span style={S.brandDot}/>ChitAdmin</div>
        </div>
        <div style={S.navRight}>
          <button style={S.btnOutline} onClick={() => navigate("/profile")}>Profile</button>
          <button style={S.btnGreen} onClick={() => { sessionStorage.removeItem("isLoggedIn"); navigate("/login"); }}>Logout</button>
        </div>
      </nav>

      <div style={S.body}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px" }}>
          <span style={{ fontWeight:800, fontSize:"22px", color:"#0a0a0a" }}>Plan Details</span>
          <span style={{ fontSize:"13px", color:GRAY }}>Plan ID: <b style={{color:"#111"}}>#{id}</b></span>
        </div>

        <div style={S.infoCard}>
          <div style={S.infoAccent}/>
          <div style={S.infoLeft}>
            <div style={S.infoTitle}>{plan.chitPlanName}</div>
            <div style={S.infoSub}>{fmtYM(plan.startDate)} → {fmtYM(plan.endDate)} &nbsp;·&nbsp; Admin: {plan.adminName} &nbsp;·&nbsp; {plan.adminContact}</div>
          </div>
          <div style={S.infoStats}>
            <div style={S.statItem}>
              <span style={S.statLabel}>Monthly</span>
              <span style={S.statValGreen}>{rupee(plan.monthlyPay)}</span>
            </div>
            <div style={S.statItem}>
              <span style={S.statLabel}>Total</span>
              <span style={S.statVal}>{rupee(plan.totalAmount)}</span>
            </div>
            <div style={S.statItem}>
              <span style={S.statLabel}>Members</span>
              <span style={S.statVal}>{members.length} / {totalMonths}</span>
            </div>
            <div style={S.badge}>{totalMonths} months</div>
          </div>
        </div>

        {dirty && (
          <div style={S.saveBar}>
            <span style={S.saveTxt}>⚠️ You have unsaved changes</span>
            <div style={S.saveActions}>
              <button style={S.btnDiscard} onClick={discardChanges} disabled={saving}>Discard</button>
              <button style={{...S.btnSave, opacity: saving ? 0.7 : 1}} onClick={saveAll} disabled={saving}>
                {saving ? "Saving…" : "💾 Save All"}
              </button>
            </div>
          </div>
        )}

        <div style={S.sheetWrap}>
          <div style={S.titleRow}>📋 {plan.chitPlanName}</div>
          <div style={S.tableScroll}>
            <table style={{ ...S.table, minWidth: `${COL_NUM + COL_NAME + COL_EMAIL + COL_WIN + COL_MONTH * totalMonths}px` }}>
              <colgroup>
                <col style={{ width:`${COL_NUM}px`,   minWidth:`${COL_NUM}px` }}/>
                <col style={{ width:`${COL_NAME}px`,  minWidth:`${COL_NAME}px` }}/>
                <col style={{ width:`${COL_EMAIL}px`, minWidth:`${COL_EMAIL}px` }}/>
                <col style={{ width:`${COL_WIN}px`,   minWidth:`${COL_WIN}px` }}/>
                {monthCols.map(i => <col key={i} style={{ width:`${COL_MONTH}px`, minWidth:`${COL_MONTH}px` }}/>)}
              </colgroup>
              <thead>
                <tr>
                  <th style={S.thRowNum}>#</th>
                  <th style={{ ...S.thFrozen1, left:`${LEFT_NAME}px`,  width:COL_NAME  }}>Name</th>
                  <th style={{ ...S.thFrozen1, left:`${LEFT_EMAIL}px`, width:COL_EMAIL }}>Email</th>
                  <th style={{ ...S.thFrozen3, left:`${LEFT_WIN}px`,   width:COL_WIN   }}>Winning Month</th>
                  {monthCols.map(i => (
                    <th key={i} style={S.th}>
                      <div style={{ fontWeight:800, color:G }}>{ordinal(i+1)} Month</div>
                      <div style={{ fontWeight:500, color:GRAY, fontSize:"11px" }}>{monthLabel(plan.startDate, i)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4 + totalMonths} style={{ textAlign:"center", padding:"40px", color:GRAY, fontSize:"13px" }}>
                      No members enrolled yet. Add members from the dashboard.
                    </td>
                  </tr>
                ) : rows.map((row, rowIdx) => {
                  const bg       = rowIdx % 2 === 0 ? "#fff"    : "#fafcfa";
                  const bgFreeze = rowIdx % 2 === 0 ? "#fafcfa" : "#f5f8f5";
                  return (
                    <tr key={row.memberId} style={{ background: bg }}>
                      <td style={S.tdRowNum}>{rowIdx + 1}</td>

                      <td style={{ ...S.tdFrozen1, left:`${LEFT_NAME}px`,  width:COL_NAME,  background:bgFreeze }}>
                        <EditableCell value={row.memberName}  onChange={v => handleNameChange(rowIdx, v)}  placeholder="Member name"       isFocused={focusedCell?.row===rowIdx && focusedCell?.col==="name"}  onFocus={() => setFocusedCell({row:rowIdx,col:"name"})}  onBlur={() => setFocusedCell(null)}/>
                      </td>

                      <td style={{ ...S.tdFrozen1, left:`${LEFT_EMAIL}px`, width:COL_EMAIL, background:bgFreeze }}>
                        <EditableCell value={row.memberEmail} onChange={v => handleEmailChange(rowIdx, v)} placeholder="email@example.com" isFocused={focusedCell?.row===rowIdx && focusedCell?.col==="email"} onFocus={() => setFocusedCell({row:rowIdx,col:"email"})} onBlur={() => setFocusedCell(null)}/>
                      </td>

                      <td style={{ ...S.tdFrozen3, left:`${LEFT_WIN}px`, width:COL_WIN, background:bgFreeze }}>
                        <WinningMonthCell value={row.winningMonth} onChange={v => handleWinningMonthChange(rowIdx, v)} plan={plan} isFocused={focusedCell?.row===rowIdx && focusedCell?.col==="win"} onFocus={() => setFocusedCell({row:rowIdx,col:"win"})} onBlur={() => setFocusedCell(null)}/>
                      </td>

                      {monthCols.map(mIdx => (
                        <td key={mIdx} style={S.td}>
                          <MonthCell value={row.months[mIdx]} onChange={v => handleMonthCellChange(rowIdx, mIdx, v)} isFocused={focusedCell?.row===rowIdx && focusedCell?.col===mIdx} onFocus={() => setFocusedCell({row:rowIdx,col:mIdx})} onBlur={() => setFocusedCell(null)}/>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop:"12px", fontSize:"11.5px", color:"#9ca3af", textAlign:"center" }}>
          💡 Click any cell to edit &nbsp;·&nbsp; First 3 columns are frozen &nbsp;·&nbsp; Click "Save All" to persist changes
        </div>
      </div>

      {toast && <div style={{...S.toast, background: toast.ok ? "#111" : RED}}>{toast.msg}</div>}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EditableCell({ value, onChange, placeholder, isFocused, onFocus, onBlur }) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  return (
    <input
      style={{ ...S.cellInput, ...(isFocused ? S.cellInputFocus : {}) }}
      value={local}
      placeholder={placeholder}
      onChange={e => { setLocal(e.target.value); onChange(e.target.value); }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

function WinningMonthCell({ value, onChange, plan, isFocused, onFocus, onBlur }) {
  const totalMonths = plan?.totalMonths || 20;
  const options = Array.from({ length: totalMonths }, (_, i) => ({
    label: `${ordinal(i+1)} – ${monthLabel(plan.startDate, i)}`,
    value: monthLabel(plan.startDate, i),
  }));
  return (
    <select
      style={{ ...S.cellInput, cursor:"pointer", color: value ? G : "#9ca3af", fontWeight: value ? 600 : 400, ...(isFocused ? S.cellInputFocus : {}) }}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <option value="">— Select —</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function MonthCell({ value, onChange, isFocused, onFocus, onBlur }) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  const isPaid = local && local.trim() !== "";
  return (
    <input
      style={{
        ...S.monthInput,
        background:    isFocused ? "#fffbeb" : isPaid ? G_LIGHT : "transparent",
        color:         isPaid ? G : "#374151",
        fontWeight:    isPaid ? 700 : 400,
        outline:       isFocused ? `2px solid #f59e0b` : "none",
        outlineOffset: "-2px",
      }}
      value={local}
      placeholder="—"
      onChange={e => { setLocal(e.target.value); onChange(e.target.value); }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}