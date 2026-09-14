import type { DealShell, Statement } from '@/domain/deal/types'

export const EXTRACTION_1_SHELL: Partial<DealShell> = {
  myNetworks: ['ARAX1', 'ARAX2'],
  roamingPartners: ['GRAX1', 'GRAX3'],
  alliance: null,
  period: { start: '2025-01', end: '2025-12' },
  currency: 'EUR',
  autoRenewal: true,
  autoRenewalNoticeDays: 30,
  roamingChannel: 'traditional',
  negotiator: 'Christophe Demars',
  accessLevel: 'private',
  budgetInclusion: true,
  excludeTax: true,
  groupStatement: false,
}

export const EXTRACTION_1_STATEMENTS: Partial<Statement>[] = [
  {
    direction: 'inbound',
    serviceTypes: ['gprs'],
    model: { family: 'A', variant: 'threshold' },
    roamingChannel: 'traditional',
  },
  {
    direction: 'inbound',
    serviceTypes: ['voice_mo'],
    model: { family: 'A', variant: 'threshold' },
    roamingChannel: 'traditional',
  },
  {
    direction: 'inbound',
    serviceTypes: ['voice_mt'],
    model: { family: 'C', variant: 'volume_threshold' },
    roamingChannel: 'traditional',
  },
  {
    direction: 'inbound',
    serviceTypes: ['sms'],
    model: { family: 'A', variant: 'threshold' },
    roamingChannel: 'traditional',
  },
]
