import type { QueryLogEntry } from "@/store/app"

export interface QueryChip {
  text: string
  count: number
  trend: 'up' | 'flat'
  flowId?: string
}

const CHIP_FLOW_MAP: Record<string, string> = {
  "forecast": "forecast",
  "negotiate": "negotiation",
  "corridor": "rankings",
  "expire": "forecast",
  "renewal": "forecast",
}

function inferFlowId(text: string): string | undefined {
  const lower = text.toLowerCase()
  for (const [keyword, flowId] of Object.entries(CHIP_FLOW_MAP)) {
    if (lower.includes(keyword)) return flowId
  }
  return undefined
}

export function getTopChips(log: QueryLogEntry[], n = 3): QueryChip[] {
  const now = Date.now()
  const cutoff30 = now - 30 * 24 * 60 * 60 * 1000
  const cutoff7  = now -  7 * 24 * 60 * 60 * 1000

  const recent = log.filter((e) => new Date(e.timestamp).getTime() > cutoff30)

  // Accumulate weighted score per normalised key
  const acc = new Map<string, { score: number; raw: number; recent7: number; displayText: string }>()

  for (const e of recent) {
    const key = e.text.toLowerCase().trim()
    const ts  = new Date(e.timestamp).getTime()
    const isRecent = ts > cutoff7
    const existing = acc.get(key) ?? { score: 0, raw: 0, recent7: 0, displayText: e.text }
    acc.set(key, {
      score:       existing.score + (isRecent ? 3 : 1),
      raw:         existing.raw + 1,
      recent7:     existing.recent7 + (isRecent ? 1 : 0),
      displayText: existing.displayText,
    })
  }

  return [...acc.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, n)
    .map(([, v]) => ({
      text:    v.displayText,
      count:   v.raw,
      trend:   v.recent7 > v.raw * 0.4 ? 'up' : 'flat',
      flowId:  inferFlowId(v.displayText),
    }))
}

// Cold-start defaults when log is empty or too sparse
export const DEFAULT_CHIPS: QueryChip[] = [
  { text: "Which deals expire in the next 90 days?",               count: 0, trend: 'flat', flowId: "forecast"    },
  { text: "Forecast inbound data from Deutsche Telekom for Q3",    count: 0, trend: 'flat', flowId: "forecast"    },
  { text: "Summarise our Vodafone negotiation and suggest next steps", count: 0, trend: 'flat', flowId: "negotiation" },
]
