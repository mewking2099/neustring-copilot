import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ArrowLeftRight, Settings, Copy, Trash2, Link } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import type { DiscountModel, ServiceType, RoamingChannel } from '@/domain/deal/types'
import {
  MODEL_OPTIONS,
  SERVICE_TYPE_LABELS,
  ROAMING_CHANNEL_LABELS,
  APPLY_TO_LABELS,
} from '@/domain/deal/discountFamilies'
import { cn } from '@/lib/utils'

interface Props {
  statementId: string
  onOpenSettings: (id: string) => void
  isPairedHalf?: boolean
}

const MODEL_FAMILY_LABELS: Record<string, string> = {
  A: 'Family A — Threshold',
  B: 'Family B — Balanced/Unbalanced',
  C: 'Family C — Commitment',
  D: 'Family D — Incremental',
  E: 'Family E — Group',
  F: 'Family F — Access Fee / IMSI',
}

const MODEL_FAMILIES = ['A', 'B', 'C', 'D', 'E', 'F'] as const

function encodeModel(m: DiscountModel): string {
  if ('variant' in m)       return `${m.family}:${m.variant}`
  if ('method' in m)        return `${m.family}:${m.method}`
  if ('distribution' in m)  return `${m.family}:${m.distribution}`
  if ('subtype' in m)       return `${m.family}:${m.subtype}`
  return m.family
}

function decodeModel(key: string): DiscountModel {
  const [family, sub] = key.split(':') as [string, string]
  switch (family) {
    case 'A': return { family: 'A', variant: sub as 'threshold' | 'cross_service' | 'percentage_threshold' }
    case 'B': return { family: 'B', method: sub as 'standard' | 'bilateral' | 'group' }
    case 'C': return { family: 'C', variant: sub as 'volume_threshold' | 'charge_commitment' | 'market_share' | 'commitment_bub' }
    case 'D': return { family: 'D', variant: sub as 'incremental_volume' | 'incremental_charge' | 'bundle_allowances' }
    case 'E': return { family: 'E', distribution: sub as 'automatic' | 'back_to_back' }
    case 'F': return { family: 'F', subtype: sub as 'access_fee' | 'access_fee_interval' | 'incremental_access_fee' | 'imsi_commitment' | 'imsi_cap' | 'imsi_allowance' }
    default:  return { family: 'A', variant: 'threshold' }
  }
}

const ALL_SERVICE_TYPES: ServiceType[] = [
  'voice_mo', 'voice_mt', 'video_mt', 'sms', 'gprs', 'volte', 'nb_iot', 'lte_m', '5g',
]

const DEFAULT_BAND = {
  from: 0 as number | null,
  to: null as number | null,
  unit: 'volume' as const,
  discount: null as number | null,
  discountUnit: 'volume' as const,
}

// ── ServiceTypeSelect ─────────────────────────────────────────────────────────

interface ServiceTypeSelectProps {
  selected: ServiceType[]
  onChange: (next: ServiceType[]) => void
}

function ServiceTypeSelect({ selected, onChange }: ServiceTypeSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleToggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setOpen((o) => !o)
  }

  const filtered = ALL_SERVICE_TYPES.filter((st) =>
    SERVICE_TYPE_LABELS[st].toLowerCase().includes(search.toLowerCase()),
  )

  function toggle(st: ServiceType) {
    if (selected.includes(st)) {
      onChange(selected.filter((s) => s !== st))
    } else {
      onChange([...selected, st])
    }
  }

  return (
    <div className="relative flex-1 min-w-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="flex flex-wrap gap-1 min-h-[28px] px-2 py-1 border border-[#e4e7ec] rounded-lg text-xs bg-white hover:border-[#d0d5dd] transition-colors w-full text-left"
      >
        {selected.length === 0 ? (
          <span className="text-[#98a2b3] self-center">Select services…</span>
        ) : (
          selected.map((st) => (
            <span
              key={st}
              className="flex items-center gap-0.5 bg-[#f2f4f7] text-[#344054] rounded px-1.5 py-0.5"
              onClick={(e) => { e.stopPropagation(); toggle(st) }}
            >
              {SERVICE_TYPE_LABELS[st]}
              <span className="text-[#98a2b3] ml-0.5 hover:text-[#d92d20]">×</span>
            </span>
          ))
        )}
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropPos.top,
            left: dropPos.left,
            width: Math.max(dropPos.width, 224),
            zIndex: 9999,
          }}
          className="bg-white border border-[#e4e7ec] rounded-xl shadow-lg"
        >
          <div className="p-2 border-b border-[#f2f4f7]">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full text-xs border border-[#e4e7ec] rounded-lg px-2 py-1 outline-none focus:border-[#82bc34]"
            />
          </div>
          <div className="flex gap-2 px-2 py-1.5 border-b border-[#f2f4f7]">
            <button type="button" className="text-xs text-[#667085] hover:text-[#0e2c46]" onClick={() => onChange([...ALL_SERVICE_TYPES])}>All</button>
            <span className="text-[#e4e7ec]">|</span>
            <button type="button" className="text-xs text-[#667085] hover:text-[#0e2c46]" onClick={() => onChange([])}>Clear</button>
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.map((st) => (
              <li key={st}>
                <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#f9fafb] cursor-pointer text-xs text-[#344054]">
                  <input type="checkbox" checked={selected.includes(st)} onChange={() => toggle(st)} className="accent-[#82bc34]" />
                  {SERVICE_TYPE_LABELS[st]}
                </label>
              </li>
            ))}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  )
}

// ── StatementRow ──────────────────────────────────────────────────────────────

export function StatementRow({ statementId, onOpenSettings, isPairedHalf = false }: Props) {
  const [expanded, setExpanded] = useState(false)

  const statement          = useDealStore((s) => s.statements.find((st) => st.id === statementId))
  const updateStatement    = useDealStore((s) => s.updateStatement)
  const duplicateStatement = useDealStore((s) => s.duplicateStatement)
  const deleteStatement    = useDealStore((s) => s.deleteStatement)
  const addPairedStatement = useDealStore((s) => s.addPairedStatement)
  const linkStatements     = useDealStore((s) => s.linkStatements)

  if (!statement) return null

  const { direction, roamingChannel, serviceTypes, model, bands, applyTo } = statement
  const isLinked = !!statement.linkedStatementId
  const band = bands[0] ?? { ...DEFAULT_BAND }
  const modelKey = encodeModel(model)
  const modelLabel = MODEL_OPTIONS.find((o) => `${o.family}:${o.variant}` === modelKey)?.label ?? modelKey

  function handleSwapDirection() {
    if (isLinked) return
    updateStatement(statementId, { direction: direction === 'inbound' ? 'outbound' : 'inbound' })
  }

  function handleLinkToCounterpart() {
    const oppDirection = direction === 'inbound' ? 'outbound' : 'inbound'
    const store = useDealStore.getState()
    store.addStatement(oppDirection)
    const newest = useDealStore.getState().statements.at(-1)
    if (newest) {
      store.updateStatement(newest.id, { serviceTypes, model, bands, applyTo, roamingChannel })
      linkStatements(
        direction === 'inbound' ? statementId : newest.id,
        direction === 'inbound' ? newest.id : statementId,
      )
    }
  }

  function updateBand(patch: Partial<typeof band>) {
    updateStatement(statementId, { bands: [{ ...band, ...patch }] })
  }

  const discountDisplay = band.discount != null
    ? `${band.discount}${band.discountUnit === 'percentage' ? '%' : band.discountUnit === 'fixed' ? ' fixed' : ' vol'}`
    : '—'

  return (
    <div className="bg-white rounded-xl border border-[#e4e7ec] shadow-sm">
      {/* Primary face */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Direction badge / swap button */}
        {isLinked ? (
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-widest shrink-0 w-8 text-center py-0.5 rounded',
            direction === 'inbound' ? 'bg-[#eef2f7] text-[#344054]' : 'bg-[#f2f4f7] text-[#667085]',
          )}>
            {direction === 'inbound' ? 'IN' : 'OUT'}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleSwapDirection}
            title={`Swap to ${direction === 'inbound' ? 'outbound' : 'inbound'}`}
            className={cn(
              'flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest shrink-0 rounded px-1.5 py-0.5 transition-colors border',
              direction === 'inbound'
                ? 'bg-[#eef2f7] text-[#344054] border-[#d0d5dd] hover:border-[#0e2c46]'
                : 'bg-[#f2f4f7] text-[#667085] border-[#e4e7ec] hover:border-[#0e2c46]',
            )}
          >
            {direction === 'inbound' ? 'IN' : 'OUT'}
            <ArrowLeftRight className="w-2.5 h-2.5 ml-0.5 opacity-50" />
          </button>
        )}

        {/* Paired half badge — shown in Inbound/Outbound filtered views */}
        {isPairedHalf && (
          <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold text-[#4a7010] bg-[#e8f5cc] border border-[#c5e07a] rounded-full px-1.5 py-0.5">
            <svg viewBox="0 0 10 10" className="w-2 h-2" fill="none" aria-hidden="true">
              <path d="M1 4h8M6 2l2 2-2 2M9 6H1M4 4l-2 2 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Paired
          </span>
        )}

        {/* Service pills — flex-1 */}
        <ServiceTypeSelect
          selected={serviceTypes}
          onChange={(next) => updateStatement(statementId, { serviceTypes: next })}
        />

        {/* Model select — compact */}
        <div className="shrink-0 w-40" title={modelLabel}>
          <select
            value={modelKey}
            onChange={(e) => updateStatement(statementId, { model: decodeModel(e.target.value) })}
            className="w-full text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34] truncate"
          >
            {MODEL_FAMILIES.map((fam) => {
              const opts = MODEL_OPTIONS.filter((o) => o.family === fam)
              if (!opts.length) return null
              return (
                <optgroup key={fam} label={MODEL_FAMILY_LABELS[fam]}>
                  {opts.map((o) => (
                    <option key={`${o.family}:${o.variant}`} value={`${o.family}:${o.variant}`}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              )
            })}
          </select>
        </div>

        {/* Discount — inline */}
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="number"
            value={band.discount ?? ''}
            onChange={(e) => updateBand({ discount: e.target.value === '' ? null : Number(e.target.value) })}
            className="w-14 text-center text-xs border border-[#e4e7ec] rounded-lg px-1 py-1.5 outline-none focus:border-[#82bc34]"
            placeholder="—"
          />
          <select
            value={band.discountUnit}
            onChange={(e) => updateBand({ discountUnit: e.target.value as 'volume' | 'percentage' | 'fixed' })}
            className="text-xs border border-[#e4e7ec] rounded-lg px-1 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
          >
            <option value="volume">Vol</option>
            <option value="percentage">%</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        {/* Secondary indicator — shows non-default values when collapsed */}
        {!expanded && (roamingChannel !== 'traditional' || applyTo !== 'threshold' || band.from != null || band.to != null) && (
          <span className="text-[10px] text-[#667085] bg-[#f9fafb] rounded px-1.5 py-0.5 border border-[#e4e7ec] shrink-0">
            +details
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 ml-auto shrink-0">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            title={expanded ? 'Collapse details' : 'Expand details'}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f2f4f7] text-[#98a2b3] hover:text-[#344054] transition-colors"
          >
            <ChevronDown className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')} />
          </button>
          <button
            type="button"
            onClick={() => onOpenSettings(statementId)}
            title="Statement settings"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f2f4f7] text-[#98a2b3] hover:text-[#344054] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => deleteStatement(statementId)}
            title="Delete"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#fff1f0] text-[#98a2b3] hover:text-[#d92d20] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#f2f4f7] bg-[#f9fafb] rounded-b-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          {/* Channel */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-[#98a2b3] font-medium uppercase tracking-wide">Channel</span>
            <select
              value={roamingChannel}
              onChange={(e) => updateStatement(statementId, { roamingChannel: e.target.value as RoamingChannel })}
              className="text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
            >
              {Object.entries(ROAMING_CHANNEL_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Apply To */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-[#98a2b3] font-medium uppercase tracking-wide">Apply to</span>
            <select
              value={applyTo}
              onChange={(e) => updateStatement(statementId, { applyTo: e.target.value as typeof applyTo })}
              className="text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
            >
              {Object.entries(APPLY_TO_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Band interval */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-[#98a2b3] font-medium uppercase tracking-wide">From</span>
            <input
              type="number"
              value={band.from ?? ''}
              onChange={(e) => updateBand({ from: e.target.value === '' ? null : Number(e.target.value) })}
              className="w-16 text-center text-xs border border-[#e4e7ec] rounded-lg px-1 py-1.5 outline-none focus:border-[#82bc34] bg-white"
              placeholder="0"
            />
            <span className="text-[#98a2b3] text-xs">–</span>
            <input
              type="number"
              value={band.to ?? ''}
              onChange={(e) => updateBand({ to: e.target.value === '' ? null : Number(e.target.value) })}
              className="w-16 text-center text-xs border border-[#e4e7ec] rounded-lg px-1 py-1.5 outline-none focus:border-[#82bc34] bg-white"
              placeholder="∞"
            />
            <select
              value={band.unit}
              onChange={(e) => updateBand({ unit: e.target.value as 'volume' | 'charge' | 'imsi' })}
              className="text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
            >
              <option value="volume">Volume</option>
              <option value="charge">Charge</option>
              <option value="imsi">IMSI</option>
            </select>
          </div>

          {/* Secondary actions */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            <button
              type="button"
              onClick={() => duplicateStatement(statementId)}
              title="Duplicate"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#98a2b3] hover:text-[#344054] transition-colors border border-transparent hover:border-[#e4e7ec]"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {!isLinked && (
              <button
                type="button"
                onClick={handleLinkToCounterpart}
                title="Pair with a new counterpart statement"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#98a2b3] hover:text-[#4a7010] transition-colors border border-transparent hover:border-[#82bc34]"
              >
                <Link className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
