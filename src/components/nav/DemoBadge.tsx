import type { FlowCategory } from "@/data/flows"

const CONFIG: Record<FlowCategory, { bg: string; color: string }> = {
  Analytical: { bg: "#e8f2ce", color: "#4d7c0f" },
  RoDeO:      { bg: "#fef3c7", color: "#92400e" },
  Action:     { bg: "#dbeafe", color: "#1e40af" },
}

export function DemoBadge({ category }: { category: FlowCategory }) {
  const { bg, color } = CONFIG[category]
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0"
      style={{ backgroundColor: bg, color }}
    >
      {category}
    </span>
  )
}
