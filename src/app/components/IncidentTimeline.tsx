import { Activity, AlertTriangle, Rocket, Bug, Shield, Wrench } from "lucide-react";
import { timelineEvents, type TimelineEvent } from "./data/mockData";

const typeConfig = {
  alert: { icon: AlertTriangle, color: "#f97316", bg: "rgba(249,115,22,0.15)", label: "Alert" },
  deploy: { icon: Rocket, color: "#3b82f6", bg: "rgba(59,130,246,0.15)", label: "Deploy" },
  error: { icon: Bug, color: "#ef4444", bg: "rgba(239,68,68,0.15)", label: "Error" },
  recovery: { icon: Wrench, color: "#10b981", bg: "rgba(16,185,129,0.15)", label: "Recovery" },
  detection: { icon: Shield, color: "#a855f7", bg: "rgba(168,85,247,0.15)", label: "AI Detection" },
};

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const cfg = typeConfig[event.type];
  const Icon = cfg.icon;

  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div
          className="absolute left-5 top-10 bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)" }}
        />
      )}
      <div className="flex flex-col items-center">
        <div
          className="flex items-center justify-center rounded-full w-10 h-10 shrink-0 z-10"
          style={{ background: cfg.bg, border: `1px solid ${cfg.color}40` }}
        >
          <Icon size={14} style={{ color: cfg.color }} />
        </div>
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded text-xs"
            style={{ background: cfg.bg, color: cfg.color, fontSize: 10, fontWeight: 600 }}
          >
            {cfg.label}
          </span>
          <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>
            {event.time} UTC
          </span>
        </div>
        <p className="text-white mb-1" style={{ fontSize: 13, fontWeight: 500 }}>
          {event.title}
        </p>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>{event.description}</p>
      </div>
    </div>
  );
}

export function IncidentTimeline() {
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
        <Activity size={14} style={{ color: "#3b82f6" }} />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>
          Incident Timeline
        </span>
        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: "auto" }}>
          INC-2847 · Last 60 minutes
        </span>
      </div>
      <div className="px-4 py-4 overflow-y-auto" style={{ maxHeight: 420 }}>
        {timelineEvents.map((event, idx) => (
          <TimelineItem key={event.id} event={event} isLast={idx === timelineEvents.length - 1} />
        ))}
      </div>
    </div>
  );
}
