export default function HeatmapBar({ data }) {
  const max = Math.max(...data.map(d => d.value));
  const LABELS = { 0: "12a", 6: "6a", 12: "12p", 18: "6p", 23: "11p" };

  return (
    <div className="ov2-heatmap">
      <div className="ov2-heatmap-bars">
        {data.map((d) => {
          const pct = d.value / max;
          return (
            <div key={d.h} className="ov2-heatmap-col"
              title={`${String(d.h).padStart(2, "0")}:00 · ${d.value.toLocaleString()} txns`}>
              <div
                className="ov2-heatmap-bar"
                style={{ "--h": `${Math.max(6, pct * 100)}%`, "--o": 0.15 + pct * 0.85 }}
              />
            </div>
          );
        })}
      </div>
      <div className="ov2-heatmap-axis">
        {data.map((d) => (
          <div key={d.h} className="ov2-heatmap-tick-slot">
            {LABELS[d.h] && <span className="ov2-heatmap-tick">{LABELS[d.h]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}