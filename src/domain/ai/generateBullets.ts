import type { DealState } from '@/domain/deal/types'
import { SERVICE_TYPE_LABELS, MODEL_OPTIONS } from '@/domain/deal/discountFamilies'

export function generateBullets(state: DealState): string[] {
  const { shell, statements } = state
  if (!shell || statements.length === 0) return []

  const bullets: string[] = []

  // Bullet 1: service coverage
  const allServices = [...new Set(statements.flatMap(s => s.serviceTypes))]
  if (allServices.length > 0) {
    const svcLabels = allServices.map(s => SERVICE_TYPE_LABELS[s] ?? s).join(', ')
    bullets.push(`Services covered: ${svcLabels}`)
  }

  // Bullet 2: model families in use
  const families = [...new Set(statements.map(s => s.model.family))]
  if (families.length > 0) {
    const familyNames = families.map(f => {
      const opt = MODEL_OPTIONS.find(o => o.family === f)
      return opt ? `Family ${f} (${opt.label})` : `Family ${f}`
    })
    bullets.push(`Discount models: ${familyNames.join(', ')}`)
  }

  // Bullet 3: period and currency
  if (shell.period) {
    bullets.push(`Agreement period: ${shell.period.start} – ${shell.period.end} · ${shell.currency}`)
  }

  return bullets.slice(0, 3)
}
