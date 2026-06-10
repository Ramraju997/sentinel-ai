import { useEffect, useRef, useState } from "react";
import { GitBranch } from "lucide-react";
import { serviceNodes, serviceEdges, type ServiceNode } from "./data/mockData";

const statusColors = {
  healthy: "#10b981",
  degraded: "#f97316",
  down: "#ef4444",
};

const statusGlow = {
  healthy: "rgba(16,185,129,0.3)",
  degraded: "rgba(249,115,22,0.3)",
  down: "rgba(239,68,68,0.3)",
};

export function ServiceDependencyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [hoveredNode, setHoveredNode] = useState<ServiceNode | null>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 320 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({ w: entry.contentRect.width, h: 320 });
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    canvas.style.width = `${dimensions.w}px`;
    canvas.style.height = `${dimensions.h}px`;
    ctx.scale(dpr, dpr);

    const scaleX = dimensions.w / 800;
    const scaleY = dimensions.h / 520;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (dimensions.w - 800 * scale) / 2;
    const offsetY = (dimensions.h - 520 * scale) / 2;

    function toCanvas(x: number, y: number) {
      return { x: x * scale + offsetX, y: y * scale + offsetY };
    }

    let tick = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, dimensions.w, dimensions.h);

      // Draw edges
      serviceEdges.forEach((edge) => {
        const fromNode = serviceNodes.find((n) => n.id === edge.from)!;
        const toNode = serviceNodes.find((n) => n.id === edge.to)!;
        const from = toCanvas(fromNode.x, fromNode.y);
        const to = toCanvas(toNode.x, toNode.y);

        const errorRate = edge.errorRate ?? 0;
        const edgeColor =
          errorRate > 30 ? "#ef4444" : errorRate > 10 ? "#f97316" : "rgba(255,255,255,0.15)";

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);

        // Bezier curve
        const cpx = (from.x + to.x) / 2;
        const cpy = Math.min(from.y, to.y) - 20 * scale;
        ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = errorRate > 30 ? 1.5 : 1;
        ctx.setLineDash(errorRate > 30 ? [4, 3] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated packet on high-error edges
        if (errorRate > 10) {
          const t = ((tick * 0.01) % 1);
          const px = from.x + (to.x - from.x) * t;
          const py = from.y + (to.y - from.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 2.5 * scale, 0, Math.PI * 2);
          ctx.fillStyle = edgeColor;
          ctx.fill();
        }

        // Latency label
        if (edge.latency && edge.latency > 500) {
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2 - 8;
          ctx.fillStyle = "rgba(249,115,22,0.8)";
          ctx.font = `${Math.max(9, 10 * scale)}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(`${edge.latency}ms`, mx, my);
        }
      });

      // Draw nodes
      serviceNodes.forEach((node) => {
        const pos = toCanvas(node.x, node.y);
        const color = statusColors[node.status];
        const glow = statusGlow[node.status];
        const r = 28 * scale;

        // Glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2);
        gradient.addColorStop(0, glow);
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10, 12, 20, 0.9)";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = node.status === "down" ? 2.5 : 1.5;
        ctx.stroke();

        // Status dot (pulsing for down/degraded)
        const pulseR = 5 * scale;
        const pulse = node.status !== "healthy" ? Math.sin(tick * 0.08) * 0.4 + 0.8 : 1;
        ctx.beginPath();
        ctx.arc(pos.x + r * 0.6, pos.y - r * 0.6, pulseR * pulse, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.fillStyle = "#e5e7eb";
        ctx.font = `${Math.max(9, 11 * scale)}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(node.name, pos.x, pos.y + r + 16 * scale);

        // Status label
        ctx.fillStyle = color;
        ctx.font = `${Math.max(7, 9 * scale)}px Inter, sans-serif`;
        ctx.fillText(node.status.toUpperCase(), pos.x, pos.y + r + 28 * scale);
      });

      tick++;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [dimensions]);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const scaleX = dimensions.w / 800;
    const scaleY = dimensions.h / 520;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (dimensions.w - 800 * scale) / 2;
    const offsetY = (dimensions.h - 520 * scale) / 2;

    const found = serviceNodes.find((node) => {
      const cx = node.x * scale + offsetX;
      const cy = node.y * scale + offsetY;
      const r = 28 * scale;
      return Math.hypot(mx - cx, my - cy) < r;
    });
    setHoveredNode(found ?? null);
  }

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
        <GitBranch size={14} style={{ color: "#06b6d4" }} />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>
          Service Dependency Graph
        </span>
        <div className="ml-auto flex items-center gap-4">
          {(["healthy", "degraded", "down"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: statusColors[s] }} />
              <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "capitalize" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="relative" style={{ height: 320 }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
        />
        {hoveredNode && (
          <div
            className="absolute bottom-4 left-4 rounded-lg px-3 py-2"
            style={{
              background: "rgba(10,12,20,0.95)",
              border: `1px solid ${statusColors[hoveredNode.status]}40`,
              backdropFilter: "blur(20px)",
              pointerEvents: "none",
            }}
          >
            <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>
              {hoveredNode.name}
            </p>
            <p style={{ fontSize: 11, color: statusColors[hoveredNode.status] }}>
              Status: {hoveredNode.status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
