import { useQuery } from "@tanstack/react-query"
import { fetchTrafficData, type TrafficData } from "@/services/analytics"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

function BarChart({ months, inbound, outbound }: Pick<TrafficData, "months" | "inbound" | "outbound">) {
  const W = 500, H = 130, PAD_L = 36, PAD_R = 8, PAD_T = 10, PAD_B = 24
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B
  const allVals = [...inbound, ...outbound]
  const max = Math.ceil(Math.max(...allVals) * 1.1)
  const groupW = innerW / months.length
  const barW = (groupW - 8) / 2

  function barH(v: number) { return (v / max) * innerH }
  function gx(i: number)   { return PAD_L + i * groupW }

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((p) => ({
    y: PAD_T + (1 - p) * innerH,
    label: (p * max).toFixed(1),
  }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }} aria-hidden="true">
      {gridLines.map((g) => (
        <g key={g.y}>
          <line x1={PAD_L} y1={g.y} x2={W - PAD_R} y2={g.y} stroke="#e4e7ec" strokeWidth="1" />
          <text x={PAD_L - 4} y={g.y + 3} textAnchor="end" fill="#98a2b3" fontSize="8">{g.label}</text>
        </g>
      ))}
      {months.map((m, i) => {
        const gLeft = gx(i) + 4
        const inH   = barH(inbound[i])
        const outH  = barH(outbound[i])
        const midY  = PAD_T + innerH
        return (
          <g key={m}>
            <rect x={gLeft}           y={midY - inH}  width={barW} height={inH}  rx="2" fill="#0e2c46" />
            <rect x={gLeft + barW + 2} y={midY - outH} width={barW} height={outH} rx="2" fill="#82bc34" />
            <text x={gLeft + barW + 1} y={H - 7} textAnchor="middle" fill="#98a2b3" fontSize="9">{m}</text>
          </g>
        )
      })}
    </svg>
  )
}

interface Props { onChip?: (flowId: string) => void }

export function TrafficCard({ onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["traffic"],
    queryFn: fetchTrafficData,
  })

  if (isLoading) return <CardLoading title="Traffic Patterns" hasChart rows={2} />
  if (isError || !data) return <CardError title="Traffic Patterns" onRetry={refetch} />

  return (
    <CardShell
      title="Traffic Patterns — DE ↔ DK"
      subtitle="Data traffic · Q1–Q2 2025"
      chips={data.chips}
      onChip={onChip}
    >
      <div className="px-4 pt-4 pb-2">
        <BarChart months={data.months} inbound={data.inbound} outbound={data.outbound} />
        <div className="flex items-center gap-4 mt-1 text-[10px] text-[#667085]">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-[#0e2c46] inline-block" /> Inbound</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-[#82bc34] inline-block" /> Outbound</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-[#e4e7ec] border-t border-[#e4e7ec] mt-2">
        {data.metrics.map((m) => (
          <div key={m.label} className="bg-white px-4 py-3">
            <p className="text-[10px] text-[#667085]">{m.label}</p>
            <p className="text-base font-semibold text-[#0e2c46] mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
