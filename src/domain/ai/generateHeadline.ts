import type { DealShell } from '@/domain/deal/types'
import type { StatementCard } from '@/domain/deal/cardTypes'
import { SERVICE_TYPE_LABELS } from '@/domain/deal/discountFamilies'

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function generateHeadline(shell: DealShell | null, cards: StatementCard[]): string {
  if (!shell || cards.length === 0) {
    return "No statements yet — the read updates as you build."
  }

  const layer1 = cards.filter((c) => c.layer === 1)
  const layer2 = cards.filter((c) => c.layer === 2)

  const allServices = [...new Set(layer1.flatMap((c) => c.serviceRows.map((r) => r.serviceType)))]
  const dirs = [...new Set(layer1.map((c) => c.direction))]

  const dirLabel =
    dirs.length === 1
      ? dirs[0] === 'bilateral' ? 'bilateral' : dirs[0]
      : 'mixed-direction'

  const svcLabels = allServices.slice(0, 3).map((s) => SERVICE_TYPE_LABELS[s] ?? s)
  const svcText =
    svcLabels.length > 1
      ? `${svcLabels.slice(0, -1).join(', ')} and ${svcLabels[svcLabels.length - 1]}`
      : svcLabels[0] ?? 'unknown services'
  const moreTag = allServices.length > 3 ? ` +${allServices.length - 3} more` : ''

  const partnerCount = shell.roamingPartners.length
  const partnerText =
    partnerCount === 0
      ? 'no partner yet'
      : partnerCount === 1
        ? shell.roamingPartners[0]
        : `${partnerCount} partners`

  const overrideSuffix =
    layer2.length > 0
      ? `, with ${layer2.length} partner-specific override${layer2.length !== 1 ? 's' : ''}.`
      : '.'

  return `${cap(dirLabel)} deal pricing ${svcText}${moreTag} across ${partnerText}${overrideSuffix}`
}
