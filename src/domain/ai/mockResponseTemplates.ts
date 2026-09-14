import type { DealState } from '@/domain/deal/types'

const EXPLAIN_RESPONSES: Record<string, string> = {
  explainBUB: "Balanced/Unbalanced (B/UB) splits traffic into a 'balanced' portion — the smaller of inbound vs outbound — priced at a premium rate, and an 'unbalanced' surplus priced at a cheaper rate. It rewards mutual traffic exchange.",
  explainThreshold: "Threshold is the base model: you define volume bands (e.g. 0–100k MB at one rate, 100k–∞ at a lower rate). Each band charges at its own rate unless you set Apply To = Retrospective, which back-prices all traffic at the reached tier.",
  copyToOutbound: "Done — all inbound statements have been copied to outbound. Review the Outbound tab to adjust any direction-specific rates.",
  addVoiceMT: "I've added a Voice MT statement to inbound. Set the threshold bands and model in the new row.",
  addGPRS: "Added a GPRS statement. Select your roaming channel (M2M is common for GPRS) and configure the interval bands.",
  addSMS: "Added an SMS statement. Threshold with a single 0–∞ band is the most common pattern for SMS.",
}

export function getMockResponse(handler: string, state: DealState): string {
  if (EXPLAIN_RESPONSES[handler]) return EXPLAIN_RESPONSES[handler]
  const count = state.statements.length
  const partner = state.shell?.roamingPartners[0] ?? 'your partner'
  return `Got it. You now have ${count} statement${count !== 1 ? 's' : ''} with ${partner}. Keep building or use the quick actions.`
}

export function getMockResponseFromText(text: string, state: DealState): string {
  const lower = text.toLowerCase()
  if (lower.includes('balance') || lower.includes('b/ub')) {
    return EXPLAIN_RESPONSES.explainBUB
  }
  if (lower.includes('threshold')) {
    return EXPLAIN_RESPONSES.explainThreshold
  }
  return getMockResponse('generic', state)
}
