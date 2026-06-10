export type Severity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "active" | "investigating" | "resolved" | "monitoring";
export type IncidentCategory = "Database" | "Network" | "Application" | "Infrastructure" | "Security";

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  category: IncidentCategory;
  affectedServices: string[];
  startTime: string;
  duration: string;
  impactedUsers: number;
  confidenceScore: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "alert" | "deploy" | "error" | "recovery" | "detection";
}

export interface RootCause {
  id: string;
  title: string;
  confidence: number;
  evidence: string[];
  category: IncidentCategory;
}

export interface ServiceNode {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "down";
  x: number;
  y: number;
}

export interface ServiceEdge {
  from: string;
  to: string;
  latency?: number;
  errorRate?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const incidents: Incident[] = [
  {
    id: "INC-2847",
    title: "Database Connection Pool Exhaustion",
    severity: "critical",
    status: "active",
    category: "Database",
    affectedServices: ["api-gateway", "user-service", "payment-service"],
    startTime: "14:23 UTC",
    duration: "23m",
    impactedUsers: 12400,
    confidenceScore: 94,
  },
  {
    id: "INC-2846",
    title: "Payment Gateway Latency Spike",
    severity: "high",
    status: "investigating",
    category: "Application",
    affectedServices: ["payment-service", "checkout-service"],
    startTime: "13:58 UTC",
    duration: "48m",
    impactedUsers: 3200,
    confidenceScore: 81,
  },
  {
    id: "INC-2845",
    title: "CDN Edge Node Failure",
    severity: "medium",
    status: "monitoring",
    category: "Infrastructure",
    affectedServices: ["cdn-us-east", "static-assets"],
    startTime: "12:11 UTC",
    duration: "2h 12m",
    impactedUsers: 870,
    confidenceScore: 76,
  },
  {
    id: "INC-2844",
    title: "Auth Service Certificate Expiry",
    severity: "high",
    status: "investigating",
    category: "Security",
    affectedServices: ["auth-service", "api-gateway"],
    startTime: "11:45 UTC",
    duration: "2h 38m",
    impactedUsers: 5600,
    confidenceScore: 99,
  },
  {
    id: "INC-2843",
    title: "Message Queue Backlog Buildup",
    severity: "low",
    status: "resolved",
    category: "Infrastructure",
    affectedServices: ["notification-service", "event-bus"],
    startTime: "09:02 UTC",
    duration: "55m",
    impactedUsers: 120,
    confidenceScore: 88,
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: "t1",
    time: "14:01",
    title: "Deployment: api-gateway v2.4.1",
    description: "New release rolled out to production cluster (3 pods)",
    type: "deploy",
  },
  {
    id: "t2",
    time: "14:08",
    title: "Alert: DB connection wait time > 500ms",
    description: "P95 connection wait time exceeded threshold on db-primary-01",
    type: "alert",
  },
  {
    id: "t3",
    time: "14:15",
    title: "Error spike: 503s from user-service",
    description: "Error rate jumped to 34% — connection pool at 98% capacity",
    type: "error",
  },
  {
    id: "t4",
    time: "14:23",
    title: "AI Detection: Root cause identified",
    description: "Sentinel AI correlated deployment with connection leak pattern",
    type: "detection",
  },
  {
    id: "t5",
    time: "14:31",
    title: "Alert: Payment service degraded",
    description: "Downstream impact detected — payment success rate dropped to 61%",
    type: "alert",
  },
  {
    id: "t6",
    time: "14:38",
    title: "Rollback initiated: api-gateway v2.4.0",
    description: "Engineering team initiated rollback after AI recommendation",
    type: "recovery",
  },
];

export const rootCauses: RootCause[] = [
  {
    id: "rc1",
    title: "Connection leak in api-gateway v2.4.1",
    confidence: 94,
    evidence: [
      "Deployment at 14:01 correlates with connection spike",
      "Connection count increased 340% post-deploy",
      "No connection release on request timeout (new code path)",
      "Issue absent in v2.4.0 baseline",
    ],
    category: "Application",
  },
  {
    id: "rc2",
    title: "DB max_connections limit reached",
    confidence: 72,
    evidence: [
      "PostgreSQL max_connections=200 hit at 14:15",
      "New connections rejected after threshold",
      "Wait queue depth exceeded pg_hba timeout",
    ],
    category: "Database",
  },
  {
    id: "rc3",
    title: "Insufficient connection pool size",
    confidence: 41,
    evidence: [
      "Pool size of 20 connections per pod under-provisioned",
      "Load balancer distributing uneven traffic",
    ],
    category: "Infrastructure",
  },
];

export const confidenceData = [
  { name: "Connection Leak", confidence: 94, fill: "#ef4444" },
  { name: "DB Limit Hit", confidence: 72, fill: "#f97316" },
  { name: "Pool Size", confidence: 41, fill: "#eab308" },
  { name: "Network Issue", confidence: 18, fill: "#6b7280" },
  { name: "Config Drift", confidence: 12, fill: "#6b7280" },
];

export const serviceNodes: ServiceNode[] = [
  { id: "client", name: "Client Apps", status: "degraded", x: 120, y: 200 },
  { id: "cdn", name: "CDN", status: "healthy", x: 120, y: 340 },
  { id: "gateway", name: "API Gateway", status: "down", x: 300, y: 270 },
  { id: "auth", name: "Auth Service", status: "degraded", x: 480, y: 140 },
  { id: "user", name: "User Service", status: "down", x: 480, y: 270 },
  { id: "payment", name: "Payment Service", status: "degraded", x: 480, y: 400 },
  { id: "db", name: "PostgreSQL DB", status: "down", x: 660, y: 200 },
  { id: "cache", name: "Redis Cache", status: "healthy", x: 660, y: 340 },
  { id: "notif", name: "Notifications", status: "healthy", x: 660, y: 460 },
];

export const serviceEdges: ServiceEdge[] = [
  { from: "client", to: "gateway", latency: 890, errorRate: 34 },
  { from: "cdn", to: "gateway", latency: 120, errorRate: 2 },
  { from: "gateway", to: "auth", latency: 450, errorRate: 18 },
  { from: "gateway", to: "user", latency: 1200, errorRate: 41 },
  { from: "gateway", to: "payment", latency: 780, errorRate: 29 },
  { from: "user", to: "db", latency: 2100, errorRate: 56 },
  { from: "payment", to: "db", latency: 1900, errorRate: 48 },
  { from: "user", to: "cache", latency: 12, errorRate: 0 },
  { from: "payment", to: "notif", latency: 45, errorRate: 1 },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "I'm Sentinel AI, your autonomous incident investigator. I've analyzed **INC-2847** and identified a connection pool exhaustion caused by a connection leak in api-gateway v2.4.1.\n\n**Immediate recommendation:** Roll back to v2.4.0 to restore normal operations. Would you like me to walk through the evidence or generate a full incident report?",
    timestamp: "14:24",
  },
];
