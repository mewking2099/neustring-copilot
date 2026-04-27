import { useQuery } from "@tanstack/react-query"
import { fetchAnomalyData, type TrafficAnomaly } from "@/services/rodeo"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

function Sparkline({ spikePercent }: { spikePercent: number }) {
  const pts = [10, 12, 11, 13, 50 + spikePercent * 0.12, 14, 11]
  const H = 28, W = 60
  const max = Math.max(...pts)
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * W)
  const ys = pts.map((v) => H - (v / max) * H + 2)
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ")
  return (
    <svg width={W} height={H + 4} viewBox={`0 0 ${W} ${H + 4}`} aria-hidden="true">
      <path d={d} fill="none" stroke="#b42318" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[4]} cy={ys[4]} r="2.5" fill="#b42318" />
    </svg>
  )
}

function AnomalyRow({ a }: { a: TrafficAnomaly }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-medium text-[#0e2c46]">{a.corridor}</span>
            <span className="text-[10px] bg-[#f2f4f7] text-[#344054] px-1.5 py-0.5 rounded">{a.service}</span>
            <span className="text-[10px] font-bold text-[#b42318]" aria-label={`${a.spikePercent}% spike`}>+{a.spikePercent}%</span>
          </div>
          <p className="text-[10px] text-[#98a2b3] mb-1">{a.detected}</p>
          <p className="text-xs text-[#667085]">
            <span className="font-medium text-[#344054]">Likely cause:</span> {a.cause}
          </p>
          <p className="text-xs text-[#344054] mt-1 leading-relaxed">↳ {a.action}</p>
        </div>
        <Sparkline spikePercent={a.spikePercent} />
      </div>
    </div>
  )
}

interface Props { onChip?: (flowId: string) => void }

export function AnomalyCard({ onChip: _onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["anomaly"],
    queryFn: fetchAnomalyData,
  })

  if (isLoading) return <CardLoading title="Traffic Anomalies" rows={2} />
  if (isError || !data) return <CardError title="Traffic Anomalies" onRetry={refetch} />

  return (
    <CardShell
      title="Traffic Anomalies"
      subtitle={`${data.anomalies.length} detected · Last 48 hours`}
    >
      <div className="divide-y divide-[#f2f4f7]">
        {data.anomalies.map((a, i) => <AnomalyRow key={i} a={a} />)}
      </div>
    </CardShell>
  )
}
