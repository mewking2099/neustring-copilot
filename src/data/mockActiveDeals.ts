export interface ActiveDeal {
  id: string
  partnerName: string
  partner: string
  services: string[]
  urgency: 'expiring' | 'countered' | 'idle'
  urgencyReason: string
  expiresAt?: string
  lastCounterAt?: string
  lastEditedAt: string
  currency: string
}

// Dates anchored to 2026-09-22 (current project date)
export const MOCK_ACTIVE_DEALS: ActiveDeal[] = [
  // RED — expires within 7 days (auto-renewal notice window)
  {
    id: 'DR-0188',
    partnerName: 'T-Mobile DE',
    partner: 'DTEDT',
    services: ['Data', 'Voice'],
    urgency: 'expiring',
    urgencyReason: 'Expires Sep 25 — auto-renewal notice window closes in 3 days',
    expiresAt: '2026-09-25T00:00:00Z',
    lastEditedAt: '2026-09-10T09:00:00Z',
    currency: 'EUR',
  },
  {
    id: 'DR-0172',
    partnerName: 'Telecom Italia',
    partner: 'ITMCM',
    services: ['Data', 'IoT'],
    urgency: 'expiring',
    urgencyReason: 'Expires Sep 28 — 6 days until auto-renewal triggers',
    expiresAt: '2026-09-28T00:00:00Z',
    lastEditedAt: '2026-09-15T14:00:00Z',
    currency: 'EUR',
  },
  // AMBER — partner countered / replied in last 48h
  {
    id: 'DR-0195',
    partnerName: 'Orange France',
    partner: 'FRORA',
    services: ['Data', 'Voice', 'SMS'],
    urgency: 'countered',
    urgencyReason: 'Orange France countered 18h ago — revised Data rate proposal',
    lastCounterAt: '2026-09-21T16:00:00Z',
    lastEditedAt: '2026-09-18T11:00:00Z',
    currency: 'EUR',
  },
  {
    id: 'DR-0183',
    partnerName: 'Bouygues Telecom',
    partner: 'FRBUY',
    services: ['Data'],
    urgency: 'countered',
    urgencyReason: 'Bouygues replied 42h ago — discount structure revised',
    lastCounterAt: '2026-09-20T10:00:00Z',
    lastEditedAt: '2026-09-17T09:00:00Z',
    currency: 'EUR',
  },
  // GREY — drafts idle 14+ days
  {
    id: 'DR-0167',
    partnerName: 'Swisscom',
    partner: 'CHSCM',
    services: ['Data', 'Voice'],
    urgency: 'idle',
    urgencyReason: 'Draft stalled — no edits in 21 days',
    lastEditedAt: '2026-09-01T08:00:00Z',
    currency: 'CHF',
  },
  {
    id: 'DR-0151',
    partnerName: 'Telstra AU',
    partner: 'AUTIL',
    services: ['Data'],
    urgency: 'idle',
    urgencyReason: 'Draft stalled — no edits in 28 days',
    lastEditedAt: '2026-08-25T14:00:00Z',
    currency: 'USD',
  },
]

export const URGENCY_COLORS: Record<ActiveDeal['urgency'], string> = {
  expiring:  '#f04438',
  countered: '#f79009',
  idle:      '#98a2b3',
}
