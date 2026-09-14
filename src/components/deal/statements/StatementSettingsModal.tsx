import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useDealStore } from '@/store/deal'
import type { StatementSettings } from '@/domain/deal/types'
import { defaultStatementSettings } from '@/domain/deal/statementSettings'

interface Props {
  statementId: string | null
  onClose: () => void
}

/** Simple multi-value chip input (comma-separated text) */
function ChipInput({
  label,
  values,
  onChange,
}: {
  label: string
  values: string[]
  onChange: (next: string[]) => void
}) {
  const [inputVal, setInputVal] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
      e.preventDefault()
      const next = inputVal.trim().replace(/,$/, '')
      if (next && !values.includes(next)) {
        onChange([...values, next])
      }
      setInputVal('')
    } else if (e.key === 'Backspace' && inputVal === '' && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  function removeChip(val: string) {
    onChange(values.filter((v) => v !== val))
  }

  return (
    <div>
      <label className="block text-xs text-[#667085] mb-1">{label}</label>
      <div className="flex flex-wrap gap-1 border border-[#e4e7ec] rounded px-2 py-1.5 min-h-[34px] focus-within:border-[#82bc34] transition-colors">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-0.5 bg-[#f2f4f7] text-[#344054] text-xs rounded px-1.5 py-0.5"
          >
            {v}
            <button
              type="button"
              onClick={() => removeChip(v)}
              className="text-[#98a2b3] hover:text-[#344054] ml-0.5"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? 'Type and press Enter…' : ''}
          className="flex-1 min-w-[80px] text-xs outline-none bg-transparent text-[#344054]"
        />
      </div>
    </div>
  )
}

const LABEL_CLASS = 'block text-xs text-[#667085] mb-1'
const INPUT_CLASS = 'w-full text-xs border border-[#e4e7ec] rounded px-2 py-1.5 outline-none focus:border-[#82bc34] text-[#344054] transition-colors'
const ROW_CLASS = 'flex items-center justify-between py-1.5'

export function StatementSettingsModal({ statementId, onClose }: Props) {
  const statement = useDealStore((s) =>
    s.statements.find((st) => st.id === statementId),
  )
  const updateStatement = useDealStore((s) => s.updateStatement)

  const [local, setLocal] = useState<StatementSettings>(defaultStatementSettings())
  const overlayRef = useRef<HTMLDivElement>(null)

  // Sync local state when the modal opens for a new statement
  useEffect(() => {
    if (statement) {
      setLocal({ ...statement.settings })
    }
  }, [statementId, statement])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!statementId || !statement) return null

  function patch(p: Partial<StatementSettings>) {
    setLocal((prev) => ({ ...prev, ...p }))
  }

  function handleConfirm() {
    if (statementId) {
      updateStatement(statementId, { settings: local })
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-label="Statement Settings"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={overlayRef}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl mx-4 flex flex-col max-h-[90vh]"
      >
        {/* Green header */}
        <div className="bg-[#2d7a4f] text-white px-4 py-3 rounded-t-xl flex items-center justify-between shrink-0">
          <span className="text-sm font-semibold tracking-wide">STATEMENT SETTINGS</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto flex-1 px-4 py-4 flex flex-col gap-4">
          {/* Include Tax + Currency */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-[#344054] cursor-pointer">
              <input
                type="checkbox"
                checked={local.includeTax}
                onChange={(e) => patch({ includeTax: e.target.checked })}
                className="accent-[#2d7a4f]"
              />
              Include Tax
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <label className={LABEL_CLASS + ' mb-0'}>Currency</label>
              <select
                value={local.currency}
                onChange={(e) => patch({ currency: e.target.value })}
                className="text-xs border border-[#e4e7ec] rounded px-2 py-1 outline-none focus:border-[#82bc34] text-[#344054]"
              >
                {['EUR', 'USD', 'GBP', 'JPY', 'CHF'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chargeable / Charged */}
          <div>
            <label className={LABEL_CLASS}>Chargeable / Charged</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-[#344054] cursor-pointer">
                <input
                  type="radio"
                  name="chargeableOrCharged"
                  value="chargeable"
                  checked={local.chargeableOrCharged === 'chargeable'}
                  onChange={() => patch({ chargeableOrCharged: 'chargeable' })}
                  className="accent-[#2d7a4f]"
                />
                Chargeable
              </label>
              <label className="flex items-center gap-2 text-xs text-[#344054] cursor-pointer">
                <input
                  type="radio"
                  name="chargeableOrCharged"
                  value="charged"
                  checked={local.chargeableOrCharged === 'charged'}
                  onChange={() => patch({ chargeableOrCharged: 'charged' })}
                  className="accent-[#2d7a4f]"
                />
                Charged
              </label>
              {local.chargeableOrCharged === 'charged' && (
                <input
                  type="text"
                  value={local.chargedValue ?? ''}
                  onChange={(e) => patch({ chargedValue: e.target.value || null })}
                  placeholder="Value"
                  className={INPUT_CLASS + ' w-24'}
                />
              )}
            </div>
          </div>

          {/* Include Premium */}
          <label className="flex items-center gap-2 text-xs text-[#344054] cursor-pointer">
            <input
              type="checkbox"
              checked={local.includePremium}
              onChange={(e) => patch({ includePremium: e.target.checked })}
              className="accent-[#2d7a4f]"
            />
            Include Premium
          </label>

          {/* My Networks override */}
          <ChipInput
            label="My Networks (override)"
            values={local.myNetworksOverride}
            onChange={(v) => patch({ myNetworksOverride: v })}
          />

          {/* Roaming Partners override */}
          <ChipInput
            label="Roaming Partners (override)"
            values={local.roamingPartnersOverride}
            onChange={(v) => patch({ roamingPartnersOverride: v })}
          />

          {/* Period override */}
          <div>
            <label className={LABEL_CLASS}>Period override</label>
            <div className="flex items-center gap-2">
              <input
                type="month"
                value={local.periodOverride?.start ?? ''}
                onChange={(e) =>
                  patch({
                    periodOverride: {
                      start: e.target.value,
                      end: local.periodOverride?.end ?? '',
                    },
                  })
                }
                className={INPUT_CLASS}
              />
              <span className="text-[#98a2b3] text-xs shrink-0">–</span>
              <input
                type="month"
                value={local.periodOverride?.end ?? ''}
                onChange={(e) =>
                  patch({
                    periodOverride: {
                      start: local.periodOverride?.start ?? '',
                      end: e.target.value,
                    },
                  })
                }
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Permanent Roamers */}
          <div>
            <label className={LABEL_CLASS}>Permanent Roamers</label>
            <div className="flex gap-2">
              {(['pb_traffic', 'regular'] as const).map((v) => {
                const active = local.permanentRoamers === v
                const labels = { pb_traffic: 'PB Traffic', regular: 'Regular' }
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => patch({ permanentRoamers: v })}
                    className={[
                      'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                      active
                        ? 'bg-[#2d7a4f] text-white border-[#2d7a4f]'
                        : 'bg-white text-[#344054] border-[#d0d5dd] hover:bg-[#f9fafb]',
                    ].join(' ')}
                  >
                    {labels[v]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Route by route */}
          <div className={ROW_CLASS}>
            <span className="text-xs text-[#344054]">Route by route</span>
            <Switch
              size="sm"
              checked={local.routeByRoute}
              onCheckedChange={(c) => patch({ routeByRoute: c })}
            />
          </div>

          {/* Distribution by period */}
          <div className={ROW_CLASS}>
            <span className="text-xs text-[#344054]">Distribution by period</span>
            <Switch
              size="sm"
              checked={local.distributionByPeriod}
              onCheckedChange={(c) => patch({ distributionByPeriod: c })}
            />
          </div>

          {/* Market Channel */}
          <ChipInput
            label="Market Channel"
            values={local.marketChannel}
            onChange={(v) => patch({ marketChannel: v })}
          />

          {/* Customer Name */}
          <ChipInput
            label="Customer Name"
            values={local.customerName}
            onChange={(v) => patch({ customerName: v })}
          />

          {/* Product Name */}
          <ChipInput
            label="Product Name"
            values={local.productName}
            onChange={(v) => patch({ productName: v })}
          />

          {/* Device Type */}
          <ChipInput
            label="Device Type"
            values={local.deviceType}
            onChange={(v) => patch({ deviceType: v })}
          />
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 border-t border-[#e4e7ec] flex justify-end">
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#2d7a4f] text-white text-sm rounded px-5 py-2 hover:bg-[#236040] transition-colors font-medium"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
