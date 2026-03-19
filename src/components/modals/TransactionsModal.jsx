import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { transactionRows } from "../../data/tables";
import TransactionDetailModal from "./TransactionDetailModal";
import TransactionDashboardModal from "./TransactionDashboardModal";
import { CheckIcon, CopyIcon } from "../ui/Icons";

function CopyCell({ value, display, className }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <span
      className={`txn-copy-cell${className ? " " + className : ""}`}
      onClick={handleCopy}
      title={`Click to copy: ${value}`}
    >
      <span className="txn-copy-text">{display ?? value}</span>
      <span className={`txn-copy-icon${copied ? " copied" : ""}`}>
        {copied ? <CheckIcon size={11} /> : <CopyIcon size={11} />}
      </span>
      {copied && <span className="txn-copy-toast">Copied!</span>}
    </span>
  );
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const VISIBLE_REASONS = 2;

function ReasonCell({ reasons }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const visible = reasons.slice(0, VISIBLE_REASONS);
  const extra = reasons.slice(VISIBLE_REASONS);

  function handleOpen(e) {
    e.stopPropagation();
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 5, left: r.left });
    }
    setOpen((v) => !v);
  }

  return (
    <div className="txn-reasons-wrap">
      {visible.map((rsn) => (
        <span
          key={rsn}
          className={`txn-reason-badge rsn-${rsn.replace(/[^a-z0-9]/gi, "").toLowerCase()}`}
        >
          {rsn}
        </span>
      ))}
      {extra.length > 0 && (
        <>
          <button
            ref={btnRef}
            className={`txn-reason-more-btn${open ? " active" : ""}`}
            onClick={handleOpen}
          >
            +{extra.length}
          </button>
          {open &&
            createPortal(
              <>
                <div
                  className="txn-reason-overlay"
                  onClick={() => setOpen(false)}
                />
                <div
                  className="txn-reason-popover"
                  style={{ top: pos.top, left: pos.left }}
                >
                  {extra.map((rsn) => (
                    <span
                      key={rsn}
                      className={`txn-reason-badge rsn-${rsn.replace(/[^a-z0-9]/gi, "").toLowerCase()}`}
                    >
                      {rsn}
                    </span>
                  ))}
                </div>
              </>,
              document.body,
            )}
        </>
      )}
    </div>
  );
}

export default function TransactionsModal({
  onClose,
  title = "Clicked Clean — Transactions",
  ipFilter: initialIp = "",
  role = "admin",
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [dashMode, setDashMode]       = useState(null);
  const [ipFilter, setIpFilter] = useState(initialIp);
  const [search, setSearch] = useState(initialIp);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All"); // "All" | "Clear" | "Block"

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = transactionRows.filter((r) => {
    const matchSearch =
      r.id.includes(search) ||
      r.network.toLowerCase().includes(search.toLowerCase()) ||
      r.apk.toLowerCase().includes(search.toLowerCase()) ||
      r.userIp.includes(search);
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Block" && r.status === "Block") ||
      (statusFilter === "Clear" && r.status === "Clear");
    return matchSearch && matchStatus;
  });

  // Counts for tab badges
  const countAll = transactionRows.length;
  const countBlock = transactionRows.filter((r) => r.status === "Block").length;
  const countClear = transactionRows.filter((r) => r.status === "Clear").length;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalEntries = 112003;

  const pageNums = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNums.push(i);
  } else {
    pageNums.push(1, 2, 3, 4, 5, "…", totalPages);
  }

  return (
    <>
      <div onClick={onClose} className="txn-backdrop" />

      <div className="txn-modal">
        {/* ── Header ── */}
        <div className="txn-header">
          <div className="txn-header-left">
            <div className="txn-icon">✓</div>
            <div>
              <div className="txn-title">
                {ipFilter ? `Transactions — IP: ${ipFilter}` : title}
              </div>
              <div className="txn-subtitle">
                Showing {filtered.length.toLocaleString()} of{" "}
                {totalEntries.toLocaleString()} entries
              </div>
            </div>
          </div>
          <div className="txn-header-actions">
            <button className="txn-toolbar-btn txn-btn-export">
              Export Transactions
            </button>
            <button
              onClick={() => setDashMode("dashboard")}
              className="txn-toolbar-btn txn-btn-dashboard"
            >
              Dashboard
            </button>
            <button
              onClick={() => setDashMode("excluded")}
              className="txn-toolbar-btn txn-btn-excluded"
            >
              Excluded Dashboard
            </button>
            <button onClick={onClose} className="txn-close-btn">
              ×
            </button>
          </div>
        </div>

        {/* ── IP filter banner ── */}
        {ipFilter && (
          <div className="txn-ip-banner">
            <span className="txn-ip-label">🔍 Filtering by User IP:</span>
            <span className="txn-ip-chip">{ipFilter}</span>
            <button
              onClick={() => {
                setIpFilter("");
                setSearch("");
              }}
              className="txn-ip-clear"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* ── Status Filter Tabs ── */}
        <div className="txn-status-tabs">
          {[
            {
              key: "All",
              label: "All Transactions",
              count: countAll,
              icon: "≡",
            },
            { key: "Clear", label: "Clear", count: countClear, icon: "✅" },
            { key: "Block", label: "Blocked", count: countBlock, icon: "🚫" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setPage(1);
              }}
              className={`txn-status-tab${statusFilter === tab.key ? " active" : ""} tab-${tab.key.toLowerCase()}`}
            >
              <span className="txn-status-tab-icon">{tab.icon}</span>
              <span className="txn-status-tab-label">{tab.label}</span>
              <span className="txn-status-tab-count">
                {tab.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        {/* ── Controls ── */}
        <div className="txn-controls">
          <div className="txn-ctrl-group">
            Show
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(+e.target.value);
                setPage(1);
              }}
              className="txn-select"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            entries
          </div>
          <div className="txn-ctrl-group">
            Search:
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="txn-search"
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="txn-table-scroll">
          <table className="txn-table">
            <thead className="txn-thead">
              <tr className="txn-thead-row">
                {[
                  "Sr.",
                  "ID",
                  "Time",
                  "Network",
                  "APK",
                  "User IP",
                  "MSISDN",
                  "Status",
                  "Reason",
                  "Interaction",
                  "View",
                ].map((h) => (
                  <th key={h} className="txn-th">
                    {h}{" "}
                    {h !== "View" && h !== "Sr." && (
                      <span className="txn-sort-icon">↕</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((r, i) => (
                <tr key={r.id} className="txn-tr">
                  <td className="txn-td-sr">{(page - 1) * pageSize + i + 1}</td>
                  <td className="txn-td-id">
                    <CopyCell value={r.id} display={r.id} />
                  </td>
                  <td className="txn-td-time">{r.time}</td>
                  <td className="txn-td-network">
                    <CopyCell value={r.network} display={r.network} />
                  </td>
                  <td className="txn-td-apk">
                    <CopyCell value={r.apk || "—"} display={r.apk || "—"} />
                  </td>
                  <td className="txn-td-ip">
                    <CopyCell value={r.userIp} />
                  </td>
                  <td className="txn-td-msisdn">{r.msisdn || "—"}</td>
                  <td className="txn-td-badge">
                    <span
                      className={`txn-status-badge ${r.status === "Block" ? "status-block" : "status-allow"}`}
                    >
                      {r.status === "Block" ? "Block" : "Clear"}
                    </span>
                  </td>
                  <td className="txn-td-reasons">
                    <ReasonCell reasons={r.reasons} />
                  </td>
                  <td className="txn-td-interaction">
                    <span className="txn-interact-badge">{r.interaction}</span>
                  </td>
                  <td className="txn-td-view">
                    <button
                      onClick={() => setSelectedRow(r)}
                      className="txn-view-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Footer / Pagination ── */}
        <div className="txn-footer">
          <div className="txn-footer-count">
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} to{" "}
            {Math.min(page * pageSize, filtered.length)} of{" "}
            {totalEntries.toLocaleString()} entries
          </div>
          <div className="txn-pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`txn-page-prev${page === 1 ? " disabled" : ""}`}
            >
              Previous
            </button>

            {pageNums.map((n, i) =>
              typeof n === "number" ? (
                <button
                  key={i}
                  onClick={() => setPage(n)}
                  className={`txn-page-num${page === n ? " active" : ""}`}
                >
                  {n}
                </button>
              ) : (
                <span key={i} className="txn-page-ellipsis">
                  {n}
                </span>
              ),
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="txn-page-next"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedRow && (
        <TransactionDetailModal
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          role={role}
          hasImage={!!selectedRow?.hasImage}
          hasVideo={!!selectedRow?.hasVideo}
          onUserIp={(ip) => {
            setSelectedRow(null);
            setIpFilter(ip);
            setSearch(ip);
            setPage(1);
          }}
        />
      )}
      {dashMode && (
        <TransactionDashboardModal
          title={ipFilter ? `IP: ${ipFilter}` : title}
          mode={dashMode}
          onClose={() => setDashMode(null)}
        />
      )}
    </>
  );
}