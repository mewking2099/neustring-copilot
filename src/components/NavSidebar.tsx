import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app"
import { useChatStore } from "@/store/chat"
import { OperationsTab } from "@/components/nav/OperationsTab"
import { HistoryTab } from "@/components/nav/HistoryTab"

export function NavSidebar() {
  const { navOpen, setNavOpen } = useAppStore()
  const { clearMessages } = useChatStore()
  const [activeTab, setActiveTab] = useState<"operations" | "history">("operations")
  const navigate = useNavigate()

  function handleNewChat() {
    clearMessages()
    navigate("/")
    setNavOpen(false)
  }

  return (
    <div
      id="nav-sidebar"
      aria-hidden={!navOpen || undefined}
      inert={!navOpen || undefined}
      className="shrink-0 overflow-hidden transition-[width] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ width: navOpen ? 288 : 0 }}
    >
      {/* Inner — always 288px wide, hidden by parent overflow:hidden when closed */}
      <div className="w-72 h-full flex flex-col border-r border-[#e4e7ec] bg-white">

        {/* Sticky header */}
        <div className="shrink-0 px-3 pt-3 pb-2 space-y-2">
          {/* Title + collapse */}
          <div className="flex items-center justify-between h-8">
            <span className="text-sm font-semibold text-[#0e2c46]">Co Pilot</span>
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Collapse sidebar"
              className="w-7 h-7 flex items-center justify-center rounded text-[#667085] hover:bg-[#f2f4f7] hover:text-[#0e2c46] transition-colors"
              title="Collapse"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* + New Chat */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#f2f4f7] text-[#0e2c46] text-sm font-medium py-2 hover:bg-[#e4e7ec] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          {/* Operations / History tab switch */}
          <div role="tablist" aria-label="Sidebar view" className="flex rounded-lg bg-[#f2f4f7] p-0.5 gap-0.5">
            {(["operations", "history"] as const).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 rounded-md py-1 text-xs font-medium transition-colors capitalize",
                  activeTab === tab
                    ? "bg-[#0e2c46] text-white"
                    : "text-[#667085] hover:text-[#344054]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {activeTab === "operations" ? <OperationsTab /> : <HistoryTab />}
        </div>
      </div>
    </div>
  )
}
