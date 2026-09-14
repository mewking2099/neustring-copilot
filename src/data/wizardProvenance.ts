import { DEAL_HISTORY, type HistoricalDeal } from './dealHistory'

export interface PartnerSummary {
  tadig: string
  name: string
  dealCount: number
  lastDealId: string
  lastDealDate: string
  lastDealISO: string
}

export interface RateSuggestion {
  value: number
  min: number
  max: number
  avg: number
  sourceId: string
  sourceDate: string
  sampleSize: number
}

export interface TermSuggestion {
  termMonths: number
  count: number
  total: number
  sourceIds: string[]
}

export interface FrequencyRecord {
  count: number
  total: number
}

function byPartner(tadig: string): HistoricalDeal[] {
  return DEAL_HISTORY.filter((d) => d.partner === tadig)
}

function mostFrequent<T extends string | number>(items: T[]): T {
  const freq = new Map<T, number>()
  for (const v of items) freq.set(v, (freq.get(v) ?? 0) + 1)
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

export function getRecentPartners(): PartnerSummary[] {
  const map = new Map<string, { name: string; deals: HistoricalDeal[] }>()
  for (const deal of DEAL_HISTORY) {
    if (!map.has(deal.partner)) map.set(deal.partner, { name: deal.partnerName, deals: [] })
    map.get(deal.partner)!.deals.push(deal)
  }
  return Array.from(map.entries())
    .map(([tadig, { name, deals }]) => {
      const sorted = [...deals].sort((a, b) => b.closedAtISO.localeCompare(a.closedAtISO))
      return {
        tadig,
        name,
        dealCount: deals.length,
        lastDealId: sorted[0].id,
        lastDealDate: sorted[0].closedAt,
        lastDealISO: sorted[0].closedAtISO,
      }
    })
    .sort((a, b) => b.dealCount - a.dealCount)
}

export function getLastDeal(tadig: string): HistoricalDeal | null {
  const deals = byPartner(tadig)
  if (!deals.length) return null
  return [...deals].sort((a, b) => b.closedAtISO.localeCompare(a.closedAtISO))[0]
}

export function getUsualDealType(tadig: string): { type: string; count: number; total: number } | null {
  const deals = byPartner(tadig)
  if (!deals.length) return null
  const type = mostFrequent(deals.map((d) => d.dealType))
  const count = deals.filter((d) => d.dealType === type).length
  return { type, count, total: deals.length }
}

export function getServiceFrequency(tadig: string): Record<string, FrequencyRecord> {
  const deals = byPartner(tadig)
  const total = deals.length
  const result: Record<string, FrequencyRecord> = {}
  for (const svc of ['Data', 'Voice', 'SMS', 'IoT']) {
    result[svc] = { count: deals.filter((d) => d.services.includes(svc)).length, total }
  }
  return result
}

export function getRateSuggestion(
  tadig: string,
  service: 'data' | 'voice' | 'sms' | 'iot',
): RateSuggestion | null {
  const deals = byPartner(tadig).filter((d) => d.rates[service] !== undefined)
  if (!deals.length) return null
  const sorted = [...deals].sort((a, b) => b.closedAtISO.localeCompare(a.closedAtISO))
  const values = sorted.map((d) => d.rates[service]!)
  const avg = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 1000) / 1000
  return {
    value: sorted[0].rates[service]!,
    min: Math.min(...values),
    max: Math.max(...values),
    avg,
    sourceId: sorted[0].id,
    sourceDate: sorted[0].closedAt,
    sampleSize: deals.length,
  }
}

export function getSuggestedCurrency(
  tadig: string,
): { currency: string; count: number; total: number; sourceId: string } | null {
  const deals = byPartner(tadig)
  if (!deals.length) return null
  const currency = mostFrequent(deals.map((d) => d.currency))
  const currencyDeals = deals.filter((d) => d.currency === currency)
  const latest = [...currencyDeals].sort((a, b) => b.closedAtISO.localeCompare(a.closedAtISO))[0]
  return { currency, count: currencyDeals.length, total: deals.length, sourceId: latest.id }
}

export function getSuggestedTerm(tadig: string): TermSuggestion | null {
  const deals = byPartner(tadig)
  if (!deals.length) return null
  const termMonths = mostFrequent(deals.map((d) => d.termMonths))
  const matching = deals.filter((d) => d.termMonths === termMonths)
  return { termMonths, count: matching.length, total: deals.length, sourceIds: matching.map((d) => d.id) }
}

export function getAutoRenewalSuggestion(
  tadig: string,
): { value: boolean; count: number; total: number } | null {
  const deals = byPartner(tadig)
  if (!deals.length) return null
  const yesCount = deals.filter((d) => d.autoRenewal).length
  return { value: yesCount > deals.length / 2, count: yesCount, total: deals.length }
}
