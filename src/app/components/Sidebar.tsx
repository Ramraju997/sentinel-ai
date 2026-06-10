import { useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  GitBranch,
  BarChart3,
  MessageSquare,
  Upload,
  Settings,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "incidents", label: "Incidents", icon: AlertTriangle, badge: 4 },
  { id: "timeline", label: "Timeline", icon: Activity },
  { id: "analysis", label: "Root Cause", icon: GitBranch },
  { id: "graph", label: "Dependency Graph", icon: BarChart3 },
  { id: "chat", label: "AI Assistant", icon: MessageSquare },
  { id: "upload", label: "Log Upload", icon: Upload },
];

const bottomItems = [
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 relative"
      style={{
        width: collapsed ? 64 : 220,
        background: "rgba(10, 12, 20, 0.95)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          }}
        >
          <Shield size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white text-sm" style={{ fontWeight: 700, letterSpacing: "0.02em" }}>
              SENTINEL
            </p>
            <p style={{ fontSize: 10, color: "#6b7280", letterSpacing: "0.1em" }}>AI OPS</p>
          </div>
        )}
      </div>

      {/* Live indicator */}
      {!collapsed && (
        <div className="mx-4 mt-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>LIVE MONITORING</span>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center mt-4 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon, badge }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left relative group"
              style={{
                background: active ? "rgba(59,130,246,0.15)" : "transparent",
                border: active ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                color: active ? "#60a5fa" : "#9ca3af",
              }}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && (
                <>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{label}</span>
                  {badge && (
                    <span
                      className="ml-auto flex items-center justify-center rounded-full text-white"
                      style={{ fontSize: 10, fontWeight: 700, background: "#ef4444", minWidth: 18, height: 18, padding: "0 4px" }}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: "#3b82f6" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1 border-t pt-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {bottomItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
            style={{ color: "#6b7280" }}
          >
            <Icon size={16} className="shrink-0" />
            {!collapsed && <span style={{ fontSize: 13 }}>{label}</span>}
          </button>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 flex items-center justify-center rounded-full w-6 h-6 transition-all z-10"
        style={{ background: "#1e2030", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
