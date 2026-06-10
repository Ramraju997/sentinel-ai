import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";
import { initialChatMessages, type ChatMessage } from "./data/mockData";

const suggestedQuestions = [
  "What's the blast radius of this incident?",
  "Show me the root cause evidence",
  "Generate incident report",
  "What should I do first?",
];

const mockResponses: Record<string, string> = {
  blast: "**Blast Radius Analysis:**\n\n- **Primary**: api-gateway → user-service → PostgreSQL DB (complete failure chain)\n- **Secondary**: payment-service (61% success rate), checkout-service (downstream)\n- **Tertiary**: notification-service (delayed queue processing)\n\nEstimated **12,400 users** directly affected with **$48K/hr** revenue impact at current error rates.",
  root: "**Evidence Summary for INC-2847:**\n\n1. ✅ api-gateway v2.4.1 deployed at 14:01 — correlation coefficient: 0.97\n2. ✅ DB connections jumped from 42 → 195 within 7 minutes post-deploy\n3. ✅ Connection release missing in new timeout handler (line 847, gateway.go)\n4. ✅ Identical symptom pattern in staging stress test (ignored pre-release)\n\n**Verdict**: Connection leak in new timeout code path. Confidence: **94%**",
  report: "**Incident Report Generated** ✓\n\n```\nINCIDENT: INC-2847\nSeverity: CRITICAL\nDuration: 23 minutes (ongoing)\nAffected: 12,400 users\n\nROOT CAUSE: Connection leak in api-gateway v2.4.1\nEVIDENCE: 4 corroborating signals\nCONFIDENCE: 94%\n\nACTIONS TAKEN:\n- AI detection at 14:23\n- Rollback initiated at 14:38\n\nNEXT STEPS:\n1. Monitor rollback progress\n2. Conduct code review\n3. Add regression tests\n```\nReport saved to incident-reports/INC-2847.md",
  first: "**Immediate Priority Actions:**\n\n🔴 **RIGHT NOW** (< 2 min)\n→ Execute rollback: `kubectl rollout undo deployment/api-gateway`\n\n🟡 **NEXT** (2-10 min)\n→ Verify connection count dropping below 50\n→ Confirm payment service recovery\n\n🟢 **AFTER RECOVERY** (10-30 min)\n→ Update incident stakeholders\n→ Schedule post-mortem for tomorrow\n→ Open PR to fix connection handling code",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("blast") || lower.includes("radius") || lower.includes("impact")) return mockResponses.blast;
  if (lower.includes("evidence") || lower.includes("root")) return mockResponses.root;
  if (lower.includes("report") || lower.includes("generate")) return mockResponses.report;
  if (lower.includes("first") || lower.includes("do") || lower.includes("priority")) return mockResponses.first;
  return "I've analyzed **INC-2847** in detail. The primary root cause is a connection leak introduced in api-gateway v2.4.1 (deployed 14:01 UTC). I recommend immediate rollback to v2.4.0. Would you like me to provide the rollback command, generate an incident report, or analyze the blast radius?";
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isAI = msg.role === "assistant";
  return (
    <div className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
      <div
        className="flex items-center justify-center rounded-full shrink-0 w-7 h-7"
        style={{
          background: isAI ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.1)",
          border: isAI ? "none" : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {isAI ? <Bot size={14} className="text-white" /> : <User size={14} style={{ color: "#9ca3af" }} />}
      </div>
      <div className={`max-w-[85%] ${isAI ? "" : "items-end"} flex flex-col gap-1`}>
        <div
          className="rounded-xl px-3 py-2.5"
          style={{
            background: isAI ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.06)",
            border: isAI ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-white whitespace-pre-wrap" style={{ fontSize: 12, lineHeight: 1.6 }}>
            {msg.content.split(/(\*\*.*?\*\*|`[^`]+`)/g).map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} style={{ color: "#e5e7eb" }}>{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith("`") && part.endsWith("`")) {
                return (
                  <code key={i} style={{ background: "rgba(255,255,255,0.1)", padding: "0 4px", borderRadius: 4, fontFamily: "monospace", fontSize: 11 }}>
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return part;
            })}
          </p>
        </div>
        <span style={{ fontSize: 10, color: "#4b5563" }}>{msg.timestamp}</span>
      </div>
    </div>
  );
}

export function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: "user",
      content: text,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`,
        role: "assistant",
        content: getResponse(text),
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1200);
  }

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="flex items-center justify-center rounded-lg w-7 h-7"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
        >
          <Sparkles size={13} className="text-white" />
        </div>
        <div>
          <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>Sentinel AI</p>
          <p style={{ fontSize: 10, color: "#10b981" }}>● Analyzing INC-2847</p>
        </div>
        <button
          onClick={() => setMessages(initialChatMessages)}
          className="ml-auto"
          style={{ color: "#6b7280" }}
          title="Reset chat"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div
              className="flex items-center justify-center rounded-full w-7 h-7 shrink-0"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <Bot size={14} className="text-white" />
            </div>
            <div
              className="px-4 py-3 rounded-xl"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400"
                    style={{ animation: `bounce 1s ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-4 py-2 flex gap-2 flex-wrap border-t shrink-0" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="rounded-full px-3 py-1 transition-all"
            style={{
              fontSize: 11,
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#93c5fd",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <input
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-600"
            style={{ fontSize: 13 }}
            placeholder="Ask about this incident..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="flex items-center justify-center rounded-lg w-7 h-7 transition-all"
            style={{
              background: input.trim() && !loading ? "#3b82f6" : "rgba(255,255,255,0.06)",
              color: input.trim() && !loading ? "white" : "#4b5563",
            }}
          >
            <Send size={12} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
