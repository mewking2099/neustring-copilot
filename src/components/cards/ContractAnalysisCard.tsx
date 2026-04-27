import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchContractAnalysisData } from "@/services/contracts"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SEV_CONFIG, type ContractChange } from "@/data/contractConv"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"
import type { CardProps } from "./index"

const FOOTER_CHIPS = ["Export PDF", "Copy summary", "Negotiate drafts", "Flag for legal"]

function ChangeCard({ change }: { change: ContractChange }) {
  const sev = SEV_CONFIG[change.severity]
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: sev.border }}>
      <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: sev.bg }}>
        <span className="text-sm" aria-hidden="true">{sev.icon}</span>
        <span className="text-xs font-semibold" style={{ color: sev.color }}>{change.severity}</span>
        <span className="text-xs text-[#667085]">· {change.type}</span>
      </div>
      <div className="px-4 py-3 space-y-3 bg-white">
        <p className="text-sm font-semibold text-[#182230]">{change.title}</p>
        <p className="text-xs text-[#667085] leading-relaxed">{change.explanation}</p>
        <div className="rounded-lg border-l-4 border-red-400 bg-red-50 px-3 py-2">
          <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1">Removed</p>
          <p className="text-xs text-[#344054] leading-relaxed italic">{change.removed}</p>
        </div>
        <div className="rounded-lg border-l-4 border-green-500 bg-green-50 px-3 py-2">
          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wide mb-1">Added</p>
          <p className="text-xs text-[#344054] leading-relaxed italic">{change.added}</p>
        </div>
        <div className="rounded-lg border-l-4 border-[#0e2c46] bg-[#f2f4f7] px-3 py-2">
          <p className="text-[10px] font-semibold text-[#0e2c46] uppercase tracking-wide mb-1" aria-hidden="true">💡 Recommendation</p>
          <p className="text-xs text-[#344054] leading-relaxed">{change.recommendation}</p>
        </div>
      </div>
    </div>
  )
}

export function ContractAnalysisCard({ onChip: _ }: CardProps) {
  const [activeTab, setActiveTab] = useState("all")

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["contract-analysis"],
    queryFn: fetchContractAnalysisData,
  })

  if (isLoading) return <CardLoading title="Contract Analysis" rows={4} />
  if (isError || !data) return <CardError title="Contract Analysis" onRetry={refetch} />

  const { changes } = data
  const critical = changes.filter((c) => c.severity === "Critical")
  const medium   = changes.filter((c) => c.severity === "Medium")
  const low      = changes.filter((c) => c.severity === "Low")

  const visibleChanges: ContractChange[] =
    activeTab === "all"      ? changes :
    activeTab === "critical" ? critical :
    activeTab === "medium"   ? medium :
                               low

  return (
    <div className="mt-3 max-w-2xl space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#182230]">{changes.length} changes found across 6 clauses</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {[
            { key: "Critical", items: critical, cfg: SEV_CONFIG.Critical },
            { key: "Medium",   items: medium,   cfg: SEV_CONFIG.Medium },
            { key: "Low",      items: low,       cfg: SEV_CONFIG.Low },
          ].map(({ key, items, cfg }) => (
            <span key={key} className="text-xs font-medium rounded-full px-2 py-0.5" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
              {cfg.icon} {items.length} {key}
            </span>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({changes.length})</TabsTrigger>
          <TabsTrigger value="critical">Critical ({critical.length})</TabsTrigger>
          <TabsTrigger value="medium">Medium ({medium.length})</TabsTrigger>
          <TabsTrigger value="low">Low ({low.length})</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="space-y-3 mt-2">
            {visibleChanges.map((c) => <ChangeCard key={c.id} change={c} />)}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-2 pt-1">
        {FOOTER_CHIPS.map((chip) => (
          <button key={chip} className="rounded-full border border-[#d0d5dd] bg-white text-[#344054] text-xs px-3 py-1.5 hover:border-[#0e2c46] hover:text-[#0e2c46] transition-colors">
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}
