function fmtNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  const toRad = d => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export default function ScoreGauge({ clean = 0, suspect = 0, blocked = 0 }) {
  const total = (clean + suspect + blocked) || 1;
  const cleanPct   = clean   / total;
  const suspectPct = suspect / total;
  const blockedPct = blocked / total;

  const cx = 110, cy = 110, r = 75;
  // Arc goes from 180deg (left) to 0deg (right) — total 180deg sweep
  const START = 180, END = 360;
  const SWEEP = END - START;

  const cleanEnd   = START + SWEEP * cleanPct;
  const suspectEnd = cleanEnd + SWEEP * suspectPct;

  // Needle angle points to midpoint of dominant segment
  const dominant = cleanPct >= suspectPct && cleanPct >= blockedPct ? "clean"
    : suspectPct >= blockedPct ? "suspect" : "blocked";

  const needleMid = dominant === "clean"
    ? START + SWEEP * (cleanPct / 2)
    : dominant === "suspect"
    ? cleanEnd + SWEEP * (suspectPct / 2)
    : suspectEnd + SWEEP * (blockedPct / 2);

  const toRad = d => (d * Math.PI) / 180;
  const needleX = cx + 60 * Math.cos(toRad(needleMid));
  const needleY = cy + 60 * Math.sin(toRad(needleMid));
  const needleColor = dominant === "clean" ? "#22c55e" : dominant === "suspect" ? "#f59e0b" : "#ef4444";
  const dominantCount = dominant === "clean" ? clean : dominant === "suspect" ? suspect : blocked;

  return (
    <div className="ov2-gauge-wrap">
      <svg viewBox="0 0 220 120" className="ov2-gauge-svg">
        {/* Background */}
        <path d={describeArc(cx, cy, r, START, END)} fill="none"
          stroke="var(--bg-subtle)" strokeWidth={20} strokeLinecap="butt" />

        {/* Clean */}
        {cleanPct > 0.001 && (
          <path d={describeArc(cx, cy, r, START, cleanEnd - 0.5)} fill="none"
            stroke="#22c55e" strokeWidth={20} strokeLinecap="butt" />
        )}
        {/* Suspect */}
        {suspectPct > 0.001 && (
          <path d={describeArc(cx, cy, r, cleanEnd + 0.5, suspectEnd - 0.5)} fill="none"
            stroke="#f59e0b" strokeWidth={20} strokeLinecap="butt" />
        )}
        {/* Blocked */}
        {blockedPct > 0.001 && (
          <path d={describeArc(cx, cy, r, suspectEnd + 0.5, END)} fill="none"
            stroke="#ef4444" strokeWidth={20} strokeLinecap="butt" />
        )}

        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY}
          stroke={needleColor} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill={needleColor} />

        {/* Count */}
        <text x={cx} y={cy - 10} textAnchor="middle"
          className="ov2-gauge-num" fill={needleColor}>{fmtNum(dominantCount)}</text>
      </svg>

      <div className="ov2-gauge-legend">
        {[
          { label: "Clean",     color: "#22c55e", val: clean   },
          { label: "Low Risk",  color: "#f59e0b", val: suspect },
          { label: "High Risk", color: "#ef4444", val: blocked },
        ].map(({ label, color, val }) => (
          <div key={label} className="ov2-gauge-legend-item">
            <span className="ov2-gauge-legend-dot" style={{ "--c": color }} />
            <span className="ov2-gauge-legend-label">{label}</span>
            <span className="ov2-gauge-legend-val">{fmtNum(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}