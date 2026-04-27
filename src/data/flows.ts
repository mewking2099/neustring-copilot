export type FlowCategory = "Analytical" | "RoDeO" | "Action"

export interface PinnedItem {
  id: string
  name: string
  icon: string
  route: string
  flowId?: string  // for chat flows that trigger a card
}

export interface NonActionFlow {
  id: string
  category: "Analytical" | "RoDeO"
  icon: string
  name: string
  description: string
  route: "/chat"
}

export interface SubAction {
  id: string
  label: string
  route: string
  icon?: string
}

export interface ActionFlow {
  id: string
  category: "Action"
  icon: string
  name: string
  subActions: SubAction[]
}

export type DemoFlow = NonActionFlow | ActionFlow

export function isActionFlow(f: DemoFlow): f is ActionFlow {
  return f.category === "Action"
}

export const DEMO_FLOWS: DemoFlow[] = [
  // ── Analytical ────────────────────────────────────────────────────
  { id: "traffic",       category: "Analytical", icon: "📊", name: "Traffic Patterns",      description: "Data corridor analysis",         route: "/chat" },
  { id: "forecast",      category: "Analytical", icon: "📡", name: "Forecast Query",         description: "Partner traffic forecast",        route: "/chat" },
  { id: "rankings",      category: "Analytical", icon: "🏆", name: "Corridor Rankings",      description: "Outbound ranking view",           route: "/chat" },
  { id: "partners",      category: "Analytical", icon: "🌍", name: "Partner Status",         description: "Scandinavian partner status",      route: "/chat" },
  { id: "multirankings", category: "Analytical", icon: "📈", name: "Multi-Service Rankings", description: "FRAF1 multi-service breakdown",    route: "/chat" },
  { id: "negotiation",   category: "Analytical", icon: "🤝", name: "Negotiation Brief",      description: "Vodafone DE negotiation summary",  route: "/chat" },
  { id: "help",          category: "Analytical", icon: "❓", name: "Contextual Help",        description: "Get help with any flow",          route: "/chat" },
  // ── RoDeO ─────────────────────────────────────────────────────────
  { id: "tasks",         category: "RoDeO", icon: "✅", name: "Priority Tasks",     description: "3-item priority queue",           route: "/chat" },
  { id: "approvals",     category: "RoDeO", icon: "✍️", name: "Deal Approvals",     description: "2 deals awaiting approval",        route: "/chat" },
  { id: "coherency",     category: "RoDeO", icon: "🔗", name: "Contract Coherency", description: "Coherency failure list",          route: "/chat" },
  { id: "gaps",          category: "RoDeO", icon: "🕳️", name: "Missing Rates",      description: "Service gaps in active deals",     route: "/chat" },
  { id: "anomaly",       category: "RoDeO", icon: "⚠️", name: "Traffic Anomalies",  description: "Spike/anomaly detection",         route: "/chat" },
  // ── Action ────────────────────────────────────────────────────────
  {
    id: "action-deals", category: "Action", icon: "💰", name: "Deals",
    subActions: [
      { id: "deal-create",    label: "Create",    route: "/deal/new", icon: "⚡" },
      { id: "deal-edit",      label: "Edit",      route: "/chat" },
      { id: "deal-duplicate", label: "Duplicate", route: "/chat" },
      { id: "deal-review",    label: "Review",    route: "/chat" },
    ],
  },
  {
    id: "action-contract", category: "Action", icon: "📄", name: "Contract",
    subActions: [
      { id: "contract-create",     label: "Create Manually",  route: "/contract/new" },
      { id: "contract-from-deal",  label: "Create from Deal", route: "/contract/from-deal" },
      { id: "contract-edit",       label: "Edit",             route: "/contract/1/edit" },
      { id: "contract-review",     label: "Review",           route: "/contract/1/review" },
    ],
  },
  {
    id: "action-forecast", category: "Action", icon: "🔭", name: "Forecast",
    subActions: [
      { id: "forecast-create",    label: "Create",    route: "/chat" },
      { id: "forecast-edit",      label: "Edit",      route: "/chat" },
      { id: "forecast-duplicate", label: "Duplicate", route: "/chat" },
      { id: "forecast-review",    label: "Review",    route: "/chat" },
    ],
  },
  {
    id: "action-quicksight", category: "Action", icon: "📺", name: "QuickSight",
    subActions: [
      { id: "qs-open",   label: "Open",   route: "/chat" },
      { id: "qs-export", label: "Export", route: "/chat" },
      { id: "qs-share",  label: "Share",  route: "/chat" },
    ],
  },
]

export const FLOW_LABELS: Record<string, string> = Object.fromEntries(
  DEMO_FLOWS.flatMap((f) =>
    isActionFlow(f) ? [] : [[f.id, `${f.icon} ${f.name}`]]
  )
)

export const DEFAULT_PINS: PinnedItem[] = [
  { id: "deal-create", name: "Create Deal",      icon: "⚡", route: "/deal/new" },
  { id: "traffic",     name: "Traffic Patterns", icon: "📊", route: "/chat", flowId: "traffic"   },
  { id: "tasks",       name: "Priority Tasks",   icon: "✅", route: "/chat", flowId: "tasks"     },
  { id: "approvals",   name: "Deal Approvals",   icon: "✍️", route: "/chat", flowId: "approvals" },
]
