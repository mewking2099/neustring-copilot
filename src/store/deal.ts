import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DealShell, ChangeLogEntry, EntrySource } from '@/domain/deal/types'
import type { StatementCard, ServiceRow } from '@/domain/deal/cardTypes'
import { buildOverrideCard } from '@/domain/deal/cardMapper'
import { defaultStatementSettings } from '@/domain/deal/statementSettings'

// ── state shape ───────────────────────────────────────────────────────────────

export interface DealState {
  shell:        DealShell | null
  cards:        StatementCard[]
  aiChangeLog:  ChangeLogEntry[]
  entrySource:  EntrySource | null
  draftId:      string | null
}

// ── store interface ───────────────────────────────────────────────────────────

interface DealStore extends DealState {
  // Shell
  initShell:  (shell: DealShell, source: EntrySource) => void
  patchShell: (patch: Partial<DealShell>) => void
  clearDeal:  () => void

  // Cards — Layer 1 / Layer 2
  seedCards:        (cards: StatementCard[]) => void
  addOverrideCard:  (parentCardId: string, partners: string[]) => void
  removeCard:       (cardId: string) => void

  // Service rows inside a card
  addServiceRow:    (cardId: string, row?: Partial<ServiceRow>) => void
  updateServiceRow: (cardId: string, rowId: string, patch: Partial<ServiceRow>) => void
  removeServiceRow: (cardId: string, rowId: string) => void

  // Change log
  logChange:     (message: string, field: string) => void
  clearChangeLog: () => void
}

// ── helpers ───────────────────────────────────────────────────────────────────

const EMPTY_STATE: DealState = {
  shell:       null,
  cards:       [],
  aiChangeLog: [],
  entrySource: null,
  draftId:     null,
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function makeLogEntry(message: string, field: string): ChangeLogEntry {
  return { id: makeId(), timestamp: new Date().toISOString(), message, field }
}

function defaultServiceRow(partial?: Partial<ServiceRow>): ServiceRow {
  return {
    id:               makeId(),
    serviceType:      'voice_mo',
    model:            { family: 'A', variant: 'threshold' },
    applyTo:          'threshold',
    highCostFilter:   null,
    chargeUnit:       'Per Min (60/30 s)',
    inboundDiscount:  null,
    outboundDiscount: null,
    additionalBands:  [],
    ...partial,
  }
}

// ── store ─────────────────────────────────────────────────────────────────────

export const useDealStore = create<DealStore>()(
  persist(
    (set, get) => ({
      ...EMPTY_STATE,

      // ── shell ──────────────────────────────────────────────────────────────

      initShell(shell, source) {
        set({
          shell,
          entrySource: source,
          draftId:     shell.id,
          cards:       [],
          aiChangeLog: [
            makeLogEntry(
              `Deal started — ${shell.myNetworks.join(', ')} ↔ ${shell.roamingPartners.join(', ')}`,
              'shell',
            ),
          ],
        })
      },

      patchShell(patch) {
        const shell = get().shell
        if (!shell) return
        set({ shell: { ...shell, ...patch } })
        const keys = Object.keys(patch) as (keyof DealShell)[]
        keys.forEach((k) => {
          const val = patch[k]
          const label = Array.isArray(val) ? val.join(', ') : String(val)
          get().logChange(`${k} → ${label}`, `shell.${k}`)
        })
      },

      clearDeal() {
        set(EMPTY_STATE)
      },

      // ── cards ──────────────────────────────────────────────────────────────

      seedCards(cards) {
        set({ cards })
        get().logChange(
          `${cards.length} global statement card(s) seeded from qualifying intake`,
          'cards',
        )
      },

      addOverrideCard(parentCardId, partners) {
        const parent = get().cards.find((c) => c.id === parentCardId)
        if (!parent) return
        const override = buildOverrideCard(parent, partners)
        set((s) => ({ cards: [...s.cards, override] }))
        get().logChange(
          `Partner override card added — ${partners.join(', ')}`,
          `cards.override.${parentCardId}`,
        )
      },

      removeCard(cardId) {
        set((s) => ({ cards: s.cards.filter((c) => c.id !== cardId) }))
        get().logChange('Statement card removed', `cards.${cardId}`)
      },

      // ── service rows ───────────────────────────────────────────────────────

      addServiceRow(cardId, partial) {
        const row = defaultServiceRow(partial)
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId ? { ...c, serviceRows: [...c.serviceRows, row] } : c,
          ),
        }))
        get().logChange('Service row added', `cards.${cardId}.rows`)
      },

      updateServiceRow(cardId, rowId, patch) {
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  serviceRows: c.serviceRows.map((r) =>
                    r.id === rowId ? { ...r, ...patch } : r,
                  ),
                }
              : c,
          ),
        }))
        get().logChange('Service row updated', `cards.${cardId}.rows.${rowId}`)
      },

      removeServiceRow(cardId, rowId) {
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId
              ? { ...c, serviceRows: c.serviceRows.filter((r) => r.id !== rowId) }
              : c,
          ),
        }))
        get().logChange('Service row removed', `cards.${cardId}.rows.${rowId}`)
      },

      // ── change log ─────────────────────────────────────────────────────────

      logChange(message, field) {
        set((s) => ({
          aiChangeLog: [makeLogEntry(message, field), ...s.aiChangeLog],
        }))
      },

      clearChangeLog() {
        set({ aiChangeLog: [] })
      },
    }),
    {
      name: 'iris.deal.draft',
      partialize: (state) => ({
        shell:      state.shell,
        cards:      state.cards,
        entrySource: state.entrySource,
        draftId:    state.draftId,
      }),
    },
  ),
)

// keep defaultStatementSettings importable for anything that still references it
export { defaultStatementSettings }
