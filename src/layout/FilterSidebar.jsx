import { useState } from "react";

const FILTER_OPTIONS = [
  "Choose Service",
  "Choose Network",
  "Choose OS",
  "Choose Platform",
  "Choose Google/Non-Google",
  "Custom Variables",
];

const FILTER_DATA = {
  "Choose Service": ["Service A", "Service B", "Service C"],
  "Choose Network": ["MTN", "Vodacom", "Airtel", "Glo"],
  "Choose OS": ["Android", "iOS", "Windows", "Other"],
  "Choose Platform": ["Mobile", "Desktop", "Tablet"],
  "Choose Google/Non-Google": ["Google", "Non-Google"],
  "Custom Variables": ["Variable 1", "Variable 2", "Variable 3"],
};

function SelectFilter({ label }) {
  return (
    <div className="fsb-field">
      <label className="fsb-label">{label}</label>
      <select defaultValue="" className="fsb-input fsb-select-input">
        <option value="" disabled>
          — Select —
        </option>
        {(FILTER_DATA[label] || []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FilterSidebar({ role, setRole, setPage }) {
  const [fromDate, setFromDate] = useState("2024-09-01");
  const [toDate, setToDate] = useState("2024-09-26");

  return (
    <aside className="fsb-root">
      {/* ── Header ── */}
      <div className="fsb-header">
        <span className="fsb-header-icon">⚙</span>
        Filters
      </div>

      {/* ── Body ── */}
      <div className="fsb-body">
        {/* Role toggle */}
        <div className="fsb-field">
          <label className="fsb-label-lg">View As</label>
          <div className="fsb-role-toggle">
            {["admin", "partner"].map((r) => (
              <button
                key={r}
                className={`fsb-role-btn${role === r ? " active" : ""}`}
                onClick={() => {
                  if (setRole) setRole(r);
                  if (setPage) setPage("overview");
                }}
              >
                {r === "admin" ? "⚙ Admin" : "🤝 Partner"}
              </button>
            ))}
          </div>
        </div>

        {/* GEO */}
        <div className="fsb-field">
          <label className="fsb-label-lg">GEO</label>
          <div className="fsb-geo-chip">
            <span className="fsb-geo-flag">🇿🇦</span>
            South Africa (ZA)
          </div>
        </div>

        {/* Date From */}
        <div className="fsb-field">
          <label className="fsb-label-lg">Date From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="fsb-input"
          />
        </div>

        {/* Date To */}
        <div className="fsb-field">
          <label className="fsb-label-lg">Date To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="fsb-input"
          />
        </div>

        {/* ── Buttons ── */}
        <div className="fsb-btn-row">
          <button className="fsb-btn-clear">Reset</button>
          <button className="fsb-btn-apply">Apply</button>
        </div>

        {/* ── Options ── */}
        <div className="fsb-options-hd">Options</div>
        {FILTER_OPTIONS.map((label) => (
          <SelectFilter key={label} label={label} />
        ))}
      </div>
    </aside>
  );
}
