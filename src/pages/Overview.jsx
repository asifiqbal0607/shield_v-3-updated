import { useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

import { Card, SectionTitle } from "../components/ui";
import { ChartTooltip } from "../components/charts";
import { TransactionsModal } from "../components/modals";
import { TaperedGauge, TinyDonut, BlockRadarChart } from "../components/charts";
import { BLUE, GREEN, AMBER, SLATE } from "../components/constants/colors";
import {
  BackArrowIcon,
  InfoIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FilterIcon,
} from "../components/ui/Icons";
import { histogramData } from "../data/charts";
import { channelCards } from "../data/tables";
import ServicesTrafficChart from "../components/charts/ServicesTrafficChart";
import PartnersTrafficChart from "../components/charts/PartnersTrafficChart";

const SERIES = [
  { key: "visits", color: GREEN },
  { key: "clicks", color: AMBER },
  { key: "subs", color: BLUE },
];

const CHART_TICK = { fontSize: 9, fill: "#cbd5e1" };
const CHART_MARGIN = { top: 5, right: 5, bottom: 0, left: -30 };

// ── deterministic pseudo-random (no Math.random so data is stable) ─────────
function makeSparkData(base, variance, points = 60, trend = 0) {
  let seed = base + 1;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const currArr = Array.from({ length: points }, (_, i) => {
    const trendBias = (trend / 100) * variance * 0.8 * (i / (points - 1));
    const noise = (rand() - 0.5) * variance;
    const wave = Math.sin(i * 0.35) * variance * 0.3;
    return Math.max(base * 0.05, base + trendBias + noise + wave);
  });
  const offset = Math.sign(trend || -1) * variance * 0.55;
  const prevArr = Array.from({ length: points }, (_, i) => {
    const noise = (rand() - 0.5) * variance * 0.75;
    const wave = Math.sin(i * 0.35 + 1.5) * variance * 0.25;
    return Math.max(base * 0.05, base - offset + noise + wave);
  });
  return Array.from({ length: points }, (_, i) => ({
    i,
    curr: currArr[i],
    prev: prevArr[i],
  }));
}

const KPI_CARDS = [
  {
    label: "Clear",
    value: "3.1K",
    change: -5.1,
    desc: "168 fewer cleared transactions than the previous period.",
    data: makeSparkData(3100, 520, 60, -5.1),
  },
  {
    label: "Clear ratio",
    value: "72%",
    change: -7.2,
    pp: true,
    desc: "Cleared ratio is 7.2 percentage points lower than the previous period.",
    data: makeSparkData(72, 10, 60, -7.2),
  },
  {
    label: "Clicked",
    value: "4.4K",
    change: +4.5,
    desc: "187 more clicked transactions than the previous period.",
    data: makeSparkData(4400, 680, 60, 4.5),
  },
  {
    label: "Clicked ratio",
    value: "13.3%",
    change: +8.7,
    pp: true,
    desc: "Clicked ratio is 8.7 percentage points higher than the previous period.",
    data: makeSparkData(13.3, 3.2, 60, 8.7),
  },
  {
    label: "Total",
    value: "32.7K",
    change: -64.1,
    desc: "58.6K fewer total transactions than the previous period.",
    data: makeSparkData(32700, 4200, 60, -64.1),
  },
];

const INFO_TIPS = {
  Clear: "Transactions that passed all checks in the selected period.",
  "Clear ratio": "Percentage of total transactions that were cleared.",
  Clicked: "Total click events recorded in the selected period.",
  "Clicked ratio": "Percentage of visits that resulted in a click.",
  Total: "All transactions processed in the selected period.",
};

// ── KPI sparkline ─────────────────────────────────────────────────────────
function KpiSparkline({ data, up }) {
  const strokeColor = up ? "#16a34a" : "#2563eb";
  return (
    <ResponsiveContainer width="100%" height={64}>
      <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line
          type="monotone"
          dataKey="prev"
          stroke="#e2e8f0"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="4 3"
        />
        <Line
          type="monotone"
          dataKey="curr"
          stroke={strokeColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: strokeColor, strokeWidth: 0 }}
        />
        <Tooltip
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="kpi-tt">
                <div className="kpi-tt-row">
                  <span className="kpi-tt-dot kpi-tt-dot--prev" />
                  <span>Prev</span>
                  <span className="kpi-tt-num">
                    {Math.round(payload[0]?.value ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="kpi-tt-row">
                  <span
                    className="kpi-tt-dot"
                    style={{ "--c": strokeColor }}
                  />
                  <span>Curr</span>
                  <span className="kpi-tt-num kpi-tt-num--curr">
                    {Math.round(payload[1]?.value ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function KpiSparkCard({ card, onClick }) {
  const [tipOpen, setTipOpen] = useState(false);
  const up = card.change > 0;
  const changeColor = up ? "#16a34a" : "#dc2626";
  return (
    <div className="kpi-card" onClick={onClick}>
      <div className="kpi-card-top">
        <span className="kpi-card-label">{card.label}</span>
        <div
          className="kpi-card-info"
          onClick={(e) => {
            e.stopPropagation();
            setTipOpen((t) => !t);
          }}
        >
          <InfoIcon size={13} />
          {tipOpen && (
            <div className="kpi-card-tip">{INFO_TIPS[card.label]}</div>
          )}
        </div>
      </div>
      <div className="kpi-card-value">{card.value}</div>
      <div className="kpi-card-change" style={{ "--c": changeColor }}>
        {up ? <ChevronUpIcon size={11} /> : <ChevronDownIcon size={11} />}
        <span>
          {up ? "+" : ""}
          {card.change}
          {card.pp ? "pp" : "%"}
        </span>
        <span className="kpi-card-change-sep">·</span>
        <span className="kpi-card-change-desc">{card.desc}</span>
      </div>
      <div className="kpi-card-chart">
        <KpiSparkline data={card.data} up={up} />
      </div>
    </div>
  );
}

function KpiSparkRow({ onOpen }) {
  return (
    <div className="kpi-spark-row">
      {KPI_CARDS.map((card) => (
        <KpiSparkCard
          key={card.label}
          card={card}
          onClick={() => onOpen(`${card.label} — Transactions`)}
        />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function PageOverview({ service, setPage, role = "admin" }) {
  const isAdmin = role === "admin";

  const [active, setActive] = useState({
    visits: true,
    clicks: true,
    subs: true,
  });
  const toggle = (k) => setActive((prev) => ({ ...prev, [k]: !prev[k] }));
  const [modal, setModal] = useState(null);
  const open = (title) => setModal(title);
  const close = () => setModal(null);

  // ── selected bar (partner or service name, null = all) ─────────────────
  const [selectedBar, setSelectedBar] = useState(null);
  const handleBarFilter = useCallback((name) => setSelectedBar(name), []);

  // ── filter multiplier for charts below ───────────────────────────────────
  const filterScale = useMemo(() => {
    if (!selectedBar) return 1;
    return (
      0.15 +
      Math.abs(
        selectedBar.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 70,
      ) /
        100
    );
  }, [selectedBar]);

  // ── filtered histogram data ────────────────────────────────────────────
  const filteredHistogram = useMemo(
    () =>
      histogramData.map((d) => ({
        ...d,
        visits: Math.round(d.visits * filterScale),
        clicks: Math.round(d.clicks * filterScale),
        subs: Math.round(d.subs * filterScale),
      })),
    [filterScale],
  );

  // ── filter label for section heading ──────────────────────────────────
  const filterLabel = selectedBar;

  return (
    <div>
      {/* ── Per-service header (drilled in from Services page) ── */}
      {service && (
        <div className="ov-service-header">
          <button
            className="ov-back-btn"
            onClick={() => setPage && setPage("services")}
          >
            <BackArrowIcon size={16} />
            Back to Services
          </button>
          <div className="ov-service-meta">
            <span className="ov-service-id">{service.serviceId}</span>
            <span
              className="ov-service-status"
              style={{
                "--c": service.status === "active" ? "#16a34a" : "#f59e0b",
              }}
            >
              {service.status?.toUpperCase()}
            </span>
          </div>
          <h2 className="ov-service-name">{service.name}</h2>
          <div className="ov-service-tags">
            {service.client && service.client !== "--" && (
              <span className="ov-service-tag">Client: {service.client}</span>
            )}
            {service.mno && service.mno !== "--" && (
              <span className="ov-service-tag">MNO: {service.mno}</span>
            )}
            {service.shieldMode && service.shieldMode !== "--" && (
              <span className="ov-service-tag">
                Shield: {service.shieldMode}
              </span>
            )}
            {service.vsBrand && service.vsBrand !== "--" && (
              <span className="ov-service-tag">
                VS Brand: {service.vsBrand}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── KPI sparkline cards (always unfiltered) ── */}
      <KpiSparkRow onOpen={open} />

      {/* ── Top Partners (Admin) / Top 20 Services (Partner) bar chart ── */}
      {isAdmin ? (
        <PartnersTrafficChart days={1} onPartnerFilter={handleBarFilter} />
      ) : (
        <ServicesTrafficChart days={1} onServiceFilter={handleBarFilter} />
      )}

      {/* ── section filter banner (when something is selected) ── */}
      {selectedBar && (
        <div className="ovb-filter-banner">
          <FilterIcon size={14} />
          <span>
            Showing data for <strong>{selectedBar}</strong> —{" "}
            {isAdmin ? "partner" : "service"} filter active
          </span>
          <button
            className="ovb-banner-clear"
            onClick={() => setSelectedBar(null)}
          >
            Clear filter ✕
          </button>
        </div>
      )}

      {/* ── Visits, Clicks & Subscriptions ── */}
      <Card className="p-md mb-section">
        <div className="ov-chart-header">
          <div className="ov-chart-title-wrap">
            <span className="txt-label">
              Visits, Clicks &amp; Subscriptions
            </span>
            {filterLabel && (
              <span className="ovb-chart-filter-tag">{selectedBar}</span>
            )}
          </div>
          <div className="f-gap-6">
            {SERIES.map(({ key, color }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="ov-series-btn"
                style={{
                  "--bg": active[key] ? `${color}18` : "#f1f5f9",
                  "--tx": active[key] ? color : SLATE,
                  "--ol": active[key] ? `1.5px solid ${color}` : "none",
                }}
              >
                <span
                  className="ov-series-dot"
                  style={{ "--c": active[key] ? color : "#cbd5e1" }}
                />
                {key[0].toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div
          onClick={() => open("Visits, Clicks & Subscriptions — Transactions")}
          className="ov-clickable"
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={filteredHistogram} margin={CHART_MARGIN}>
              <XAxis
                dataKey="x"
                tick={CHART_TICK}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Brush
                dataKey="x"
                height={28}
                fill="#f8fafc"
                travellerWidth={8}
                stroke="#cbd5e1"
                tickFormatter={(v) => `${v}`}
              />
              {active.visits && (
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke={GREEN}
                  strokeWidth={2.5}
                  dot={false}
                  name="Visits"
                />
              )}
              {active.clicks && (
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke={AMBER}
                  strokeWidth={1.5}
                  dot={false}
                  name="Clicks"
                />
              )}
              {active.subs && (
                <Line
                  type="monotone"
                  dataKey="subs"
                  stroke={BLUE}
                  strokeWidth={1.5}
                  dot={false}
                  name="Subs"
                  strokeDasharray="4 2"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── Row 2: Block Reasons radar + channel donuts ── */}
      <div className="ov-row2">
        {/* Radar card */}
        <Card className="card-lg">
          <SectionTitle>
            Block Reasons — Past Week
            {filterLabel && (
              <span className="ovb-chart-filter-tag ovb-chart-filter-tag--sm">
                {selectedBar}
              </span>
            )}
          </SectionTitle>
          <div className="ov-radar-wrap">
            <div className="ov-side-stats">
              <div
                className="stat-bg"
                style={{ "--c": "#1d4ed8" }}
                onClick={() => open("Overall Blocks — Transactions")}
              >
                <div className="ov-overall-label">Overall</div>
                <div className="ov-overall-num">
                  {Math.round(1511786 * filterScale).toLocaleString()}
                </div>
                <div className="ov-overall-link">View Transactions ↗</div>
              </div>
              {[
                ["Apps", Math.round(226767 * filterScale), "#22c55e"],
                ["Browsing", Math.round(226767 * filterScale), "#f59e0b"],
                ["In-App", Math.round(189034 * filterScale), "#1d4ed8"],
              ].map(([l, v, col]) => (
                <div
                  key={l}
                  className="bl-stat"
                  style={{ "--c": col }}
                  onClick={() => open(`${l} — Transactions`)}
                >
                  <div className="ov-stat-label">{l}</div>
                  <div className="ov-stat-num">{v.toLocaleString()}</div>
                  <div className="ov-stat-link">View Transactions ↗</div>
                </div>
              ))}
            </div>
            <div className="ov-radar-expand">
              <BlockRadarChart
                height={420}
                showBadge={false}
                onDayClick={(day) =>
                  open(`${day} Block Pattern — Transactions`)
                }
              />
            </div>
          </div>
        </Card>

        {/* Channel cards — 2×2 grid */}
        <div className="ov-channel-grid">
          {channelCards.map((c, i) => (
            <Card key={i} className="ov-channel-card">
              <div
                className="ov-channel-title dyn-border-bottom"
                style={{ "--c": c.color }}
                onClick={() => open(`${c.name} — Transactions`)}
              >
                {c.name}
                <span className="ov-channel-title-arrow">↗</span>
              </div>
              <div className="ov-channel-body">
                <div>
                  <div
                    className="ov-metric-item"
                    onClick={() => open(`${c.name} Clicks — Transactions`)}
                  >
                    <div className="ov-metric-label">Clicks</div>
                    <div className="ov-metric-num-clicks">
                      {Math.round(c.clicks * filterScale).toLocaleString()}
                    </div>
                    <div className="ov-metric-link">View Transactions ↗</div>
                  </div>
                  <div
                    className="ov-metric-item"
                    onClick={() => open(`${c.name} Visits — Transactions`)}
                  >
                    <div className="ov-metric-label">Visits</div>
                    <div className="ov-metric-num-visits">
                      {Math.round(c.visits * filterScale).toLocaleString()}
                    </div>
                    <div className="ov-metric-link">View Transactions ↗</div>
                  </div>
                </div>
                <TinyDonut
                  clicks={Math.round(c.clicks * filterScale)}
                  visits={Math.round(c.visits * filterScale)}
                  color={c.color}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {modal && <TransactionsModal title={modal} onClose={close} role={role} />}
    </div>
  );
}