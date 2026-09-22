import type { DealShell } from '@/domain/deal/types'
import type { StatementCard } from '@/domain/deal/cardTypes'

export interface ReadGap {
  severity: 'warn' | 'info'
  text: string
}

export function generateGaps(shell: DealShell | null, cards: StatementCard[]): ReadGap[] {
  if (!shell) return []
  const gaps: ReadGap[] = []

  const allRows = cards.flatMap((c) => c.serviceRows)

  // Blank rates
  const emptyRows = allRows.filter(
    (r) => r.inboundDiscount === null && r.outboundDiscount === null,
  )
  if (emptyRows.length > 0) {
    gaps.push({
      severity: 'warn',
      text: `${emptyRows.length} service row${emptyRows.length !== 1 ? 's' : ''} have no rates entered yet`,
    })
  }

  // Missing period end
  if (!shell.period?.end) {
    gaps.push({ severity: 'warn', text: 'Agreement end date not set' })
  }

  // No partner
  if (shell.roamingPartners.length === 0) {
    gaps.push({ severity: 'warn', text: 'No roaming partner selected' })
  }

  // Layer 1 card with no service rows (shouldn't happen but guard it)
  const emptyCards = cards.filter((c) => c.serviceRows.length === 0)
  if (emptyCards.length > 0) {
    gaps.push({ severity: 'info', text: `${emptyCards.length} statement card${emptyCards.length !== 1 ? 's' : ''} have no service rows` })
  }

  return gaps
}
