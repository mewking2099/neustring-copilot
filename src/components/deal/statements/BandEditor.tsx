import { Plus, X } from 'lucide-react'
import type { IntervalBand } from '@/domain/deal/types'
import { cn } from '@/lib/utils'

interface Props {
  bands: IntervalBand[]
  onChange: (bands: IntervalBand[]) => void
  editable?: boolean
}

function makeBlankBand(prev?: IntervalBand): IntervalBand {
  return {
    from: prev?.to != null ? prev.to : null,
    to: null,
    unit: prev?.unit ?? 'volume',
    discount: null,
    discountUnit: prev?.discountUnit ?? 'volume',
  }
}

const inputCls = (editable: boolean) =>
  cn(
    'text-xs border border-[#e4e7ec] rounded px-1 py-1 outline-none text-center',
    editable
      ? 'bg-white focus:border-[#82bc34]'
      : 'bg-[#f9fafb] text-[#98a2b3] cursor-not-allowed',
  )

export function BandEditor({ bands, onChange, editable = true }: Props) {
  function updateBand(index: number, patch: Partial<IntervalBand>) {
    const next = bands.map((b, i) => (i === index ? { ...b, ...patch } : b))
    onChange(next)
  }

  function addBand() {
    onChange([...bands, makeBlankBand(bands.at(-1))])
  }

  function removeBand(index: number) {
    if (bands.length <= 1) return
    onChange(bands.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-0.5">
      {/* Layer 3 header */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[9px] font-bold text-[#667085] uppercase tracking-widest">
          Volume bands
        </span>
        <div className="flex-1 h-px bg-[#e4e7ec]" />
        <span className="text-[9px] text-[#98a2b3]">{bands.length} band{bands.length !== 1 ? 's' : ''}</span>
      </div>

      {bands.map((band, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#f9fafb] border border-[#f0f1f3] text-xs"
        >
          {/* Band index */}
          <span className="text-[9px] font-bold text-[#98a2b3] uppercase tracking-wider w-9 shrink-0">
            B{i + 1}
          </span>

          {/* Range */}
          <input
            type="number"
            value={band.from ?? ''}
            readOnly={!editable}
            onChange={(e) => editable && updateBand(i, { from: e.target.value === '' ? null : Number(e.target.value) })}
            className={cn(inputCls(editable), 'w-14')}
            placeholder="0"
          />
          <span className="text-[#98a2b3]">–</span>
          <input
            type="number"
            value={band.to ?? ''}
            readOnly={!editable}
            onChange={(e) => editable && updateBand(i, { to: e.target.value === '' ? null : Number(e.target.value) })}
            className={cn(inputCls(editable), 'w-14')}
            placeholder="∞"
          />
          <select
            value={band.unit}
            disabled={!editable}
            onChange={(e) => editable && updateBand(i, { unit: e.target.value as IntervalBand['unit'] })}
            className={cn(inputCls(editable), 'px-1.5')}
          >
            <option value="volume">Vol</option>
            <option value="charge">Charge</option>
            <option value="imsi">IMSI</option>
          </select>

          {/* Separator */}
          <span className="text-[#d0d5dd] mx-0.5">|</span>

          {/* Discount */}
          <input
            type="number"
            value={band.discount ?? ''}
            readOnly={!editable}
            onChange={(e) => editable && updateBand(i, { discount: e.target.value === '' ? null : Number(e.target.value) })}
            className={cn(inputCls(editable), 'w-14')}
            placeholder="—"
          />
          <select
            value={band.discountUnit}
            disabled={!editable}
            onChange={(e) => editable && updateBand(i, { discountUnit: e.target.value as IntervalBand['discountUnit'] })}
            className={cn(inputCls(editable), 'px-1.5')}
          >
            <option value="volume">Vol</option>
            <option value="percentage">%</option>
            <option value="fixed">Fixed</option>
          </select>

          {/* Remove — disabled when only one band */}
          {editable && (
            <button
              type="button"
              onClick={() => removeBand(i)}
              disabled={bands.length <= 1}
              className="ml-auto w-5 h-5 flex items-center justify-center rounded hover:bg-[#fff1f0] text-[#98a2b3] hover:text-[#d92d20] disabled:opacity-20 disabled:pointer-events-none transition-colors"
              title="Remove band"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {!editable && (
            <span className="ml-auto text-[10px] text-[#82bc34] font-medium">↑ mirroring</span>
          )}
        </div>
      ))}

      {/* Add band */}
      {editable && (
        <button
          type="button"
          onClick={addBand}
          className="flex items-center gap-1 mt-0.5 text-[10px] font-medium text-[#667085] hover:text-[#0e2c46] transition-colors py-0.5 group"
        >
          <span className="flex items-center justify-center w-4 h-4 rounded border border-dashed border-[#d0d5dd] group-hover:border-[#0e2c46] transition-colors">
            <Plus className="w-2.5 h-2.5" />
          </span>
          Add volume band
        </button>
      )}
    </div>
  )
}
