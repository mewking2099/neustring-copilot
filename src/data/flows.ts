import type { LucideIcon } from "lucide-react"
import {
  Radio, TrendingUp, Trophy, Globe, BarChart3, Handshake,
  ListChecks, ClipboardCheck, Search, AlertTriangle, AlertOctagon,
  Zap, FileText, LayoutDashboard, HelpCircle,
  Pencil, Copy, Eye, FilePlus, FileInput, FileEdit, FileSearch,
  Plus, ExternalLink, Download, Share2,
} from "lucide-react"

export type FlowCategory = "Queries" | "Tasks" | "Functions"

export interface PinnedItem {
  id: string
  name: string
  icon: LucideIcon
  route: string
  flowId?: string
}

export interface NonActionFlow {
  id: string
  category: "Queries" | "Tasks"
  icon: LucideIcon
  name: string
  description: string
  route: "/chat"
}

export interface SubAction {
  id: string
  label: string
  route: string
  icon?: LucideIcon
}

export interface ActionFlow {
  id: string
  category: "Functions"
  icon: LucideIcon
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
  { id: "traffic",       category: "Queries", icon: Radio,         name: "Traffic Patterns",      description: "Bilateral data analysis by partner",      route: "/chat" },
  { id: "forecast",      category: "Queries", icon: TrendingUp,    name: "Forecast Query",         description: "Volume & revenue by partner",              route: "/chat" },
  { id: "rankings",      category: "Queries", icon: Trophy,        name: "Corridor Rankings",      description: "Outbound deal count by country",           route: "/chat" },
  { id: "partners",      category: "Queries", icon: Globe,         name: "Partner Status",         description: "Deal expiry & service availability",       route: "/chat" },
  { id: "multirankings", category: "Queries", icon: BarChart3,     name: "Multi-Service Rankings", description: "Top partners ranked by service type",      route: "/chat" },
  { id: "negotiation",   category: "Queries", icon: Handshake,     name: "Negotiation Brief",      description: "AI-prepared strategy & next steps",        route: "/chat" },
  // ── Tasks ─────────────────────────────────────────────────────────────────
  { id: "tasks",         category: "Tasks", icon: ListChecks,    name: "Priority Tasks",     description: "Urgent items across your portfolio",        route: "/chat" },
  { id: "approvals",     category: "Tasks", icon: ClipboardCheck,name: "Deal Approvals",     description: "Deals pending your sign-off",               route: "/chat" },
  { id: "coherency",     category: "Tasks", icon: Search,        name: "Contract Coherency", description: "Configuration mismatches & conflicts",       route: "/chat" },
  { id: "gaps",          category: "Tasks", icon: AlertTriangle, name: "Missing Rates",      description: "Service gaps + monthly revenue at risk",    route: "/chat" },
  { id: "anomaly",       category: "Tasks", icon: AlertOctagon,  name: "Traffic Anomalies",  description: "Unusual spikes outside normal patterns",    route: "/chat" },
  // ── Functions ─────────────────────────────────────────────────────────────
  {
    id: "action-deals", category: "Functions", icon: Zap, name: "Deals",
    description: "Manage roaming deal agreements",
    subActions: [
      { id: "deal-create",    label: "Create",    route: "/deal/new",  icon: Zap      },
      { id: "deal-edit",      label: "Edit",      route: "/chat",      icon: Pencil   },
      { id: "deal-duplicate", label: "Duplicate", route: "/chat",      icon: Copy     },
      { id: "deal-review",    label: "Review",    route: "/chat",      icon: Eye      },
    ],
  },
  {
    id: "action-contract", category: "Functions", icon: FileText, name: "Contract",
    description: "Manage roaming contracts & clauses",
    subActions: [
      { id: "contract-create",     label: "Create Manually",  route: "/contract/new",       icon: FilePlus   },
      { id: "contract-from-deal",  label: "Create from Deal", route: "/contract/from-deal", icon: FileInput  },
      { id: "contract-edit",       label: "Edit",             route: "/contract/1/edit",    icon: FileEdit   },
      { id: "contract-review",     label: "Review",           route: "/contract/1/review",  icon: FileSearch },
    ],
  },
  {
    id: "action-forecast", category: "Functions", icon: TrendingUp, name: "Forecast",
    description: "Manage volume & revenue forecasts",
    subActions: [
      { id: "forecast-create",    label: "Create",    route: "/chat", icon: Plus   },
      { id: "forecast-edit",      label: "Edit",      route: "/chat", icon: Pencil },
      { id: "forecast-duplicate", label: "Duplicate", route: "/chat", icon: Copy   },
      { id: "forecast-review",    label: "Review",    route: "/chat", icon: Eye    },
    ],
  },
  {
    id: "action-quicksight", category: "Functions", icon: LayoutDashboard, name: "QuickSight",
    description: "BI dashboards & visual analytics",
    subActions: [
      { id: "qs-open",   label: "Open",   route: "/chat", icon: ExternalLink },
      { id: "qs-export", label: "Export", route: "/chat", icon: Download     },
      { id: "qs-share",  label: "Share",  route: "/chat", icon: Share2       },
    ],
  },
  {
    id: "help", category: "Functions", icon: HelpCircle, name: "Contextual Help",
    description: "How-to guides & deep-links",
    subActions: [],
  },
]

export const FLOW_LABELS: Record<string, string> = Object.fromEntries(
  DEMO_FLOWS.flatMap((f) =>
    isActionFlow(f) ? [] : [[f.id, f.name]]
  )
)

export const DEFAULT_PINS: PinnedItem[] = [
  { id: "deal-create", name: "Create Deal",      icon: Zap,          route: "/deal/new" },
  { id: "traffic",     name: "Traffic Patterns", icon: Radio,        route: "/chat", flowId: "traffic"   },
  { id: "tasks",       name: "Priority Tasks",   icon: ListChecks,   route: "/chat", flowId: "tasks"     },
  { id: "approvals",   name: "Deal Approvals",   icon: ClipboardCheck, route: "/chat", flowId: "approvals" },
]
