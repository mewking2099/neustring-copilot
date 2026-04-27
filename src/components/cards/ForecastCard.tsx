import { useQuery } from "@tanstack/react-query"
import { fetchForecastData, type ForecastData } from "@/services/analytics"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

function LineChart({ months, values, historicalCount }: Pick<ForecastData, "months" | "values" | "historicalCount">) {
  const W = 500, H = 120, PAD_L = 8, PAD_R = 8, PAD_T = 10, PAD_B = 24
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B
  const max = Math.max(...values)
  const min = Math.min(...values) - 5

  function x(i: number) { return PAD_L + (i / (values.length - 1)) * innerW }
  function y(v: number) { return PAD_T + (1 - (v - min) / (max - min)) * innerH }

  const historicalPts = values.slice(0, historicalCount)
    .map((v, i) => `${x(i)},${y(v)}`).join(" ")
  const projectedPts = values.slice(historicalCount - 1)
    .map((v, i) => `${x(historicalCount - 1 + i)},${y(v)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }} aria-hidden="true">
      <polygon
        points={
          values.slice(historicalCount - 1).map((v, i) => `${x(historicalCount - 1 + i)},${y(v - 4)}`).join(" ") +
          " " +
          values.slice(historicalCount - 1).map((v, i) => `${x(historicalCount - 1 + (values.length - historicalCount) - i)},${y(v + 4)}`).join(" ")
        }
        fill="#e8f2ce" opacity="0.6"
      />
      <polyline points={historicalPts} fill="none" stroke="#0e2c46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={projectedPts}  fill="none" stroke="#0e2c46" strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1={x(historicalCount - 1)} y1={PAD_T} x2={x(historicalCount - 1)} y2={H - PAD_B} stroke="#d0d5dd" strokeWidth="1" strokeDasharray="3,2" />
      {months.map((m, i) => (
        <text key={m} x={x(i)} y={H - 6} textAnchor="middle" fill="#98a2b3" fontSize="9">{m}</text>
      ))}
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={i < historicalCount ? "#0e2c46" : "#82bc34"} />
      ))}
    </svg>
  )
}

interface Props { onChip?: (flowId: string) => void }

export function ForecastCard({ onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["forecast"],
    queryFn: fetchForecastData,
  })

  if (isLoading) return <CardLoading title="Forecast" hasChart rows={2} />
  if (isError || !data) return <CardError title="Forecast" onRetry={refetch} />

  return (
    <CardShell
      title="Orange France — Q3 2025 Forecast"
      subtitle="Inbound data traffic · Updated today"
      chips={data.chips}
      onChip={onChip}
    >
      <div className="px-4 pt-4 pb-2">
        <LineChart months={data.months} values={data.values} historicalCount={data.historicalCount} />
        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#667085]">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#0e2c46] inline-block" /> Historical</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block border-dashed" style={{ borderTop: "2px dashed #0e2c46", background: "none", height: 0 }} /> Projected</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-[#e4e7ec] border-t border-[#e4e7ec]">
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
