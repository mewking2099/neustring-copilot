import type { DealShell, Statement } from '@/domain/deal/types'

export const EXTRACTION_2_SHELL: Partial<DealShell> = {
  myNetworks: ['BELMO', 'ESPX1'],
  roamingPartners: ['FRAF1'],
  alliance: null,
  period: { start: '2025-06', end: '2026-05' },
  currency: 'USD',
  autoRenewal: false,
  autoRenewalNoticeDays: null,
  roamingChannel: 'm2m',
  negotiator: 'Alex Moreau',
  accessLevel: 'company',
  budgetInclusion: false,
  excludeTax: true,
  groupStatement: false,
}

export const EXTRACTION_2_STATEMENTS: Partial<Statement>[] = [
  {
    direction: 'inbound',
    serviceTypes: ['gprs'],
    model: { family: 'F', subtype: 'access_fee' },
    roamingChannel: 'm2m',
  },
  {
    direction: 'inbound',
    serviceTypes: ['nb_iot'],
    model: { family: 'F', subtype: 'access_fee' },
    roamingChannel: 'm2m',
  },
  {
    direction: 'inbound',
    serviceTypes: ['lte_m'],
    model: { family: 'A', variant: 'threshold' },
    roamingChannel: 'm2m',
  },
]
