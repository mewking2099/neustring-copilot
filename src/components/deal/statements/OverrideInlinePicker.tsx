import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  availablePartners: string[]
  onConfirm: (partners: string[]) => void
  onCancel: () => void
}

// Always unioned with shell partners so there are enough chips for multi-select
const DEMO_FALLBACK_PARTNERS = ['VODDE', 'DTAG', 'ORAFE', 'CHEOR', 'LIEVE']

export function OverrideInlinePicker({ availablePartners, onConfirm, onCancel }: Props) {
  const partners = [...new Set([...availablePartners, ...DEMO_FALLBACK_PARTNERS])]
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [custom, setCustom] = useState('')

  function toggle(p: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(p)) next.delete(p)
      else next.add(p)
      return next
    })
  }

  function addCustom() {
    const code = custom.trim().toUpperCase()
    if (!code) return
    setSelected((prev) => new Set([...prev, code]))
    setCustom('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addCustom()
  }

  const canConfirm = selected.size > 0

  return (
    <div className="mt-1 ml-6 rounded-xl border border-[#d0d5dd] bg-white shadow-sm px-4 py-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#344054]">Select partners for this override</p>
        <button onClick={onCancel} className="text-[#98a2b3] hover:text-[#667085] transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Partner chips */}
      <div className="flex flex-wrap gap-1.5">
        {partners.map((p) => {
          const active = selected.has(p)
          return (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium border transition-colors',
                active
                  ? 'bg-[#0e2c46] text-white border-[#0e2c46]'
                  : 'bg-white text-[#344054] border-[#d0d5dd] hover:border-[#0e2c46] hover:text-[#0e2c46]',
              )}
            >
              {p}
            </button>
          )
        })}
      </div>

      {/* Custom TADIG input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add TADIG code…"
          value={custom}
          onChange={(e) => setCustom(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          maxLength={6}
          className="flex-1 rounded-lg border border-[#d0d5dd] px-2.5 py-1.5 text-xs text-[#344054] placeholder:text-[#98a2b3] focus:outline-none focus:border-[#0e2c46] focus:ring-1 focus:ring-[#0e2c46]/20"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="px-2.5 py-1.5 rounded-lg border border-[#d0d5dd] text-xs text-[#667085] hover:border-[#0e2c46] hover:text-[#0e2c46] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Add
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[#f2f4f7]">
        <p className="text-[10px] text-[#98a2b3]">
          {selected.size === 0
            ? 'No partners selected'
            : `${selected.size} partner${selected.size !== 1 ? 's' : ''} selected`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#667085] hover:text-[#344054] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => canConfirm && onConfirm([...selected])}
            disabled={!canConfirm}
            className="rounded-lg bg-[#0e2c46] text-white text-xs font-semibold px-3 py-1.5 hover:bg-[#185992] disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Add override
          </button>
        </div>
      </div>
    </div>
  )
}
