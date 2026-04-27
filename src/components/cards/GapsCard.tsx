import { useQuery } from "@tanstack/react-query"
import { fetchGapsData, type GapImpact } from "@/services/rodeo"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

const IMPACT_STYLE: Record<GapImpact, string> = {
  Billing: "bg-[#fef3f2] text-[#b42318]",
  Minor:   "bg-[#fffaeb] text-[#b54708]",
}

interface Props { onChip?: (flowId: string) => void }

export function GapsCard({ onChip: _onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["gaps"],
    queryFn: fetchGapsData,
  })

  if (isLoading) return <CardLoading title="Service Gaps" rows={3} />
  if (isError || !data) return <CardError title="Service Gaps" onRetry={refetch} />

  const billingCount = data.gaps.filter((g) => g.impact === "Billing").length

  return (
    <CardShell
      title="Service Gaps"
      subtitle={`${data.gaps.length} gaps detected · ${billingCount} billing-impacting`}
    >
      <div className="divide-y divide-[#f2f4f7]">
        {data.gaps.map((g, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-[#667085]">{g.dealId}</span>
              <span className="text-[10px] text-[#98a2b3]">·</span>
              <span className="text-[10px] font-medium text-[#344054]">{g.partner}</span>
              <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${IMPACT_STYLE[g.impact]}`}>
                {g.impact}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-medium bg-[#e8f2ce] text-[#0e2c46] px-2 py-0.5 rounded">
                {g.service}
              </span>
            </div>
            <p className="text-xs text-[#667085] leading-relaxed mb-2">{g.description}</p>
            <button className="text-xs font-medium text-[#0e2c46] border border-[#d0d5dd] rounded-full px-3 py-1 hover:border-[#0e2c46] transition-colors">
              Add rate ↗
            </button>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
