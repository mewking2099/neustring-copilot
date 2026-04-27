function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

// ── Traffic ───────────────────────────────────────────────────────────────────

export interface TrafficData {
  months: string[]
  inbound: number[]
  outbound: number[]
  metrics: Array<{ label: string; value: string }>
  chips: Array<{ label: string; flowId: string }>
}

export async function fetchTrafficData(): Promise<TrafficData> {
  await delay(650)
  return {
    months:  ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    inbound: [3.2, 3.8, 3.5, 4.1, 3.9, 4.5],
    outbound:[2.1, 2.4, 2.6, 2.3, 2.8, 2.5],
    metrics: [
      { label: "Total Volume", value: "22.5 TB" },
      { label: "MoM Growth",   value: "+8.3%" },
      { label: "Top Corridor", value: "DE→DK" },
    ],
    chips: [
      { label: "Voice & SMS",       flowId: "traffic" },
      { label: "Forecast 2026",     flowId: "forecast" },
      { label: "DNKIA deal status", flowId: "partners" },
      { label: "Drill into BELHO",  flowId: "multirankings" },
    ],
  }
}

// ── Forecast ──────────────────────────────────────────────────────────────────

export interface ForecastData {
  months: string[]
  values: number[]
  historicalCount: number
  metrics: Array<{ label: string; value: string }>
  chips: Array<{ label: string; flowId: string }>
}

export async function fetchForecastData(): Promise<ForecastData> {
  await delay(650)
  return {
    months:         ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    values:         [42, 48, 45, 52, 55, 58, 63, 68, 74],
    historicalCount: 6,
    metrics: [
      { label: "Projected Volume", value: "74 TB" },
      { label: "YoY Growth",       value: "+14%" },
      { label: "Confidence",       value: "87%" },
    ],
    chips: [
      { label: "Voice forecast", flowId: "forecast" },
      { label: "View deal",      flowId: "partners" },
    ],
  }
}

// ── Rankings ──────────────────────────────────────────────────────────────────

export interface CorridorRanking {
  rank: number
  corridor: string
  volume: string
  mom: number
}

export interface RankingsData {
  corridors: CorridorRanking[]
  chips: Array<{ label: string; flowId: string }>
}

export async function fetchRankingsData(): Promise<RankingsData> {
  await delay(600)
  return {
    corridors: [
      { rank: 1, corridor: "France → Germany",    volume: "4.2 TB", mom: +8.1 },
      { rank: 2, corridor: "France → Spain",       volume: "3.8 TB", mom: +3.4 },
      { rank: 3, corridor: "France → UK",          volume: "3.1 TB", mom: -1.2 },
      { rank: 4, corridor: "France → Italy",       volume: "2.6 TB", mom: +5.7 },
      { rank: 5, corridor: "France → Netherlands", volume: "2.0 TB", mom: -0.4 },
    ],
    chips: [
      { label: "Multi-service breakdown", flowId: "multirankings" },
      { label: "Top partner",             flowId: "partners" },
    ],
  }
}

// ── Multi-Service Rankings ────────────────────────────────────────────────────

export interface MultiRankingRow {
  corridor: string
  data: number
  voice: number
  sms: number
  iot: number
  total: string
}

export interface MultiRankingsData {
  rows: MultiRankingRow[]
  chips: Array<{ label: string; flowId: string }>
}

export async function fetchMultiRankingsData(): Promise<MultiRankingsData> {
  await delay(620)
  return {
    rows: [
      { corridor: "FR→DE", data: 1, voice: 2, sms: 1, iot: 3, total: "4.2 TB" },
      { corridor: "FR→ES", data: 2, voice: 1, sms: 3, iot: 1, total: "3.8 TB" },
      { corridor: "FR→UK", data: 3, voice: 3, sms: 2, iot: 2, total: "3.1 TB" },
      { corridor: "FR→IT", data: 4, voice: 4, sms: 4, iot: 4, total: "2.6 TB" },
    ],
    chips: [
      { label: "Corridor rankings", flowId: "rankings" },
      { label: "Traffic detail",    flowId: "traffic" },
    ],
  }
}

// ── Partners ──────────────────────────────────────────────────────────────────

export type PartnerStatus = "Active" | "Expiring" | "At-risk"

export interface Partner {
  name: string
  tadig: string
  status: PartnerStatus
  lastContact: string
}

export interface PartnersData {
  partners: Partner[]
  chips: Array<{ label: string; flowId: string }>
}

export async function fetchPartnersData(): Promise<PartnersData> {
  await delay(680)
  return {
    partners: [
      { name: "Telia Sweden",   tadig: "SWEST",  status: "Active",   lastContact: "8 Apr 2025" },
      { name: "Telenor Norway", tadig: "NORTN",  status: "Expiring", lastContact: "2 Mar 2025" },
      { name: "DNA Finland",    tadig: "FINDNA", status: "Active",   lastContact: "15 Apr 2025" },
      { name: "Elisa Finland",  tadig: "FINELS", status: "At-risk",  lastContact: "18 Jan 2025" },
    ],
    chips: [
      { label: "Schedule review", flowId: "negotiation" },
      { label: "Export list",     flowId: "partners" },
    ],
  }
}

// ── Negotiation ───────────────────────────────────────────────────────────────

export interface NegotiationData {
  facts: Array<{ label: string; value: string }>
  points: string[]
  riskWarning: string
  chips: Array<{ label: string; flowId: string }>
}

export async function fetchNegotiationData(): Promise<NegotiationData> {
  await delay(700)
  return {
    facts: [
      { label: "Current Rates",  value: "€0.0042/MB" },
      { label: "Proposed Rates", value: "€0.0038/MB" },
      { label: "Expiry Date",    value: "31 Aug 2025" },
      { label: "Account Value",  value: "€2.4M / year" },
      { label: "Territory",      value: "Germany + Austria" },
      { label: "Deal Type",      value: "Bilateral IOT" },
    ],
    points: [
      "Lead with the 12% volume increase on DE→FR — leverage for improved rate.",
      "Vodafone DE proposed ±9% variance clause; counter with ±5% industry standard.",
      "Anchor on renewal before expiry to avoid auto-rollover at current rates.",
    ],
    riskWarning: "Rate lock expires in 98 days. Delay increases risk of auto-rollover at unfavourable rates.",
    chips: [
      { label: "Draft counter-offer", flowId: "deal" },
      { label: "Partner history",     flowId: "partners" },
    ],
  }
}

// ── Help ──────────────────────────────────────────────────────────────────────

export interface HelpData {
  steps: string[]
  chips: Array<{ label: string; flowId: string }>
}

export async function fetchHelpData(): Promise<HelpData> {
  await delay(500)
  return {
    steps: [
      "Navigate to Settings → TADIG Management in the left rail.",
      'Click "+ New Group" and enter a group name (e.g. "East Africa").',
      "Search for TADIG codes by operator name or country, then click Add.",
      "Repeat for each operator in the region. Groups can span up to 50 codes.",
      "Save the group, then reference it by name when creating a multi-country deal.",
    ],
    chips: [
      { label: "TADIG codes",       flowId: "tadig" },
      { label: "Multi-country deals", flowId: "deal" },
    ],
  }
}

// ── TADIG ─────────────────────────────────────────────────────────────────────

export interface TadigCode {
  code: string
  operator: string
  country: string
  verified: boolean
}

export interface TadigData {
  codes: TadigCode[]
  chips: Array<{ label: string; flowId: string }>
}

export async function fetchTadigData(): Promise<TadigData> {
  await delay(600)
  return {
    codes: [
      { code: "KENYAF", operator: "Safaricom",        country: "Kenya",    verified: true },
      { code: "TZATN",  operator: "Vodacom TZ",       country: "Tanzania", verified: true },
      { code: "UGAUT",  operator: "MTN Uganda",       country: "Uganda",   verified: true },
      { code: "RWARN",  operator: "MTN Rwanda",       country: "Rwanda",   verified: true },
      { code: "ETHEE",  operator: "Ethio Telecom",    country: "Ethiopia", verified: false },
      { code: "SDSUD",  operator: "MTN Sudan",        country: "Sudan",    verified: true },
      { code: "SOMSO",  operator: "Hormuud",          country: "Somalia",  verified: true },
      { code: "DJIDJ",  operator: "Djibouti Telecom", country: "Djibouti", verified: true },
    ],
    chips: [
      { label: "Use this group", flowId: "deal" },
    ],
  }
}
