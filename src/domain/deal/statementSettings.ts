import type { StatementSettings } from './types'

export function defaultStatementSettings(): StatementSettings {
  return {
    includeTax: false,
    currency: 'EUR',
    chargeableOrCharged: 'chargeable',
    chargedValue: null,
    includePremium: false,
    myNetworksOverride: [],
    roamingPartnersOverride: [],
    periodOverride: null,
    permanentRoamers: 'regular',
    routeByRoute: false,
    distributionByPeriod: false,
    marketChannel: [],
    customerName: [],
    productName: [],
    deviceType: [],
  }
}
