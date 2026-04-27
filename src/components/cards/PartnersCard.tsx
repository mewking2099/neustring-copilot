import { useQuery } from "@tanstack/react-query"
import { fetchPartnersData, type PartnerStatus } from "@/services/analytics"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

const STATUS_STYLES: Record<PartnerStatus, string> = {
  "Active":   "bg-[#ecfdf3] text-[#027a48]",
  "Expiring": "bg-[#fffaeb] text-[#b54708]",
  "At-risk":  "bg-[#fef3f2] text-[#b42318]",
}

interface Props { onChip?: (flowId: string) => void }

export function PartnersCard({ onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["partners"],
    queryFn: fetchPartnersData,
  })

  if (isLoading) return <CardLoading title="Partner Status" rows={4} />
  if (isError || !data) return <CardError title="Partner Status" onRetry={refetch} />

  const expiringSoon = data.partners.filter((p) => p.status !== "Active").length

  return (
    <CardShell
      title="Scandinavian Partner Status"
      subtitle={`${data.partners.length} partners · ${expiringSoon} action needed`}
      chips={data.chips}
      onChip={onChip}
    >
      <div className="divide-y divide-[#f2f4f7]">
        {data.partners.map((p) => (
          <div key={p.tadig} className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-[#0e2c46] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0" aria-hidden="true">
              {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#182230] truncate">{p.name}</p>
              <p className="text-xs text-[#667085] font-mono">{p.tadig}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[p.status]}`}>
                {p.status}
              </span>
              <p className="text-[10px] text-[#98a2b3] mt-0.5">{p.lastContact}</p>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
