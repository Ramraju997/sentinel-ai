import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import { incidents } from "./data/mockData";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  trend?: string;
}

function StatCard({ title, value, subtitle, icon, color, glowColor, trend }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 -translate-y-8 translate-x-8"
        style={{ background: glowColor }}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p style={{ fontSize: 12, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {title}
          </p>
          <div
            className="flex items-center justify-center rounded-lg w-8 h-8"
            style={{ background: `${color}20`, color }}
          >
            {icon}
          </div>
        </div>
        <p className="text-white mb-1" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
          {value}
        </p>
        <p style={{ fontSize: 12, color: "#6b7280" }}>{subtitle}</p>
        {trend && (
          <p className="mt-2" style={{ fontSize: 11, color }}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

export function StatCards() {
  const active = incidents.filter((i) => i.status === "active" || i.status === "investigating").length;
  const critical = incidents.filter((i) => i.severity === "critical").length;
  const resolved = incidents.filter((i) => i.status === "resolved").length;
  const totalUsers = incidents.reduce((sum, i) => sum + i.impactedUsers, 0);

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        title="Active Incidents"
        value={active}
        subtitle="Requires immediate attention"
        icon={<AlertTriangle size={16} />}
        color="#ef4444"
        glowColor="#ef4444"
        trend="▲ 2 new in last hour"
      />
      <StatCard
        title="Critical Severity"
        value={critical}
        subtitle="P0 incidents in progress"
        icon={<AlertTriangle size={16} />}
        color="#f97316"
        glowColor="#f97316"
        trend="INC-2847 escalated"
      />
      <StatCard
        title="Resolved Today"
        value={resolved}
        subtitle="Mean TTR: 55 minutes"
        icon={<CheckCircle size={16} />}
        color="#10b981"
        glowColor="#10b981"
        trend="▼ 12% faster than avg"
      />
      <StatCard
        title="Users Impacted"
        value={totalUsers.toLocaleString()}
        subtitle="Across all active incidents"
        icon={<Users size={16} />}
        color="#3b82f6"
        glowColor="#3b82f6"
        trend="Estimated revenue impact: $48K/hr"
      />
    </div>
  );
}
