import type { DealShell } from '@/domain/deal/types'
import type { StatementCard } from '@/domain/deal/cardTypes'

const EXPLAIN_RESPONSES: Record<string, string> = {
  explainQualifying: "Statement cards are created automatically from your qualifying answers — each card defines a scope (My Network × Partner × Conditions) with service rows inside. Use the wizard's qualifying flow or start a deal and the canvas pre-fills for you.",
  explainRates: "Enter discount percentages (e.g. 15 for 15%) in the Inbound and Outbound columns. Inbound = traffic from partner roamers on your network. Outbound = your subscribers roaming on the partner network. Blank rows won't be included in final terms.",
  explainBUB: "Balanced/Unbalanced splits traffic: the balanced portion (the smaller of inbound vs outbound) is priced at a premium rate; the unbalanced surplus is cheaper. It rewards mutual traffic exchange between partners.",
  explainOverride: "Partner overrides (Layer 2) let you set different rates for a specific partner when this deal covers multiple partners. Click '+ Add partner override' at the bottom of any global statement card.",
  explainBilateral: "Bilateral pricing means both Inbound and Outbound traffic are priced in the same statement card. Enter rates in both columns — Inbound (blue) for partner roamers on your network, Outbound (orange) for your subscribers abroad.",
}

export function getMockResponse(
  handler: string,
  shell: DealShell | null,
  cards: StatementCard[],
): string {
  if (EXPLAIN_RESPONSES[handler]) return EXPLAIN_RESPONSES[handler]
  const count = cards.length
  const partner = shell?.roamingPartners[0] ?? 'your partner'
  return `Got it. You now have ${count} statement card${count !== 1 ? 's' : ''} with ${partner}. Keep building or ask me anything.`
}

export function getMockResponseFromText(
  text: string,
  shell: DealShell | null,
  cards: StatementCard[],
): string {
  const lower = text.toLowerCase()
  if (lower.includes('balance') || lower.includes('b/ub')) return EXPLAIN_RESPONSES.explainBUB
  if (lower.includes('threshold')) return EXPLAIN_RESPONSES.explainRates
  if (lower.includes('override')) return EXPLAIN_RESPONSES.explainOverride
  if (lower.includes('bilateral')) return EXPLAIN_RESPONSES.explainBilateral
  return getMockResponse('generic', shell, cards)
}
