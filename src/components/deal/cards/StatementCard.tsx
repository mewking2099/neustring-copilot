import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import type { StatementCard as IStatementCard } from '@/domain/deal/cardTypes'
import { SERVICE_TYPE_LABELS } from '@/domain/deal/discountFamilies'
import { ServiceRowEditor } from './ServiceRowEditor'
import { OverrideInlinePicker } from '../statements/OverrideInlinePicker'
import { cn } from '@/lib/utils'

interface Props {
  card: IStatementCard
  shell: { myNetworks: string[]; roamingPartners: string[]; period: { start: string; end: string } } | null
}

function directionBadge(d: IStatementCard['direction']) {
  if (d === 'bilateral') return (
    <>
      <span className="text-[9px] font-bold text-white bg-[#2563eb] rounded-full px-2 py-0.5">Inbound</span>
      <span className="text-[9px] font-bold text-white bg-[#dc4f00] rounded-full px-2 py-0.5">Outbound</span>
    </>
  )
  if (d === 'inbound')  return <span className="text-[9px] font-bold text-white bg-[#2563eb] rounded-full px-2 py-0.5">Inbound</span>
  return <span className="text-[9px] font-bold text-white bg-[#dc4f00] rounded-full px-2 py-0.5">Outbound</span>
}

function networkLabel(codes: string[], allCodes: string[]): string {
  if (!codes.length) {
    if (allCodes.length <= 3) return allCodes.join(', ')
    return `${allCodes.slice(0, 2).join(', ')}... +${allCodes.length - 2} more`
  }
  if (codes.length <= 3) return codes.join(', ')
  return `${codes.slice(0, 2).join(', ')}... +${codes.length - 2} more`
}

export function StatementCard({ card, shell }: Props) {
  const [expanded, setExpanded] = useState(card.layer === 1)
  const [pickerOpen, setPickerOpen] = useState(false)

  const addServiceRow      = useDealStore((s) => s.addServiceRow)
  const addOverrideCard    = useDealStore((s) => s.addOverrideCard)
  const removeCard         = useDealStore((s) => s.removeCard)

  const allMyNetworks     = shell?.myNetworks     ?? []
  const allPartners       = shell?.roamingPartners ?? []
  const period            = shell?.period

  const displayMyNetworks = networkLabel(card.myNetworks, allMyNetworks)
  const displayPartners   = card.partnerNetworks.length
    ? card.partnerNetworks.join(', ')
    : networkLabel([], allPartners)

  // Service chips for collapsed header
  const serviceChips = [...new Set(card.serviceRows.map((r) => r.serviceType))]

  const isLayer2 = card.layer === 2

  return (
    <div className={cn(
      'rounded-xl border bg-white shadow-sm overflow-hidden',
      isLayer2 ? 'border-[#0e2c46]/30' : 'border-[#e4e7ec]',
    )}>
      {/* Layer indicator rail */}
      {isLayer2 && <div className="h-0.5 bg-[#0e2c46]" />}

      {/* Card header */}
      <div
        className={cn(
          'flex items-start gap-2 px-4 py-3 cursor-pointer select-none',
          isLayer2 ? 'bg-[#f0f3f8]' : 'bg-white',
        )}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          {/* Top line: period + direction badges + service chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {period && (
              <span className="text-[10px] font-semibold text-[#344054] shrink-0">
                {period.start} – {period.end}
              </span>
            )}
            {directionBadge(card.direction)}

            {/* Layer 2 scope badge */}
            {isLayer2 && card.scopedPartners && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#0e2c46] text-white text-[9px] font-semibold px-2 py-0.5">
                <svg viewBox="0 0 10 10" className="w-2 h-2 opacity-70" fill="none">
                  <path d="M2 5h6M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {card.scopedPartners.slice(0, 3).join(' · ')}
                {card.scopedPartners.length > 3 && <span className="opacity-70">+{card.scopedPartners.length - 3}</span>}
              </span>
            )}

            {/* Service type chips */}
            <div className="flex items-center gap-1 flex-wrap">
              {serviceChips.map((st) => (
                <span key={st} className="text-[9px] font-bold text-[#344054] bg-[#f2f4f7] border border-[#e4e7ec] rounded px-1.5 py-0.5">
                  {SERVICE_TYPE_LABELS[st] ?? st}
                </span>
              ))}
            </div>
          </div>

          {/* Second line: My Network × Partner Network */}
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-[#98a2b3] uppercase tracking-wide font-medium shrink-0">My Network</span>
              <span className="text-xs text-[#344054] font-medium">{displayMyNetworks}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-[#98a2b3] uppercase tracking-wide font-medium shrink-0">Partner</span>
              <span className="text-xs text-[#344054] font-medium">{displayPartners}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-[#98a2b3] uppercase tracking-wide font-medium">Currency</span>
              <span className="text-xs text-[#344054]">EUR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-[#98a2b3] uppercase tracking-wide font-medium">Route by Route</span>
              <span className="text-xs text-[#344054]">NO</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-[#667085]">{expanded ? 'View Less' : 'View More'}</span>
          <ChevronDown className={cn('w-3.5 h-3.5 text-[#667085] transition-transform', expanded && 'rotate-180')} />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeCard(card.id) }}
            className="ml-1 w-6 h-6 flex items-center justify-center rounded hover:bg-[#fff1f0] text-[#98a2b3] hover:text-[#d92d20] transition-colors"
            title="Remove card"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expanded service table */}
      {expanded && (
        <div className="border-t border-[#f0f1f3]">
          {/* Network sub-header */}
          <div className="px-4 py-2 bg-[#f9fafb] border-b border-[#f0f1f3] flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#344054]">
              {card.myNetworks.length
                ? networkLabel(card.myNetworks, allMyNetworks)
                : networkLabel([], allMyNetworks)}
            </span>
          </div>

          <table className="w-full border-collapse">
            {/* Column headers */}
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                <th className="px-3 py-2 text-left text-[9px] font-bold text-[#667085] uppercase tracking-wider w-36">Service Type</th>
                <th className="px-3 py-2 text-left text-[9px] font-bold text-[#667085] uppercase tracking-wider w-44">Discount Model</th>
                <th className="px-3 py-2 text-left text-[9px] font-bold text-[#667085] uppercase tracking-wider w-36">High Cost Dest.</th>
                <th className="px-3 py-2 text-left text-[9px] font-bold text-[#667085] uppercase tracking-wider w-44">Charge Unit</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold text-[#2563eb] uppercase tracking-wider w-24">Inbound</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold text-[#dc4f00] uppercase tracking-wider w-24">Outbound</th>
                <th className="w-16" />
              </tr>
            </thead>

            <tbody>
              {card.serviceRows.map((row, i) => (
                <ServiceRowEditor
                  key={row.id}
                  cardId={card.id}
                  row={row}
                  canDelete={card.serviceRows.length > 1}
                  isLast={i === card.serviceRows.length - 1}
                />
              ))}
            </tbody>
          </table>

          {/* Card footer actions */}
          <div className="px-4 py-3 border-t border-[#f0f1f3] flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => addServiceRow(card.id)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[#667085] hover:text-[#0e2c46] transition-colors group"
            >
              <span className="flex items-center justify-center w-4 h-4 rounded border border-dashed border-[#d0d5dd] group-hover:border-[#0e2c46] transition-colors">
                <Plus className="w-2.5 h-2.5" />
              </span>
              Add service row
            </button>

            {card.layer === 1 && (
              <>
                {pickerOpen ? (
                  <OverrideInlinePicker
                    availablePartners={allPartners}
                    onConfirm={(partners) => {
                      addOverrideCard(card.id, partners)
                      setPickerOpen(false)
                    }}
                    onCancel={() => setPickerOpen(false)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-[#667085] hover:text-[#0e2c46] transition-colors group"
                  >
                    <span className="flex items-center justify-center w-4 h-4 rounded border border-dashed border-[#d0d5dd] group-hover:border-[#0e2c46] transition-colors">
                      <Plus className="w-2.5 h-2.5" />
                    </span>
                    Add partner override
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
