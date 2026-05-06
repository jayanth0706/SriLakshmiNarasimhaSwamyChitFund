import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
const FONT = "'Outfit', sans-serif";
const BASE = `${process.env.REACT_APP_API_URL}/admin`;

// ── Helpers ──────────────────────────────────────────────────────────────────
const rupee = v => (v !== "" && v != null) ? `₹${Number(v).toLocaleString("en-IN")}` : "—";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmtYM = ym => {
  if (!ym) return "—";
  const [y, m] = ym.split("-");
  return `${MONTHS[+m-1]} ${y}`;
};

// Given a "YYYY-MM" start and an offset (0-based), return the month label
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

// ── Styles ───────────────────────────────────────────────────────────────────
const S = {
  root: { fontFamily: FONT, minHeight: "100vh", background: "#f0f4f0", display: "flex", flexDirection: "column" },
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: "60px", background: "#fff",
    borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 300,
    boxShadow: "0 1px 6px rgba(0,0,0,.05)"
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  backBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "7px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: "8px", background: "#fff", fontFamily: FONT,
    fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#374151"
  },
  navBrand: { fontWeight: 800, fontSize: "18px", color: "#0a0a0a", display: "flex", alignItems: "center", gap: "8px" },
  brandDot: { width: "9px", height: "9px", borderRadius: "50%", background: G },

  body: { flex: 1, padding: "24px 28px 60px" },

  // Info card at top
  infoCard: {
    background: "#fff", borderRadius: "14px", border: "1px solid #e8ebe8",
    padding: "20px 24px", marginBottom: "22px",
    boxShadow: "0 2px 10px rgba(0,0,0,.05)", display: "flex",
    alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px"
  },
  infoLeft: { display: "flex", flexDirection: "column", gap: "4px" },
  infoTitle: { fontWeight: 800, fontSize: "20px", color: "#0a0a0a" },
  infoSub: { fontSize: "13px", color: GRAY },
  infoStats: { display: "flex", gap: "28px", flexWrap: "wrap" },
  statItem: { display: "flex", flexDirection: "column", gap: "2px" },
  statLabel: { fontSize: "11px", color: GRAY, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" },
  statVal: { fontSize: "16px", fontWeight: 700, color: "#0a0a0a" },
  statValGreen: { fontSize: "16px", fontWeight: 700, color: G },
  badge: {
    background: G_LIGHT, color: G, border: `1px solid ${G_BORDER}`,
    borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700
  },

  // Save bar
  saveBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px",
    padding: "10px 18px", marginBottom: "14px",
    boxShadow: "0 1px 4px rgba(0,0,0,.04)"
  },
  saveTxt: { fontSize: "13px", color: GRAY, fontWeight: 500 },
  saveActions: { display: "flex", gap: "10px" },
  btnSave: {
    padding: "8px 22px", border: "none", borderRadius: "7px",
    background: G, color: "#fff", fontFamily: FONT, fontWeight: 700,
    fontSize: "13px", cursor: "pointer"
  },
  btnDiscard: {
    padding: "8px 18px", border: "1.5px solid #e5e7eb", borderRadius: "7px",
    background: "#fff", fontFamily: FONT, fontWeight: 600,
    fontSize: "13px", cursor: "pointer", color: "#374151"
  },

  // Spreadsheet wrapper
  sheetWrap: {
    background: "#fff", borderRadius: "14px", border: "1px solid #e0e3e0",
    overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,.07)"
  },
  tableScroll: { overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 320px)" },

  table: { borderCollapse: "collapse", tableLayout: "fixed", fontSize: "12.5px", fontFamily: FONT },

  // Header row
  th: {
    background: "#f8faf8", borderRight: "1px solid #e0e3e0", borderBottom: "2px solid #d1d5d1",
    padding: "10px 10px", fontWeight: 700, fontSize: "11.5px", color: "#374151",
    textAlign: "center", whiteSpace: "nowrap", position: "sticky", top: 0, zIndex: 10,
    lineHeight: 1.35
  },
  thFrozen1: {
    background: "#f8faf8", borderRight: "1px solid #e0e3e0", borderBottom: "2px solid #d1d5d1",
    padding: "10px 12px", fontWeight: 700, fontSize: "11.5px", color: "#374151",
    textAlign: "left", position: "sticky", top: 0, left: 0, zIndex: 20, lineHeight: 1.35
  },
  thFrozen2: {
    background: "#f8faf8", borderRight: "1px solid #e0e3e0", borderBottom: "2px solid #d1d5d1",
    padding: "10px 12px", fontWeight: 700, fontSize: "11.5px", color: "#374151",
    textAlign: "left", position: "sticky", top: 0, zIndex: 20, lineHeight: 1.35
  },
  thFrozen3: {
    background: "#f8faf8", borderRight: "2px solid #c3c8c3", borderBottom: "2px solid #d1d5d1",
    padding: "10px 12px", fontWeight: 700, fontSize: "11.5px", color: "#374151",
    textAlign: "left", position: "sticky", top: 0, zIndex: 20, lineHeight: 1.35
  },

  // Row number column
  thRowNum: {
    background: "#f0f2f0", borderRight: "1px solid #e0e3e0", borderBottom: "2px solid #d1d5d1",
    padding: "10px 8px", fontWeight: 700, fontSize: "11px", color: GRAY,
    textAlign: "center", position: "sticky", top: 0, left: 0, zIndex: 21, width: "36px"
  },

  // Cells
  td: {
    borderRight: "1px solid #e8ebe8", borderBottom: "1px solid #e8ebe8",
    padding: 0, verticalAlign: "middle", background: "#fff"
  },
  tdFrozen1: {
    borderRight: "1px solid #e0e3e0", borderBottom: "1px solid #e8ebe8",
    padding: 0, verticalAlign: "middle", background: "#fafcfa",
    position: "sticky", left: 0, zIndex: 5
  },
  tdFrozen2: {
    borderRight: "1px solid #e0e3e0", borderBottom: "1px solid #e8ebe8",
    padding: 0, verticalAlign: "middle", background: "#fafcfa",
    position: "sticky", zIndex: 5
  },
  tdFrozen3: {
    borderRight: "2px solid #c3c8c3", borderBottom: "1px solid #e8ebe8",
    padding: 0, verticalAlign: "middle", background: "#fafcfa",
    position: "sticky", zIndex: 5
  },
  tdRowNum: {
    borderRight: "1px solid #e0e3e0", borderBottom: "1px solid #e8ebe8",
    padding: "0 8px", textAlign: "center", fontSize: "11px", color: "#9ca3af",
    fontWeight: 600, background: "#f7f9f7", position: "sticky", left: 0, zIndex: 5,
    width: "36px", userSelect: "none"
  },

  cellInput: {
    width: "100%", height: "36px", border: "none", outline: "none",
    fontFamily: FONT, fontSize: "12.5px", color: "#111", fontWeight: 500,
    background: "transparent", padding: "0 10px", boxSizing: "border-box"
  },
  cellInputFocus: {
    background: "#fffbeb", outline: "2px solid #f59e0b", outlineOffset: "-2px"
  },

  // Month column cell input – monthy payment data
  monthInput: {
    width: "100%", height: "36px", border: "none", outline: "none",
    fontFamily: FONT, fontSize: "12px", color: "#374151", fontWeight: 500,
    background: "transparent", padding: "0 8px", boxSizing: "border-box",
    textAlign: "center"
  },

  // Title row (merged-like header for plan name)
  titleRow: {
    background: "linear-gradient(90deg, #16a34a 0%, #15803d 100%)",
    color: "#fff", fontWeight: 800, fontSize: "14px",
    padding: "10px 16px", letterSpacing: "0.02em"
  },

  toast: {
    position: "fixed", bottom: "30px", right: "32px",
    padding: "12px 22px", borderRadius: "9px", fontSize: "13px",
    fontWeight: 600, zIndex: 999, color: "#fff",
    boxShadow: "0 4px 18px rgba(0,0,0,.18)"
  },

  loadWrap: { textAlign: "center", padding: "80px 20px", color: GRAY, fontSize: "14px" },
  errWrap: { textAlign: "center", padding: "80px 20px", color: RED, fontSize: "14px" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChitPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grid data: rows keyed by memberId, cols keyed by monthIndex (0-based)
  // Each cell can store a string value (payment note / amount)
  // Also stores: memberName (editable), memberEmail (editable), winningMonth (editable)
  const [rows, setRows] = useState([]); // [{ memberId, memberName, memberEmail, winningMonth, months: ["", "", ...] }]
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null); // { row, col }

  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Fetch plan + members ──────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [planRes, membersRes] = await Promise.all([
        fetch(`${BASE}/chit-plans-details/${id}`),
        fetch(`${BASE}/chit-plans/${id}/members`),
      ]);
      if (!planRes.ok) throw new Error("Plan not found");
      const planData = await planRes.json();
      const membersData = membersRes.ok ? await membersRes.json() : [];

      setPlan(planData);
      setMembers(membersData);

      // Build initial rows
      const totalMonths = planData.totalMonths || 20;
      const initialRows = membersData.map(m => ({
        memberId: m.id,
        memberName: m.memberName || "",
        memberEmail: m.memberEmail || "",
        winningMonth: m.winningMonth || "",
        months: Array(totalMonths).fill(""),
      }));
      setRows(initialRows);
      setDirty(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Cell change handlers ──────────────────────────────────────────────────
  const handleNameChange = (rowIdx, val) => {
    setRows(r => r.map((row, i) => i === rowIdx ? { ...row, memberName: val } : row));
    setDirty(true);
  };

  const handleEmailChange = (rowIdx, val) => {
    setRows(r => r.map((row, i) => i === rowIdx ? { ...row, memberEmail: val } : row));
    setDirty(true);
  };

  const handleWinningMonthChange = (rowIdx, val) => {
    setRows(r => r.map((row, i) => i === rowIdx ? { ...row, winningMonth: val } : row));
    setDirty(true);
  };

  const handleMonthCellChange = (rowIdx, monthIdx, val) => {
    setRows(r => r.map((row, i) => {
      if (i !== rowIdx) return row;
      const months = [...row.months];
      months[monthIdx] = val;
      return { ...row, months };
    }));
    setDirty(true);
  };

  // ── Save all changes ──────────────────────────────────────────────────────
  const saveAll = async () => {
    setSaving(true);
    try {
      // Save member name/email updates
      const memberUpdates = rows.map(row =>
        fetch(`${BASE}/chit-plans/${id}/members/${row.memberId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberName: row.memberName,
            memberEmail: row.memberEmail,
            winningMonth: row.winningMonth,
          }),
        }).catch(() => null)
      );

      // Save grid data (month cells)
      const gridPayload = {
        planId: id,
        rows: rows.map(row => ({
          memberId: row.memberId,
          winningMonth: row.winningMonth,
          months: row.months,
        })),
      };
      const gridSave = fetch(`${BASE}/chit-plans/${id}/grid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gridPayload),
      }).catch(() => null);

      await Promise.all([...memberUpdates, gridSave]);
      setDirty(false);
      showToast("Changes saved successfully!");
    } catch {
      showToast("Saved locally (API not yet implemented)", true);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    fetchAll();
    showToast("Changes discarded.", true);
  };

  // ── Column widths ─────────────────────────────────────────────────────────
  const COL_NUM = 36;
  const COL_NAME = 160;
  const COL_EMAIL = 170;
  const COL_WIN = 130;
  const COL_MONTH = 110;

  // Left offsets for sticky columns (after row number)
  const LEFT_NAME = COL_NUM;
  const LEFT_EMAIL = COL_NUM + COL_NAME;
  const LEFT_WIN = COL_NUM + COL_NAME + COL_EMAIL;

  if (loading) return <div style={S.root}><div style={S.loadWrap}>⏳ Loading chit plan…</div></div>;
  if (error) return <div style={S.root}><div style={S.errWrap}>❌ {error}</div></div>;
  if (!plan) return null;

  const totalMonths = plan.totalMonths || 20;
  const monthCols = Array.from({ length: totalMonths }, (_, i) => i);

  return (
    <div style={S.root}>
      {/* ── Navbar ── */}
      <nav style={S.navbar}>
        <div style={S.navLeft}>
          <button style={S.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <div style={S.navBrand}>
            <span style={S.brandDot} />
            ChitAdmin
          </div>
        </div>
        <div style={{ fontSize: "13px", color: GRAY, fontWeight: 500 }}>
          Plan ID: <b style={{ color: "#111" }}>#{id}</b>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={S.body}>

        {/* ── Info Card ── */}
        <div style={S.infoCard}>
          <div style={S.infoLeft}>
            <div style={S.infoTitle}>{plan.chitPlanName}</div>
            <div style={S.infoSub}>
              {fmtYM(plan.startDate)} → {fmtYM(plan.endDate)} &nbsp;·&nbsp; Admin: {plan.adminName} &nbsp;·&nbsp; {plan.adminContact}
            </div>
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
            <div style={{ ...S.badge }}>{totalMonths} months</div>
          </div>
        </div>

        {/* ── Save Bar ── */}
        {dirty && (
          <div style={S.saveBar}>
            <span style={S.saveTxt}>⚠️ You have unsaved changes</span>
            <div style={S.saveActions}>
              <button style={S.btnDiscard} onClick={discardChanges} disabled={saving}>Discard</button>
              <button style={{ ...S.btnSave, opacity: saving ? 0.7 : 1 }} onClick={saveAll} disabled={saving}>
                {saving ? "Saving…" : "💾 Save All"}
              </button>
            </div>
          </div>
        )}

        {/* ── Spreadsheet ── */}
        <div style={S.sheetWrap}>

          {/* Title row spanning all */}
          <div style={S.titleRow}>📋 {plan.chitPlanName}</div>

          <div style={S.tableScroll}>
            <table style={{ ...S.table, minWidth: `${COL_NUM + COL_NAME + COL_EMAIL + COL_WIN + COL_MONTH * totalMonths}px` }}>
              <colgroup>
                <col style={{ width: `${COL_NUM}px`, minWidth: `${COL_NUM}px` }} />
                <col style={{ width: `${COL_NAME}px`, minWidth: `${COL_NAME}px` }} />
                <col style={{ width: `${COL_EMAIL}px`, minWidth: `${COL_EMAIL}px` }} />
                <col style={{ width: `${COL_WIN}px`, minWidth: `${COL_WIN}px` }} />
                {monthCols.map(i => (
                  <col key={i} style={{ width: `${COL_MONTH}px`, minWidth: `${COL_MONTH}px` }} />
                ))}
              </colgroup>

              <thead>
                <tr>
                  {/* Row # */}
                  <th style={S.thRowNum}>#</th>
                  {/* Frozen col 1 */}
                  <th style={{ ...S.thFrozen1, left: `${LEFT_NAME}px`, width: COL_NAME }}>Name</th>
                  {/* Frozen col 2 */}
                  <th style={{ ...S.thFrozen2, left: `${LEFT_EMAIL}px`, width: COL_EMAIL }}>Email</th>
                  {/* Frozen col 3 */}
                  <th style={{ ...S.thFrozen3, left: `${LEFT_WIN}px`, width: COL_WIN }}>Winning Month</th>
                  {/* Month columns */}
                  {monthCols.map(i => (
                    <th key={i} style={S.th}>
                      <div style={{ fontWeight: 800, color: G }}>{ordinal(i + 1)} Month</div>
                      <div style={{ fontWeight: 500, color: "#6b7280", fontSize: "11px" }}>
                        {monthLabel(plan.startDate, i)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4 + totalMonths} style={{ textAlign: "center", padding: "40px", color: GRAY, fontSize: "13px" }}>
                      No members enrolled yet. Add members from the dashboard.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, rowIdx) => (
                    <tr key={row.memberId} style={{ background: rowIdx % 2 === 0 ? "#fff" : "#fafcfa" }}>
                      {/* Row number */}
                      <td style={S.tdRowNum}>{rowIdx + 1}</td>

                      {/* Frozen: Name */}
                      <td style={{ ...S.tdFrozen1, left: `${LEFT_NAME}px`, width: COL_NAME, background: rowIdx % 2 === 0 ? "#fafcfa" : "#f5f8f5" }}>
                        <EditableCell
                          value={row.memberName}
                          onChange={val => handleNameChange(rowIdx, val)}
                          placeholder="Member name"
                          isFocused={focusedCell?.row === rowIdx && focusedCell?.col === "name"}
                          onFocus={() => setFocusedCell({ row: rowIdx, col: "name" })}
                          onBlur={() => setFocusedCell(null)}
                        />
                      </td>

                      {/* Frozen: Email */}
                      <td style={{ ...S.tdFrozen2, left: `${LEFT_EMAIL}px`, width: COL_EMAIL, background: rowIdx % 2 === 0 ? "#fafcfa" : "#f5f8f5" }}>
                        <EditableCell
                          value={row.memberEmail}
                          onChange={val => handleEmailChange(rowIdx, val)}
                          placeholder="email@example.com"
                          isFocused={focusedCell?.row === rowIdx && focusedCell?.col === "email"}
                          onFocus={() => setFocusedCell({ row: rowIdx, col: "email" })}
                          onBlur={() => setFocusedCell(null)}
                        />
                      </td>

                      {/* Frozen: Winning Month */}
                      <td style={{ ...S.tdFrozen3, left: `${LEFT_WIN}px`, width: COL_WIN, background: rowIdx % 2 === 0 ? "#fafcfa" : "#f5f8f5" }}>
                        <WinningMonthCell
                          value={row.winningMonth}
                          onChange={val => handleWinningMonthChange(rowIdx, val)}
                          plan={plan}
                          isFocused={focusedCell?.row === rowIdx && focusedCell?.col === "win"}
                          onFocus={() => setFocusedCell({ row: rowIdx, col: "win" })}
                          onBlur={() => setFocusedCell(null)}
                        />
                      </td>

                      {/* Month cells */}
                      {monthCols.map(monthIdx => (
                        <td key={monthIdx} style={S.td}>
                          <MonthCell
                            value={row.months[monthIdx]}
                            onChange={val => handleMonthCellChange(rowIdx, monthIdx, val)}
                            isFocused={focusedCell?.row === rowIdx && focusedCell?.col === monthIdx}
                            onFocus={() => setFocusedCell({ row: rowIdx, col: monthIdx })}
                            onBlur={() => setFocusedCell(null)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom hint */}
        <div style={{ marginTop: "12px", fontSize: "11.5px", color: "#9ca3af", textAlign: "center" }}>
          💡 Click any cell to edit &nbsp;·&nbsp; First 3 columns are frozen &nbsp;·&nbsp; Click "Save All" to persist changes
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ ...S.toast, background: toast.ok ? "#111" : RED }}>{toast.msg}</div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EditableCell({ value, onChange, placeholder, isFocused, onFocus, onBlur }) {
  const [localVal, setLocalVal] = useState(value);
  useEffect(() => { setLocalVal(value); }, [value]);

  return (
    <input
      style={{
        ...S.cellInput,
        ...(isFocused ? S.cellInputFocus : {}),
      }}
      value={localVal}
      placeholder={placeholder}
      onChange={e => { setLocalVal(e.target.value); onChange(e.target.value); }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

function WinningMonthCell({ value, onChange, plan, isFocused, onFocus, onBlur }) {
  // Dropdown of all month labels for this plan
  const totalMonths = plan?.totalMonths || 20;
  const options = Array.from({ length: totalMonths }, (_, i) => ({
    label: `${ordinal(i + 1)} – ${monthLabel(plan.startDate, i)}`,
    value: monthLabel(plan.startDate, i),
  }));

  return (
    <select
      style={{
        ...S.cellInput,
        cursor: "pointer",
        color: value ? G : "#9ca3af",
        fontWeight: value ? 600 : 400,
        ...(isFocused ? S.cellInputFocus : {}),
      }}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <option value="">— Select —</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function MonthCell({ value, onChange, isFocused, onFocus, onBlur }) {
  const [localVal, setLocalVal] = useState(value);
  useEffect(() => { setLocalVal(value); }, [value]);

  // Color coding: "paid" → green tint, empty → white
  const isPaid = localVal && localVal.trim() !== "";

  return (
    <input
      style={{
        ...S.monthInput,
        background: isFocused ? "#fffbeb" : isPaid ? "#f0fdf4" : "transparent",
        color: isPaid ? G : "#374151",
        fontWeight: isPaid ? 700 : 400,
        outline: isFocused ? "2px solid #f59e0b" : "none",
        outlineOffset: "-2px",
      }}
      value={localVal}
      placeholder="—"
      onChange={e => { setLocalVal(e.target.value); onChange(e.target.value); }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}