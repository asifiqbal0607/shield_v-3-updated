import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip,
} from "recharts";
import { Card, SectionTitle } from "../components/ui";
import { BLUE, GREEN, AMBER, ROSE } from "../components/constants/colors";

const VIOLET = "#7c3aed";
const CYAN   = "#0891b2";

const TREND_DATA = [
  { d:"Jan", google:24100, facebook:18200, instagram:11400, tiktok:9800,  x:4200, snapchat:3100 },
  { d:"Feb", google:25800, facebook:19400, instagram:12800, tiktok:11200, x:4600, snapchat:3400 },
  { d:"Mar", google:27400, facebook:22100, instagram:14200, tiktok:13600, x:5100, snapchat:3800 },
  { d:"Apr", google:26200, facebook:20800, instagram:13400, tiktok:12400, x:4800, snapchat:3600 },
  { d:"May", google:29800, facebook:24600, instagram:15900, tiktok:15800, x:5600, snapchat:4200 },
  { d:"Jun", google:32400, facebook:27200, instagram:17400, tiktok:18200, x:6200, snapchat:4800 },
  { d:"Jul", google:31100, facebook:25800, instagram:16600, tiktok:17100, x:5900, snapchat:4500 },
  { d:"Aug", google:34800, facebook:29400, instagram:18200, tiktok:20600, x:6800, snapchat:5200 },
  { d:"Sep", google:37600, facebook:32100, instagram:18900, tiktok:23400, x:8200, snapchat:6100 },
];

const CONV_DATA = [
  { d:"Jan", google:5.2, facebook:3.8, instagram:4.2, tiktok:2.4, x:2.9, snapchat:2.6 },
  { d:"Feb", google:5.6, facebook:4.1, instagram:4.5, tiktok:2.7, x:3.1, snapchat:2.8 },
  { d:"Mar", google:5.9, facebook:4.4, instagram:4.8, tiktok:3.1, x:3.3, snapchat:3.0 },
  { d:"Apr", google:5.7, facebook:4.2, instagram:4.6, tiktok:2.9, x:3.2, snapchat:2.9 },
  { d:"May", google:6.2, facebook:4.7, instagram:5.0, tiktok:3.4, x:3.5, snapchat:3.2 },
  { d:"Jun", google:6.6, facebook:5.1, instagram:5.3, tiktok:3.8, x:3.7, snapchat:3.4 },
  { d:"Jul", google:6.4, facebook:4.9, instagram:5.1, tiktok:3.6, x:3.6, snapchat:3.3 },
  { d:"Aug", google:6.8, facebook:5.3, instagram:5.5, tiktok:4.0, x:3.8, snapchat:3.5 },
  { d:"Sep", google:7.2, facebook:5.7, instagram:5.0, tiktok:4.4, x:3.8, snapchat:3.5 },
];

const SOURCES = [
  {
    id:"SRC-001", name:"Google Ads",       icon:"G", color:"#4285f4",
    identifier:"gclid", identifierLabel:"gclid param",
    visits:42800, clicks:37600, conversions:2462, convRate:7.2,
    revenue:"$74,100", revShare:30, avgSession:"3m 22s",
    bounce:32, status:"active", trend:"+19%", trendUp:true,
    topCountry:"KE", topDevice:"Desktop",
    domains:["google.com","googleadservices.com"],
  },
  {
    id:"SRC-002", name:"Facebook",         icon:"F", color:"#1877f2",
    identifier:"fbclid", identifierLabel:"fbclid param",
    visits:38600, clicks:32100, conversions:1621, convRate:5.7,
    revenue:"$58,400", revShare:24, avgSession:"2m 48s",
    bounce:41, status:"active", trend:"+14%", trendUp:true,
    topCountry:"IQ", topDevice:"Mobile",
    domains:["facebook.com","m.facebook.com"],
  },
  {
    id:"SRC-003", name:"Instagram",        icon:"I", color:"#e1306c",
    identifier:"fbclid", identifierLabel:"fbclid param",
    visits:22400, clicks:18900, conversions:820, convRate:5.0,
    revenue:"$34,800", revShare:14, avgSession:"2m 12s",
    bounce:46, status:"active", trend:"+24%", trendUp:true,
    topCountry:"NG", topDevice:"Mobile",
    domains:["instagram.com","l.instagram.com"],
  },
  {
    id:"SRC-004", name:"TikTok",           icon:"T", color:"#ff0050",
    identifier:"ttclid", identifierLabel:"ttclid param",
    visits:28100, clicks:23400, conversions:915, convRate:4.4,
    revenue:"$31,200", revShare:13, avgSession:"1m 38s",
    bounce:54, status:"active", trend:"+38%", trendUp:true,
    topCountry:"NG", topDevice:"Mobile",
    domains:["tiktok.com","vm.tiktok.com"],
  },
  {
    id:"SRC-005", name:"X (Twitter)",      icon:"X", color:"#14171a",
    identifier:"twclid", identifierLabel:"twclid param",
    visits:10800, clicks:8200, conversions:281, convRate:3.8,
    revenue:"$9,600", revShare:4, avgSession:"1m 44s",
    bounce:57, status:"active", trend:"+5%", trendUp:true,
    topCountry:"SD", topDevice:"Mobile",
    domains:["t.co","twitter.com","x.com"],
  },
  {
    id:"SRC-006", name:"Snapchat",         icon:"S", color:"#f7c948",
    identifier:"ScCid", identifierLabel:"ScCid param",
    visits:7900, clicks:6100, conversions:196, convRate:3.5,
    revenue:"$7,200", revShare:3, avgSession:"1m 02s",
    bounce:61, status:"active", trend:"+11%", trendUp:true,
    topCountry:"SA", topDevice:"Mobile",
    domains:["snapchat.com"],
  },
  {
    id:"SRC-010", name:"Direct / Unknown", icon:"D", color:VIOLET,
    identifier:"no param", identifierLabel:"No identifier",
    visits:9200, clicks:6700, conversions:321, convRate:4.8,
    revenue:"$12,900", revShare:5, avgSession:"3m 08s",
    bounce:34, status:"active", trend:"+3%", trendUp:true,
    topCountry:"AE", topDevice:"Desktop",
    domains:["--"],
  },
];

const SERIES = [
  { key:"google",    label:"Google",    color:"#4285f4" },
  { key:"facebook",  label:"Facebook",  color:"#1877f2" },
  { key:"instagram", label:"Instagram", color:"#e1306c" },
  { key:"tiktok",    label:"TikTok",    color:"#ff0050" },
  { key:"x",         label:"X",         color:"#14171a" },
  { key:"snapchat",  label:"Snapchat",  color:"#f7c948" },
];

const STATUS_STYLE = {
  active:         { bg:"#dcfce7", c:"#15803d" },
  needsattention: { bg:"#fef3c7", c:"#92400e" },
  inactive:       { bg:"#fee2e2", c:"#991b1b" },
};

const CHART_TICK = { fontSize:10, fill:"#94a3b8" };
const CHART_TT   = { fontSize:11, borderRadius:8, border:"none", background:"#0f172a", color:"#fff" };

function SourceAvatar({ src, size }) {
  const s = size || 38;
  return (
    <div style={{
      width:s, height:s, borderRadius: Math.round(s * 0.28),
      background: src.color + "18",
      border: "1.5px solid " + src.color + "35",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: Math.round(s * 0.38), fontWeight:800, color:src.color, flexShrink:0,
    }}>
      {src.icon}
    </div>
  );
}

function TrendBadge({ trend, trendUp }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      fontSize:11, fontWeight:700,
      color: trendUp ? "#16a34a" : "#dc2626",
      background: trendUp ? "#f0fdf4" : "#fef2f2",
      border: "1px solid " + (trendUp ? "#bbf7d0" : "#fecaca"),
      padding:"2px 8px", borderRadius:20, whiteSpace:"nowrap",
    }}>
      {trendUp ? "+" : ""}{trend}
    </span>
  );
}

function MiniBar({ value, max, color }) {
  return (
    <div style={{ height:3, background:"#f1f5f9", borderRadius:99, overflow:"hidden", flex:1 }}>
      <div style={{
        height:"100%", width: Math.min((value / max) * 100, 100) + "%",
        background: color, borderRadius:99,
      }} />
    </div>
  );
}

function IdTag({ value }) {
  return (
    <span style={{
      fontSize:10, fontFamily:"monospace", fontWeight:600,
      color:"#0891b2", background:"#e0f2fe",
      padding:"2px 7px", borderRadius:4, whiteSpace:"nowrap",
    }}>{value}</span>
  );
}

function BarChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const src = payload[0].payload;
  return (
    <div style={{
      background:"#0f172a", borderRadius:10, padding:"12px 16px",
      border:"1px solid #1e293b", minWidth:170,
      boxShadow:"0 8px 32px rgba(0,0,0,.4)",
    }}>
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        marginBottom:10, paddingBottom:8, borderBottom:"1px solid #1e293b",
      }}>
        <div style={{ width:10, height:10, borderRadius:3, background:src.color }} />
        <span style={{ fontSize:13, fontWeight:700, color:"#f1f5f9" }}>{src.name}</span>
      </div>
      {[
        { label:"Visits",     value: src.visits.toLocaleString(),  color:"#4ade80" },
        { label:"Clicks",     value: src.clicks.toLocaleString(),  color: src.color },
        { label:"Conv. Rate", value: src.convRate + "%",            color:"#fbbf24" },
      ].map((r) => (
        <div key={r.label} style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          gap:20, marginBottom:4,
        }}>
          <span style={{ fontSize:11, color:"#94a3b8" }}>{r.label}</span>
          <span style={{ fontSize:12, fontWeight:700, color:r.color }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function SourceModal({ source, onClose }) {
  if (!source) return null;
  const st = STATUS_STYLE[source.status] || STATUS_STYLE.active;
  return (
    <div className="partner-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="partner-box" style={{ maxWidth:520 }}>
        <div className="partner-modal-header" style={{
          background:"linear-gradient(135deg, #0a1628 0%, " + source.color + "44 100%)",
        }}>
          <div className="f-gap-14">
            <SourceAvatar src={source} size={46} />
            <div>
              <div className="txt-white-hd">{source.name}</div>
              <div className="txt-white-sub">{source.id} - Traffic Source</div>
            </div>
          </div>
          <button className="partner-modal-close" onClick={onClose}>x</button>
        </div>
        <div className="p-section">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
            {[
              { label:"Visits",      value: source.visits.toLocaleString(),      color:"#16a34a" },
              { label:"Clicks",      value: source.clicks.toLocaleString(),      color: source.color },
              { label:"Conversions", value: source.conversions.toLocaleString(), color: AMBER },
              { label:"Conv. Rate",  value: source.convRate + "%",               color: VIOLET },
            ].map((k) => (
              <div key={k.label} style={{
                textAlign:"center", padding:"12px 8px",
                background:"#f8fafc", borderRadius:10, border:"1px solid #e8ecf3",
              }}>
                <div style={{ fontSize:18, fontWeight:800, color:k.color, lineHeight:1.1 }}>{k.value}</div>
                <div style={{ fontSize:10, color:"#94a3b8", marginTop:3, fontWeight:600 }}>{k.label}</div>
              </div>
            ))}
          </div>
          {[
            ["Identified By",  source.identifierLabel],
            ["Identifier",     source.identifier],
            ["Known Domains",  source.domains && source.domains.join(", ")],
            ["Revenue",        source.revenue],
            ["Revenue Share",  source.revShare + "% of total"],
            ["Avg. Session",   source.avgSession],
            ["Bounce Rate",    source.bounce + "%"],
            ["Top Country",    source.topCountry],
            ["Top Device",     source.topDevice],
            ["Status",         source.status],
            ["Trend",          source.trend],
          ].map(([label, value]) => (
            <div key={label} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"9px 0", borderBottom:"1px solid #f1f5f9",
            }}>
              <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>{label}</span>
              {label === "Status" ? (
                <span className="partner-status-badge" style={{ "--bg":st.bg, "--c":st.c }}>{value}</span>
              ) : label === "Trend" ? (
                <TrendBadge trend={value} trendUp={source.trendUp} />
              ) : (label === "Identified By" || label === "Identifier") ? (
                <IdTag value={value} />
              ) : (
                <span style={{ fontSize:12, fontWeight:600, color:"#0f172a" }}>{value}</span>
              )}
            </div>
          ))}
          <div className="ph-modal-actions">
            <button className="partner-btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Trafficsources() {
  const [tab,      setTab]      = useState("overview");
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");
  const [perPage,  setPerPage]  = useState(10);
  const [series,   setSeries]   = useState(
    Object.fromEntries(SERIES.map((s) => [s.key, true]))
  );

  function toggleSeries(key) {
    setSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const totalVisits      = SOURCES.reduce((a, r) => a + r.visits, 0);
  const totalClicks      = SOURCES.reduce((a, r) => a + r.clicks, 0);
  const totalConversions = SOURCES.reduce((a, r) => a + r.conversions, 0);
  const avgConvRate      = (SOURCES.reduce((a, r) => a + r.convRate, 0) / SOURCES.length).toFixed(1);
  const maxClicks        = Math.max(...SOURCES.map((s) => s.clicks));

  const filtered = SOURCES.filter((r) => {
    const q = search.toLowerCase();
    return (r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
      && (filter === "All" || r.status === filter);
  });
  const visible = filtered.slice(0, perPage);

  const KPI = [
    { label:"Total Visits",    value: totalVisits.toLocaleString(),      color:"#16a34a", sub:"Page landings" },
    { label:"Total Clicks",    value: totalClicks.toLocaleString(),      color:"#4285f4", sub:"Subscribe taps" },
    { label:"Conversions",     value: totalConversions.toLocaleString(), color: AMBER,    sub:"Block API called" },
    { label:"Avg. Conv. Rate", value: avgConvRate + "%",                  color: VIOLET,   sub:"Across all sources" },
  ];

  const TABS = [
    { key:"overview", label:"Overview",       color:"#4285f4" },
    { key:"trends",   label:"Trend Analysis", color: VIOLET   },
    { key:"sources",  label:"All Sources",    color:"#0d9488" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{
              width:46, height:46, borderRadius:12, flexShrink:0,
              background:"linear-gradient(135deg, #0a1628, #1e3a5f)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 14px rgba(10,22,40,.25)",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text)", letterSpacing:"-0.4px", margin:0 }}>
                Traffic Sources
              </h1>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3, fontSize:12,
                color:"var(--text-3)", fontWeight:500 }}>
                <span>{SOURCES.length} sources</span>
                <span style={{ color:"var(--border2)" }}>·</span>
                <span style={{ color:"#16a34a", fontWeight:600 }}>{SOURCES.filter((r) => r.status === "active").length} active</span>
                <span style={{ color:"var(--border2)" }}>·</span>
                <span>{totalClicks.toLocaleString()} total clicks</span>
              </div>
            </div>
          </div>
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"7px 14px", borderRadius:8,
            background:"#eff6ff", border:"1px solid #bfdbfe",
            fontSize:11, color:"#1d4ed8", fontWeight:600,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Identified via gclid / fbclid / ttclid / twclid / ScCid
          </div>
        </div>
      </div>

      {/* Tab strip */}
      <div style={{
        display:"flex", background:"var(--bg-card)",
        borderRadius:"14px 14px 0 0",
        border:"1px solid var(--border)", borderBottom:"none",
        padding:"0 18px",
      }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"13px 18px", fontSize:12,
              fontWeight: tab === t.key ? 700 : 600,
              color: tab === t.key ? t.color : "var(--text-3)",
              border:"none", background:"none",
              borderBottom: tab === t.key
                ? "2.5px solid " + t.color
                : "2.5px solid transparent",
              marginBottom:"-1px", cursor:"pointer",
              transition:"all .15s", whiteSpace:"nowrap", fontFamily:"inherit",
            }}>
            <span style={{
              width:7, height:7, borderRadius:"50%", flexShrink:0,
              background: tab === t.key ? t.color : "#cbd5e1",
              transition:"background .15s",
            }} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{
        background:"var(--bg-card)",
        border:"1px solid var(--border)",
        borderRadius:"0 0 14px 14px",
        padding:22,
      }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            {/* KPI cards */}
            <div className="g-stats4 mb-section">
              {KPI.map((k) => (
                <div key={k.label} style={{
                  background:"var(--bg-card)", borderRadius:12,
                  border:"1px solid var(--border)",
                  borderTop:"3px solid " + k.color,
                  padding:"18px 20px",
                  boxShadow:"0 1px 6px rgba(0,0,0,.05)",
                }}>
                  <div style={{ fontSize:28, fontWeight:800, color:k.color,
                    lineHeight:1, letterSpacing:"-1px" }}>{k.value}</div>
                  <div style={{ fontSize:12, color:"var(--text-2)", fontWeight:600, marginTop:6 }}>{k.label}</div>
                  <div style={{ fontSize:11, color:"var(--text-4)", marginTop:2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="g-split2 mb-section">
              <div style={{
                background:"var(--bg-card)", borderRadius:12,
                border:"1px solid var(--border)", padding:"18px 20px",
              }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:16 }}>
                  Clicks by Source
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={SOURCES} margin={{ top:4, right:8, bottom:0, left:-10 }}>
                    <XAxis dataKey="name" tick={{ ...CHART_TICK, fontSize:9 }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => v.split(" ")[0]} />
                    <YAxis tick={CHART_TICK} axisLine={false} tickLine={false}
                      tickFormatter={(v) => v >= 1000 ? (v / 1000).toFixed(0) + "k" : v} />
                    <Tooltip cursor={{ fill:"rgba(0,0,0,.04)" }} content={<BarChartTooltip />} />
                    <Bar dataKey="clicks" radius={[5, 5, 0, 0]}>
                      {SOURCES.map((s) => <Cell key={s.id} fill={s.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{
                background:"var(--bg-card)", borderRadius:12,
                border:"1px solid var(--border)", padding:"18px 20px",
              }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:16 }}>
                  Revenue Share
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <ResponsiveContainer width={130} height={130}>
                    <PieChart>
                      <Pie data={SOURCES} cx="50%" cy="50%" innerRadius={36} outerRadius={60}
                        dataKey="revShare" paddingAngle={2}>
                        {SOURCES.map((s) => <Cell key={s.id} fill={s.color} />)}
                      </Pie>
                      <Tooltip contentStyle={CHART_TT} formatter={(v) => [v + "%", "Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
                    {SOURCES.map((s) => (
                      <div key={s.id} style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ width:8, height:8, borderRadius:2, background:s.color,
                          flexShrink:0, display:"inline-block" }} />
                        <span style={{ flex:1, fontSize:11, color:"var(--text-2)", fontWeight:500,
                          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {s.name.split(" ")[0]}
                        </span>
                        <span style={{ fontSize:11, fontWeight:700, color:"var(--text)" }}>{s.revShare}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Source cards - original grid layout */}
            <div className="g-auto-md">
              {SOURCES.map((src) => {
                const st = STATUS_STYLE[src.status] || STATUS_STYLE.active;
                return (
                  <div key={src.id} className="card"
                    style={{ cursor:"pointer", transition:"box-shadow .15s" }}
                    onClick={() => setSelected(src)}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.12)"}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = ""}
                  >
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <SourceAvatar src={src} size={38} />
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{src.name}</div>
                          <div style={{ fontSize:10, color:"var(--text-4)", marginTop:1 }}>{src.id}</div>
                        </div>
                      </div>
                      <span className="partner-status-badge" style={{ "--bg":st.bg, "--c":st.c }}>
                        {src.status}
                      </span>
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                      {[
                        { label:"Clicks",    value: src.clicks.toLocaleString() },
                        { label:"Conv. %",   value: src.convRate + "%" },
                        { label:"Revenue",   value: src.revenue },
                        { label:"Bounce",    value: src.bounce + "%" },
                      ].map((k) => (
                        <div key={k.label} style={{
                          background:"var(--bg-subtle)", borderRadius:7,
                          padding:"7px 10px", border:"1px solid var(--border)",
                        }}>
                          <div style={{ fontSize:12, fontWeight:700, color:"var(--text)" }}>{k.value}</div>
                          <div style={{ fontSize:10, color:"var(--text-4)", marginTop:1 }}>{k.label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:10, color:"var(--text-4)" }}>Revenue share</span>
                      <span style={{ fontSize:11, fontWeight:700, color:src.color }}>{src.revShare}%</span>
                    </div>
                    <div style={{ height:4, background:"var(--border)", borderRadius:99, overflow:"hidden" }}>
                      <div style={{ height:"100%", width: src.revShare + "%", background:src.color, borderRadius:99 }} />
                    </div>

                    <div style={{ marginTop:10, fontSize:11, fontWeight:700,
                      color: src.trendUp ? "#16a34a" : "#dc2626" }}>
                      {src.trendUp ? "+" : ""}{src.trend} vs last period
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRENDS */}
        {tab === "trends" && (
          <div>
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              {SERIES.map((s) => (
                <button key={s.key} onClick={() => toggleSeries(s.key)}
                  style={{
                    display:"flex", alignItems:"center", gap:7,
                    padding:"6px 14px", borderRadius:20,
                    border:"1.5px solid " + (series[s.key] ? s.color : "var(--border)"),
                    background: series[s.key] ? s.color + "12" : "var(--bg-subtle)",
                    color: series[s.key] ? s.color : "var(--text-4)",
                    fontSize:11, fontWeight:700, cursor:"pointer",
                    fontFamily:"inherit", transition:"all .15s",
                  }}>
                  <span style={{
                    width:7, height:7, borderRadius:"50%",
                    background: series[s.key] ? s.color : "#cbd5e1",
                    flexShrink:0, display:"inline-block",
                  }} />
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ background:"var(--bg-card)", borderRadius:12,
              border:"1px solid var(--border)", padding:"18px 20px", marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:16 }}>
                Click Volume by Source
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={TREND_DATA} margin={{ top:4, right:8, bottom:0, left:-10 }}>
                  <defs>
                    {SERIES.map((s) => (
                      <linearGradient key={s.key} id={"tg-" + s.key} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={s.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis dataKey="d" tick={CHART_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART_TICK} axisLine={false} tickLine={false}
                    tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
                  <Tooltip contentStyle={CHART_TT}
                    formatter={(v, name) => [v.toLocaleString(), SERIES.find((s) => s.key === name) && SERIES.find((s) => s.key === name).label || name]} />
                  {SERIES.map((s) => series[s.key] && (
                    <Area key={s.key} type="monotone" dataKey={s.key}
                      stroke={s.color} strokeWidth={2}
                      fill={"url(#tg-" + s.key + ")"}
                      dot={{ r:3, fill:s.color, strokeWidth:0 }} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background:"var(--bg-card)", borderRadius:12,
              border:"1px solid var(--border)", padding:"18px 20px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:4 }}>
                Conversion Rate Trend
              </div>
              <div style={{ fontSize:11, color:"var(--text-4)", marginBottom:16 }}>
                % of visits that triggered the Block API (subscribe click)
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={CONV_DATA} margin={{ top:4, right:8, bottom:0, left:-10 }}>
                  <defs>
                    {SERIES.map((s) => (
                      <linearGradient key={s.key} id={"cg-" + s.key} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={s.color} stopOpacity={0.12} />
                        <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis dataKey="d" tick={CHART_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART_TICK} axisLine={false} tickLine={false}
                    tickFormatter={(v) => v + "%"} />
                  <Tooltip contentStyle={CHART_TT}
                    formatter={(v, name) => [v + "%", SERIES.find((s) => s.key === name) && SERIES.find((s) => s.key === name).label || name]} />
                  {SERIES.map((s) => series[s.key] && (
                    <Area key={s.key} type="monotone" dataKey={s.key}
                      stroke={s.color} strokeWidth={2}
                      fill={"url(#cg-" + s.key + ")"}
                      dot={{ r:3, fill:s.color, strokeWidth:0 }} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ALL SOURCES */}
        {tab === "sources" && (
          <div>
            <div className="g-stats4 mb-section">
              {KPI.map((k) => (
                <div key={k.label} style={{
                  background:"var(--bg-card)", borderRadius:12,
                  border:"1px solid var(--border)", padding:"16px 18px",
                  borderTop:"3px solid " + k.color,
                }}>
                  <div style={{ fontSize:26, fontWeight:800, color:k.color,
                    lineHeight:1, letterSpacing:"-1px" }}>{k.value}</div>
                  <div style={{ fontSize:12, color:"var(--text-2)", fontWeight:600, marginTop:5 }}>{k.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              flexWrap:"wrap", gap:12, marginBottom:12 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>All Traffic Sources</div>
              <div className="f-wrap-10">
                <div className="dt-entries-bar">
                  <span className="dt-entries-lbl">Show</span>
                  <select className="dt-entries-sel" value={perPage}
                    onChange={(e) => setPerPage(+e.target.value)}>
                    {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
                  </select>
                  <span className="dt-entries-lbl">entries</span>
                </div>
                <div className="f-gap-6">
                  {[{ label:"All", value:"All" },
                    ...["active","needsattention","inactive"]
                      .filter((s) => SOURCES.some((r) => r.status === s))
                      .map((s) => ({
                        label: s === "needsattention" ? "Needs Attention"
                          : s.charAt(0).toUpperCase() + s.slice(1),
                        value: s,
                      })),
                  ].map((f) => (
                    <button key={f.value} onClick={() => setFilter(f.value)}
                      className={"partner-filter-pill " + (filter === f.value ? "active" : "inactive")}>
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="p-rel">
                  <span className="partner-search-icon" style={{ fontSize:11 }}>&#9906;</span>
                  <input className="partner-search" placeholder="Search sources..."
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
              <table className="dt" style={{ tableLayout:"auto" }}>
                <thead>
                  <tr style={{ background:"var(--bg-subtle)", borderBottom:"2px solid var(--border)" }}>
                    {["Source","Identifier","Visits","Clicks","Conv. Rate","Revenue","Rev. Share","Trend",""].map((h) => (
                      <th key={h} className="dt-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((src) => {
                    const st = STATUS_STYLE[src.status] || STATUS_STYLE.active;
                    return (
                      <tr key={src.id} className="dt-tr" onClick={() => setSelected(src)}>
                        <td className="p-sm">
                          <div className="f-gap-10">
                            <SourceAvatar src={src} size={30} />
                            <div>
                              <div className="txt-strong-sm">{src.name}</div>
                              <div className="txt-mono">{src.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-sm"><IdTag value={src.identifier} /></td>
                        <td style={{ padding:"8px 10px", fontWeight:700, color:"#16a34a", fontSize:12 }}>
                          {src.visits.toLocaleString()}
                        </td>
                        <td className="p-sm">
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <MiniBar value={src.clicks} max={maxClicks} color={src.color} />
                            <span style={{ fontSize:12, fontWeight:700, color:src.color, minWidth:38, textAlign:"right" }}>
                              {src.clicks.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-sm">
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <div style={{ flex:1, height:4, background:"var(--border)", borderRadius:99, overflow:"hidden" }}>
                              <div style={{ height:"100%", width: Math.min(src.convRate * 8, 100) + "%",
                                background: AMBER, borderRadius:99 }} />
                            </div>
                            <span style={{ fontSize:11, fontWeight:700, color: AMBER, minWidth:34 }}>
                              {src.convRate}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding:"8px 10px", fontSize:12, fontWeight:700, color:"var(--text)" }}>
                          {src.revenue}
                        </td>
                        <td className="p-sm">
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <div style={{ flex:1, height:4, background:"var(--border)", borderRadius:99, overflow:"hidden" }}>
                              <div style={{ height:"100%", width: src.revShare + "%",
                                background: src.color, borderRadius:99 }} />
                            </div>
                            <span style={{ fontSize:11, fontWeight:700, color:"var(--text)", minWidth:26 }}>
                              {src.revShare}%
                            </span>
                          </div>
                        </td>
                        <td className="p-sm"><TrendBadge trend={src.trend} trendUp={src.trendUp} /></td>
                        <td className="p-sm">
                          <button className="partner-view-btn"
                            onClick={(e) => { e.stopPropagation(); setSelected(src); }}>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {visible.length === 0 && (
                    <tr><td colSpan={9} className="dt-empty">No sources match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="partner-footer-txt">Showing {visible.length} of {SOURCES.length} sources</div>
          </div>
        )}
      </div>

      {selected && <SourceModal source={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}