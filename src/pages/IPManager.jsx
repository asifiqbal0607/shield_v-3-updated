import { useState } from "react";

/* ── Mock data ──────────────────────────────────────────────────────────── */
const CLIENTS = ["360VUZ", "Dharam IQ", "Kids Plus", "MediaNet", "StreamCore"];
const SERVICES = [
  "360VUZ VIP",
  "360VUZ Premium",
  "Kids Games",
  "Sports HD",
  "News Live",
];

const NETOP_BLOCKS = [];

const CALC_RESULTS = [
  { id: 1, network: "Libyana-Mobile-AS", total: 1575 },
  { id: 2, network: "U Mobile Sdn Bhd", total: 862 },
  {
    id: 3,
    network:
      "Hulum Almustakbal Company for Communication Engineering and Services Ltd",
    total: 821,
  },
  {
    id: 4,
    network: "Earthlink Telecommunications Equipment Trading & Services DMCC",
    total: 791,
  },
  {
    id: 5,
    network: "Emirates Telecommunications Group Company (etisalat Group) Pjsc",
    total: 510,
  },
  {
    id: 6,
    network: "Kurdistan Net Company for Computer and Internet Ltd.",
    total: 473,
  },
  {
    id: 7,
    network: "Spark for Information Technology Services Ltd",
    total: 436,
  },
  { id: 8, network: "General Post and Telecommunication Company", total: 428 },
  {
    id: 9,
    network: "Allay Nawroz Telecom Company for Communication/Ltd.",
    total: 274,
  },
  { id: 10, network: "Horizon Scope Mobile Telecom WLL", total: 209 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 1 — Attach Netops
═══════════════════════════════════════════════════════════════════════════ */
function AttachNetops() {
  const [client, setClient] = useState("360VUZ");
  const [service, setService] = useState("360VUZ VIP");

  return (
    <div className="ipm-tab-content">
      <div className="ipm-form-card">
        <h2 className="ipm-card-title">Proxy IP Ranges</h2>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Clients</span>
          <select
            className="ipm-underline-select"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            {CLIENTS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Services</span>
          <select
            className="ipm-underline-select"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="ipm-card-footer">
          <button className="ipm-process-link">Process</button>
        </div>
      </div>

      <div className="ipm-netops-list">
        {NETOP_BLOCKS.map((n) => (
          <div key={n.id} className="ipm-netop-card">
            <span className="ipm-netop-badge">{n.name}</span>
            <div className="ipm-asn-header">
              <span className="ipm-asn-header-label">ASN-Numbers</span>
              <button className="ipm-update-btn">Update Ips</button>
            </div>
            <div className="ipm-asn-chips">
              {n.asns.length > 0 ? (
                n.asns.map((asn) => (
                  <span key={asn} className="ipm-asn-chip">
                    {asn}
                  </span>
                ))
              ) : (
                <span className="ipm-asn-none">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — Export IP Ranges
═══════════════════════════════════════════════════════════════════════════ */
function ExportIPRanges() {
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [netops, setNetops] = useState("");
  const [email, setEmail] = useState("");
  const [days, setDays] = useState("");

  return (
    <div className="ipm-tab-content">
      <div className="ipm-form-card">
        <h2 className="ipm-card-title">Export Top 10 Netop Ranges</h2>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Clients</span>
          <select
            className="ipm-underline-select"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            <option value="" disabled>
              Select from the list
            </option>
            {CLIENTS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Services</span>
          <select
            className="ipm-underline-select"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="" disabled>
              Select from the list
            </option>
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Netops to exclude</span>
          <select
            className="ipm-underline-select"
            value={netops}
            onChange={(e) => setNetops(e.target.value)}
          >
            <option value="" disabled>
              Select from the list
            </option>
            {NETOP_BLOCKS.map((n) => (
              <option key={n.id}>{n.name}</option>
            ))}
          </select>
        </div>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Email Address</span>
          <input
            className="ipm-underline-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Add To Email Address, (,) Separated"
          />
        </div>

        <div className="ipm-field-row">
          <span className="ipm-field-label ipm-label-with-info">
            Data To Process
            <span className="ipm-info-badge" title="Minimum 3 days required">
              i
            </span>
          </span>
          <input
            className="ipm-underline-input"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="min 3 days"
            type="number"
            min="3"
          />
        </div>

        <div className="ipm-card-footer">
          <button className="ipm-process-link">Process</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 3 — IP Ranges Calculator
═══════════════════════════════════════════════════════════════════════════ */
const PAGE_SIZES = [10, 25, 50];
const TOTAL_ENTRIES = 174;
const TOTAL_PAGES = 18;

function IPRangesCalculator() {
  const [client, setClient] = useState("360VUZ");
  const [service, setService] = useState("360VUZ VIP");
  const [dateRange] = useState("03/12/2026 - 03/12/2026");
  const [txType, setTxType] = useState("all");
  const [calculated, setCalculated] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = CALC_RESULTS.filter((r) =>
    r.network.toLowerCase().includes(search.toLowerCase()),
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageNums = [1, 2, 3, 4, 5, "…", TOTAL_PAGES];

  return (
    <div className="ipm-tab-content">
      {/* filter card */}
      <div className="ipm-form-card">
        <div className="ipm-field-row">
          <span className="ipm-field-label">Clients</span>
          <select
            className="ipm-underline-select ipm-has-arrow"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            {CLIENTS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Services</span>
          <select
            className="ipm-underline-select ipm-has-arrow"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Date Range</span>
          <div className="ipm-date-display">{dateRange}</div>
        </div>

        <div className="ipm-field-row">
          <span className="ipm-field-label">Transaction Type</span>
          <div className="ipm-radio-row">
            <label className="ipm-radio-opt">
              <input
                type="radio"
                name="ipm-txtype"
                value="all"
                checked={txType === "all"}
                onChange={() => setTxType("all")}
                className="ipm-radio-input"
              />
              <span
                className={`ipm-radio-circle${txType === "all" ? " ipm-radio-on" : ""}`}
              />
              All
            </label>
            <label className="ipm-radio-opt">
              <input
                type="radio"
                name="ipm-txtype"
                value="queried"
                checked={txType === "queried"}
                onChange={() => setTxType("queried")}
                className="ipm-radio-input"
              />
              <span
                className={`ipm-radio-circle${txType === "queried" ? " ipm-radio-on" : ""}`}
              />
              Queried Only
            </label>
          </div>
        </div>

        <div className="ipm-card-footer">
          <button
            className="ipm-process-link"
            onClick={() => {
              setCalculated(true);
              setPage(1);
            }}
          >
            Calculate
          </button>
        </div>
      </div>

      {/* results */}
      {calculated && (
        <div className="ipm-results-card">
          <div className="ipm-results-top">
            <div className="ipm-results-top-left">
              <h3 className="ipm-results-title">Network With Transactions</h3>
              <div className="ipm-show-row">
                <span className="ipm-show-lbl">Show</span>
                <select
                  className="ipm-show-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(+e.target.value);
                    setPage(1);
                  }}
                >
                  {PAGE_SIZES.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
                <span className="ipm-show-lbl">entries</span>
              </div>
              <button className="ipm-composite-btn">Composite Report</button>
            </div>
            <div className="ipm-results-top-right">
              <span className="ipm-search-lbl">Search:</span>
              <input
                className="ipm-search-input"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="ipm-table-wrap">
            <table className="ipm-table">
              <thead>
                <tr className="ipm-thead-row">
                  <th className="ipm-th ipm-col-num">
                    # <span className="ipm-sort">↕</span>
                  </th>
                  <th className="ipm-th ipm-col-net">
                    Network <span className="ipm-sort">↕</span>
                  </th>
                  <th className="ipm-th ipm-col-tot">
                    Total Transactions <span className="ipm-sort">↕</span>
                  </th>
                  <th className="ipm-th ipm-col-act">
                    Action <span className="ipm-sort">↕</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r, idx) => (
                  <tr key={r.id} className="ipm-tr">
                    <td className="ipm-td ipm-td-num">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td className="ipm-td ipm-td-net">{r.network}</td>
                    <td className="ipm-td ipm-td-tot">
                      {r.total.toLocaleString()}
                    </td>
                    <td className="ipm-td ipm-td-act">
                      <button className="ipm-dl-btn">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ipm-tbl-footer">
            <span className="ipm-showing-txt">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, TOTAL_ENTRIES)} of {TOTAL_ENTRIES}{" "}
              entries
            </span>
            <div className="ipm-pagination">
              <button
                className={`ipm-pg-btn${page === 1 ? " ipm-pg-disabled" : ""}`}
                onClick={() => page > 1 && setPage((p) => p - 1)}
              >
                Previous
              </button>
              {pageNums.map((n, i) =>
                typeof n === "number" ? (
                  <button
                    key={i}
                    className={`ipm-pg-num${page === n ? " ipm-pg-active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ) : (
                  <span key={i} className="ipm-pg-ellipsis">
                    {n}
                  </span>
                ),
              )}
              <button
                className={`ipm-pg-btn${page === TOTAL_PAGES ? " ipm-pg-disabled" : ""}`}
                onClick={() => page < TOTAL_PAGES && setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════════════════ */
const ALL_TABS = [
  {
    key: "attach",
    label: "Attach Netops",
    dot: "ipm-dot-blue",
    roles: ["admin"],
  },
  {
    key: "export",
    label: "Export IP Ranges",
    dot: "ipm-dot-violet",
    roles: ["admin"],
  },
  {
    key: "calculator",
    label: "IP Ranges Calculator",
    dot: "ipm-dot-amber",
    roles: ["admin", "partner"],
  },
];

export default function IPManager({ role }) {
  const isPartner = role === "partner";
  const tabs = ALL_TABS.filter((t) => t.roles.includes(role));
  const [activeTab, setActiveTab] = useState(
    isPartner ? "calculator" : "attach",
  );

  return (
    <div className="page-main ipm-page">
      <div className="ipm-page-hd">
        <div className="ipm-page-hd-left">
          <div className="ipm-page-icon">🌐</div>
          <div>
            <h1 className="ipm-page-title">IP Manager</h1>
            <p className="ipm-page-sub">
              Manage IP ranges, netops and export configurations
            </p>
          </div>
        </div>
      </div>

      <div className="ipm-tab-strip">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`ipm-tab${activeTab === t.key ? " ipm-tab-active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span className={`ipm-tab-dot ${t.dot}`} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "attach" && <AttachNetops />}
      {activeTab === "export" && <ExportIPRanges />}
      {activeTab === "calculator" && <IPRangesCalculator />}
    </div>
  );
}
