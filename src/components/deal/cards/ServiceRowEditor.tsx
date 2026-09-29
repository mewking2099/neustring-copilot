import { useState } from 'react'
import { Trash2, Plus, ChevronDown } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import type { ServiceRow } from '@/domain/deal/cardTypes'
import type { ServiceType, DiscountModel, ApplyTo } from '@/domain/deal/types'
import { SERVICE_TYPE_LABELS, MODEL_OPTIONS } from '@/domain/deal/discountFamilies'
import { cn } from '@/lib/utils'

const ALL_SERVICE_TYPES: ServiceType[] = [
  'voice_mo', 'voice_mt', 'sms', 'gprs', 'nb_iot', 'lte_m', '5g', 'volte', 'video_mt',
]

const MODEL_FAMILY_LABELS: Record<string, string> = {
  A: 'Family A — Threshold',
  B: 'Family B — Balanced/Unbalanced',
  C: 'Family C — Commitment',
  D: 'Family D — Incremental',
  E: 'Family E — Group',
  F: 'Family F — Access Fee / IMSI',
}

const MODEL_FAMILIES = ['A', 'B', 'C', 'D', 'E', 'F'] as const

const APPLY_TO_OPTIONS: { value: string; label: string }[] = [
  { value: 'threshold',     label: 'Threshold' },
  { value: 'retrospective', label: 'Retrospective' },
  { value: 'back_to_first', label: 'Back to First' },
]

function encodeModel(m: DiscountModel): string {
  switch (m.family) {
    case 'A': return `A:${m.variant}`
    case 'B': return `B:${m.method}`
    case 'C': return `C:${m.variant}`
    case 'D': return `D:${m.variant}`
    case 'E': return `E:${m.distribution}`
    case 'F': return `F:${m.subtype}`
  }
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



interface Props {
  cardId: string
  row: ServiceRow
  canDelete: boolean
  isLast: boolean
}

export function ServiceRowEditor({ cardId, row, canDelete, isLast }: Props) {
  const [bandsOpen, setBandsOpen] = useState(false)
  const updateServiceRow = useDealStore((s) => s.updateServiceRow)
  const removeServiceRow = useDealStore((s) => s.removeServiceRow)

  function patch(p: Partial<ServiceRow>) {
    updateServiceRow(cardId, row.id, p)
  }

  function addBand() {
    const prev = row.additionalBands[row.additionalBands.length - 1]
    const nextFrom = prev?.to != null ? prev.to + 1 : null
    patch({
      additionalBands: [
        ...row.additionalBands,
        { from: nextFrom, to: null, unit: 'volume', inboundDiscount: null, outboundDiscount: null },
      ],
    })
  }

  function updateBand(i: number, p: Partial<ServiceRow['additionalBands'][number]>) {
    const next = row.additionalBands.map((b, idx) => idx === i ? { ...b, ...p } : b)
    patch({ additionalBands: next })
  }

  function removeBand(i: number) {
    patch({ additionalBands: row.additionalBands.filter((_, idx) => idx !== i) })
  }

  const hasBands = row.additionalBands.length > 0

  return (
    <>
      {/* Primary row */}
      <tr className={cn('group hover:bg-[#f9fafb] transition-colors', !isLast && 'border-b border-[#f0f1f3]')}>
        {/* Service type */}
        <td className="px-3 py-2 w-36">
          <select
            value={row.serviceType}
            onChange={(e) => patch({ serviceType: e.target.value as ServiceType })}
            className="w-full text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
          >
            {ALL_SERVICE_TYPES.map((st) => (
              <option key={st} value={st}>{SERVICE_TYPE_LABELS[st] ?? st}</option>
            ))}
          </select>
        </td>

        {/* Discount model */}
        <td className="px-3 py-2 w-44">
          <select
            value={encodeModel(row.model)}
            onChange={(e) => patch({ model: decodeModel(e.target.value) })}
            className="w-full text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
          >
            {MODEL_FAMILIES.map((fam) => {
              const opts = MODEL_OPTIONS.filter((o) => o.family === fam)
              if (!opts.length) return null
              return (
                <optgroup key={fam} label={MODEL_FAMILY_LABELS[fam]}>
                  {opts.map((o) => {
                    const key = `${o.family}:${o.variant}`
                    return <option key={key} value={key}>{o.label}</option>
                  })}
                </optgroup>
              )
            })}
          </select>
        </td>

        {/* Apply To */}
        <td className="px-3 py-2 w-36">
          <select
            value={row.applyTo ?? 'threshold'}
            onChange={(e) => patch({ applyTo: e.target.value as ApplyTo })}
            className="w-full text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
          >
            {APPLY_TO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </td>

        {/* Charge unit */}
        <td className="px-3 py-2 w-44">
          <input
            type="text"
            value={row.chargeUnit}
            onChange={(e) => patch({ chargeUnit: e.target.value })}
            className="w-full text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
          />
        </td>

        {/* Inbound discount */}
        <td className="px-3 py-2 w-24 text-right">
          <input
            type="number"
            value={row.inboundDiscount ?? ''}
            onChange={(e) => patch({ inboundDiscount: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="—"
            className="w-full text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#0e2c46] font-medium text-right outline-none focus:border-[#82bc34] placeholder:text-[#98a2b3]"
          />
        </td>

        {/* Outbound discount */}
        <td className="px-3 py-2 w-24 text-right">
          <input
            type="number"
            value={row.outboundDiscount ?? ''}
            onChange={(e) => patch({ outboundDiscount: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="—"
            className="w-full text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#d04a02] font-medium text-right outline-none focus:border-[#82bc34] placeholder:text-[#98a2b3]"
          />
        </td>

        {/* Actions */}
        <td className="px-2 py-2 w-16">
          <div className="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setBandsOpen((v) => !v)}
              title="Additional bands"
              className={cn(
                'w-6 h-6 flex items-center justify-center rounded hover:bg-[#f2f4f7] transition-colors',
                hasBands ? 'text-[#0e2c46]' : 'text-[#98a2b3]',
              )}
            >
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', bandsOpen && 'rotate-180')} />
            </button>
            {canDelete && (
              <button
                type="button"
                onClick={() => removeServiceRow(cardId, row.id)}
                title="Remove row"
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#fff1f0] text-[#98a2b3] hover:text-[#d92d20] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Additional bands (Layer 3) */}
      {bandsOpen && (
        <tr>
          <td colSpan={7} className="px-3 pb-2">
            <div className="ml-4 border-l-2 border-[#e4e7ec] pl-3 flex flex-col gap-1">
              {/* High cost destination (de-prioritised) */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-bold text-[#98a2b3] uppercase tracking-widest w-28 shrink-0">High Cost Dest.</span>
                <input
                  type="text"
                  value={row.highCostFilter ?? ''}
                  onChange={(e) => patch({ highCostFilter: e.target.value || null })}
                  placeholder="e.g. 210 Countries"
                  className="flex-1 text-xs border border-[#e4e7ec] rounded px-2 py-1 outline-none focus:border-[#82bc34] placeholder:text-[#98a2b3]"
                />
              </div>

              <p className="text-[9px] font-bold text-[#98a2b3] uppercase tracking-widest mb-1">
                Additional rate bands
              </p>
              {row.additionalBands.map((band, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-[#98a2b3] w-5 shrink-0">B{i + 2}</span>

                  {/* Volume range */}
                  <input
                    type="number"
                    value={band.from ?? ''}
                    onChange={(e) => updateBand(i, { from: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="From"
                    className="w-20 text-xs border border-[#e4e7ec] rounded px-2 py-1 text-right text-[#344054] outline-none focus:border-[#82bc34] placeholder:text-[#98a2b3]"
                  />
                  <span className="text-[10px] text-[#98a2b3]">–</span>
                  <input
                    type="number"
                    value={band.to ?? ''}
                    onChange={(e) => updateBand(i, { to: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="∞"
                    className="w-20 text-xs border border-[#e4e7ec] rounded px-2 py-1 text-right text-[#344054] outline-none focus:border-[#82bc34] placeholder:text-[#98a2b3]"
                  />

                  {/* Unit */}
                  <select
                    value={band.unit}
                    onChange={(e) => updateBand(i, { unit: e.target.value as 'volume' | 'charge' })}
                    className="text-xs border border-[#e4e7ec] rounded px-1.5 py-1 bg-white text-[#344054] outline-none focus:border-[#82bc34]"
                  >
                    <option value="volume">Vol</option>
                    <option value="charge">Charge</option>
                  </select>

                  {/* Inbound / Outbound discounts */}
                  <input
                    type="number"
                    value={band.inboundDiscount ?? ''}
                    onChange={(e) => updateBand(i, { inboundDiscount: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="IN %"
                    className="w-16 text-xs border border-[#e4e7ec] rounded px-2 py-1 text-right text-[#0e2c46] outline-none focus:border-[#82bc34] placeholder:text-[#98a2b3]"
                  />
                  <input
                    type="number"
                    value={band.outboundDiscount ?? ''}
                    onChange={(e) => updateBand(i, { outboundDiscount: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="OUT %"
                    className="w-16 text-xs border border-[#e4e7ec] rounded px-2 py-1 text-right text-[#d04a02] outline-none focus:border-[#82bc34] placeholder:text-[#98a2b3]"
                  />

                  <button
                    type="button"
                    onClick={() => removeBand(i)}
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#fff1f0] text-[#98a2b3] hover:text-[#d92d20] transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBand}
                className="flex items-center gap-1 text-[10px] font-medium text-[#667085] hover:text-[#0e2c46] transition-colors mt-0.5"
              >
                <Plus className="w-3 h-3" /> Add band
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
