import { useState, useCallback } from "react";
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip,
} from "recharts";
import { Card, SectionTitle } from "../components/ui";
import {
  BLUE, GREEN, AMBER, ROSE,
  statusBg, statusText,
} from "../components/constants/colors";

/* ══════════════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════════════ */
const FLAG = {
  ZA:"🇿🇦", TH:"🇹🇭", TZ:"🇹🇿", NG:"🇳🇬", SN:"🇸🇳",
  KE:"🇰🇪", GH:"🇬🇭", ZW:"🇿🇼", ET:"🇪🇹", SD:"🇸🇩",
  ZM:"🇿🇲", UG:"🇺🇬", IQ:"🇮🇶", SA:"🇸🇦", AE:"🇦🇪",
};

const PARTNER_ROWS = [
  // ── Aggregators ──────────────────────────────────────────────────────────
  { id:"PTR-012", name:"IQ Services",      contact:"Karwan",          email:"karwan@gmail.com",          country:"IQ", revenue:"UGX 1.8M",      status:"active",   joined:"2023-10-20", lastActive:"Today",   type:"Aggregator", isDirectClient:false, aggregatorId:null },
  { id:"PTR-006", name:"Safaricom Kenya",  contact:"Grace Wanjiru",   email:"grace@safaricom.co.ke",     country:"KE", revenue:"KES 3,400,000", status:"active",   joined:"2022-11-30", lastActive:"Today",   type:"Aggregator", isDirectClient:false, aggregatorId:null },

  // ── CSPs under IQ Services (PTR-012) ─────────────────────────────────────
  { id:"PTR-001", name:"Aplimedia",        contact:"John Smith",      email:"john@truedigital.com",      country:"IQ", revenue:"฿1,240,000",   status:"active",   joined:"2023-01-15", lastActive:"Today",   type:"CSP", isDirectClient:false, aggregatorId:"PTR-012" },
  { id:"PTR-002", name:"Iraqcom",          contact:"Sipho Dlamini",   email:"sipho@mtn.co.za",           country:"IQ", revenue:"R 980,000",     status:"active",   joined:"2023-03-08", lastActive:"Today",   type:"CSP", isDirectClient:false, aggregatorId:"PTR-012" },
  { id:"PTR-003", name:"Gameloft",         contact:"Amina Hassan",    email:"amina@vodacom.tz",          country:"IQ", revenue:"TZS 4.2M",      status:"active",   joined:"2023-06-22", lastActive:"2d ago",  type:"CSP", isDirectClient:true,  aggregatorId:"PTR-012" },
  { id:"PTR-004", name:"Mobimind",         contact:"Kwame Asante",    email:"kwame@glo.com.gh",          country:"IQ", revenue:"GHS 210,000",   status:"inactive", joined:"2024-01-05", lastActive:"22d ago", type:"CSP", isDirectClient:true,  aggregatorId:"PTR-012" },
  { id:"PTR-005", name:"Iraqtel",          contact:"Sipho Dlamini",   email:"sipho2@mtn.co.za",          country:"IQ", revenue:"R 980,000",     status:"active",   joined:"2023-03-08", lastActive:"Today",   type:"CSP", isDirectClient:false, aggregatorId:"PTR-012" },
  { id:"PTR-007", name:"IQNet",            contact:"Sipho Dlamini",   email:"sipho3@mtn.co.za",          country:"IQ", revenue:"R 980,000",     status:"active",   joined:"2023-03-08", lastActive:"Today",   type:"CSP", isDirectClient:false, aggregatorId:"PTR-012" },
  { id:"PTR-013", name:"IQMedia",          contact:"Sipho Dlamini",   email:"sipho4@mtn.co.za",          country:"IQ", revenue:"R 980,000",     status:"active",   joined:"2023-03-08", lastActive:"Today",   type:"CSP", isDirectClient:false, aggregatorId:"PTR-012" },
  { id:"PTR-014", name:"IQConnect",        contact:"Sipho Dlamini",   email:"sipho5@mtn.co.za",          country:"IQ", revenue:"R 980,000",     status:"active",   joined:"2023-03-08", lastActive:"Today",   type:"CSP", isDirectClient:false, aggregatorId:"PTR-012" },
  { id:"PTR-015", name:"IQBroadband",      contact:"Sipho Dlamini",   email:"sipho6@mtn.co.za",          country:"IQ", revenue:"R 980,000",     status:"active",   joined:"2023-03-08", lastActive:"Today",   type:"CSP", isDirectClient:false, aggregatorId:"PTR-012" },

  // ── CSPs under Safaricom Kenya (PTR-006) ─────────────────────────────────
  { id:"PTR-008", name:"Airtel Nigeria",   contact:"Chukwuemeka O.",  email:"chukwu@airtel.ng",          country:"NG", revenue:"₦ 2,100,000",   status:"active",   joined:"2023-07-01", lastActive:"Today",   type:"CSP", isDirectClient:true,  aggregatorId:"PTR-006" },
  { id:"PTR-016", name:"Orange Senegal",   contact:"Moussa Diop",     email:"moussa@orange.sn",          country:"SN", revenue:"CFA 890,000",   status:"warning",  joined:"2023-09-14", lastActive:"8d ago",  type:"CSP", isDirectClient:false, aggregatorId:"PTR-006" },
  { id:"PTR-017", name:"Telecel Zimbabwe", contact:"Tatenda Moyo",    email:"tatenda@telecel.co.zw",     country:"ZW", revenue:"USD 45,000",    status:"active",   joined:"2024-02-18", lastActive:"1d ago",  type:"CSP", isDirectClient:false, aggregatorId:"PTR-006" },

  // ── Direct clients (no aggregator) ───────────────────────────────────────
  { id:"PTR-009", name:"True",             contact:"Bereket Alemu",   email:"bereket@ethiotelecom.et",   country:"ET", revenue:"ETB 820,000",   status:"active",   joined:"2023-08-09", lastActive:"Today",   type:"CSP", isDirectClient:true,  aggregatorId:null },
  { id:"PTR-010", name:"Dtac",             contact:"Omar Al-Rashid",  email:"omar@sudatel.sd",           country:"SD", revenue:"SDG 340,000",   status:"warning",  joined:"2024-03-01", lastActive:"5d ago",  type:"CSP", isDirectClient:true,  aggregatorId:null },
  { id:"PTR-018", name:"IQ Services",      contact:"Mwila Mwansa",    email:"mwila@zamtel.zm",           country:"ZM", revenue:"ZMW 98,000",    status:"active",   joined:"2024-04-12", lastActive:"3d ago",  type:"CSP", isDirectClient:true,  aggregatorId:null },
  { id:"PTR-019", name:"Media World",      contact:"Mwila Mwansa",    email:"mwila2@zamtel.zm",          country:"ZM", revenue:"ZMW 98,000",    status:"active",   joined:"2024-04-12", lastActive:"3d ago",  type:"CSP", isDirectClient:true,  aggregatorId:null },
  { id:"PTR-020", name:"Gameloft",         contact:"Mwila Mwansa",    email:"mwila3@zamtel.zm",          country:"ZM", revenue:"ZMW 98,000",    status:"active",   joined:"2024-04-12", lastActive:"3d ago",  type:"CSP", isDirectClient:true,  aggregatorId:null },
  { id:"PTR-021", name:"Mobimind",         contact:"Mwila Mwansa",    email:"mwila4@zamtel.zm",          country:"ZM", revenue:"ZMW 98,000",    status:"active",   joined:"2024-04-12", lastActive:"3d ago",  type:"CSP", isDirectClient:true,  aggregatorId:null },
  { id:"PTR-022", name:"Dharam",           contact:"Mwila Mwansa",    email:"mwila5@zamtel.zm",          country:"ZM", revenue:"ZMW 98,000",    status:"active",   joined:"2024-04-12", lastActive:"3d ago",  type:"CSP", isDirectClient:true,  aggregatorId:null },
];

const TREND_DATA = [
  { d:"Sep 1", partners:8 }, { d:"Sep 7", partners:9 },
  { d:"Sep 14", partners:9 }, { d:"Sep 21", partners:10 },
  { d:"Sep 26", partners:12 },
];

/* ── Derive hierarchy nodes from partners list ───────────────────────────── */
function deriveNodes(partners) {
  return partners.map((p) => ({
    id:             `node-${p.id}`,
    name:           p.name,
    geo:            p.country,
    role:           p.type === "Aggregator" ? "aggregator"
                  : (!p.aggregatorId && p.isDirectClient) ? "direct"
                  : "csp",
    parentId:       p.aggregatorId ? `node-${p.aggregatorId}` : null,
    isDirectClient: p.isDirectClient || false,
  }));
}

const ROLE_META = {
  aggregator: { label:"Aggregator", cls:"ph-badge-agg" },
  csp:        { label:"CSP",        cls:"ph-badge-csp" },
  direct:     { label:"Direct",     cls:"ph-badge-direct" },
};

/* ══════════════════════════════════════════════════════════════════════════
   PARTNER DETAIL / EDIT / DELETE MODAL
══════════════════════════════════════════════════════════════════════════ */
function PartnerModal({ partner, onClose, onSave, onDelete }) {
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState({ ...partner });
  const [saving, setSaving] = useState(false);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function handleSave() {
    setSaving(true);
    setTimeout(() => { onSave(form); setSaving(false); setMode("view"); }, 500);
  }

  function handleDelete() { onDelete(partner.id); onClose(); }

  if (!partner) return null;

  return (
    <div className="partner-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="partner-box">
        <div className="partner-modal-header">
          <div className="f-gap-14">
            <div className="partner-avatar">{partner.name[0]}</div>
            <div>
              <div className="txt-white-hd">
                {mode === "edit" ? "Edit Partner" : mode === "confirm-delete" ? "Delete Partner" : partner.name}
              </div>
              <div className="txt-white-sub">{FLAG[partner.country] ?? "🌐"} {partner.id}</div>
            </div>
          </div>
          <button onClick={onClose} className="partner-modal-close">×</button>
        </div>

        <div className="p-section">
          {mode === "view" && (
            <>
              <div className="g-stats3 mb-section">
                {[{ label:"Revenue", value:partner.revenue, color:GREEN }].map((s) => (
                  <div key={s.label} className="partner-stat-cell">
                    <div className="stat-num" style={{ "--c":s.color }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              {[
                ["Contact",     partner.contact],
                ["Email",       partner.email],
                ["Country",     `${FLAG[partner.country] ?? "🌐"} ${partner.country}`],
                ["Status",      partner.status],
                ["Joined",      partner.joined],
                ["Last Active", partner.lastActive],
              ].map(([label, value]) => (
                <div key={label} className="partner-detail-row">
                  <span className="stat-sublabel">{label}</span>
                  {label === "Status" ? (
                    <span className="partner-status-badge" style={{ "--bg":statusBg(value), "--c":statusText(value) }}>{value}</span>
                  ) : (
                    <span className="detail-val">{value}</span>
                  )}
                </div>
              ))}
              <div className="ph-modal-actions">
                <button className="partner-btn-primary" onClick={() => setMode("edit")}>Edit Partner</button>
                <button className="partner-btn-danger"  onClick={() => setMode("confirm-delete")}>Delete</button>
              </div>
            </>
          )}

          {mode === "edit" && (
            <>
              <div className="ph-add-grid">
                <div className="ph-add-field">
                  <label className="ph-add-label">Partner Name</label>
                  <input className="ph-add-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="ph-add-field">
                  <label className="ph-add-label">Contact Person</label>
                  <input className="ph-add-input" value={form.contact} onChange={(e) => set("contact", e.target.value)} />
                </div>
                <div className="ph-add-field">
                  <label className="ph-add-label">Email Address</label>
                  <input className="ph-add-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div className="ph-add-field">
                  <label className="ph-add-label">Country</label>
                  <select className="ph-add-select" value={form.country} onChange={(e) => set("country", e.target.value)}>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{FLAG[c.code] ?? "🌐"} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ph-add-field">
                  <label className="ph-add-label">Status</label>
                  <select className="ph-add-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
                    <option value="active">Active</option>
                    <option value="warning">Warning</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="ph-add-field">
                  <label className="ph-add-label">Revenue</label>
                  <input className="ph-add-input" value={form.revenue} onChange={(e) => set("revenue", e.target.value)} />
                </div>
              </div>
              <div className="ph-modal-actions">
                <button className="partner-btn-ghost"   onClick={() => setMode("view")}>Cancel</button>
                <button className="partner-btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {mode === "confirm-delete" && (
            <div className="ph-delete-confirm">
              <div className="ph-delete-icon">🗑</div>
              <p className="ph-delete-msg">
                Are you sure you want to delete <strong>{partner.name}</strong>? This action cannot be undone.
              </p>
              <div className="ph-modal-actions">
                <button className="partner-btn-ghost"  onClick={() => setMode("view")}>Cancel</button>
                <button className="partner-btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ADD PARTNER MODAL
══════════════════════════════════════════════════════════════════════════ */
const COUNTRIES = [
  { code:"AE", name:"United Arab Emirates" }, { code:"ET", name:"Ethiopia" },
  { code:"GH", name:"Ghana" },   { code:"IQ", name:"Iraq" },
  { code:"KE", name:"Kenya" },   { code:"NG", name:"Nigeria" },
  { code:"SA", name:"Saudi Arabia" }, { code:"SD", name:"Sudan" },
  { code:"SN", name:"Senegal" }, { code:"TH", name:"Thailand" },
  { code:"TZ", name:"Tanzania" },{ code:"UG", name:"Uganda" },
  { code:"ZA", name:"South Africa" }, { code:"ZM", name:"Zambia" },
  { code:"ZW", name:"Zimbabwe" },
];

const PARTNER_TYPES = ["Aggregator", "CSP"];
const AGGREGATOR_LIST = PARTNER_ROWS.filter((p) => p.type === "Aggregator");

function AddPartnerModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name:"", contact:"", email:"", country:"",
    type:"CSP", isDirectClient:false, aggregatorId:"", revenue:"",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())    errs.name    = "Partner name is required";
    if (!form.contact.trim()) errs.contact = "Contact name is required";
    if (!form.email.trim())   errs.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (!form.country)        errs.country = "Please select a country";
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setTimeout(() => {
      onAdd({
        id:             `PTR-${String(Date.now()).slice(-3)}`,
        name:           form.name.trim(),
        contact:        form.contact.trim(),
        email:          form.email.trim(),
        country:        form.country,
        revenue:        form.revenue.trim() || "—",
        status:         "active",
        joined:         new Date().toISOString().slice(0, 10),
        lastActive:     "Today",
        type:           form.type,
        isDirectClient: form.isDirectClient,
        aggregatorId:   form.type === "CSP" ? (form.aggregatorId || null) : null,
      });
      setSaving(false);
      onClose();
    }, 600);
  }

  return (
    <div className="partner-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="partner-box ph-add-modal">
        <div className="partner-modal-header">
          <div className="f-gap-14">
            <div className="partner-avatar">+</div>
            <div>
              <div className="txt-white-hd">Add New Partner</div>
              <div className="txt-white-sub">Fill in the details below</div>
            </div>
          </div>
          <button onClick={onClose} className="partner-modal-close">×</button>
        </div>

        <div className="p-section ph-add-body">
          <div className="ph-add-field-group">
            <label className="ph-add-label">Partner Type</label>
            <div className="ph-add-type-row">
              {PARTNER_TYPES.map((t) => (
                <button key={t} className={`ph-add-type-btn${form.type === t ? " active" : ""}`} onClick={() => set("type", t)} type="button">{t}</button>
              ))}
            </div>
          </div>

          {form.type === "CSP" && (
            <>
              <div className="ph-add-field-group ph-add-direct-row">
                <span className="ph-add-label ph-add-direct-label">
                  Also a Direct Client?
                  <span className="ph-add-direct-hint">This CSP is also our direct client</span>
                </span>
                <button type="button" className={`ph-add-toggle${form.isDirectClient ? " on" : ""}`} onClick={() => set("isDirectClient", !form.isDirectClient)}>
                  <span className="ph-add-toggle-knob" />
                </button>
              </div>
              <div className="ph-add-field-group">
                <label className="ph-add-label">Under Aggregator <span className="ph-add-optional">(optional)</span></label>
                <select className="ph-add-select" value={form.aggregatorId} onChange={(e) => set("aggregatorId", e.target.value)}>
                  <option value="">— None (standalone CSP) —</option>
                  {AGGREGATOR_LIST.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} · {a.country}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="ph-add-grid">
            <div className="ph-add-field">
              <label className="ph-add-label">Partner Name <span className="ph-add-req">*</span></label>
              <input className={`ph-add-input${errors.name ? " ph-add-input-err" : ""}`} placeholder="e.g. Safaricom Kenya" value={form.name} onChange={(e) => set("name", e.target.value)} />
              {errors.name && <span className="ph-add-err">{errors.name}</span>}
            </div>
            <div className="ph-add-field">
              <label className="ph-add-label">Contact Person <span className="ph-add-req">*</span></label>
              <input className={`ph-add-input${errors.contact ? " ph-add-input-err" : ""}`} placeholder="Full name" value={form.contact} onChange={(e) => set("contact", e.target.value)} />
              {errors.contact && <span className="ph-add-err">{errors.contact}</span>}
            </div>
            <div className="ph-add-field">
              <label className="ph-add-label">Email Address <span className="ph-add-req">*</span></label>
              <input className={`ph-add-input${errors.email ? " ph-add-input-err" : ""}`} placeholder="contact@company.com" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              {errors.email && <span className="ph-add-err">{errors.email}</span>}
            </div>
            <div className="ph-add-field">
              <label className="ph-add-label">Country <span className="ph-add-req">*</span></label>
              <select className={`ph-add-select${errors.country ? " ph-add-input-err" : ""}`} value={form.country} onChange={(e) => set("country", e.target.value)}>
                <option value="">Select country…</option>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{FLAG[c.code] ?? "🌐"} {c.name}</option>)}
              </select>
              {errors.country && <span className="ph-add-err">{errors.country}</span>}
            </div>
            <div className="ph-add-field ph-add-field-full">
              <label className="ph-add-label">Revenue</label>
              <input className="ph-add-input" placeholder="e.g. KES 3,400,000" value={form.revenue} onChange={(e) => set("revenue", e.target.value)} />
            </div>
          </div>

          <div className="ph-add-footer">
            <button className="partner-btn-ghost" onClick={onClose} type="button">Cancel</button>
            <button className="partner-btn-primary" onClick={handleSubmit} type="button" disabled={saving}>
              {saving ? "Saving…" : "Add Partner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TAB 1 — HIERARCHY VIEW
══════════════════════════════════════════════════════════════════════════ */
function HierarchyNodeCard({ node, isDragging, onDragStart }) {
  return (
    <div
      className={`ph-node${isDragging ? " ph-node-dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, node.id)}
    >
      <div className="ph-node-drag">⠿</div>
      <div className="ph-node-body">
        <div className="ph-node-name">{node.name}</div>
        <div className="ph-node-badges">
          <span className={`ph-badge ${ROLE_META[node.role].cls}`}>{ROLE_META[node.role].label}</span>
          <span className="ph-badge ph-badge-geo">{FLAG[node.geo] ?? "🌐"} {node.geo}</span>
          {node.isDirectClient && node.role === "csp" && (
            <span className="ph-badge ph-badge-dual">Direct Client</span>
          )}
        </div>
      </div>
    </div>
  );
}

function AggregatorLane({ agg, children, onDrop, onDragOver, draggingId }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? children : children.slice(0, 4);
  const extra   = children.length - 4;

  return (
    <div className="ph-lane">
      <div className="ph-lane-header">
        <div className="ph-lane-dot ph-lane-dot-agg" />
        <span className="ph-lane-title">{agg.name}</span>
        <span className="ph-badge ph-badge-geo ph-lane-geo">{FLAG[agg.geo] ?? "🌐"} {agg.geo}</span>
        <span className="ph-lane-count">{children.length} CSPs</span>
      </div>
      <div
        className={`ph-lane-drop${draggingId ? " ph-lane-drop-active" : ""}`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, agg.id)}
      >
        {visible.length > 0 ? visible : <div className="ph-lane-empty">Drop a CSP here</div>}
        {!expanded && extra > 0 && (
          <button className="ph-lane-show-more" onClick={() => setExpanded(true)}>
            + {extra} more — View all
          </button>
        )}
        {expanded && extra > 0 && (
          <button className="ph-lane-show-more ph-lane-show-less" onClick={() => setExpanded(false)}>
            Show less
          </button>
        )}
      </div>
    </div>
  );
}

function DirectClientsLane({ nodes, onDrop, onDragOver, draggingId, onDragStart }) {
  return (
    <div className="ph-lane ph-lane-direct">
      <div className="ph-lane-header">
        <div className="ph-lane-dot ph-lane-dot-direct" />
        <span className="ph-lane-title">Direct Clients</span>
        <span className="ph-lane-count">{nodes.length} clients</span>
      </div>
      <div
        className={`ph-lane-drop ph-lane-drop-wrap${draggingId ? " ph-lane-drop-active" : ""}`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "__direct__")}
      >
        {nodes.length > 0 ? nodes.map((n) => (
          <HierarchyNodeCard key={n.id} node={n} onDragStart={onDragStart} />
        )) : <div className="ph-lane-empty">Drop clients here</div>}
      </div>
    </div>
  );
}

function HierarchyTab({ nodes, onReparent }) {
  const [draggingId, setDraggingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const handleDragStart = useCallback((e, id) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e, targetId) => {
    e.preventDefault();
    if (!draggingId) return;
    const dragged = nodes.find((n) => n.id === draggingId);
    if (!dragged) return;
    if (dragged.role === "aggregator" && targetId !== "__direct__") return;
    const newParentId = targetId === "__direct__" ? null : targetId;
    const newRole     = targetId === "__direct__" ? "direct" : "csp";
    if (dragged.parentId === newParentId) return;
    const target     = nodes.find((n) => n.id === targetId);
    const targetName = targetId === "__direct__" ? "Direct Clients" : target?.name ?? targetId;
    showToast(`"${dragged.name}" moved to ${targetName}`);
    onReparent(draggingId, newParentId, newRole);
    setDraggingId(null);
  }, [draggingId, nodes, onReparent]);

  const aggregators   = nodes.filter((n) => n.role === "aggregator");
  const directClients = nodes.filter((n) => n.role === "direct" && !n.parentId);

  return (
    <div className="ph-root">
      <div className="ph-legend">
        <div className="ph-legend-item">
          <span className="ph-legend-dot ph-lane-dot-agg" />
          <span className="ph-legend-lbl">Aggregator lane</span>
        </div>
        <div className="ph-legend-item">
          <span className="ph-badge ph-badge-csp">CSP</span>
          <span className="ph-legend-lbl">Content Service Provider</span>
        </div>
        <div className="ph-legend-item">
          <span className="ph-badge ph-badge-direct">Direct</span>
          <span className="ph-legend-lbl">Direct client</span>
        </div>
        <div className="ph-legend-item">
          <span className="ph-badge ph-badge-dual">Direct Client</span>
          <span className="ph-legend-lbl">CSP that is also a direct client</span>
        </div>
        <div className="ph-legend-hint">⠿ Drag a node to reassign it</div>
      </div>

      <DirectClientsLane
        nodes={directClients}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        draggingId={draggingId}
        onDragStart={handleDragStart}
      />

      <div className="ph-lanes-grid">
        {aggregators.map((agg) => {
          const children = nodes.filter((n) => n.parentId === agg.id);
          return (
            <AggregatorLane
              key={agg.id}
              agg={agg}
              children={children.map((n) => (
                <HierarchyNodeCard key={n.id} node={n} isDragging={draggingId === n.id} onDragStart={handleDragStart} />
              ))}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              draggingId={draggingId}
            />
          );
        })}
      </div>

      {toast && <div className="ph-toast">{toast}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TAB 2 — MANAGE PARTNERS
══════════════════════════════════════════════════════════════════════════ */
const CHART_TICK = { fontSize:10, fill:"#cbd5e1" };
const CHART_DOT  = { r:3, fill:BLUE, strokeWidth:0 };
const CHART_TT   = { fontSize:11, borderRadius:8, border:"none", background:"#0f172a", color:"#fff" };

function ManagePartnersTab({ partners, setPartners, onAddClick }) {
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");
  const [selected, setSelected] = useState(null);
  const [perPage,  setPerPage]  = useState(10);

  const filtered = partners.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) ||
      p.contact.toLowerCase().includes(q) || p.country.toLowerCase().includes(q);
    const matchFilter = filter === "All" || p.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const visible = filtered.slice(0, perPage);
  const stats = {
    total:    partners.length,
    active:   partners.filter((p) => p.status === "active").length,
    warning:  partners.filter((p) => p.status === "warning").length,
    inactive: partners.filter((p) => p.status === "inactive").length,
  };

  return (
    <div className="ph-manage-wrap">
      <div className="g-stats4 mb-section">
        {[
          { label:"Total Partners",  value:stats.total,    color:BLUE  },
          { label:"Active",          value:stats.active,   color:GREEN },
          { label:"Needs Attention", value:stats.warning,  color:AMBER },
          { label:"Inactive",        value:stats.inactive, color:ROSE  },
        ].map((s) => (
          <Card key={s.label}>
            <div className="kpi-stat stat-accent" style={{ "--c":s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="g-split2 mb-section">
        <Card>
          <SectionTitle>Partner Growth</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={TREND_DATA}>
              <XAxis dataKey="d" tick={CHART_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} domain={[6,14]} />
              <Tooltip contentStyle={CHART_TT} />
              <Line dataKey="partners" name="Partners" stroke={BLUE} strokeWidth={2.5} dot={CHART_DOT} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>By Status</SectionTitle>
          <div className="f-col-10">
            {[
              { label:"Active",          count:stats.active,   color:GREEN, bg:"#dcfce7", pct:Math.round((stats.active/stats.total)*100) },
              { label:"Needs Attention", count:stats.warning,  color:AMBER, bg:"#fef3c7", pct:Math.round((stats.warning/stats.total)*100) },
              { label:"Inactive",        count:stats.inactive, color:ROSE,  bg:"#fee2e2", pct:Math.round((stats.inactive/stats.total)*100) },
            ].map((s) => (
              <div key={s.label} className="partner-status-row" style={{ "--bg":s.bg }}>
                <div className="color-dot stat-bg" style={{ "--c":s.color }} />
                <div className="rep-legend-lbl">{s.label}</div>
                <span className="stat-num-val" style={{ "--c":s.color }}>{s.count}</span>
                <span className="stat-sublabel">{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="partner-toolbar">
          <SectionTitle className="m-0">All Partners</SectionTitle>
          <div className="f-wrap-10">
            <div className="dt-entries-bar">
              <span className="dt-entries-lbl">Show</span>
              <select className="dt-entries-sel" value={perPage} onChange={(e) => setPerPage(+e.target.value)}>
                {[10,25,50,100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="dt-entries-lbl">entries</span>
            </div>
            <div className="f-gap-6">
              {["All","Active","Warning","InActive"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`partner-filter-pill ${filter===f?"active":"inactive"}`}>{f}</button>
              ))}
            </div>
            <div className="p-rel">
              <span className="partner-search-icon">🔍</span>
              <input placeholder="Search partners…" value={search} onChange={(e) => setSearch(e.target.value)} className="partner-search" />
            </div>
            <button className="partner-add-btn" onClick={onAddClick}>+ Add Partner</button>
          </div>
        </div>

        <div className="page-table-scroll">
          <table className="dt">
            <thead>
              <tr className="dt-head-row">
                {["Partner","Contact","Country","Type","Revenue","Status","Last Active",""].map((h) => (
                  <th key={h} className="dt-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="dt-tr" onClick={() => setSelected(p)}>
                  <td className="p-sm">
                    <div className="f-gap-10">
                      <div className="partner-row-avatar">{p.name[0]}</div>
                      <div>
                        <div className="txt-strong-sm">{p.name}</div>
                        <div className="txt-mono">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-p-body">{p.contact}</td>
                  <td className="td-p-flag">{FLAG[p.country] ?? "🌐"} {p.country}</td>
                  <td className="p-sm">
                    <div className="ph-node-badges">
                      <span className={`ph-badge ${p.type === "Aggregator" ? "ph-badge-agg" : "ph-badge-csp"}`}>
                        {p.type === "Aggregator" ? "Aggregator" : "CSP"}
                      </span>
                      {p.isDirectClient && p.type !== "Aggregator" && (
                        <span className="ph-badge ph-badge-dual">Direct Client</span>
                      )}
                    </div>
                  </td>
                  <td className="td-p-mono">{p.revenue}</td>
                  <td className="p-sm">
                    <span className="partner-status-badge" style={{ "--bg":statusBg(p.status), "--c":statusText(p.status) }}>{p.status}</span>
                  </td>
                  <td className="td-p-slate">{p.lastActive}</td>
                  <td className="p-sm">
                    <button onClick={(e) => { e.stopPropagation(); setSelected(p); }} className="partner-view-btn">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="td-empty">No partners match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="partner-footer-txt">Showing {visible.length} of {partners.length} partners</div>
      </Card>

      {selected && (
        <PartnerModal
          partner={selected}
          onClose={() => setSelected(null)}
          onSave={(updated) => {
            setPartners((prev) => prev.map((p) => p.id === updated.id ? updated : p));
            setSelected(updated);
          }}
          onDelete={(id) => {
            setPartners((prev) => prev.filter((p) => p.id !== id));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
const TABS = [
  { key:"manage",    label:"Manage Partners", dot:"ph-dot-violet" },
  { key:"hierarchy", label:"Hierarchy View",  dot:"ph-dot-blue"   },
];

export default function PagePartners() {
  const [activeTab, setActiveTab] = useState("manage");
  const [showAdd,   setShowAdd]   = useState(false);
  const [partners,  setPartners]  = useState(PARTNER_ROWS);

  const nodes       = deriveNodes(partners);
  const aggregators = nodes.filter((n) => n.role === "aggregator").length;
  const direct      = nodes.filter((n) => n.role === "direct").length;

  return (
    <div className="partners-page-wrap ph-page">
      <div className="ph-page-hd">
        <div className="ph-page-hd-left">
          <div className="ph-page-icon">◈</div>
          <div>
            <h1 className="ph-page-title">Partners</h1>
            <p className="ph-page-sub">
              {partners.length} partners · {aggregators} aggregators · {direct} direct clients
            </p>
          </div>
        </div>
        <div className="ph-page-hd-right" />
      </div>

      <div className="ph-tab-strip">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`ph-tab${activeTab === t.key ? " ph-tab-active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span className={`ph-tab-dot ${t.dot}`} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="ph-tab-content">
        {activeTab === "hierarchy" && (
          <HierarchyTab
            nodes={nodes}
            onReparent={(nodeId, newParentId, newRole) => {
              setPartners((prev) => prev.map((p) =>
                `node-${p.id}` === nodeId
                  ? { ...p,
                      type:           newRole === "aggregator" ? "Aggregator" : "CSP",
                      isDirectClient: newRole === "direct",
                      aggregatorId:   newParentId ? newParentId.replace("node-", "") : null,
                    }
                  : p
              ));
            }}
          />
        )}
        {activeTab === "manage" && (
          <ManagePartnersTab
            partners={partners}
            setPartners={setPartners}
            onAddClick={() => setShowAdd(true)}
          />
        )}
      </div>

      {showAdd && (
        <AddPartnerModal
          onClose={() => setShowAdd(false)}
          onAdd={(p) => { setPartners((prev) => [p, ...prev]); setShowAdd(false); }}
        />
      )}
    </div>
  );
}