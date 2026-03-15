import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BLUE } from "../../components/constants/colors";

/**
 * TinyDonut — a compact donut chart for channel cards.
 *
 * @param {number} pct    Filled percentage (0–100)
 * @param {string} color  Fill color for the active slice
 */
export default function TinyDonut({ pct = 25, color = BLUE }) {
  const data = [{ v: pct }, { v: 100 - pct }];

  return (
    <div className="tiny-donut-wrap" style={{ "--c": color }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="v"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e8ecf3" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="tiny-donut-label">{pct}%</div>
    </div>
  );
}
