import { create } from "zustand"
import { DEFAULT_PINS } from "@/data/flows"
import type { PinnedItem } from "@/data/flows"

const LS_PINS_KEY = "ns-pinned-ops"

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
  pendingFlowId: string | null
  pendingUserMessage: string | null

  setNavOpen: (open: boolean) => void
  toggleNav: () => void
  setActiveRailItem: (id: string) => void
  pinItem: (item: PinnedItem) => void
  unpinItem: (id: string) => void
  isPinned: (id: string) => boolean
  setPendingFlow: (flowId: string | null) => void
  setPendingUserMessage: (msg: string | null) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  navOpen: true,
  activeRailItem: "chat",
  pins: loadPins(),
  pendingFlowId: null,
  pendingUserMessage: null,

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

  setPendingFlow: (flowId) => set({ pendingFlowId: flowId }),
  setPendingUserMessage: (msg) => set({ pendingUserMessage: msg }),
}))
