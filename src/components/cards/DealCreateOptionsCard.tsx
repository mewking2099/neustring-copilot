import { Copy, Sparkles, Upload } from "lucide-react"
import { useAppStore } from "@/store/app"
import type { CardProps } from "@/components/cards"

const OPTIONS = [
  {
    id: "deal-clone-picker",
    icon: Copy,
    label: "Clone a deal",
    sub: "Start from one of your past deals",
    primary: false,
  },
  {
    id: "deal-qualify",
    icon: Sparkles,
    label: "Start fresh",
    sub: "AI guides you with a few quick questions",
    primary: true,
  },
  {
    id: "deal-ingest-chat",
    icon: Upload,
    label: "From document",
    sub: "Upload a proposal, SoW, or email",
    primary: false,
  },
] as const

export function DealCreateOptionsCard({ onChip }: CardProps) {
  const setQualifyingDrawerOpen = useAppStore((s) => s.setQualifyingDrawerOpen)

  function handleOption(id: string) {
    if (id === "deal-qualify") {
      setQualifyingDrawerOpen(true)
      return
    }
    onChip?.(id)
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {OPTIONS.map(({ id, icon: Icon, label, sub, primary }) => (
        <button
          key={id}
          onClick={() => handleOption(id)}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors group ${
            primary
              ? "bg-[#0e2c46] border-[#0e2c46] text-white hover:bg-[#0a2038]"
              : "bg-white border-[#d0d5dd] text-[#182230] hover:border-[#0e2c46] hover:bg-[#f8fafc]"
          }`}
        >
          <Icon
            className={`w-4 h-4 flex-shrink-0 ${primary ? "text-[#82bc34]" : "text-[#667085] group-hover:text-[#0e2c46]"}`}
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${primary ? "text-white" : "text-[#182230]"}`}>{label}</p>
            <p className={`text-xs mt-0.5 ${primary ? "text-white/60" : "text-[#667085]"}`}>{sub}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
