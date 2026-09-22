import type { Statement, ServiceType, DiscountModel as DomainDiscountModel } from './types'
import { defaultStatementSettings } from './statementSettings'
import type { QualifyingResult, ServiceName, DiscountModel as QualifyingModel } from './qualifyingTypes'

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function makeTimestamp(): string {
  return new Date().toISOString()
}

// Maps qualifying service names to domain ServiceType arrays.
// Voice is split by direction — voice_mo (outbound) and voice_mt (inbound).
const SERVICE_TYPES: Record<ServiceName, { inbound: ServiceType[]; outbound: ServiceType[] }> = {
  Data:  { inbound: ['gprs'],     outbound: ['gprs']     },
  SMS:   { inbound: ['sms'],      outbound: ['sms']      },
  IoT:   { inbound: ['nb_iot'],   outbound: ['nb_iot']   },
  Voice: { inbound: ['voice_mt'], outbound: ['voice_mo'] },
}

function mapDiscountModel(q: QualifyingModel): DomainDiscountModel {
  switch (q) {
    case 'threshold': return { family: 'A', variant: 'threshold' }
    case 'tapered':   return { family: 'D', variant: 'incremental_volume' }
    case 'flat':      return { family: 'A', variant: 'threshold' }
    case 'iot-flat':  return { family: 'F', subtype: 'access_fee' }
  }
}

function baseStatement(
  direction: 'inbound' | 'outbound',
  serviceTypes: ServiceType[],
  model: DomainDiscountModel,
): Omit<Statement, 'id' | 'linkedStatementId' | 'mirrorMode'> {
  return {
    direction,
    roamingChannel: 'traditional',
    serviceTypes,
    model,
    bands: [{ from: 0, to: null, unit: 'volume', discount: null, discountUnit: 'volume' }],
    applyTo: 'threshold',
    settings: defaultStatementSettings(),
    createdAt: makeTimestamp(),
  }
}

/**
 * Builds the Layer 1 (global) statements from a qualifying result.
 * Each service × direction combination produces one statement.
 * 'both' direction produces a linked inbound + outbound pair.
 * Voice 'both' pairs have mirrorMode=false (different serviceTypes per side).
 * All other 'both' pairs have mirrorMode=true (shared serviceTypes).
 */
export function buildStatementsFromQualifying(result: QualifyingResult): Statement[] {
  const model = mapDiscountModel(result.discountModel)
  const statements: Statement[] = []

  for (const svc of result.services) {
    const dir = result.directions[svc] ?? 'both'
    const types = SERVICE_TYPES[svc]

    if (dir === 'both') {
      const inboundId  = makeId()
      const outboundId = makeId()
      const isVoice    = svc === 'Voice'

      const inbound: Statement = {
        id: inboundId,
        linkedStatementId: outboundId,
        mirrorMode: !isVoice,
        layer: 1,
        ...baseStatement('inbound', types.inbound, model),
      }
      const outbound: Statement = {
        id: outboundId,
        linkedStatementId: inboundId,
        mirrorMode: !isVoice,
        layer: 1,
        ...baseStatement('outbound', types.outbound, model),
      }
      statements.push(inbound, outbound)
    } else {
      const id = makeId()
      const serviceTypes = dir === 'inbound' ? types.inbound : types.outbound
      statements.push({ id, layer: 1, ...baseStatement(dir, serviceTypes, model) })
    }
  }

  return statements
}
