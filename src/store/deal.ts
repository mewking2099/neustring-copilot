import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DealState, DealShell, Statement, ChangeLogEntry, EntrySource } from '@/domain/deal/types'
import { defaultStatementSettings } from '@/domain/deal/statementSettings'

// Store exposes state + actions together (Zustand best practice for this scale)
interface DealStore extends DealState {
  // Shell
  initShell: (shell: DealShell, source: EntrySource) => void
  patchShell: (patch: Partial<DealShell>) => void
  clearDeal: () => void

  // Statements — single direction
  addStatement: (direction: 'inbound' | 'outbound') => void
  updateStatement: (id: string, patch: Partial<Statement>) => void
  duplicateStatement: (id: string) => void
  deleteStatement: (id: string) => void
  copyToOutbound: () => void  // deprecated — retained as shim; prefer addPairedStatement

  // Statements — paired (Phase 2)
  addPairedStatement: (template?: Partial<Pick<Statement, 'serviceTypes' | 'model' | 'roamingChannel' | 'applyTo' | 'bands'>>) => void
  linkStatements: (inboundId: string, outboundId: string) => void
  unlinkStatement: (id: string) => void
  toggleMirrorMode: (id: string) => void

  // Change log
  logChange: (message: string, field: string) => void
  clearChangeLog: () => void
}

const EMPTY_STATE: DealState = {
  shell: null,
  statements: [],
  aiChangeLog: [],
  entrySource: null,
  draftId: null,
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function makeLogEntry(message: string, field: string): ChangeLogEntry {
  return { id: makeId(), timestamp: new Date().toISOString(), message, field }
}

export const useDealStore = create<DealStore>()(
  persist(
    (set, get) => ({
      ...EMPTY_STATE,

      initShell(shell, source) {
        set({
          shell,
          entrySource: source,
          draftId: shell.id,
          statements: [],
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
        const updated = { ...shell, ...patch }
        set({ shell: updated })
        // Log meaningful field changes
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

      addStatement(direction) {
        const id = makeId()
        const newStatement: Statement = {
          id,
          direction,
          roamingChannel: 'traditional',
          serviceTypes: [],
          model: { family: 'A', variant: 'threshold' },
          bands: [{ from: 0, to: null, unit: 'volume', discount: null, discountUnit: 'volume' }],
          applyTo: 'threshold',
          settings: defaultStatementSettings(),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          statements: [...s.statements, newStatement],
        }))
        get().logChange(`New ${direction} statement added`, `statements.${id}`)
      },

      updateStatement(id, patch) {
        const current = get().statements.find((s) => s.id === id)
        const linkedId = current?.mirrorMode ? current?.linkedStatementId : undefined

        // Fields that propagate to the mirror counterpart (direction/id/settings never mirror)
        const MIRRORED: (keyof Statement)[] = ['serviceTypes', 'model', 'bands', 'applyTo', 'roamingChannel']
        const mirrorPatch: Partial<Statement> = {}
        if (linkedId) {
          for (const field of MIRRORED) {
            if (field in patch) (mirrorPatch as Record<string, unknown>)[field] = patch[field as keyof typeof patch]
          }
        }

        set((s) => ({
          statements: s.statements.map((st) => {
            if (st.id === id) return { ...st, ...patch }
            if (linkedId && st.id === linkedId && Object.keys(mirrorPatch).length > 0) return { ...st, ...mirrorPatch }
            return st
          }),
        }))
        const keys = Object.keys(patch).join(', ')
        get().logChange(`Statement updated (${keys})`, `statements.${id}`)
      },

      duplicateStatement(id) {
        const orig = get().statements.find((s) => s.id === id)
        if (!orig) return
        const copy: Statement = { ...orig, id: makeId(), createdAt: new Date().toISOString() }
        set((s) => ({ statements: [...s.statements, copy] }))
        get().logChange('Statement duplicated', `statements.${copy.id}`)
      },

      deleteStatement(id) {
        set((s) => ({ statements: s.statements.filter((st) => st.id !== id) }))
        get().logChange('Statement removed', `statements.${id}`)
      },

      copyToOutbound() {
        // Deprecated — retained as a shim. New code should use addPairedStatement().
        console.warn('[iris] copyToOutbound() is deprecated — use addPairedStatement() instead.')
        const inbound = get().statements.filter((s) => s.direction === 'inbound')
        const copies: Statement[] = inbound.map((s) => ({
          ...s,
          id: makeId(),
          direction: 'outbound' as const,
          createdAt: new Date().toISOString(),
          linkedStatementId: undefined,
          mirrorMode: undefined,
        }))
        set((s) => ({ statements: [...s.statements, ...copies] }))
        get().logChange(
          `${copies.length} inbound statement(s) mirrored to outbound`,
          'statements',
        )
      },

      addPairedStatement(template) {
        const inboundId = makeId()
        const outboundId = makeId()
        const shared = {
          roamingChannel: template?.roamingChannel ?? ('traditional' as const),
          serviceTypes: template?.serviceTypes ?? [],
          model: template?.model ?? ({ family: 'A', variant: 'threshold' } as const),
          bands: template?.bands ?? [{ from: 0, to: null, unit: 'volume' as const, discount: null, discountUnit: 'volume' as const }],
          applyTo: template?.applyTo ?? ('threshold' as const),
          settings: defaultStatementSettings(),
          createdAt: new Date().toISOString(),
          mirrorMode: true,
        }
        const inbound: Statement = { id: inboundId, direction: 'inbound', linkedStatementId: outboundId, ...shared }
        const outbound: Statement = { id: outboundId, direction: 'outbound', linkedStatementId: inboundId, ...shared }
        set((s) => ({ statements: [...s.statements, inbound, outbound] }))
        get().logChange('Paired inbound+outbound statement added (mirror ON)', 'statements')
      },

      linkStatements(inboundId, outboundId) {
        set((s) => ({
          statements: s.statements.map((st) => {
            if (st.id === inboundId) return { ...st, linkedStatementId: outboundId, mirrorMode: true }
            if (st.id === outboundId) return { ...st, linkedStatementId: inboundId, mirrorMode: true }
            return st
          }),
        }))
        get().logChange('Statements linked as mirrored pair', 'statements')
      },

      unlinkStatement(id) {
        const linkedId = get().statements.find((s) => s.id === id)?.linkedStatementId
        set((s) => ({
          statements: s.statements.map((st) => {
            if (st.id === id || st.id === linkedId) {
              const { linkedStatementId: _l, mirrorMode: _m, ...rest } = st
              return rest
            }
            return st
          }),
        }))
        get().logChange('Statement pair unlinked', 'statements')
      },

      toggleMirrorMode(id) {
        const current = get().statements.find((s) => s.id === id)
        const linkedId = current?.linkedStatementId
        const newMode = !current?.mirrorMode
        set((s) => ({
          statements: s.statements.map((st) => {
            if (st.id === id || st.id === linkedId) return { ...st, mirrorMode: newMode }
            return st
          }),
        }))
        get().logChange(`Mirror ${newMode ? 'ON' : 'OFF'}`, 'statements')
      },

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
      // Only persist draft-relevant state, not transient UI
      partialize: (state) => ({
        shell: state.shell,
        statements: state.statements,
        entrySource: state.entrySource,
        draftId: state.draftId,
      }),
    },
  ),
)
