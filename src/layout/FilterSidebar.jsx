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
  "Choose Service":           ["Service A", "Service B", "Service C"],
  "Choose Network":           ["MTN", "Vodacom", "Airtel", "Glo"],
  "Choose OS":                ["Android", "iOS", "Windows", "Other"],
  "Choose Platform":          ["Mobile", "Desktop", "Tablet"],
  "Choose Google/Non-Google": ["Google", "Non-Google"],
  "Custom Variables":         ["Variable 1", "Variable 2", "Variable 3"],
};

// ── Search field config ───────────────────────────────────────────────────────
const SEARCH_FIELDS = [
  {
    key:         "uniqueId",
    label:       "Unique ID",
    placeholder: "e.g. UID-00123456",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        <path d="M16 12h.01"/>
      </svg>
    ),
  },
  {
    key:         "txnId",
    label:       "Transaction ID",
    placeholder: "e.g. TXN-9a3f…",
    mono:        true,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
  },
  {
    key:         "ip",
    label:       "IP Address",
    placeholder: "e.g. 192.168.1.1",
    mono:        true,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    key:         "msisdn",
    label:       "MSISDN",
    placeholder: "e.g. +27821234567",
    mono:        true,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
];

function SelectFilter({ label }) {
  return (
    <div className="fsb-field">
      <label className="fsb-label">{label}</label>
      <select defaultValue="" className="fsb-input fsb-select-input">
        <option value="" disabled>— Select —</option>
        {(FILTER_DATA[label] || []).map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function FilterSidebar({ role, setRole, setPage, onSearch }) {
  const [fromDate, setFromDate] = useState("2024-09-01");
  const [toDate,   setToDate]   = useState("2024-09-26");

  const [search, setSearch] = useState({
    uniqueId: "", txnId: "", ip: "", msisdn: "",
  });

  const hasSearch = Object.values(search).some((v) => v.trim() !== "");

  function handleSearchChange(key, val) {
    setSearch((prev) => ({ ...prev, [key]: val }));
  }

  function handleSearchClear() {
    setSearch({ uniqueId: "", txnId: "", ip: "", msisdn: "" });
  }

  function handleSearchApply() {
    if (onSearch) onSearch(search);
  }

  return (
    <aside className="fsb-root">

      {/* ── Header ── */}
      <div className="fsb-header">
        <span className="fsb-header-icon">⚙</span>
        Filters
      </div>

      {/* ── Body ── */}
      <div className="fsb-body">

        {/* ════ SEARCH SECTION ════ */}
        <div className="fsb-search-section">

          {/* Section heading with clear button */}
          <div className="fsb-search-hd">
            <div className="fsb-search-hd-left">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search
            </div>
            {hasSearch && (
              <button className="fsb-search-clear-all" onClick={handleSearchClear}>
                Clear all
              </button>
            )}
          </div>

          {/* 4 search inputs */}
          {SEARCH_FIELDS.map((f) => (
            <div key={f.key} className="fsb-search-field">
              <label className="fsb-label">{f.label}</label>
              <div className="fsb-search-input-wrap">
                <span className="fsb-search-field-icon">{f.icon}</span>
                <input
                  type="text"
                  value={search[f.key]}
                  onChange={(e) => handleSearchChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`fsb-input fsb-search-input-field${f.mono ? " fsb-search-mono" : ""}`}
                  spellCheck={false}
                  autoComplete="off"
                />
                {search[f.key] && (
                  <button
                    className="fsb-search-field-clear"
                    onClick={() => handleSearchChange(f.key, "")}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Search action button */}
          <button
            className={`fsb-search-apply-btn${hasSearch ? " fsb-search-apply-btn--active" : ""}`}
            onClick={handleSearchApply}
            disabled={!hasSearch}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search Transactions
          </button>
        </div>

        {/* ════ DIVIDER ════ */}
        <div className="fsb-section-divider" />

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
                }}>
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

        {/* Apply / Reset */}
        <div className="fsb-btn-row">
          <button className="fsb-btn-clear">Reset</button>
          <button className="fsb-btn-apply">Apply</button>
        </div>

        {/* Options */}
        <div className="fsb-options-hd">Options</div>
        {FILTER_OPTIONS.map((label) => (
          <SelectFilter key={label} label={label} />
        ))}

      </div>
    </aside>
  );
}