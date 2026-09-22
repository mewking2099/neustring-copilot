import { create } from "zustand"
import { DEFAULT_PINS } from "@/data/flows"
import type { PinnedItem } from "@/data/flows"
import type { QualifyingResult } from "@/domain/deal/qualifyingTypes"

const LS_PINS_KEY = "ns-pinned-ops"
const LS_QUERY_LOG_KEY = "ns-query-log"
const LS_QUERY_SEEDED_KEY = "ns-query-log-seeded-v1"

export interface QueryLogEntry {
  text: string
  timestamp: string
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function createSeedLog(): QueryLogEntry[] {
  return [
    // "Which deals expire in the next 90 days?" — 11 entries, 7 in last 7 days (spike)
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(0) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(1) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(2) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(3) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(4) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(5) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(6) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(12) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(18) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(25) },
    { text: "Which deals expire in the next 90 days?", timestamp: daysAgo(29) },
    // "Forecast DT inbound data" — 14 entries, 3 in last 7 days
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(1) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(4) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(6) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(8) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(9) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(10) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(14) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(15) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(18) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(20) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(22) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(24) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(26) },
    { text: "Forecast inbound data from Deutsche Telekom for Q3", timestamp: daysAgo(28) },
    // "Summarise Vodafone negotiation" — 9 entries, 4 in last 7 days
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(1) },
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(3) },
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(5) },
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(6) },
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(11) },
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(16) },
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(20) },
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(25) },
    { text: "Summarise our Vodafone negotiation and suggest next steps", timestamp: daysAgo(28) },
    // "France corridor comparison" — 6 entries, 2 in last 7 days
    { text: "Compare France → Spain and France → Italy corridor rates", timestamp: daysAgo(2) },
    { text: "Compare France → Spain and France → Italy corridor rates", timestamp: daysAgo(5) },
    { text: "Compare France → Spain and France → Italy corridor rates", timestamp: daysAgo(12) },
    { text: "Compare France → Spain and France → Italy corridor rates", timestamp: daysAgo(19) },
    { text: "Compare France → Spain and France → Italy corridor rates", timestamp: daysAgo(23) },
    { text: "Compare France → Spain and France → Italy corridor rates", timestamp: daysAgo(27) },
    // "Bouygues notice window" — 4 entries, all older
    { text: "What is Bouygues' auto-renewal notice window?", timestamp: daysAgo(8) },
    { text: "What is Bouygues' auto-renewal notice window?", timestamp: daysAgo(15) },
    { text: "What is Bouygues' auto-renewal notice window?", timestamp: daysAgo(22) },
    { text: "What is Bouygues' auto-renewal notice window?", timestamp: daysAgo(28) },
    // "Orange PL IoT" — 3 entries, 1 recent
    { text: "Show Orange PL IoT rate movement since last renewal", timestamp: daysAgo(3) },
    { text: "Show Orange PL IoT rate movement since last renewal", timestamp: daysAgo(15) },
    { text: "Show Orange PL IoT rate movement since last renewal", timestamp: daysAgo(24) },
  ]
}

function loadQueryLog(): QueryLogEntry[] {
  if (localStorage.getItem(LS_QUERY_SEEDED_KEY)) {
    try {
      const stored = localStorage.getItem(LS_QUERY_LOG_KEY)
      return stored ? (JSON.parse(stored) as QueryLogEntry[]) : []
    } catch { return [] }
  }
  const seed = createSeedLog()
  localStorage.setItem(LS_QUERY_LOG_KEY, JSON.stringify(seed))
  localStorage.setItem(LS_QUERY_SEEDED_KEY, "1")
  return seed
}

function loadPins(): PinnedItem[] {
  try {
    const stored = localStorage.getItem(LS_PINS_KEY)
    return stored ? (JSON.parse(stored) as PinnedItem[]) : DEFAULT_PINS
  } catch {
    return DEFAULT_PINS
  }
}

function savePins(pins: PinnedItem[]) {
  localStorage.setItem(LS_PINS_KEY, JSON.stringify(pins))
}

interface AppState {
  navOpen: boolean
  activeRailItem: string
  pins: PinnedItem[]
  queryLog: QueryLogEntry[]
  pendingFlowId: string | null
  pendingUserMessage: string | null
  qualifyingDrawerOpen: boolean
  qualifyingResult: QualifyingResult | null

  setNavOpen: (open: boolean) => void
  toggleNav: () => void
  setActiveRailItem: (id: string) => void
  pinItem: (item: PinnedItem) => void
  unpinItem: (id: string) => void
  isPinned: (id: string) => boolean
  logQuery: (text: string) => void
  setPendingFlow: (flowId: string | null) => void
  setPendingUserMessage: (msg: string | null) => void
  setQualifyingDrawerOpen: (open: boolean) => void
  setQualifyingResult: (result: QualifyingResult | null) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  navOpen: true,
  activeRailItem: "chat",
  pins: loadPins(),
  queryLog: loadQueryLog(),
  pendingFlowId: null,
  pendingUserMessage: null,
  qualifyingDrawerOpen: false,
  qualifyingResult: null,

  setNavOpen: (open) => set({ navOpen: open }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
  setActiveRailItem: (id) => set({ activeRailItem: id }),

  pinItem: (item) => {
    if (get().isPinned(item.id)) return
    const next = [...get().pins, item]
    savePins(next)
    set({ pins: next })
  },
  unpinItem: (id) => {
    const next = get().pins.filter((p) => p.id !== id)
    savePins(next)
    set({ pins: next })
  },
  isPinned: (id) => get().pins.some((p) => p.id === id),

  logQuery: (text) => {
    const entry: QueryLogEntry = { text: text.trim(), timestamp: new Date().toISOString() }
    const next = [...get().queryLog, entry]
    try { localStorage.setItem(LS_QUERY_LOG_KEY, JSON.stringify(next)) } catch { /* quota */ }
    set({ queryLog: next })
  },

  setPendingFlow: (flowId) => set({ pendingFlowId: flowId }),
  setPendingUserMessage: (msg) => set({ pendingUserMessage: msg }),
  setQualifyingDrawerOpen: (open) => set({ qualifyingDrawerOpen: open }),
  setQualifyingResult: (result) => set({ qualifyingResult: result }),
}))
