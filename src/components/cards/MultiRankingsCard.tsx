import { useQuery } from "@tanstack/react-query"
import { fetchMultiRankingsData } from "@/services/analytics"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

function RankBadge({ rank }: { rank: number }) {
  const colors = ["bg-[#fef9c3] text-[#854d0e]", "bg-[#f1f5f9] text-[#475569]", "bg-[#fef3f2] text-[#9a3412]", "text-[#98a2b3]"]
  return (
    <span className={`inline-flex w-6 h-6 items-center justify-center rounded text-xs font-semibold ${colors[rank - 1] ?? colors[3]}`}>
      {rank}
    </span>
  )
}

interface Props { onChip?: (flowId: string) => void }

export function MultiRankingsCard({ onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["multirankings"],
    queryFn: fetchMultiRankingsData,
  })

  if (isLoading) return <CardLoading title="Multi-Service Rankings" rows={4} />
  if (isError || !data) return <CardError title="Multi-Service Rankings" onRetry={refetch} />

  return (
    <CardShell
      title="FRAF1 Multi-Service Rankings"
      subtitle="Q1 2025 · Breakdown by service"
      chips={data.chips}
      onChip={onChip}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#f2f4f7]">
              <th className="px-4 py-2.5 text-left font-medium text-[#667085]">Corridor</th>
              <th className="px-3 py-2.5 text-center font-medium text-[#667085]">Data</th>
              <th className="px-3 py-2.5 text-center font-medium text-[#667085]">Voice</th>
              <th className="px-3 py-2.5 text-center font-medium text-[#667085]">SMS</th>
              <th className="px-3 py-2.5 text-center font-medium text-[#667085]">IoT</th>
              <th className="px-4 py-2.5 text-right font-medium text-[#667085]">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f7]">
            {data.rows.map((row) => (
              <tr key={row.corridor} className="hover:bg-[#f9fafb]">
                <td className="px-4 py-3 font-mono font-medium text-[#0e2c46]">{row.corridor}</td>
                <td className="px-3 py-3 text-center"><RankBadge rank={row.data} /></td>
                <td className="px-3 py-3 text-center"><RankBadge rank={row.voice} /></td>
                <td className="px-3 py-3 text-center"><RankBadge rank={row.sms} /></td>
                <td className="px-3 py-3 text-center"><RankBadge rank={row.iot} /></td>
                <td className="px-4 py-3 text-right font-medium text-[#344054]">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardShell>
  )
}
