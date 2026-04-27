import { Star } from "lucide-react"
import { DemoBadge } from "@/components/nav/DemoBadge"

const STARRED = [
  { id: "s1", title: "Q4 APAC Forecast",           category: "Analytical" as const },
  { id: "s2", title: "Vodafone DE Rate Review",     category: "Analytical" as const },
  { id: "s3", title: "MEA Expansion Analysis",      category: "Analytical" as const },
]

const CONTRACT_SESSIONS = [
  { id: "c1", name: "Yaana Solutions LLC",   active: true  },
  { id: "c2", name: "Deutsche Telekom AG",   active: false },
]

const TODAY_CHATS = [
  "Show traffic anomalies for FRAF1",
  "Compare Q3 vs Q2 corridor volumes",
  "Draft negotiation brief for Vodafone",
  "Priority tasks this week",
]

export function HistoryTab() {
  return (
    <div className="space-y-5">
      {/* Starred */}
      <div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-[#667085] uppercase tracking-wider">
          <Star className="w-3 h-3" />
          Saved
        </div>
        <div className="space-y-0.5">
          {STARRED.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-[#f2f4f7] transition-colors text-left"
            >
              <span className="text-sm text-[#344054] truncate">{item.title}</span>
              <DemoBadge category={item.category} />
            </button>
          ))}
        </div>
      </div>

      {/* Contract Sessions */}
      <div>
        <div className="px-3 py-1.5 text-[10px] font-semibold text-[#667085] uppercase tracking-wider flex items-center gap-1.5">
          Contract Sessions
          <span className="bg-[#0e2c46] text-white text-[9px] rounded-full px-1.5 py-0.5 leading-none">
            {CONTRACT_SESSIONS.length}
          </span>
        </div>
        <div className="space-y-0.5">
          {CONTRACT_SESSIONS.map((s) => (
            <button
              key={s.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#f2f4f7] transition-colors text-left"
            >
              <span
                className={
                  s.active
                    ? "text-sm font-semibold text-[#4d7c0f] bg-[#e8f2ce] rounded px-1.5 py-0.5"
                    : "text-sm text-[#344054]"
                }
              >
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Today */}
      <div>
        <div className="px-3 py-1.5 text-[10px] font-semibold text-[#667085] uppercase tracking-wider">
          Today
        </div>
        <div className="space-y-0.5">
          {TODAY_CHATS.map((title, i) => (
            <button
              key={i}
              className="w-full px-3 py-2 rounded-lg hover:bg-[#f2f4f7] transition-colors text-left"
            >
              <span className="text-sm text-[#344054] truncate block">{title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
