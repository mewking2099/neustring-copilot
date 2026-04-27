import { useQuery } from "@tanstack/react-query"
import { fetchContractReviewData, type ContractReviewData } from "@/services/contracts"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"
import type { CardProps } from "./index"

const SEV_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Critical: { bg: "#fff5f5", text: "#b42318", border: "#f04438" },
  Medium:   { bg: "#fffaeb", text: "#92400e", border: "#ca8504" },
  Low:      { bg: "#eff8ff", text: "#175cd3", border: "#2e90fa" },
}

function ReviewContent({ data, onChip }: { data: ContractReviewData; onChip?: (id: string) => void }) {
  return (
    <div className="mt-3 space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#182230]">{data.name}</span>
            <code className="text-[11px] bg-[#f2f4f7] text-[#344054] rounded px-1.5 py-0.5 font-mono">{data.id}</code>
            <span className="text-[11px] bg-[#e8f2ce] text-[#4d7c0f] rounded-full px-2 py-0.5 font-medium">Active</span>
            <span className="text-[11px] bg-[#eff8ff] text-[#175cd3] rounded-full px-2 py-0.5 font-medium">V2</span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">{data.signedDate}</p>
        </div>
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2">
        {data.quickFacts.map((f) => (
          <div key={f.label} className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-3 py-2.5">
            <p className="text-[10px] text-[#98a2b3] mb-0.5">{f.label}</p>
            <p className="text-sm font-semibold text-[#0e2c46]">{f.value}</p>
            <p className="text-[10px] text-[#667085]">{f.sub}</p>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div className="space-y-2">
        {data.sections.map((s) => (
          <div key={s.title} className="rounded-lg border px-4 py-3" style={{ backgroundColor: s.color.bg, borderColor: s.color.border }}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm" aria-hidden="true">{s.icon}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: s.color.border }}>{s.title}</span>
            </div>
            <ul className="space-y-1">
              {s.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#344054] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: s.color.dot }} aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Flagged items */}
      <div>
        <p className="text-[11px] font-semibold text-[#344054] uppercase tracking-wide mb-2">Flagged Items</p>
        <div className="space-y-2">
          {data.flags.map((f, i) => {
            const c = SEV_COLORS[f.sev]
            return (
              <div key={i} className="rounded-lg border-l-4 pl-3 pr-3 py-2.5" style={{ borderColor: c.border, backgroundColor: c.bg }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold rounded-full px-2 py-0.5" style={{ color: c.text, backgroundColor: "rgba(255,255,255,0.7)" }}>
                    {f.sev}
                  </span>
                </div>
                <p className="text-xs text-[#344054] leading-relaxed">{f.text}</p>
                <p className="text-[11px] text-[#667085] mt-1">{f.hint}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onChip?.("contract-review-compare")}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#0e2c46] text-white text-sm px-4 py-2.5 hover:bg-[#185992] transition-colors font-medium"
        >
          ⚖️ Compare with another version →
        </button>
        <button className="w-10 flex items-center justify-center rounded-lg border border-[#d0d5dd] text-[#667085] hover:bg-[#f2f4f7] transition-colors text-sm" aria-label="Export contract">
          ⬇
        </button>
      </div>
    </div>
  )
}

export function ContractReviewCard({ onChip }: CardProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["contract-review"],
    queryFn: () => fetchContractReviewData(),
  })

  if (isLoading) return <CardLoading title="Contract Review" hasChart rows={4} />
  if (isError || !data) return <CardError title="Contract Review" onRetry={refetch} />

  return <ReviewContent data={data} onChip={onChip} />
}
