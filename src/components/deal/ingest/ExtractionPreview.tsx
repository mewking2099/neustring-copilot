import { CheckCircle, AlertTriangle } from 'lucide-react'
import type { ExtractionResult } from '@/domain/ingestion/mockExtractor'
import { SERVICE_TYPE_LABELS, ROAMING_CHANNEL_LABELS, MODEL_OPTIONS } from '@/domain/deal/discountFamilies'
import type { ServiceType } from '@/domain/deal/types'

interface Props {
  result: ExtractionResult
  onBack: () => void
  onConfirm: () => void
}

function confidenceColor(c: 'high' | 'medium' | 'low') {
  if (c === 'high') return 'text-[#82bc34]'
  if (c === 'medium') return 'text-[#f59e0b]'
  return 'text-[#ef4444]'
}

function modelLabel(model: ExtractionResult['statements'][number]['model']): string {
  const found = MODEL_OPTIONS.find(
    (o) =>
      o.family === model.family &&
      (('variant' in model && o.variant === model.variant) ||
        ('method' in model && o.variant === model.method) ||
        ('distribution' in model && o.variant === model.distribution) ||
        ('subtype' in model && o.variant === model.subtype)),
  )
  return found ? found.label : `Family ${model.family}`
}

function serviceLabel(types: ServiceType[]): string {
  return types.map((t) => SERVICE_TYPE_LABELS[t] ?? t).join(', ')
}

export function ExtractionPreview({ result, onBack, onConfirm }: Props) {
  const { shell, statements, confidence, source, sourceName, factCount } = result

  return (
    <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 p-5 border-b border-[#e4e7ec]">
          <CheckCircle size={20} className="text-[#82bc34] mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0e2c46]">
              Extracted from {source === 'email' ? 'Email' : sourceName}
              <span className={`ml-2 text-xs font-medium ${confidenceColor(confidence)}`}>
                Confidence: {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
              </span>
            </p>
            <p className="text-xs text-[#667085] mt-0.5">{factCount} facts identified</p>
          </div>
        </div>

        {/* Demo transparency note */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#fffbeb] border-b border-[#fde68a]">
          <AlertTriangle size={14} className="text-[#d97706] shrink-0" />
          <p className="text-xs text-[#92400e]">
            This is a demo extractor — review all fields before confirming.
          </p>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#e4e7ec]">
          {/* Shell column */}
          <div className="p-5">
            <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">
              Shell
            </p>
            <dl className="space-y-2">
              {shell.myNetworks && shell.myNetworks.length > 0 && (
                <ShellRow label="My Networks" value={shell.myNetworks.join(', ')} />
              )}
              {shell.roamingPartners && shell.roamingPartners.length > 0 && (
                <ShellRow label="Roaming Partners" value={shell.roamingPartners.join(', ')} />
              )}
              {shell.period && (
                <ShellRow label="Period" value={`${shell.period.start} – ${shell.period.end}`} />
              )}
              {shell.currency && (
                <ShellRow label="Currency" value={shell.currency} />
              )}
              {shell.roamingChannel && (
                <ShellRow
                  label="Channel"
                  value={ROAMING_CHANNEL_LABELS[shell.roamingChannel] ?? shell.roamingChannel}
                />
              )}
              {shell.negotiator && (
                <ShellRow label="Negotiator" value={shell.negotiator} />
              )}
              {shell.accessLevel && (
                <ShellRow
                  label="Access Level"
                  value={shell.accessLevel.charAt(0).toUpperCase() + shell.accessLevel.slice(1)}
                />
              )}
              {shell.autoRenewal !== undefined && (
                <ShellRow
                  label="Auto-renewal"
                  value={
                    shell.autoRenewal
                      ? `Yes${shell.autoRenewalNoticeDays ? ` (${shell.autoRenewalNoticeDays}d notice)` : ''}`
                      : 'No'
                  }
                />
              )}
            </dl>
          </div>

          {/* Statements column */}
          <div className="p-5">
            <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">
              Statements ({statements.length})
            </p>
            <div className="space-y-2">
              {statements.map((st) => (
                <div
                  key={st.id}
                  className="rounded-lg border border-[#e4e7ec] bg-[#f8f9fc] px-3 py-2"
                >
                  <p className="text-xs font-medium text-[#344054]">
                    {st.direction.charAt(0).toUpperCase() + st.direction.slice(1)}
                    {' · '}
                    {serviceLabel(st.serviceTypes)}
                  </p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    {modelLabel(st.model)}
                    {' · '}
                    {ROAMING_CHANNEL_LABELS[st.roamingChannel] ?? st.roamingChannel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-[#e4e7ec] bg-[#f8f9fc]">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-[#344054] border border-[#d0d5dd] rounded-lg bg-white hover:bg-[#f2f4f7] transition-colors"
          >
            Try another
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#82bc34] rounded-lg hover:bg-[#6fa02c] transition-colors"
          >
            Create deal
          </button>
        </div>
      </div>
    </div>
  )
}

function ShellRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-xs text-[#98a2b3] w-32 shrink-0">{label}</dt>
      <dd className="text-xs text-[#344054] font-medium">{value}</dd>
    </div>
  )
}
