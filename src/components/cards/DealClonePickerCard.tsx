import { useNavigate } from "react-router-dom"
import { ChevronRight, Circle } from "lucide-react"
import { DEAL_HISTORY } from "@/data/dealHistory"
import type { CardProps } from "@/components/cards"

const RECENT = [...DEAL_HISTORY]
  .sort((a, b) => b.closedAtISO.localeCompare(a.closedAtISO))
  .slice(0, 5)

const SERVICE_COLORS: Record<string, string> = {
  Data:  "bg-blue-50 text-blue-700",
  Voice: "bg-purple-50 text-purple-700",
  SMS:   "bg-amber-50 text-amber-700",
  IoT:   "bg-teal-50 text-teal-700",
}

export function DealClonePickerCard(_props: CardProps) {
  const navigate = useNavigate()

  function handleSelect(dealId: string) {
    const deal = DEAL_HISTORY.find((d) => d.id === dealId)
    if (!deal) return
    navigate("/deal/new", { state: { cloneFrom: deal } })
  }

  return (
    <div className="mt-3 flex flex-col gap-1.5">
      <p className="text-xs text-[#667085] mb-1">Select a deal to clone</p>
      {RECENT.map((deal) => (
        <button
          key={deal.id}
          onClick={() => handleSelect(deal.id)}
          className="flex items-center gap-3 rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-left hover:border-[#0e2c46] hover:bg-[#f8fafc] transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-[#667085]">{deal.id}</span>
              <Circle
                className={`w-1.5 h-1.5 fill-current flex-shrink-0 ${deal.status === "active" ? "text-[#82bc34]" : "text-[#d0d5dd]"}`}
              />
              <span className="text-xs text-[#98a2b3]">{deal.closedAt}</span>
            </div>
            <p className="text-sm font-semibold text-[#182230] truncate">{deal.partnerName}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {deal.services.map((svc) => (
                <span
                  key={svc}
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${SERVICE_COLORS[svc] ?? "bg-[#f2f4f7] text-[#344054]"}`}
                >
                  {svc}
                </span>
              ))}
              <span className="text-[10px] text-[#98a2b3] self-center">{deal.termMonths}mo · {deal.currency}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#98a2b3] group-hover:text-[#0e2c46] flex-shrink-0 transition-colors" />
        </button>
      ))}
    </div>
  )
}
