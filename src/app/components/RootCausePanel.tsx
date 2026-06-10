import { GitBranch, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Wrench } from "lucide-react";
import { useState } from "react";
import { rootCauses } from "./data/mockData";

const remediationSteps = [
  "Roll back api-gateway to v2.4.0 immediately to stop connection leak",
  "Monitor connection pool recovery over next 10 minutes",
  "Increase PostgreSQL max_connections to 500 as temporary buffer",
  "Review new connection handling code in PR #4821 before re-deploy",
  "Add connection leak detection to CI/CD pipeline (pgbouncer metrics)",
  "Post-incident: implement connection pool monitoring alert at 70% threshold",
];

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 700, minWidth: 32, textAlign: "right" }}>
        {value}%
      </span>
    </div>
  );
}

export function RootCausePanel() {
  const [expanded, setExpanded] = useState<string | null>("rc1");
  const [showRemediation, setShowRemediation] = useState(false);

  const colorForConfidence = (c: number) =>
    c >= 80 ? "#ef4444" : c >= 60 ? "#f97316" : "#eab308";

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <GitBranch size={14} style={{ color: "#a855f7" }} />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>
          Root Cause Analysis
        </span>
        <span
          className="ml-auto px-2 py-0.5 rounded-full"
          style={{ fontSize: 10, background: "rgba(168,85,247,0.15)", color: "#a855f7", fontWeight: 600 }}
        >
          AI · 94% confidence
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {rootCauses.map((rc) => {
          const isOpen = expanded === rc.id;
          const color = colorForConfidence(rc.confidence);
          return (
            <div
              key={rc.id}
              className="rounded-lg overflow-hidden"
              style={{ border: `1px solid ${isOpen ? color + "40" : "rgba(255,255,255,0.06)"}`, background: isOpen ? `${color}08` : "rgba(255,255,255,0.02)" }}
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                onClick={() => setExpanded(isOpen ? null : rc.id)}
              >
                <AlertCircle size={14} style={{ color, flexShrink: 0 }} />
                <span className="flex-1 text-white" style={{ fontSize: 13, fontWeight: 500 }}>
                  {rc.title}
                </span>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color, fontWeight: 700 }}>{rc.confidence}%</span>
                  {isOpen ? (
                    <ChevronUp size={14} style={{ color: "#6b7280" }} />
                  ) : (
                    <ChevronDown size={14} style={{ color: "#6b7280" }} />
                  )}
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <ConfidenceBar value={rc.confidence} color={color} />
                  <div className="mt-3 space-y-2">
                    <p style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Evidence
                    </p>
                    {rc.evidence.map((e, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle size={12} className="mt-0.5 shrink-0" style={{ color: "#3b82f6" }} />
                        <p style={{ fontSize: 12, color: "#d1d5db" }}>{e}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Remediation */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)" }}
        >
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
            onClick={() => setShowRemediation(!showRemediation)}
          >
            <Wrench size={14} style={{ color: "#10b981", flexShrink: 0 }} />
            <span className="flex-1 text-white" style={{ fontSize: 13, fontWeight: 500 }}>
              Remediation Steps
            </span>
            <span style={{ fontSize: 11, color: "#10b981" }}>{remediationSteps.length} actions</span>
            {showRemediation ? (
              <ChevronUp size={14} style={{ color: "#6b7280" }} />
            ) : (
              <ChevronDown size={14} style={{ color: "#6b7280" }} />
            )}
          </button>
          {showRemediation && (
            <div className="px-4 pb-4 space-y-2">
              {remediationSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex items-center justify-center rounded-full shrink-0 text-white"
                    style={{ width: 20, height: 20, background: "#10b981", fontSize: 10, fontWeight: 700, marginTop: 1 }}
                  >
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 12, color: "#d1d5db" }}>{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
