import type { DealShell } from '@/domain/deal/types'
import type { StatementCard } from '@/domain/deal/cardTypes'
import { SERVICE_TYPE_LABELS, MODEL_OPTIONS } from '@/domain/deal/discountFamilies'

export function generateBullets(shell: DealShell | null, cards: StatementCard[]): string[] {
  if (!shell || cards.length === 0) return []

  const layer1 = cards.filter((c) => c.layer === 1)
  const layer2 = cards.filter((c) => c.layer === 2)
  const allRows = cards.flatMap((c) => c.serviceRows)
  const bullets: string[] = []

  // Services covered
  const allServices = [...new Set(layer1.flatMap((c) => c.serviceRows.map((r) => r.serviceType)))]
  if (allServices.length > 0) {
    const labels = allServices.map((s) => SERVICE_TYPE_LABELS[s] ?? s).join(', ')
    bullets.push(`Services: ${labels}`)
  }

  // Rate coverage
  const ratedRows = allRows.filter(
    (r) => r.inboundDiscount !== null || r.outboundDiscount !== null,
  )
  bullets.push(
    `Rates entered: ${ratedRows.length} of ${allRows.length} service row${allRows.length !== 1 ? 's' : ''}`,
  )

  // Partner overrides
  if (layer2.length > 0) {
    const scopedPartners = [...new Set(layer2.flatMap((c) => c.scopedPartners ?? []))]
    const partnerList =
      scopedPartners.length > 3
        ? `${scopedPartners.slice(0, 3).join(', ')} +${scopedPartners.length - 3} more`
        : scopedPartners.join(', ')
    bullets.push(
      `${layer2.length} override card${layer2.length !== 1 ? 's' : ''} — scoped to: ${partnerList || 'selected partners'}`,
    )
  }

  // Discount model families
  const families = [...new Set(allRows.map((r) => r.model.family))]
  if (families.length > 0) {
    const familyLabels = families.map((f) => {
      const opt = MODEL_OPTIONS.find((o) => o.family === f)
      return opt ? `Family ${f} — ${opt.label.replace(/^Family [A-F] — /, '')}` : `Family ${f}`
    })
    bullets.push(`Discount model${families.length !== 1 ? 's' : ''}: ${familyLabels.join('; ')}`)
  }

  // Period + currency
  if (shell.period) {
    const end = shell.period.end || 'end not set'
    bullets.push(`Period: ${shell.period.start} – ${end} · ${shell.currency}`)
  }

  return bullets.slice(0, 5)
}
