export type ServiceName = 'Data' | 'Voice' | 'SMS' | 'IoT'
export type Direction = 'inbound' | 'outbound' | 'both'
export type DiscountModel = 'threshold' | 'tapered' | 'flat' | 'iot-flat'
export type EntityScope = 'group' | 'affiliate'

export interface QualifyingResult {
  services: ServiceName[]
  directions: Partial<Record<ServiceName, Direction>>
  discountModel: DiscountModel
  entityScope: EntityScope
  statementCount: number
}

export function computeStatementCount(r: Partial<QualifyingResult>): number {
  const services = r.services ?? []
  if (!services.length) return 0
  const scopeMultiplier = r.entityScope === 'affiliate' ? 2 : 1
  let count = 0
  for (const svc of services) {
    const dir = r.directions?.[svc] ?? 'both'
    count += dir === 'both' ? 2 : 1
  }
  return count * scopeMultiplier
}
