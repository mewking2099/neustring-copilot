export type FlowCategory = "Queries" | "Tasks" | "Functions"

export interface PinnedItem {
  id: string
  name: string
  icon: string
  route: string
  flowId?: string
}

export interface NonActionFlow {
  id: string
  category: "Queries" | "Tasks"
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
  category: "Functions"
  icon: string
  name: string
  description: string
  subActions?: SubAction[]
}

export type DemoFlow = NonActionFlow | ActionFlow

export function isActionFlow(f: DemoFlow): f is ActionFlow {
  return f.category === "Functions"
}

export const DEMO_FLOWS: DemoFlow[] = [
  // ── Queries ───────────────────────────────────────────────────────────────
  { id: "traffic",       category: "Queries", icon: "📡", name: "Traffic Patterns",      description: "Bilateral data analysis by partner",      route: "/chat" },
  { id: "forecast",      category: "Queries", icon: "📈", name: "Forecast Query",         description: "Volume & revenue by partner",              route: "/chat" },
  { id: "rankings",      category: "Queries", icon: "🏆", name: "Corridor Rankings",      description: "Outbound deal count by country",           route: "/chat" },
  { id: "partners",      category: "Queries", icon: "🌐", name: "Partner Status",         description: "Deal expiry & service availability",       route: "/chat" },
  { id: "multirankings", category: "Queries", icon: "📊", name: "Multi-Service Rankings", description: "Top partners ranked by service type",      route: "/chat" },
  { id: "negotiation",   category: "Queries", icon: "🤝", name: "Negotiation Brief",      description: "AI-prepared strategy & next steps",        route: "/chat" },
  // ── Tasks ─────────────────────────────────────────────────────────────────
  { id: "tasks",         category: "Tasks", icon: "✅", name: "Priority Tasks",     description: "Urgent items across your portfolio",        route: "/chat" },
  { id: "approvals",     category: "Tasks", icon: "📋", name: "Deal Approvals",     description: "Deals pending your sign-off",               route: "/chat" },
  { id: "coherency",     category: "Tasks", icon: "🔍", name: "Contract Coherency", description: "Configuration mismatches & conflicts",       route: "/chat" },
  { id: "gaps",          category: "Tasks", icon: "⚠️", name: "Missing Rates",      description: "Service gaps + monthly revenue at risk",    route: "/chat" },
  { id: "anomaly",       category: "Tasks", icon: "🚨", name: "Traffic Anomalies",  description: "Unusual spikes outside normal patterns",    route: "/chat" },
  // ── Functions ─────────────────────────────────────────────────────────────
  {
    id: "action-deals", category: "Functions", icon: "⚡", name: "Deals",
    description: "Manage roaming deal agreements",
    subActions: [
      { id: "deal-create",    label: "Create",    route: "/deal/new", icon: "⚡" },
      { id: "deal-edit",      label: "Edit",      route: "/chat" },
      { id: "deal-duplicate", label: "Duplicate", route: "/chat" },
      { id: "deal-review",    label: "Review",    route: "/chat" },
    ],
  },
  {
    id: "action-contract", category: "Functions", icon: "📄", name: "Contract",
    description: "Manage roaming contracts & clauses",
    subActions: [
      { id: "contract-create",     label: "Create Manually",  route: "/contract/new" },
      { id: "contract-from-deal",  label: "Create from Deal", route: "/contract/from-deal" },
      { id: "contract-edit",       label: "Edit",             route: "/contract/1/edit" },
      { id: "contract-review",     label: "Review",           route: "/contract/1/review" },
    ],
  },
  {
    id: "action-forecast", category: "Functions", icon: "📈", name: "Forecast",
    description: "Manage volume & revenue forecasts",
    subActions: [
      { id: "forecast-create",    label: "Create",    route: "/chat" },
      { id: "forecast-edit",      label: "Edit",      route: "/chat" },
      { id: "forecast-duplicate", label: "Duplicate", route: "/chat" },
      { id: "forecast-review",    label: "Review",    route: "/chat" },
    ],
  },
  {
    id: "action-quicksight", category: "Functions", icon: "🔭", name: "QuickSight",
    description: "BI dashboards & visual analytics",
    subActions: [
      { id: "qs-open",   label: "Open",   route: "/chat" },
      { id: "qs-export", label: "Export", route: "/chat" },
      { id: "qs-share",  label: "Share",  route: "/chat" },
    ],
  },
  {
    id: "help", category: "Functions", icon: "💡", name: "Contextual Help",
    description: "How-to guides & deep-links",
    subActions: [],
  },
]

export const FLOW_LABELS: Record<string, string> = Object.fromEntries(
  DEMO_FLOWS.flatMap((f) =>
    isActionFlow(f) ? [] : [[f.id, `${f.icon} ${f.name}`]]
  )
)

export const DEFAULT_PINS: PinnedItem[] = [
  { id: "deal-create", name: "Create Deal",      icon: "⚡", route: "/deal/new" },
  { id: "traffic",     name: "Traffic Patterns", icon: "📡", route: "/chat", flowId: "traffic"   },
  { id: "tasks",       name: "Priority Tasks",   icon: "✅", route: "/chat", flowId: "tasks"     },
  { id: "approvals",   name: "Deal Approvals",   icon: "📋", route: "/chat", flowId: "approvals" },
]
