import { TrendingUp, TrendingDown } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchRankingsData } from "@/services/analytics"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

interface Props { onChip?: (flowId: string) => void }

export function RankingsCard({ onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["rankings"],
    queryFn: fetchRankingsData,
  })

  if (isLoading) return <CardLoading title="Corridor Rankings" rows={5} />
  if (isError || !data) return <CardError title="Corridor Rankings" onRetry={refetch} />

  return (
    <CardShell
      title="Outbound Corridor Rankings"
      subtitle="France origin · Apr 2025 · Data traffic"
      chips={data.chips}
      onChip={onChip}
    >
      <div className="divide-y divide-[#f2f4f7]">
        {data.corridors.map((row) => (
          <div key={row.rank} className="flex items-center gap-3 px-4 py-3">
            <span className="w-6 h-6 rounded-full bg-[#f2f4f7] text-[#344054] text-xs font-semibold flex items-center justify-center flex-shrink-0">
              {row.rank}
            </span>
            <span className="flex-1 text-sm text-[#344054] truncate">{row.corridor}</span>
            <span className="text-sm font-medium text-[#182230] tabular-nums">{row.volume}</span>
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${row.mom >= 0 ? "text-[#027a48]" : "text-[#b42318]"}`}>
              {row.mom >= 0
                ? <TrendingUp className="w-3 h-3" aria-hidden="true" />
                : <TrendingDown className="w-3 h-3" aria-hidden="true" />}
              {row.mom >= 0 ? "+" : ""}{row.mom}%
            </span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
