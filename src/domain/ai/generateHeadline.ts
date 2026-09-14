import type { DealState } from '@/domain/deal/types'

export function generateHeadline(state: DealState): string {
  const { shell, statements } = state
  if (!shell || statements.length === 0) {
    return "No statements yet — the read updates as you add pricing conditions."
  }
  const inbound = statements.filter(s => s.direction === 'inbound').length
  const outbound = statements.filter(s => s.direction === 'outbound').length
  const partners = shell.roamingPartners.join(', ')
  if (inbound > 0 && outbound > 0) {
    return `This deal prices ${inbound} inbound and ${outbound} outbound condition${outbound > 1 ? 's' : ''} with ${partners}.`
  }
  if (inbound > 0) {
    return `${inbound} inbound condition${inbound > 1 ? 's' : ''} set — outbound not yet configured.`
  }
  return `${outbound} outbound condition${outbound > 1 ? 's' : ''} set — inbound not yet configured.`
}
