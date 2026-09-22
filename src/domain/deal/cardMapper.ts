import type { StatementCard, ServiceRow, CardDirection } from './cardTypes'
import type { QualifyingResult, ServiceName } from './qualifyingTypes'
import type { ServiceType, DiscountModel } from './types'

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

// Maps qualifying service name to the domain ServiceType(s) it produces as rows
const SERVICE_TYPE_MAP: Record<ServiceName, ServiceType[]> = {
  Voice: ['voice_mo', 'voice_mt'],
  Data:  ['gprs'],
  SMS:   ['sms'],
  IoT:   ['nb_iot'],
}

const CHARGE_UNIT_MAP: Record<ServiceType, string> = {
  voice_mo: 'Per Min (60/30 s)',
  voice_mt: 'Per Min (60/60 s)',
  video_mt: 'Per Min (60/60 s)',
  sms:      'Per Unit',
  gprs:     'Per MB (1MB / 1MB)',
  volte:    'Per Min (60/30 s)',
  nb_iot:   'Per MB (1MB / 1MB)',
  lte_m:    'Per MB (1MB / 1MB)',
  '5g':     'Per MB (1MB / 1MB)',
}

function mapDiscountModel(q: QualifyingResult['discountModel']): DiscountModel {
  switch (q) {
    case 'threshold': return { family: 'A', variant: 'threshold' }
    case 'tapered':   return { family: 'D', variant: 'incremental_volume' }
    case 'flat':      return { family: 'A', variant: 'threshold' }
    case 'iot-flat':  return { family: 'F', subtype: 'access_fee' }
  }
}

function mapDirection(q: QualifyingResult): CardDirection {
  const dirs = Object.values(q.directions)
  const hasInbound  = dirs.some((d) => d === 'inbound'  || d === 'both')
  const hasOutbound = dirs.some((d) => d === 'outbound' || d === 'both')
  if (hasInbound && hasOutbound) return 'bilateral'
  if (hasInbound)  return 'inbound'
  return 'outbound'
}

function makeServiceRow(serviceType: ServiceType, model: DiscountModel): ServiceRow {
  return {
    id: makeId(),
    serviceType,
    model,
    highCostFilter: null,
    chargeUnit: CHARGE_UNIT_MAP[serviceType] ?? 'Per Unit',
    inboundDiscount: null,
    outboundDiscount: null,
    additionalBands: [],
  }
}

/**
 * Builds the Layer 1 global StatementCard from a qualifying result.
 * One card, all selected services as rows, all networks/partners ([] = all).
 */
export function buildCardsFromQualifying(result: QualifyingResult): StatementCard[] {
  const model = mapDiscountModel(result.discountModel)
  const direction = mapDirection(result)

  const serviceRows: ServiceRow[] = result.services.flatMap((svc) =>
    SERVICE_TYPE_MAP[svc].map((st) => makeServiceRow(st, model)),
  )

  const globalCard: StatementCard = {
    id: makeId(),
    direction,
    myNetworks: [],    // [] = all deal networks
    partnerNetworks: [],
    layer: 1,
    serviceRows,
    createdAt: new Date().toISOString(),
  }

  return [globalCard]
}

/**
 * Builds a Layer 2 override card, cloning service rows from the parent.
 */
export function buildOverrideCard(parent: StatementCard, partners: string[]): StatementCard {
  return {
    id: makeId(),
    direction: parent.direction,
    myNetworks: parent.myNetworks,
    partnerNetworks: partners,
    layer: 2,
    parentCardId: parent.id,
    scopedPartners: partners,
    serviceRows: parent.serviceRows.map((row) => ({
      ...row,
      id: makeId(),
      inboundDiscount: null,
      outboundDiscount: null,
      additionalBands: [],
    })),
    createdAt: new Date().toISOString(),
  }
}
