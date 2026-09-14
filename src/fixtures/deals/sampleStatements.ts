import type { Statement } from '@/domain/deal/types'
import { defaultStatementSettings } from '@/domain/deal/statementSettings'

export const SAMPLE_STATEMENTS: Statement[] = [
  {
    id: 'st-001',
    direction: 'inbound',
    roamingChannel: 'm2m',
    serviceTypes: ['gprs'],
    model: { family: 'A', variant: 'threshold' },
    bands: [{ from: 0, to: null, unit: 'volume', discount: null, discountUnit: 'volume' }],
    applyTo: 'threshold',
    settings: defaultStatementSettings(),
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'st-002',
    direction: 'inbound',
    roamingChannel: 'traditional',
    serviceTypes: ['gprs', 'volte', 'voice_mo', 'voice_mt'],
    model: { family: 'C', variant: 'volume_threshold' },
    bands: [{ from: 0, to: null, unit: 'volume', discount: null, discountUnit: 'volume' }],
    applyTo: 'threshold',
    settings: defaultStatementSettings(),
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'st-003',
    direction: 'inbound',
    roamingChannel: 'traditional_and_m2m',
    serviceTypes: ['sms'],
    model: { family: 'A', variant: 'threshold' },
    bands: [{ from: 0, to: null, unit: 'volume', discount: null, discountUnit: 'volume' }],
    applyTo: 'threshold',
    settings: defaultStatementSettings(),
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'st-004',
    direction: 'outbound',
    roamingChannel: 'traditional',
    serviceTypes: ['voice_mt'],
    model: { family: 'B', method: 'standard' },
    bands: [{ from: 0, to: null, unit: 'volume', discount: null, discountUnit: 'volume' }],
    applyTo: 'threshold',
    settings: defaultStatementSettings(),
    createdAt: '2024-01-01T00:00:00Z',
  },
]
