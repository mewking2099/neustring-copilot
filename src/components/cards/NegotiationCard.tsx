import { AlertTriangle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchNegotiationData } from "@/services/analytics"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

interface Props { onChip?: (flowId: string) => void }

export function NegotiationCard({ onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["negotiation"],
    queryFn: fetchNegotiationData,
  })

  if (isLoading) return <CardLoading title="Negotiation Brief" rows={4} />
  if (isError || !data) return <CardError title="Negotiation Brief" onRetry={refetch} />

  return (
    <CardShell
      title="Vodafone Germany"
      subtitle="DEAL-4821 · In Negotiation"
      chips={data.chips}
      onChip={onChip}
    >
      <div className="grid grid-cols-2 gap-px bg-[#e4e7ec] border-t border-[#e4e7ec]">
        {data.facts.map((f) => (
          <div key={f.label} className="bg-white px-4 py-3">
            <p className="text-[10px] text-[#667085]">{f.label}</p>
            <p className="text-sm font-medium text-[#182230] mt-0.5">{f.value}</p>
          </div>
        ))}
      </div>

      <div className="px-4 pt-4 pb-3">
        <p className="text-xs font-semibold text-[#344054] mb-2">Recommended talking points</p>
        <ul className="space-y-2">
          {data.points.map((pt, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#344054] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#82bc34] flex-shrink-0 mt-2" aria-hidden="true" />
              {pt}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-4 mb-4 flex gap-2 items-start bg-[#fffaeb] border border-[#fec84b] rounded-lg px-3 py-2.5" role="alert">
        <AlertTriangle className="w-4 h-4 text-[#b54708] flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-[#b54708] leading-relaxed">{data.riskWarning}</p>
      </div>
    </CardShell>
  )
}
