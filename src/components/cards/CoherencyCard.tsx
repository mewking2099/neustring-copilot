import { useQuery } from "@tanstack/react-query"
import { fetchCoherencyData, type CoherencySeverity } from "@/services/rodeo"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

const SEV_STYLE: Record<CoherencySeverity, string> = {
  High:   "bg-[#fef3f2] text-[#b42318]",
  Medium: "bg-[#fffaeb] text-[#b54708]",
}

interface Props { onChip?: (flowId: string) => void }

export function CoherencyCard({ onChip: _onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["coherency"],
    queryFn: fetchCoherencyData,
  })

  if (isLoading) return <CardLoading title="Contract Coherency" rows={3} />
  if (isError || !data) return <CardError title="Contract Coherency" onRetry={refetch} />

  return (
    <CardShell title="Contract Coherency Failures" subtitle={`${data.failures.length} conflicts require review before next billing cycle`}>
      <div className="divide-y divide-[#f2f4f7]">
        {data.failures.map((f, i) => (
          <div key={i} className="px-4 py-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-xs font-semibold text-[#344054]">{f.contract}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${SEV_STYLE[f.severity]}`}>
                {f.severity}
              </span>
            </div>
            <p className="text-xs text-[#0e2c46] font-medium mb-1">{f.clause}</p>
            <p className="text-xs text-[#667085] leading-relaxed mb-2">{f.conflict}</p>
            <div className="flex items-start gap-2 bg-[#f2f4f7] rounded-lg px-3 py-2">
              <span className="text-[10px] text-[#667085] leading-relaxed">{f.suggestion}</span>
            </div>
            <button className="mt-2 text-xs font-medium text-[#0e2c46] border border-[#d0d5dd] rounded-full px-3 py-1 hover:border-[#0e2c46] transition-colors">
              Resolve ↗
            </button>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
