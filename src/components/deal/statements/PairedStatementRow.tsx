import { Settings, Unlink, Trash2, ChevronDown } from 'lucide-react'
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
  inboundId: string
  outboundId: string
  onOpenSettings: (id: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

// ── encode/decode model key (same logic as StatementRow) ─────────────────────
function encodeModel(m: DiscountModel): string {
  const { family } = m
  if ('variant' in m)       return `${family}:${m.variant}`
  if ('method' in m)        return `${family}:${m.method}`
  if ('distribution' in m)  return `${family}:${m.distribution}`
  if ('subtype' in m)       return `${family}:${m.subtype}`
  return family
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

const MODEL_FAMILY_LABELS: Record<string, string> = {
  A: 'Family A — Threshold',
  B: 'Family B — Balanced/Unbalanced',
  C: 'Family C — Commitment',
  D: 'Family D — Incremental',
  E: 'Family E — Group',
  F: 'Family F — Access Fee / IMSI',
}
const MODEL_FAMILIES = ['A', 'B', 'C', 'D', 'E', 'F'] as const

// ── RateRow — compact in/out rate display ─────────────────────────────────────
function RateRow({
  label,
  statementId,
  editable,
}: {
  label: string
  statementId: string
  editable: boolean
}) {
  const statement = useDealStore((s) => s.statements.find((st) => st.id === statementId))
  const updateStatement = useDealStore((s) => s.updateStatement)

  if (!statement) return null
  const band = statement.bands[0] ?? { from: 0, to: null, unit: 'volume', discount: null, discountUnit: 'volume' }

  function updateBand(patch: Partial<typeof band>) {
    updateStatement(statementId, { bands: [{ ...band, ...patch }] })
  }

  const inputCls = cn(
    'w-14 text-center text-xs border border-[#e4e7ec] rounded px-1 py-1 outline-none',
    editable ? 'focus:border-[#82bc34] bg-white' : 'bg-[#f9fafb] text-[#98a2b3] cursor-not-allowed',
  )

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-[#f2f4f7] last:border-0 bg-[#fafafa]">
      {/* Direction label */}
      <span
        className={cn(
          'text-[9px] font-bold uppercase tracking-widest shrink-0 w-12 text-center py-0.5 rounded',
          label === 'INBOUND' ? 'bg-[#eef2f7] text-[#344054]' : 'bg-[#f2f4f7] text-[#667085]',
        )}
      >
        {label === 'INBOUND' ? 'IN' : 'OUT'}
      </span>

      {/* Interval */}
      <div className="flex items-center gap-1 flex-[2]">
        <input
          type="number"
          value={band.from ?? ''}
          onChange={(e) => editable && updateBand({ from: e.target.value === '' ? null : Number(e.target.value) })}
          readOnly={!editable}
          className={inputCls}
          placeholder="0"
        />
        <span className="text-[#98a2b3] text-xs">–</span>
        <input
          type="number"
          value={band.to ?? ''}
          onChange={(e) => editable && updateBand({ to: e.target.value === '' ? null : Number(e.target.value) })}
          readOnly={!editable}
          className={inputCls}
          placeholder="∞"
        />
        <select
          value={band.unit}
          onChange={(e) => editable && updateBand({ unit: e.target.value as 'volume' | 'charge' | 'imsi' })}
          disabled={!editable}
          className={cn(
            'text-xs border border-[#e4e7ec] rounded px-1 py-1 outline-none',
            editable ? 'bg-white focus:border-[#82bc34]' : 'bg-[#f9fafb] text-[#98a2b3]',
          )}
        >
          <option value="volume">Volume</option>
          <option value="charge">Charge</option>
          <option value="imsi">IMSI</option>
        </select>
      </div>

      {/* Discount */}
      <div className="flex items-center gap-1 flex-[1]">
        <input
          type="number"
          value={band.discount ?? ''}
          onChange={(e) => editable && updateBand({ discount: e.target.value === '' ? null : Number(e.target.value) })}
          readOnly={!editable}
          className={inputCls}
          placeholder="–"
        />
        <select
          value={band.discountUnit}
          onChange={(e) => editable && updateBand({ discountUnit: e.target.value as 'volume' | 'percentage' | 'fixed' })}
          disabled={!editable}
          className={cn(
            'text-xs border border-[#e4e7ec] rounded px-1 py-1 outline-none',
            editable ? 'bg-white focus:border-[#82bc34]' : 'bg-[#f9fafb] text-[#98a2b3]',
          )}
        >
          <option value="volume">Volume</option>
          <option value="percentage">%</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>

      {/* Mirror indicator when not editable */}
      <div className="flex-[1]">
        {!editable && (
          <span className="text-[10px] text-[#82bc34] font-medium">↑ mirroring inbound</span>
        )}
      </div>
    </div>
  )
}

// ── PairedStatementRow ────────────────────────────────────────────────────────
export function PairedStatementRow({ inboundId, outboundId, onOpenSettings, collapsed, onToggleCollapse }: Props) {
  const inbound  = useDealStore((s) => s.statements.find((st) => st.id === inboundId))
  const outbound = useDealStore((s) => s.statements.find((st) => st.id === outboundId))
  const updateStatement  = useDealStore((s) => s.updateStatement)
  const unlinkStatement  = useDealStore((s) => s.unlinkStatement)
  const toggleMirrorMode = useDealStore((s) => s.toggleMirrorMode)
  const deleteStatement  = useDealStore((s) => s.deleteStatement)

  if (!inbound || !outbound) return null

  const mirrored = inbound.mirrorMode ?? true
  const services = inbound.serviceTypes
  const serviceLabel = services.length
    ? services.map((s) => SERVICE_TYPE_LABELS[s] ?? s).join(' · ')
    : 'No services'

  function handleServiceChange(types: ServiceType[]) {
    updateStatement(inboundId, { serviceTypes: types })
  }

  function handleModelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateStatement(inboundId, { model: decodeModel(e.target.value) })
  }

  function handleChannelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateStatement(inboundId, { roamingChannel: e.target.value as RoamingChannel })
  }

  function handleApplyToChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateStatement(inboundId, { applyTo: e.target.value as typeof inbound!.applyTo })
  }

  function handleDeletePair() {
    deleteStatement(inboundId)
    deleteStatement(outboundId)
  }

  return (
    <div className="bg-white rounded-xl border border-[#e4e7ec] shadow-sm overflow-hidden flex">
      {/* Lime left-rail — encodes pairing structurally, not via background color */}
      <div className="w-1 shrink-0 bg-[#82bc34] rounded-l-xl" />

      <div className="flex-1 min-w-0">
      {/* Pair header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#f6fbee] border-b border-[#d8edbc]">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4a7010] bg-[#e8f5cc] border border-[#c5e07a] rounded-full px-2 py-0.5 uppercase tracking-wider shrink-0">
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" aria-hidden="true">
            <path d="M2 4h6M6 2l2 2-2 2M8 6H2M4 4l-2 2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Paired
        </span>
        <span className="text-xs font-medium text-[#344054] truncate">{serviceLabel}</span>

        <div className="ml-auto flex items-center gap-2">
          {/* Collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand paired statement' : 'Collapse paired statement'}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#d8edbc] text-[#667085] transition-colors"
          >
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', collapsed && 'rotate-180')} />
          </button>

          {/* Mirror toggle */}
          <button
            type="button"
            onClick={() => toggleMirrorMode(inboundId)}
            className={cn(
              'flex items-center gap-1.5 text-[10px] font-semibold rounded-full px-2.5 py-1 border transition-colors',
              mirrored
                ? 'border-[#82bc34] text-[#4a7010] bg-[#f0f7e0]'
                : 'border-[#d0d5dd] text-[#667085] bg-white hover:border-[#0e2c46]',
            )}
          >
            <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none" aria-hidden="true">
              <path d="M2 5h10M10 3l2 2-2 2M12 9H2M4 7l-2 2 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {mirrored ? 'Mirror ON' : 'Mirror OFF'}
          </button>

          {/* Settings — opens inbound settings */}
          <button
            type="button"
            onClick={() => onOpenSettings(inboundId)}
            aria-label="Statement settings"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#e8f2ce] text-[#667085] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Unlink pair */}
          <button
            type="button"
            onClick={() => unlinkStatement(inboundId)}
            aria-label="Unlink pair into separate rows"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f2f4f7] text-[#667085] hover:text-[#344054] transition-colors"
          >
            <Unlink className="w-3.5 h-3.5" />
          </button>

          {/* Delete pair */}
          <button
            type="button"
            onClick={handleDeletePair}
            aria-label="Delete both statements"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#fff1f0] text-[#667085] hover:text-[#d92d20] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!collapsed && <>
      {/* Shared controls */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#f2f4f7] flex-wrap">
        {/* Service type pills */}
        <div className="flex flex-wrap gap-1 flex-1 min-w-[160px] min-h-[28px] px-2 py-1 border border-[#e4e7ec] rounded-lg bg-white text-xs">
          {services.length === 0 ? (
            <span className="text-[#98a2b3] self-center">Select services…</span>
          ) : (
            services.map((st) => (
              <span
                key={st}
                className="inline-flex items-center gap-0.5 bg-[#f2f4f7] text-[#344054] rounded px-1.5 py-0.5"
              >
                {SERVICE_TYPE_LABELS[st]}
                <button
                  type="button"
                  onClick={() => handleServiceChange(services.filter((s) => s !== st))}
                  className="text-[#98a2b3] hover:text-[#d92d20] ml-0.5"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        {/* Model */}
        <select
          value={encodeModel(inbound.model)}
          onChange={handleModelChange}
          className="w-40 text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34] shrink-0"
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

        {/* Channel + Apply To — secondary, inline */}
        <select
          value={inbound.roamingChannel}
          onChange={handleChannelChange}
          className="text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34] shrink-0"
        >
          {Object.entries(ROAMING_CHANNEL_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        <select
          value={inbound.applyTo}
          onChange={handleApplyToChange}
          className="text-xs border border-[#e4e7ec] rounded-lg px-2 py-1.5 bg-white text-[#344054] outline-none focus:border-[#82bc34] shrink-0"
        >
          {Object.entries(APPLY_TO_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Inbound rate row */}
      <RateRow label="INBOUND"  statementId={inboundId}  editable={true} />

      {/* Outbound rate row — editable only when mirror is OFF */}
      <RateRow label="OUTBOUND" statementId={outboundId} editable={!mirrored} />
      </>}
      </div>
    </div>
  )
}
