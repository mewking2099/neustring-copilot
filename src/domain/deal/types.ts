// Direction
export type Direction = 'inbound' | 'outbound'

// Roaming channel (Traditional / M2M / Traditional and M2M)
export type RoamingChannel = 'traditional' | 'm2m' | 'traditional_and_m2m'

// Service types
export type ServiceType =
  | 'voice_mo'
  | 'voice_mt'
  | 'video_mt'
  | 'sms'
  | 'gprs'
  | 'volte'
  | 'nb_iot'
  | 'lte_m'
  | '5g'

// Discount model families A-F (discriminated union)
export type DiscountModel =
  | { family: 'A'; variant: 'threshold' | 'cross_service' | 'percentage_threshold' }
  | { family: 'B'; method: 'standard' | 'bilateral' | 'group' }
  | { family: 'C'; variant: 'volume_threshold' | 'charge_commitment' | 'market_share' | 'commitment_bub' }
  | { family: 'D'; variant: 'incremental_volume' | 'incremental_charge' | 'bundle_allowances' }
  | { family: 'E'; distribution: 'automatic' | 'back_to_back' }
  | { family: 'F'; subtype: 'access_fee' | 'access_fee_interval' | 'incremental_access_fee' | 'imsi_commitment' | 'imsi_cap' | 'imsi_allowance' }

// Interval band
export interface IntervalBand {
  from: number | null
  to: number | null // null = Infinity
  unit: 'volume' | 'charge' | 'imsi'
  discount: number | null
  discountUnit: 'volume' | 'percentage' | 'fixed'
}

// Apply To setting
export type ApplyTo = 'threshold' | 'retrospective' | 'back_to_first'

// Per-statement settings override (from the settings modal)
export interface StatementSettings {
  includeTax: boolean
  currency: string
  chargeableOrCharged: 'chargeable' | 'charged'
  chargedValue: string | null
  includePremium: boolean
  myNetworksOverride: string[]
  roamingPartnersOverride: string[]
  periodOverride: { start: string; end: string } | null
  permanentRoamers: 'pb_traffic' | 'regular'
  routeByRoute: boolean
  distributionByPeriod: boolean
  marketChannel: string[]
  customerName: string[]
  productName: string[]
  deviceType: string[]
}

// A single statement (one row in the statement section)
export interface Statement {
  id: string
  direction: Direction
  roamingChannel: RoamingChannel
  serviceTypes: ServiceType[]
  model: DiscountModel
  bands: IntervalBand[]
  applyTo: ApplyTo
  settings: StatementSettings
  createdAt: string
  linkedStatementId?: string  // id of the paired counterpart (undefined = standalone)
  mirrorMode?: boolean        // when true, shared-field edits propagate to the linked counterpart
}

// Access level
export type AccessLevel = 'private' | 'company' | 'group'

// Deal shell (the top-level deal metadata)
export interface DealShell {
  id: string
  name: string
  status: 'draft' | 'live' | 'completed'
  roamingChannel: RoamingChannel
  myNetworks: string[] // TADIG codes
  roamingPartners: string[] // TADIG codes
  alliance: string | null // either partners or alliance, not both
  serviceTypes: ServiceType[]
  period: { start: string; end: string }
  autoRenewal: boolean
  autoRenewalNoticeDays: number | null
  budgetInclusion: boolean
  accessLevel: AccessLevel
  negotiator: string
  currency: string
  excludeTax: boolean
  groupStatement: boolean
}

// AI change log entry
export interface ChangeLogEntry {
  id: string
  timestamp: string
  message: string // human-readable, e.g. "My Networks → ARAX1, ARAX2"
  field: string   // machine key, e.g. "shell.myNetworks"
}

// Entry source (how the deal was started)
export type EntrySource = 'scratch_wizard' | 'scratch_dialog' | 'email_ingestion' | 'file_ingestion' | 'cloned_deal'

// Full deal state
export interface DealState {
  shell: DealShell | null
  statements: Statement[]
  aiChangeLog: ChangeLogEntry[]
  entrySource: EntrySource | null
  draftId: string | null
}
