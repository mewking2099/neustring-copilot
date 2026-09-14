import { useState } from 'react'
import { ChevronUp, ChevronDown, Upload } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import { StatementTabs } from './StatementTabs'
import type { StatementFilter } from './StatementTabs'
import { StatementRow } from './StatementRow'
import { PairedStatementRow } from './PairedStatementRow'
import { StatementEmptyState } from './StatementEmptyState'
import { StatementImportModal } from './StatementImportModal'

interface Props {
  onOpenSettings: (id: string) => void
}

type DisplayRow =
  | { type: 'paired'; inboundId: string; outboundId: string }
  | { type: 'single'; id: string; isPaired: boolean }

function buildDisplayRows(
  allStatements: ReturnType<typeof useDealStore.getState>['statements'],
  filter: StatementFilter,
): DisplayRow[] {
  const linkedIds = new Set(
    allStatements.filter((s) => s.linkedStatementId).map((s) => s.id),
  )

  const source =
    filter === 'all'
      ? allStatements
      : allStatements.filter((st) => st.direction === filter)

  if (filter !== 'all') {
    return source.map((st) => ({ type: 'single', id: st.id, isPaired: linkedIds.has(st.id) }))
  }

  // 'all' view — collapse linked pairs into a single paired row
  const processed = new Set<string>()
  const rows: DisplayRow[] = []

  for (const st of allStatements) {
    if (processed.has(st.id)) continue
    if (st.linkedStatementId) {
      const linked = allStatements.find((s) => s.id === st.linkedStatementId)
      if (linked && !processed.has(linked.id)) {
        const inbound  = st.direction === 'inbound'  ? st : linked
        const outbound = st.direction === 'outbound' ? st : linked
        rows.push({ type: 'paired', inboundId: inbound.id, outboundId: outbound.id })
        processed.add(st.id)
        processed.add(linked.id)
        continue
      }
    }
    rows.push({ type: 'single', id: st.id, isPaired: false })
    processed.add(st.id)
  }

  return rows
}

export function StatementSection({ onOpenSettings }: Props) {
  const [filter, setFilter] = useState<StatementFilter>('all')
  const [collapsed, setCollapsed] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [collapsedPairs, setCollapsedPairs] = useState<Set<string>>(() => new Set())

  function togglePairCollapsed(key: string) {
    setCollapsedPairs((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const allStatements      = useDealStore((s) => s.statements)
  const addStatement       = useDealStore((s) => s.addStatement)
  const addPairedStatement = useDealStore((s) => s.addPairedStatement)

  const displayRows = buildDisplayRows(allStatements, filter)
  const isEmpty = displayRows.length === 0

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
                  {displayRows.map((row) => {
                    if (row.type === 'paired') {
                      const pairKey = `${row.inboundId}:${row.outboundId}`
                      return (
                        <div key={pairKey} className="ml-4">
                          <PairedStatementRow
                            inboundId={row.inboundId}
                            outboundId={row.outboundId}
                            onOpenSettings={onOpenSettings}
                            collapsed={collapsedPairs.has(pairKey)}
                            onToggleCollapse={() => togglePairCollapsed(pairKey)}
                          />
                        </div>
                      )
                    }
                    return (
                      <StatementRow
                        key={row.id}
                        statementId={row.id}
                        isPairedHalf={row.isPaired}
                        onOpenSettings={onOpenSettings}
                      />
                    )
                  })}

                  {/* Terminal add-slot */}
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
