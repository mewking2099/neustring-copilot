export interface HistoricalDeal {
  id: string
  partner: string
  partnerName: string
  dealType: 'Bilateral' | 'Unilateral' | 'IOT-only' | 'MVNO'
  myNetworks: string[]
  services: string[]
  rates: Partial<Record<'data' | 'voice' | 'sms' | 'iot', number>>
  currency: string
  termMonths: number
  autoRenewal: boolean
  closedAt: string     // display label e.g. "Jun 2025"
  closedAtISO: string  // for sorting e.g. "2025-06-01"
  status: 'active' | 'completed'
}

export const DEAL_HISTORY: HistoricalDeal[] = [
  // ── GBVOD (Vodafone UK) — 5 deals ──────────────────────────────────────────
  {
    id: 'DL-4471', partner: 'GBVOD', partnerName: 'Vodafone UK',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice', 'SMS'],
    rates: { data: 0.85, voice: 0.029, sms: 0.007 },
    currency: 'EUR', termMonths: 24, autoRenewal: false,
    closedAt: 'Jun 2025', closedAtISO: '2025-06-01', status: 'active',
  },
  {
    id: 'DL-4210', partner: 'GBVOD', partnerName: 'Vodafone UK',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice'],
    rates: { data: 0.88, voice: 0.031 },
    currency: 'EUR', termMonths: 12, autoRenewal: true,
    closedAt: 'Jan 2025', closedAtISO: '2025-01-01', status: 'completed',
  },
  {
    id: 'DL-3980', partner: 'GBVOD', partnerName: 'Vodafone UK',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice', 'SMS'],
    rates: { data: 0.92, voice: 0.033, sms: 0.008 },
    currency: 'EUR', termMonths: 24, autoRenewal: false,
    closedAt: 'Jun 2024', closedAtISO: '2024-06-01', status: 'completed',
  },
  {
    id: 'DL-3750', partner: 'GBVOD', partnerName: 'Vodafone UK',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice'],
    rates: { data: 0.90, voice: 0.032 },
    currency: 'EUR', termMonths: 12, autoRenewal: false,
    closedAt: 'Jan 2024', closedAtISO: '2024-01-01', status: 'completed',
  },
  {
    id: 'DL-3521', partner: 'GBVOD', partnerName: 'Vodafone UK',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data'],
    rates: { data: 0.95 },
    currency: 'EUR', termMonths: 24, autoRenewal: false,
    closedAt: 'Jun 2023', closedAtISO: '2023-06-01', status: 'completed',
  },

  // ── DTEDT (Deutsche Telekom) — 3 deals ─────────────────────────────────────
  {
    id: 'DL-4320', partner: 'DTEDT', partnerName: 'Deutsche Telekom',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice'],
    rates: { data: 0.78, voice: 0.027 },
    currency: 'EUR', termMonths: 12, autoRenewal: false,
    closedAt: 'Apr 2025', closedAtISO: '2025-04-01', status: 'active',
  },
  {
    id: 'DL-4100', partner: 'DTEDT', partnerName: 'Deutsche Telekom',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice', 'SMS'],
    rates: { data: 0.82, voice: 0.029, sms: 0.006 },
    currency: 'EUR', termMonths: 24, autoRenewal: true,
    closedAt: 'Oct 2024', closedAtISO: '2024-10-01', status: 'completed',
  },
  {
    id: 'DL-3890', partner: 'DTEDT', partnerName: 'Deutsche Telekom',
    dealType: 'Unilateral', myNetworks: ['GBSM'],
    services: ['Data'],
    rates: { data: 0.80 },
    currency: 'EUR', termMonths: 12, autoRenewal: false,
    closedAt: 'Apr 2024', closedAtISO: '2024-04-01', status: 'completed',
  },

  // ── FRSF (SFR France) — 2 deals ────────────────────────────────────────────
  {
    id: 'DL-4190', partner: 'FRSF', partnerName: 'SFR France',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice'],
    rates: { data: 0.72, voice: 0.026 },
    currency: 'EUR', termMonths: 24, autoRenewal: false,
    closedAt: 'Mar 2025', closedAtISO: '2025-03-01', status: 'active',
  },
  {
    id: 'DL-3960', partner: 'FRSF', partnerName: 'SFR France',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice', 'SMS'],
    rates: { data: 0.75, voice: 0.027, sms: 0.006 },
    currency: 'EUR', termMonths: 24, autoRenewal: true,
    closedAt: 'Sep 2024', closedAtISO: '2024-09-01', status: 'completed',
  },

  // ── NLTIN (T-Mobile NL) — 1 deal ───────────────────────────────────────────
  {
    id: 'DL-4050', partner: 'NLTIN', partnerName: 'T-Mobile NL',
    dealType: 'Bilateral', myNetworks: ['GBSM'],
    services: ['Data', 'Voice'],
    rates: { data: 0.80, voice: 0.028 },
    currency: 'EUR', termMonths: 12, autoRenewal: false,
    closedAt: 'Feb 2025', closedAtISO: '2025-02-01', status: 'active',
  },
]
