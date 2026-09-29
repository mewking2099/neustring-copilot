import type { ServiceType, DiscountModel, ApplyTo } from './types'

export type CardDirection = 'bilateral' | 'inbound' | 'outbound'

// One row in the service table inside a StatementCard
export interface ServiceRow {
  id: string
  serviceType: ServiceType
  model: DiscountModel
  applyTo: ApplyTo                // threshold | retrospective | back_to_first
  highCostFilter: string | null   // e.g. "210 Countries", null = standard
  chargeUnit: string              // e.g. "Per Min (60/30 s)", "Per Unit", "Per MB (1MB/1MB)"
  inboundDiscount: number | null
  outboundDiscount: number | null
  // Layer 3 — volume / charge tier bands
  additionalBands: Array<{
    from: number | null            // lower bound (inclusive); null = 0
    to: number | null              // upper bound (inclusive); null = ∞
    unit: 'volume' | 'charge'     // minutes / MB / units vs. currency amount
    inboundDiscount: number | null
    outboundDiscount: number | null
  }>
}

// A statement card — the unit of a deal's rate structure
// Scope: My Networks × Partner Networks, with direction and optional conditions
export interface StatementCard {
  id: string
  direction: CardDirection
  myNetworks: string[]            // [] = all deal networks
  partnerNetworks: string[]       // [] = all deal partners
  layer: 1 | 2
  parentCardId?: string           // Layer 2 only
  scopedPartners?: string[]       // Layer 2 — which specific partners this overrides for
  serviceRows: ServiceRow[]
  createdAt: string
}

// Full cards state (replaces Statement[])
export interface CardsState {
  cards: StatementCard[]
}
