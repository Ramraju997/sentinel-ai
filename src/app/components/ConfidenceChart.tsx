import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { confidenceData } from "./data/mockData";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        className="rounded-lg px-3 py-2"
        style={{
          background: "rgba(10,12,20,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        <p className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>
          {d.name}
        </p>
        <p style={{ fontSize: 12, color: d.fill }}>Confidence: {d.confidence}%</p>
      </div>
    );
  }
  return null;
};

export function ConfidenceChart() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <BarChart3 size={14} style={{ color: "#3b82f6" }} />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>
          Root Cause Confidence Scores
        </span>
      </div>

      <div className="p-4">
        {/* Horizontal bar chart */}
        <div className="space-y-3">
          {confidenceData.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 12, color: "#d1d5db" }}>{item.name}</span>
                <span style={{ fontSize: 12, color: item.fill, fontWeight: 700 }}>
                  {item.confidence}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.confidence}%`,
                    background: `linear-gradient(90deg, ${item.fill}80, ${item.fill})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recharts area */}
        <div className="mt-6" style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={confidenceData} layout="vertical" barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="confidence" radius={[0, 4, 4, 0]}>
                {confidenceData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
