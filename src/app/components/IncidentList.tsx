import { useState } from "react";
import { AlertTriangle, Clock, ChevronRight, Zap } from "lucide-react";
import { incidents, type Incident, type Severity, type IncidentStatus } from "./data/mockData";

const severityConfig: Record<Severity, { color: string; bg: string; label: string }> = {
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "CRITICAL" },
  high: { color: "#f97316", bg: "rgba(249,115,22,0.12)", label: "HIGH" },
  medium: { color: "#eab308", bg: "rgba(234,179,8,0.12)", label: "MEDIUM" },
  low: { color: "#6b7280", bg: "rgba(107,114,128,0.12)", label: "LOW" },
};

const statusConfig: Record<IncidentStatus, { color: string; label: string; dot: string }> = {
  active: { color: "#ef4444", label: "Active", dot: "animate-pulse" },
  investigating: { color: "#f97316", label: "Investigating", dot: "animate-pulse" },
  monitoring: { color: "#eab308", label: "Monitoring", dot: "" },
  resolved: { color: "#10b981", label: "Resolved", dot: "" },
};

function IncidentRow({ incident, selected, onClick }: { incident: Incident; selected: boolean; onClick: () => void }) {
  const sev = severityConfig[incident.severity];
  const status = statusConfig[incident.status];

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 transition-all duration-150 border-b relative"
      style={{
        background: selected ? "rgba(59,130,246,0.08)" : "transparent",
        borderColor: "rgba(255,255,255,0.04)",
        borderLeft: selected ? "2px solid #3b82f6" : "2px solid transparent",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1 mt-0.5">
          <div className={`w-2 h-2 rounded-full ${status.dot}`} style={{ background: status.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{incident.id}</span>
            <span
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ background: sev.bg, color: sev.color, fontSize: 10, fontWeight: 700 }}
            >
              {sev.label}
            </span>
            <span style={{ fontSize: 10, color: "#6b7280", marginLeft: "auto" }}>
              {incident.category}
            </span>
          </div>
          <p className="text-white mb-2 truncate" style={{ fontSize: 13, fontWeight: 500 }}>
            {incident.title}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" style={{ color: "#6b7280" }}>
              <Clock size={11} />
              <span style={{ fontSize: 11 }}>{incident.duration}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "#6b7280" }}>
              <Zap size={11} />
              <span style={{ fontSize: 11 }}>{incident.impactedUsers.toLocaleString()} users</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div
                className="h-1.5 rounded-full"
                style={{ width: 48, background: "rgba(255,255,255,0.1)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${incident.confidenceScore}%`,
                    background: incident.confidenceScore > 80 ? "#10b981" : incident.confidenceScore > 60 ? "#eab308" : "#f97316",
                  }}
                />
              </div>
              <span style={{ fontSize: 10, color: "#6b7280" }}>{incident.confidenceScore}%</span>
            </div>
          </div>
        </div>
        {selected && <ChevronRight size={14} className="shrink-0 mt-1" style={{ color: "#3b82f6" }} />}
      </div>
    </button>
  );
}

export function IncidentList({ onSelect }: { onSelect: (id: string) => void }) {
  const [selectedId, setSelectedId] = useState(incidents[0].id);

  function handleSelect(id: string) {
    setSelectedId(id);
    onSelect(id);
  }

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} style={{ color: "#ef4444" }} />
          <span className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>
            Active Incidents
          </span>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-xs"
          style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: 11 }}
        >
          {incidents.filter((i) => i.status !== "resolved").length} open
        </span>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
        {incidents.map((incident) => (
          <IncidentRow
            key={incident.id}
            incident={incident}
            selected={selectedId === incident.id}
            onClick={() => handleSelect(incident.id)}
          />
        ))}
      </div>
    </div>
  );
}
