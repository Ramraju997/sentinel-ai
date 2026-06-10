import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { StatCards } from "./components/StatCards";
import { IncidentList } from "./components/IncidentList";
import { IncidentTimeline } from "./components/IncidentTimeline";
import { RootCausePanel } from "./components/RootCausePanel";
import { ConfidenceChart } from "./components/ConfidenceChart";
import { ServiceDependencyGraph } from "./components/ServiceDependencyGraph";
import { AIChatPanel } from "./components/AIChatPanel";
import { Bell, Search, RefreshCw, Download } from "lucide-react";

function Topbar({ view }: { view: string }) {
  const viewLabels: Record<string, string> = {
    dashboard: "Incident Dashboard",
    incidents: "Active Incidents",
    timeline: "Incident Timeline",
    analysis: "Root Cause Analysis",
    graph: "Service Dependency Graph",
    chat: "AI Assistant",
    upload: "Log Upload",
    alerts: "Alerts",
    settings: "Settings",
  };

  return (
    <header
      className="flex items-center gap-4 px-6 py-3 shrink-0 border-b"
      style={{
        background: "rgba(10,12,20,0.8)",
        borderColor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div>
        <h1 className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>
          {viewLabels[view] ?? "Dashboard"}
        </h1>
        <p style={{ fontSize: 11, color: "#6b7280" }}>
          Last updated: {new Date().toLocaleTimeString()} · Auto-refresh every 30s
        </p>
      </div>

      <div className="flex-1 max-w-xs ml-6">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={13} style={{ color: "#6b7280" }} />
          <input
            className="bg-transparent outline-none text-white placeholder-gray-600 flex-1"
            style={{ fontSize: 12 }}
            placeholder="Search incidents..."
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#9ca3af",
            fontSize: 12,
          }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.3)",
            color: "#60a5fa",
            fontSize: 12,
          }}
        >
          <Download size={12} />
          Export Report
        </button>
        <div className="relative">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}
          >
            <Bell size={14} />
          </button>
          <div
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: "#ef4444", border: "1px solid rgba(10,12,20,1)" }}
          />
        </div>
      </div>
    </header>
  );
}

function DashboardView() {
  const [, setSelectedIncident] = useState("INC-2847");

  return (
    <div className="flex gap-5 h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-5 pb-4">
        <StatCards />
        <div className="grid grid-cols-2 gap-5">
          <IncidentList onSelect={setSelectedIncident} />
          <IncidentTimeline />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <RootCausePanel />
          <ConfidenceChart />
        </div>
        <ServiceDependencyGraph />
      </div>

      {/* AI Chat sidebar */}
      <div className="shrink-0" style={{ width: 340 }}>
        <AIChatPanel />
      </div>
    </div>
  );
}

function UploadView() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div
        className="rounded-xl p-8 text-center transition-all"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); setUploaded(true); }}
        style={{
          background: dragging ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)",
          border: `2px dashed ${dragging ? "#3b82f6" : "rgba(255,255,255,0.1)"}`,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
          >
            <svg width="24" height="24" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-white" style={{ fontSize: 16, fontWeight: 600 }}>
              {uploaded ? "✓ Logs uploaded — AI analyzing..." : "Drop logs here or click to upload"}
            </p>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Supports TXT, JSON, CSV · Max 50MB
            </p>
          </div>
          {!uploaded && (
            <button
              onClick={() => setUploaded(true)}
              className="px-6 py-2 rounded-lg transition-all"
              style={{ background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 500 }}
            >
              Browse Files
            </button>
          )}
          {uploaded && (
            <div className="w-full mt-2">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full bg-blue-500" style={{ width: "73%", transition: "width 2s" }} />
              </div>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>Analyzing logs with AI... 73%</p>
            </div>
          )}
        </div>
      </div>

      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-white mb-3" style={{ fontSize: 13, fontWeight: 600 }}>Or paste logs directly</p>
        <textarea
          className="w-full bg-transparent outline-none text-green-400 font-mono resize-none"
          rows={10}
          style={{ fontSize: 12, color: "#34d399" }}
          placeholder={`[2026-06-10 14:01:23] INFO  api-gateway deployment v2.4.1 started\n[2026-06-10 14:08:11] WARN  db-pool: connection wait time 523ms (threshold: 500ms)\n[2026-06-10 14:15:44] ERROR user-service: connection pool exhausted (200/200)\n[2026-06-10 14:15:45] ERROR payment-service: upstream timeout after 5000ms\n[2026-06-10 14:23:01] CRIT  api-gateway: 503 error rate 34% — SLA breach`}
        />
        <div className="flex gap-3 mt-3">
          <button
            className="px-4 py-2 rounded-lg"
            style={{ background: "#3b82f6", color: "white", fontSize: 12, fontWeight: 500 }}
          >
            Analyze with AI
          </button>
          <button
            className="px-4 py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af", fontSize: 12 }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-white" style={{ fontSize: 18, fontWeight: 600 }}>{title}</p>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8 }}>This view is available in the full implementation.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard": return <DashboardView />;
      case "incidents": return <DashboardView />;
      case "timeline": return (
        <div className="grid grid-cols-2 gap-5 h-full">
          <IncidentTimeline />
          <ConfidenceChart />
        </div>
      );
      case "analysis": return (
        <div className="grid grid-cols-2 gap-5 h-full">
          <RootCausePanel />
          <div className="flex flex-col gap-5">
            <ConfidenceChart />
            <ServiceDependencyGraph />
          </div>
        </div>
      );
      case "graph": return <ServiceDependencyGraph />;
      case "chat": return (
        <div className="max-w-2xl mx-auto h-full">
          <AIChatPanel />
        </div>
      );
      case "upload": return <UploadView />;
      default: return <PlaceholderView title={activeView} />;
    }
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: "#080a12" }}
    >
      {/* Ambient glow effects */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: -200,
          left: -100,
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          width: 400,
          height: 400,
          bottom: -100,
          right: 200,
          background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar view={activeView} />
        <main className="flex-1 overflow-hidden p-5">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
