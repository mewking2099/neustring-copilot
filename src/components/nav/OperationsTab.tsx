import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight, Pin, PinOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app"
import { DEMO_FLOWS, isActionFlow } from "@/data/flows"
import type { DemoFlow, NonActionFlow, ActionFlow, FlowCategory, PinnedItem } from "@/data/flows"
import { DemoBadge } from "@/components/nav/DemoBadge"

const CATEGORY_ORDER: FlowCategory[] = ["Queries", "Tasks", "Functions"]

function groupFlows() {
  const groups: Record<FlowCategory, DemoFlow[]> = { Queries: [], Tasks: [], Functions: [] }
  for (const f of DEMO_FLOWS) groups[f.category].push(f)
  return groups
}

// ── Non-action flow row ────────────────────────────────────────────────────
function NonActionItem({ flow }: { flow: NonActionFlow }) {
  const navigate = useNavigate()
  const { isPinned, pinItem, unpinItem, setPendingFlow } = useAppStore()
  const pinned = isPinned(flow.id)

  function handleClick() {
    setPendingFlow(flow.id)
    navigate("/chat")
  }

  function handlePin(e: React.MouseEvent) {
    e.stopPropagation()
    const item: PinnedItem = { id: flow.id, name: flow.name, icon: flow.icon, route: "/chat", flowId: flow.id }
    pinned ? unpinItem(flow.id) : pinItem(item)
  }

  return (
    <div
      className="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm text-[#344054] hover:bg-[#f2f4f7] hover:text-[#0e2c46] transition-colors"
      onClick={handleClick}
    >
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#f2f4f7] text-[#344054]">
        <flow.icon className="w-4 h-4" />
      </span>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-medium truncate">{flow.name}</span>
        <span className="text-xs text-[#667085] truncate">{flow.description}</span>
      </div>
      <button
        onClick={handlePin}
        title={pinned ? "Unpin" : "Pin"}
        className={cn(
          "shrink-0 w-6 h-6 flex items-center justify-center rounded text-[#98a2b3] hover:text-[#0e2c46] transition-all",
          pinned ? "opacity-100 text-[#0e2c46]" : "opacity-0 group-hover:opacity-100"
        )}
      >
        {pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
      </button>
      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#98a2b3]" />
    </div>
  )
}

// ── Action flow row (expandable) ───────────────────────────────────────────
function ActionItem({ flow }: { flow: ActionFlow }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const { isPinned, pinItem, unpinItem, setNavOpen } = useAppStore()
  const pinned = isPinned(flow.id)

  function handlePin(e: React.MouseEvent) {
    e.stopPropagation()
    const item: PinnedItem = { id: flow.id, name: flow.name, icon: flow.icon, route: "/chat" }
    pinned ? unpinItem(flow.id) : pinItem(item)
  }

  function handleSubAction(e: React.MouseEvent, route: string, _subId: string) {
    e.stopPropagation()
    navigate(route)
    setNavOpen(false)
  }

  return (
    <div>
      <div
        className="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm text-[#344054] hover:bg-[#f2f4f7] hover:text-[#0e2c46] transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#dbeafe] text-[#1e40af]">
          <flow.icon className="w-4 h-4" />
        </span>
        <span className="flex-1 text-sm font-medium">{flow.name}</span>
        <button
          onClick={handlePin}
          title={pinned ? "Unpin" : "Pin"}
          className={cn(
            "shrink-0 w-6 h-6 flex items-center justify-center rounded text-[#98a2b3] hover:text-[#0e2c46] transition-all",
            pinned ? "opacity-100 text-[#0e2c46]" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
        </button>
        <ChevronRight
          className={cn(
            "w-3.5 h-3.5 shrink-0 text-[#98a2b3] transition-transform duration-150",
            expanded && "rotate-90"
          )}
        />
      </div>

      {/* Sub-actions */}
      {expanded && (
        <div className="mb-1 space-y-0.5">
          {(flow.subActions ?? []).map((sub) => {
            const subPinned = isPinned(sub.id)
            return (
              <div
                key={sub.id}
                className="group/sub flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm text-[#344054] hover:bg-[#f2f4f7] hover:text-[#0e2c46] transition-colors"
                onClick={(e) => handleSubAction(e, sub.route, sub.id)}
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#f2f4f7] text-[#344054] ml-9">
                  {(() => { const I = sub.icon ?? flow.icon; return <I className="w-4 h-4" /> })()}
                </span>
                <span className="flex-1 text-sm font-medium truncate">{sub.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const item: PinnedItem = { id: sub.id, name: `${sub.label} · ${flow.name}`, icon: sub.icon ?? flow.icon, route: sub.route }
                    subPinned ? unpinItem(sub.id) : pinItem(item)
                  }}
                  title={subPinned ? "Unpin" : "Pin"}
                  className={cn(
                    "shrink-0 w-6 h-6 flex items-center justify-center rounded text-[#98a2b3] hover:text-[#0e2c46] transition-all",
                    subPinned ? "opacity-100 text-[#0e2c46]" : "opacity-0 group-hover/sub:opacity-100"
                  )}
                >
                  {subPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Operations Tab ─────────────────────────────────────────────────────────
export function OperationsTab() {
  const groups = groupFlows()

  return (
    <div className="space-y-4">
      {CATEGORY_ORDER.map((cat) => {
        const flows = groups[cat]
        if (!flows.length) return null
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <DemoBadge category={cat} />
            </div>
            <div className="space-y-0.5">
              {flows.map((flow) =>
                isActionFlow(flow)
                  ? <ActionItem key={flow.id} flow={flow} />
                  : <NonActionItem key={flow.id} flow={flow as NonActionFlow} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
