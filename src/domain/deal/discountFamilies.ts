export interface ModelOption {
  family: string
  variant: string
  label: string
  description: string
}

export const MODEL_OPTIONS: ModelOption[] = [
  // Family A
  { family: 'A', variant: 'threshold',            label: 'Threshold',                  description: 'Volume-based tiers, each band at its own rate' },
  { family: 'A', variant: 'cross_service',         label: 'Cross-service threshold',    description: 'Rate on one service depends on volume of another' },
  { family: 'A', variant: 'percentage_threshold',  label: 'Percentage on threshold',    description: '% discount varies by volume tier' },
  // Family B
  { family: 'B', variant: 'standard',              label: 'B/UB Standard',              description: 'Balanced/unbalanced pooled at group level' },
  { family: 'B', variant: 'bilateral',             label: 'B/UB Bilateral',             description: 'Each partner balanced independently' },
  { family: 'B', variant: 'group',                 label: 'B/UB Group',                 description: 'Bilateral detail adjusted to match standard total' },
  // Family C
  { family: 'C', variant: 'volume_threshold',      label: 'Volume Commitment',          description: 'Committed volume charged regardless of actual traffic' },
  { family: 'C', variant: 'charge_commitment',     label: 'Charge Commitment',          description: 'Money floor in place of volume commitment' },
  { family: 'C', variant: 'market_share',          label: 'Market Share Commitment',    description: 'Commitment as % of total country traffic' },
  { family: 'C', variant: 'commitment_bub',        label: 'Commitment + B/UB',          description: 'Fixed commitment then B/UB applies above it' },
  // Family D
  { family: 'D', variant: 'incremental_volume',    label: 'Incremental Volume',         description: 'Blended multi-service volume floor' },
  { family: 'D', variant: 'incremental_charge',    label: 'Incremental Charge',         description: 'Single money floor across all service types' },
  { family: 'D', variant: 'bundle_allowances',     label: 'Bundle + Allowances',        description: 'Fixed wholesale fee with included traffic allowances' },
  // Family E
  { family: 'E', variant: 'automatic',             label: 'Group — Automatic',          description: 'Group commitment distributed by weighted average' },
  { family: 'E', variant: 'back_to_back',          label: 'Group — Back to Back',       description: 'Shortfall assigned to specific affiliates' },
  // Family F
  { family: 'F', variant: 'access_fee',            label: 'Access Fee',                 description: 'Per IMSI per month charge' },
  { family: 'F', variant: 'access_fee_interval',   label: 'Access Fee (Interval)',      description: 'Tiered rate by total IMSI count' },
  { family: 'F', variant: 'incremental_access_fee',label: 'Incremental Access Fee',     description: 'Money commitment converted to per-IMSI rate' },
  { family: 'F', variant: 'imsi_commitment',       label: 'IMSI Commitment',            description: 'Per-IMSI monthly guarantee' },
  { family: 'F', variant: 'imsi_cap',              label: 'IMSI Cap',                   description: 'Maximum charge per IMSI' },
  { family: 'F', variant: 'imsi_allowance',        label: 'IMSI Allowance',             description: 'Based on daily count of unique IMSIs' },
]

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  voice_mo: 'Voice MO',
  voice_mt: 'Voice MT',
  video_mt: 'Video MT',
  sms:      'SMS',
  gprs:     'GPRS',
  volte:    'VoLTE',
  nb_iot:   'NB-IoT',
  lte_m:    'LTE-M',
  '5g':     '5G',
}

export const ROAMING_CHANNEL_LABELS: Record<string, string> = {
  traditional:         'Traditional',
  m2m:                 'M2M',
  traditional_and_m2m: 'Traditional and M2M',
}

export const APPLY_TO_LABELS: Record<string, string> = {
  threshold:    'Threshold',
  retrospective:'Retrospective',
  back_to_first:'Back to First',
}
