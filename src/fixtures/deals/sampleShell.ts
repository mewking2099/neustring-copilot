import type { DealShell } from '@/domain/deal/types'

export const SAMPLE_SHELL: DealShell = {
  id: 'draft-10fbd',
  name: '27192_2024-01_2024-12_[ARAX]',
  status: 'draft',
  roamingChannel: 'traditional',
  myNetworks: ['ARAX1', 'ARAX2'],
  roamingPartners: ['GRAX1', 'GRAX3', 'DRAX2'],
  alliance: null,
  serviceTypes: ['gprs', 'voice_mo', 'voice_mt', 'sms'],
  period: { start: '2024-01', end: '2024-12' },
  autoRenewal: true,
  autoRenewalNoticeDays: 30,
  budgetInclusion: true,
  accessLevel: 'private',
  negotiator: 'Christophe.Demars',
  currency: 'EUR',
  excludeTax: true,
  groupStatement: true,
}
