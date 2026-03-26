import { useState, useCallback, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

import { Card } from "../components/ui";
import { TransactionsModal } from "../components/modals";
import { BlockRadarChart } from "../components/charts";
import {
  BackArrowIcon, InfoIcon, ChevronUpIcon, ChevronDownIcon, FilterIcon,
} from "../components/ui/Icons";
import { ScoreGauge, HeatmapBar, ChannelRows } from "../components/ui";
import { histogramData, blockReasons, blockLegend } from "../data/charts";
import ServicesTrafficChart from "../components/charts/ServicesTrafficChart";
import PartnersTrafficChart from "../components/charts/PartnersTrafficChart";
import { ALL_PARTNERS } from "../models/partners";
import { buildPartnerData, getDayStats, getFilterScale } from "../services/trafficService";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}
function fmtPct(n) { return `${n.toFixed(1)}%`; }
function chgPct(curr, prev) { return prev > 0 ? +((curr - prev) / prev * 100).toFixed(1) : 0; }

// ── Aggregate all partners for a given day offset ─────────────────────────────
function dayTotal(dayOffset) {
  return ALL_PARTNERS.reduce((acc, p) => {
    const s = getDayStats(p, dayOffset);
    return { total: acc.total + s.total, blocked: acc.blocked + s.blocked, clean: acc.clean + s.clean };
  }, { total: 0, blocked: 0, clean: 0 });
}

// ── KPI data derived from real partner traffic ────────────────────────────────
function buildKpiData(range) {
  const periods = range === "1d" ? 1 : range === "7d" ? 7 : 30;
  const desc = range === "1d" ? "vs yesterday" : range === "7d" ? "vs prev 7d" : "vs prev 30d";

  // Current period
  let curr = { total: 0, blocked: 0, clean: 0 };
  for (let d = 0; d < periods; d++) {
    const s = dayTotal(d);
    curr.total += s.total; curr.blocked += s.blocked; curr.clean += s.clean;
  }
  // Previous period
  let prev = { total: 0, blocked: 0, clean: 0 };
  for (let d = periods; d < periods * 2; d++) {
    const s = dayTotal(d);
    prev.total += s.total; prev.blocked += s.blocked; prev.clean += s.clean;
  }

  const currCtr = histogramData.reduce((s, d) => s + d.clicks, 0) /
                  Math.max(1, histogramData.reduce((s, d) => s + d.visits, 0)) * 100;
  const prevCtr = currCtr * 0.94;

  const currCleanRatio = curr.total > 0 ? (curr.clean / curr.total) * 100 : 0;
  const prevCleanRatio = prev.total > 0 ? (prev.clean / prev.total) * 100 : 0;
  const currClicks = histogramData.reduce((s, d) => s + d.clicks, 0) * periods;
  const prevClicks = Math.round(currClicks * 0.93);

  // Sparkline: 30 points interpolating curr→prev
  const spark = (cVal, pVal) => Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    return { i, curr: cVal * (0.9 + Math.sin(i * 0.4) * 0.08 + t * 0.02), prev: pVal * (0.9 + Math.sin(i * 0.4 + 1.2) * 0.07) };
  });

  return [
    { label: "Clear",       color: "#22c55e", pp: false,
      value: fmtNum(curr.clean),       prevValue: fmtNum(prev.clean),
      change: chgPct(curr.clean, prev.clean), desc, data: spark(curr.clean, prev.clean) },
    { label: "Clear ratio", color: "#3b82f6", pp: true,
      value: fmtPct(currCleanRatio),   prevValue: fmtPct(prevCleanRatio),
      change: +((currCleanRatio - prevCleanRatio)).toFixed(1), desc, data: spark(currCleanRatio, prevCleanRatio) },
    { label: "Clicked",     color: "#f59e0b", pp: false,
      value: fmtNum(currClicks),       prevValue: fmtNum(prevClicks),
      change: chgPct(currClicks, prevClicks), desc, data: spark(currClicks, prevClicks) },
    { label: "CTR",         color: "#8b5cf6", pp: true,
      value: fmtPct(currCtr),          prevValue: fmtPct(prevCtr),
      change: +((currCtr - prevCtr)).toFixed(1), desc, data: spark(currCtr, prevCtr) },
    { label: "Total",       color: "#0ea5e9", pp: false,
      value: fmtNum(curr.total),       prevValue: fmtNum(prev.total),
      change: chgPct(curr.total, prev.total), desc, data: spark(curr.total, prev.total) },
  ];
}

// ── Volume chart data derived from real partner traffic ───────────────────────
function buildVolumeData(range) {
  if (range === "1d") {
    const WEIGHTS = [0.5,0.4,0.3,0.3,0.4,0.6,0.9,1.3,1.8,2.0,1.9,1.7,
                     1.5,1.6,1.8,2.1,2.0,1.8,1.4,1.1,0.9,0.7,0.6,0.5];
    const wSum = WEIGHTS.reduce((s, w) => s + w, 0);
    const today = dayTotal(0);
    const now = new Date().getHours();
    return WEIGHTS.slice(0, now + 1).map((w, h) => ({
      d: `${String(h).padStart(2,"0")}:00`,
      clean:   Math.round((w / wSum) * today.clean),
      blocked: Math.round((w / wSum) * today.blocked),
      visits:  Math.round((w / wSum) * today.total * 1.35),
    }));
  }
  if (range === "7d") {
    return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => {
      const s = dayTotal(6 - i);
      return { d, clean: s.clean, blocked: s.blocked, visits: Math.round(s.total * 1.35) };
    });
  }
  // 30d
  return Array.from({ length: 30 }, (_, i) => {
    const s = dayTotal(29 - i);
    return { d: `${i + 1}`, clean: s.clean, blocked: s.blocked, visits: Math.round(s.total * 1.35) };
  });
}

// ── Hourly density from real today total ─────────────────────────────────────
function buildHourlyData() {
  const today = dayTotal(0);
  const WEIGHTS = [0.5,0.4,0.3,0.3,0.4,0.6,0.9,1.3,1.8,2.0,1.9,1.7,
                   1.5,1.6,1.8,2.1,2.0,1.8,1.4,1.1,0.9,0.7,0.6,0.5];
  const wSum = WEIGHTS.reduce((s, w) => s + w, 0);
  return WEIGHTS.map((w, h) => ({ h, value: Math.round((w / wSum) * today.total) }));
}

// ── Block reasons from real blockReasons data ────────────────────────────────
function buildBlockReasons() {
  const COLOR_MAP = {
    "Shield Bypassing":    "#ef4444",
    "Desktop Traffic":     "#f59e0b",
    "Failed Interaction":  "#8b5cf6",
    "Bot Detected":        "#3b82f6",
    "Remotely Controlled": "#10b981",
    "Spoofing":            "#ec4899",
    "APK Fraud":           "#06b6d4",
    "Excessive IP":        "#f97316",
  };
  const totals = {};
  blockLegend.forEach(({ key }) => { totals[key] = 0; });
  blockReasons.forEach(day => blockLegend.forEach(({ key }) => { totals[key] += day[key] || 0; }));
  const grand = Object.values(totals).reduce((s, v) => s + v, 0);
  return blockLegend
    .map(({ key }) => ({ name: key, value: Math.round((totals[key] / grand) * 100), color: COLOR_MAP[key] || "#94a3b8", raw: totals[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

// ── Channel data from histogramData ──────────────────────────────────────────
function buildChannelData() {
  const totalV = histogramData.reduce((s, d) => s + d.visits, 0);
  const totalC = histogramData.reduce((s, d) => s + d.clicks, 0);
  return [
    { name: "In-App",     color: "#3b82f6", clicks: Math.round(totalC * 0.38), visits: Math.round(totalV * 0.32) },
    { name: "Browser",    color: "#22c55e", clicks: Math.round(totalC * 0.29), visits: Math.round(totalV * 0.30) },
    { name: "Google",     color: "#f59e0b", clicks: Math.round(totalC * 0.21), visits: Math.round(totalV * 0.24) },
    { name: "Non-Google", color: "#ef4444", clicks: Math.round(totalC * 0.12), visits: Math.round(totalV * 0.14) },
  ];
}

// ── Fraud score from real block rate ─────────────────────────────────────────
function buildFraudScore() {
  const s = dayTotal(0);
  const suspect = Math.round(s.clean * 0.15);
  const clean   = s.clean - suspect;
  return { clean, suspect, blocked: s.blocked };
}

// ── Pre-compute stable values ─────────────────────────────────────────────────
const HOURLY_DATA   = buildHourlyData();
const BLOCK_REASONS = buildBlockReasons();
const CHANNEL_DATA  = buildChannelData();
const FRAUD_SCORE   = buildFraudScore();

const RANGE_LABELS = {
  "1d":  "Today · hourly",
  "7d":  "Last 7 days",
  "30d": "Last 30 days",
};

const INFO_TIPS = {
  "Clear":        "Transactions that passed all fraud checks.",
  "Clear ratio":  "Percentage of total transactions that were cleared.",
  "Clicked":      "Total click events recorded in the period.",
  "CTR":          "Click-through rate: clicks divided by visits.",
  "Total":        "All transactions processed in the period.",
};

// ── KPI sparkline: today (solid) vs yesterday (dashed) ───────────────────────
function KpiSparkline({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={56}>
      <LineChart data={data} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
        <Line type="monotone" dataKey="prev" stroke="#cbd5e1" strokeWidth={1.2}
          dot={false} strokeDasharray="3 3" />
        <Line type="monotone" dataKey="curr" stroke={color} strokeWidth={2}
          dot={false} activeDot={{ r: 3, fill: color, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ card, onClick }) {
  const [tipOpen, setTipOpen] = useState(false);
  const up = card.change > 0;
  return (
    <div className="ov2-kpi-card" onClick={onClick}>
      <div className="ov2-kpi-accent" style={{ "--c": card.color }} />
      <div className="ov2-kpi-top">
        <span className="ov2-kpi-label">{card.label}</span>
        <div className="ov2-kpi-info" onClick={(e) => { e.stopPropagation(); setTipOpen(t => !t); }}>
          <InfoIcon size={12} />
          {tipOpen && <div className="ov2-kpi-tip">{INFO_TIPS[card.label]}</div>}
        </div>
      </div>
      <div className="ov2-kpi-value" style={{ "--c": card.color }}>{card.value}</div>
      <div className="ov2-kpi-compare">
        <span className="ov2-kpi-prev-lbl">Yesterday</span>
        <span className="ov2-kpi-prev-val">{card.prevValue}</span>
        <span className={`ov2-kpi-badge${up ? " up" : " dn"}`}>
          {up ? <ChevronUpIcon size={9} /> : <ChevronDownIcon size={9} />}
          {up ? "+" : ""}{card.change}{card.pp ? "pp" : "%"}
        </span>
      </div>
      <div className="ov2-kpi-chart-wrap">
        <KpiSparkline data={card.data} color={card.color} />
        <div className="ov2-kpi-spark-legend">
          <span className="ov2-kpi-spark-today">— Today</span>
          <span className="ov2-kpi-spark-yest">- - Yesterday</span>
        </div>
      </div>
    </div>
  );
}

// ── Area chart tooltip ────────────────────────────────────────────────────────
function AreaTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ov2-tooltip">
      <div className="ov2-tooltip-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="ov2-tooltip-row">
          <span className="ov2-tooltip-dot" style={{ "--c": p.color }} />
          <span className="ov2-tooltip-key">{p.name}</span>
          <span className="ov2-tooltip-val">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Block donut (pure SVG) — uses partner data so stays in Overview ───────────
function BlockDonut({ data, filterScale }) {
  const R = 48, cx = 60, cy = 60, sw = 11;
  const circ = 2 * Math.PI * R;
  const total = data.reduce((s, d) => s + d.value, 0);
  let cum = 0;
  const todayBlocked = ALL_PARTNERS.reduce((acc, p) => acc + getDayStats(p, 0).blocked, 0);
  const totalBlocks = Math.round(todayBlocked * filterScale);
  return (
    <div className="ov2-donut-wrap">
      <div className="ov2-donut-chart">
        <svg viewBox="0 0 120 120" className="ov2-donut-svg">
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--bg-subtle)" strokeWidth={sw} />
          {data.map((d) => {
            const frac = d.value / total;
            const dash = Math.max(0, frac * circ - 2);
            const rot  = cum * 360 - 90;
            cum += frac;
            return (
              <circle key={d.name} cx={cx} cy={cy} r={R}
                fill="none" stroke={d.color} strokeWidth={sw}
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy}px` }} />
            );
          })}
          <text x={cx} y={cy - 5} textAnchor="middle" className="ov2-donut-num">
            {(totalBlocks / 1000).toFixed(0)}K
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" className="ov2-donut-sub">blocks</text>
        </svg>
      </div>
      <div className="ov2-donut-legend">
        {data.map(d => (
          <div key={d.name} className="ov2-donut-row">
            <span className="ov2-donut-dot" style={{ "--c": d.color }} />
            <span className="ov2-donut-name">{d.name}</span>
            <span className="ov2-donut-bar-wrap">
              <span className="ov2-donut-bar" style={{ "--w": `${d.value}%`, "--c": d.color }} />
            </span>
            <span className="ov2-donut-pct">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function PageOverview({
  service, setPage, role = "admin",
  initialFilter = null, filterType = null,
}) {
  const isAdmin = role === "admin";
  const [modal,       setModal]       = useState(null);
  const [selectedBar, setSelectedBar] = useState(initialFilter ?? null);
  const [rangeTab,    setRangeTab]    = useState("1d");
  const [seriesVis,   setSeriesVis]   = useState({ clean: true, blocked: true, visits: false });

  const open  = (title) => setModal(title);
  const close = () => setModal(null);
  const handleBarFilter = useCallback((name) => setSelectedBar(name), []);

  // Real filter scale using trafficService
  const partnerData = useMemo(() => buildPartnerData(1, ALL_PARTNERS), []);
  const filterScale = useMemo(
    () => getFilterScale(selectedBar, partnerData),
    [selectedBar, partnerData],
  );

  // KPI cards and volume data from real data, reactive to range tab
  const kpiCards = useMemo(() => buildKpiData(rangeTab), [rangeTab]);
  const chartData = useMemo(() => {
    const raw = buildVolumeData(rangeTab);
    return raw.map(d => ({
      ...d,
      clean:   Math.round(d.clean   * filterScale),
      blocked: Math.round(d.blocked * filterScale),
      visits:  Math.round(d.visits  * filterScale),
    }));
  }, [rangeTab, filterScale]);

  const TICK = { className: "ov2-axis-tick" };

  return (
    <div className="ov2-page">

      {/* ── Per-service drill-in header ── */}
      {service && (
        <div className="ov-service-header">
          <button className="ov-back-btn" onClick={() => setPage && setPage("services")}>
            <BackArrowIcon size={16} /> Back to Services
          </button>
          <div className="ov-service-meta">
            <span className="ov-service-id">{service.serviceId}</span>
            <span className="ov-service-status" style={{ "--c": service.status === "active" ? "#16a34a" : "#f59e0b" }}>
              {service.status?.toUpperCase()}
            </span>
          </div>
          <h2 className="ov-service-name">{service.name}</h2>
          <div className="ov-service-tags">
            {service.client    && service.client    !== "--" && <span className="ov-service-tag">Client: {service.client}</span>}
            {service.mno       && service.mno       !== "--" && <span className="ov-service-tag">MNO: {service.mno}</span>}
            {service.shieldMode&& service.shieldMode!== "--" && <span className="ov-service-tag">Shield: {service.shieldMode}</span>}
            {service.vsBrand   && service.vsBrand   !== "--" && <span className="ov-service-tag">VS Brand: {service.vsBrand}</span>}
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="ov2-page-header">
        <div>
          <h1 className="ov2-page-title">Overview</h1>
          <div className="ov2-page-sub">Real-time transaction intelligence</div>
        </div>
        <div className="ov2-range-tabs">
          {["1d","7d","30d"].map(r => (
            <button key={r}
              className={`ov2-range-tab${rangeTab === r ? " active" : ""}`}
              onClick={() => setRangeTab(r)}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="ov2-kpi-row">
        {kpiCards.map(card => (
          <KpiCard key={card.label} card={card}
            onClick={() => open(`${card.label} — Transactions`)} />
        ))}
      </div>

      {/* ── Partners / Services traffic ── */}
      {isAdmin ? (
        <PartnersTrafficChart days={1} onPartnerFilter={handleBarFilter}
          initialName={filterType === "client" ? initialFilter : null} />
      ) : (
        <ServicesTrafficChart days={1} onServiceFilter={handleBarFilter}
          initialName={filterType === "service" ? initialFilter : null} />
      )}

      {/* ── Filter banner ── */}
      {selectedBar && (
        <div className="ovb-filter-banner">
          <FilterIcon size={14} />
          <span>
            Showing data for <strong>{selectedBar}</strong> —{" "}
            {filterType === "client" ? "client filter active"
              : filterType === "service" ? "service filter active"
              : isAdmin ? "partner filter active" : "service filter active"}
          </span>
          <button className="ovb-banner-clear" onClick={() => setSelectedBar(null)}>Clear filter ✕</button>
        </div>
      )}

      {/* ── Row 1: Volume chart + side col ── */}
      <div className="ov2-top-row">
        <Card className="ov2-card-volume">
          <div className="ov2-card-header">
            <div>
              <div className="ov2-card-title">Transaction Volume</div>
              <div className="ov2-card-sub">{RANGE_LABELS[rangeTab]}</div>
            </div>
            <div className="ov2-series-btns">
              {[
                { key: "clean",   label: "Clean",   color: "#22c55e" },
                { key: "blocked", label: "Blocked",  color: "#ef4444" },
                { key: "visits",  label: "Visits",   color: "#3b82f6" },
              ].map(s => (
                <button key={s.key}
                  className={`ov2-series-btn${seriesVis[s.key] ? " on" : ""}`}
                  style={{ "--c": s.color }}
                  onClick={() => setSeriesVis(v => ({ ...v, [s.key]: !v[s.key] }))}
                >
                  <span className="ov2-series-dot"
                    style={{ "--c": seriesVis[s.key] ? s.color : "#cbd5e1" }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="ov2-chart-click" onClick={() => open("Volume — Transactions")}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
                  <defs>
                    <linearGradient id="ov2gC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  className="ov2-grad-clean-start" />
                      <stop offset="95%" className="ov2-grad-clean-end" />
                    </linearGradient>
                    <linearGradient id="ov2gB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  className="ov2-grad-blocked-start" />
                      <stop offset="95%" className="ov2-grad-blocked-end" />
                    </linearGradient>
                    <linearGradient id="ov2gV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  className="ov2-grad-visits-start" />
                      <stop offset="95%" className="ov2-grad-visits-end" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="ov2-chart-grid" vertical={false} />
                  <XAxis dataKey="d" tick={TICK} axisLine={false} tickLine={false} height={18} />
                  <YAxis tick={TICK} axisLine={false} tickLine={false} width={34}
                    domain={[0, 'dataMax']}
                    tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                  <Tooltip content={<AreaTip />} />
                  {seriesVis.visits  && <Area type="monotone" dataKey="visits"  name="Visits"  className="ov2-area-visits"  fill="url(#ov2gV)" dot={false} />}
                  {seriesVis.clean   && <Area type="monotone" dataKey="clean"   name="Clean"   className="ov2-area-clean"   fill="url(#ov2gC)" dot={false} />}
                  {seriesVis.blocked && <Area type="monotone" dataKey="blocked" name="Blocked" className="ov2-area-blocked" fill="url(#ov2gB)" dot={false} />}
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </Card>

        <div className="ov2-side-col">
          <Card>
            <div className="ov2-card-header">
              <div>
                <div className="ov2-card-title">Hourly Density</div>
                <div className="ov2-card-sub">Transactions by hour</div>
              </div>
            </div>
            <HeatmapBar data={HOURLY_DATA} />
          </Card>
          <Card>
            <div className="ov2-card-header">
              <div className="ov2-card-title">Fraud Score</div>
            </div>
            <ScoreGauge clean={FRAUD_SCORE.clean} suspect={FRAUD_SCORE.suspect} blocked={FRAUD_SCORE.blocked} />
          </Card>
        </div>
      </div>

      {/* ── Row 2: Block pattern + right col ── */}
      <div className="ov2-row-bottom">
        <Card className="ov2-radar-card">
          <div className="ov2-card-header">
            <div>
              <div className="ov2-card-title">Block Pattern</div>
              <div className="ov2-card-sub">Weekly threat distribution by day</div>
            </div>
            <span className="ov2-radar-badge">7-day radar</span>
          </div>
          <BlockRadarChart height={320} showBadge={false}
            onDayClick={(day) => open(`${day} Block Pattern — Transactions`)} />
        </Card>

        <div className="ov2-bottom-right">
          <Card>
            <div className="ov2-card-header">
              <div className="ov2-card-title">Channels</div>
              <span className="ov2-card-sub">CTR by source</span>
            </div>
            <ChannelRows data={CHANNEL_DATA} filterScale={filterScale} onOpen={open} />
          </Card>
          <Card>
            <div className="ov2-card-header">
              <div className="ov2-card-title">Block Reasons</div>
              <span className="ov2-card-sub">This week</span>
            </div>
            <BlockDonut data={BLOCK_REASONS} filterScale={filterScale} />
          </Card>
        </div>
      </div>

      {modal && <TransactionsModal title={modal} onClose={close} role={role} setPage={setPage} />}
    </div>
  );
}