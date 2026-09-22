import { useState } from 'react'
import { ChevronUp, ChevronDown, Upload, Plus } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import { useDealStore as useDealShell } from '@/store/deal'
import { StatementTabs } from './StatementTabs'
import type { StatementFilter } from './StatementTabs'
import { StatementRow } from './StatementRow'
import { PairedStatementRow } from './PairedStatementRow'
import { StatementEmptyState } from './StatementEmptyState'
import { StatementImportModal } from './StatementImportModal'
import { OverrideInlinePicker } from './OverrideInlinePicker'
import type { Statement } from '@/domain/deal/types'

interface Props {
  onOpenSettings: (id: string) => void
}

type DisplayRow =
  | { type: 'paired'; inboundId: string; outboundId: string }
  | { type: 'single'; id: string; isPaired: boolean }

type Layer1Group = {
  mainRow: DisplayRow
  key: string
  representativeId: string  // inbound id for pairs, statement id for singles
  overrideRows: DisplayRow[]
}

function buildLayer1Groups(
  allStatements: Statement[],
  filter: StatementFilter,
): Layer1Group[] {
  const layer1 = allStatements.filter((s) => !s.layer || s.layer === 1)
  const layer2 = allStatements.filter((s) => s.layer === 2)

  // Build a map of parentStatementId → Layer 2 statements
  const overridesByParent = new Map<string, Statement[]>()
  for (const s of layer2) {
    const key = s.parentStatementId ?? '__orphan__'
    if (!overridesByParent.has(key)) overridesByParent.set(key, [])
    overridesByParent.get(key)!.push(s)
  }

  const source = filter === 'all' ? layer1 : layer1.filter((s) => s.direction === filter)

  // For filtered views, flatten to single rows (no grouping)
  if (filter !== 'all') {
    return source.map((st) => {
      const overrides = overridesByParent.get(st.id) ?? []
      return {
        mainRow: { type: 'single', id: st.id, isPaired: !!st.linkedStatementId },
        key: st.id,
        representativeId: st.id,
        overrideRows: overrides.map((o) => ({ type: 'single' as const, id: o.id, isPaired: !!o.linkedStatementId })),
      }
    })
  }

  // 'all' view — collapse linked Layer 1 pairs into paired rows
  const processed = new Set<string>()
  const groups: Layer1Group[] = []

  for (const st of layer1) {
    if (processed.has(st.id)) continue

    if (st.linkedStatementId) {
      const linked = layer1.find((s) => s.id === st.linkedStatementId)
      if (linked && !processed.has(linked.id)) {
        const inbound  = st.direction === 'inbound'  ? st : linked
        const outbound = st.direction === 'outbound' ? st : linked
        const key = `${inbound.id}:${outbound.id}`

        // Layer 2 overrides keyed by the inbound parent id
        const ovStmts = overridesByParent.get(inbound.id) ?? []
        const ovProcessed = new Set<string>()
        const ovRows: DisplayRow[] = []
        for (const ov of ovStmts) {
          if (ovProcessed.has(ov.id)) continue
          if (ov.linkedStatementId) {
            const ovLinked = layer2.find((s) => s.id === ov.linkedStatementId)
            if (ovLinked && !ovProcessed.has(ovLinked.id)) {
              const ovIn  = ov.direction === 'inbound'  ? ov : ovLinked
              const ovOut = ov.direction === 'outbound' ? ov : ovLinked
              ovRows.push({ type: 'paired', inboundId: ovIn.id, outboundId: ovOut.id })
              ovProcessed.add(ov.id)
              ovProcessed.add(ovLinked.id)
              continue
            }
          }
          ovRows.push({ type: 'single', id: ov.id, isPaired: false })
          ovProcessed.add(ov.id)
        }

        groups.push({
          mainRow: { type: 'paired', inboundId: inbound.id, outboundId: outbound.id },
          key,
          representativeId: inbound.id,
          overrideRows: ovRows,
        })
        processed.add(st.id)
        processed.add(linked.id)
        continue
      }
    }

    const ovStmts = overridesByParent.get(st.id) ?? []
    groups.push({
      mainRow: { type: 'single', id: st.id, isPaired: false },
      key: st.id,
      representativeId: st.id,
      overrideRows: ovStmts.map((o) => ({
        type: 'single' as const,
        id: o.id,
        isPaired: !!o.linkedStatementId,
      })),
    })
    processed.add(st.id)
  }

  return groups
}

function renderRow(
  row: DisplayRow,
  onOpenSettings: (id: string) => void,
  collapsed: boolean,
  onToggleCollapse: () => void,
) {
  if (row.type === 'paired') {
    return (
      <PairedStatementRow
        inboundId={row.inboundId}
        outboundId={row.outboundId}
        onOpenSettings={onOpenSettings}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />
    )
  }
  return (
    <StatementRow
      statementId={row.id}
      isPairedHalf={row.isPaired}
      onOpenSettings={onOpenSettings}
    />
  )
}

export function StatementSection({ onOpenSettings }: Props) {
  const [filter, setFilter] = useState<StatementFilter>('all')
  const [collapsed, setCollapsed] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [collapsedPairs, setCollapsedPairs] = useState<Set<string>>(() => new Set())
  const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null)

  function togglePairCollapsed(key: string) {
    setCollapsedPairs((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const allStatements      = useDealStore((s) => s.statements)
  const shell              = useDealShell((s) => s.shell)
  const addStatement       = useDealStore((s) => s.addStatement)
  const addPairedStatement = useDealStore((s) => s.addPairedStatement)
  const addOverrideStatement = useDealStore((s) => s.addOverrideStatement)

  const availablePartners = shell?.roamingPartners ?? []
  const layer1Count = allStatements.filter((s) => !s.layer || s.layer === 1).length
  const groups = buildLayer1Groups(allStatements, filter)
  const isEmpty = layer1Count === 0

  return (
    <>
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#e4e7ec] bg-white shrink-0">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-2 text-sm font-semibold text-[#0e2c46] hover:text-[#185992] transition-colors"
          >
            <span>
              Statement
              {allStatements.length > 0 && (
                <span className="ml-1.5 text-[10px] font-normal text-[#98a2b3]">
                  {allStatements.length}
                </span>
              )}
            </span>
            {collapsed
              ? <ChevronDown className="w-4 h-4 text-[#667085]" />
              : <ChevronUp   className="w-4 h-4 text-[#667085]" />
            }
          </button>

          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#0e2c46] border border-[#e4e7ec] rounded-lg px-2.5 py-1 hover:border-[#d0d5dd] bg-white transition-colors"
          >
            <Upload className="w-3 h-3" />
            Import
          </button>
        </div>

        {!collapsed && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Filter tabs */}
            <div className="shrink-0">
              <StatementTabs direction={filter} onChange={setFilter} />
            </div>

            {/* Statement cards */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {isEmpty ? (
                <StatementEmptyState direction={filter === 'all' ? 'inbound' : filter} />
              ) : (
                <>
                  {groups.map((group) => (
                    <div key={group.key} className="flex flex-col gap-1.5">
                      {/* Layer 1 main row */}
                      <div className={group.mainRow.type === 'paired' ? 'ml-4' : ''}>
                        {renderRow(
                          group.mainRow,
                          onOpenSettings,
                          collapsedPairs.has(group.key),
                          () => togglePairCollapsed(group.key),
                        )}
                      </div>

                      {/* Layer 2 override rows — indented with left accent */}
                      {group.overrideRows.length > 0 && (
                        <div className="ml-6 flex flex-col gap-1.5 border-l-2 border-[#0e2c46]/20 pl-3">
                          {group.overrideRows.map((ovRow) => {
                            const ovKey = ovRow.type === 'paired'
                              ? `${ovRow.inboundId}:${ovRow.outboundId}`
                              : ovRow.id
                            return (
                              <div key={ovKey} className={ovRow.type === 'paired' ? 'ml-4' : ''}>
                                {renderRow(
                                  ovRow,
                                  onOpenSettings,
                                  collapsedPairs.has(ovKey),
                                  () => togglePairCollapsed(ovKey),
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* + Add partner override affordance */}
                      {(!group.mainRow.type || filter === 'all') && (
                        <div className="ml-6">
                          {pickerOpenFor === group.representativeId ? (
                            <OverrideInlinePicker
                              availablePartners={availablePartners}
                              onConfirm={(partners) => {
                                addOverrideStatement(group.representativeId, partners)
                                setPickerOpenFor(null)
                              }}
                              onCancel={() => setPickerOpenFor(null)}
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPickerOpenFor(group.representativeId)}
                              className="flex items-center gap-1.5 text-[11px] font-medium text-[#667085] hover:text-[#0e2c46] transition-colors py-0.5 group"
                            >
                              <span className="flex items-center justify-center w-4 h-4 rounded border border-dashed border-[#d0d5dd] group-hover:border-[#0e2c46] transition-colors">
                                <Plus className="w-2.5 h-2.5" />
                              </span>
                              Add partner override
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Terminal add-slot for new Layer 1 statements */}
                  <div className="rounded-xl border border-dashed border-[#d0d5dd] bg-white px-4 py-3 flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addPairedStatement()}
                      className="text-xs font-semibold text-white bg-[#0e2c46] rounded-lg px-3 py-1.5 hover:bg-[#185992] transition-colors shrink-0"
                    >
                      + Paired
                    </button>
                    <button
                      type="button"
                      onClick={() => addStatement('inbound')}
                      className="text-xs font-medium text-[#667085] hover:text-[#0e2c46] transition-colors"
                    >
                      + Inbound only
                    </button>
                    <button
                      type="button"
                      onClick={() => addStatement('outbound')}
                      className="text-xs font-medium text-[#667085] hover:text-[#0e2c46] transition-colors"
                    >
                      + Outbound only
                    </button>
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={() => setImportOpen(true)}
                      className="flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#0e2c46] transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      Import from Excel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {importOpen && <StatementImportModal onClose={() => setImportOpen(false)} />}
    </>
  )
}
