import type { DealShell } from '@/domain/deal/types'
import type { StatementCard } from '@/domain/deal/cardTypes'

export interface ContextualAction {
  id: string
  label: string
  icon: string
  type: 'add' | 'copy' | 'explain' | 'warn'
  handler: 'explainBUB' | 'explainOverride' | 'explainRates' | 'explainQualifying' | 'explainBilateral'
}

export function deriveContextualActions(
  shell: DealShell | null,
  cards: StatementCard[],
): ContextualAction[] {
  const actions: ContextualAction[] = []

  if (!shell || cards.length === 0) {
    actions.push({
      id: 'explain-qualifying',
      label: '? How do statements get created?',
      icon: 'HelpCircle',
      type: 'explain',
      handler: 'explainQualifying',
    })
    return actions
  }

  const allRows = cards.flatMap((c) => c.serviceRows)
  const layer2  = cards.filter((c) => c.layer === 2)

  // Blank rates on some rows → prompt to fill them
  const emptyRows = allRows.filter(
    (r) => r.inboundDiscount === null && r.outboundDiscount === null,
  )
  if (emptyRows.length > 0) {
    actions.push({
      id: 'explain-rates',
      label: `? What discount rate to enter?`,
      icon: 'HelpCircle',
      type: 'explain',
      handler: 'explainRates',
    })
  }

  // B/UB model in use → explain
  const hasBUB = allRows.some((r) => r.model.family === 'B')
  if (hasBUB) {
    actions.push({
      id: 'explain-bub',
      label: '? Why Balanced/Unbalanced?',
      icon: 'HelpCircle',
      type: 'explain',
      handler: 'explainBUB',
    })
  }

  // No layer-2 overrides yet → explain the concept
  if (layer2.length === 0 && shell.roamingPartners.length > 0) {
    actions.push({
      id: 'explain-override',
      label: '? When to add a partner override?',
      icon: 'HelpCircle',
      type: 'explain',
      handler: 'explainOverride',
    })
  }

  // Bilateral card → explain what bilateral means
  const hasBilateral = cards.some((c) => c.direction === 'bilateral')
  if (hasBilateral) {
    actions.push({
      id: 'explain-bilateral',
      label: '? What is bilateral pricing?',
      icon: 'HelpCircle',
      type: 'explain',
      handler: 'explainBilateral',
    })
  }

  return actions.slice(0, 4)
}
