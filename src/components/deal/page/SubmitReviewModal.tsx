import { X, AlertTriangle, CheckCircle2, FileText } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useDealStore } from '@/store/deal'
import { generateGaps } from '@/domain/ai/generateGaps'
import { SERVICE_TYPE_LABELS } from '@/domain/deal/discountFamilies'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export function SubmitReviewModal({ onConfirm, onCancel }: Props) {
  const { shell, cards } = useDealStore(
    useShallow((s) => ({ shell: s.shell, cards: s.cards })),
  )

  const gaps = generateGaps(shell, cards)
  const hasBlockingGaps = gaps.some((g) => g.severity === 'warn')

  const layer1 = cards.filter((c) => c.layer === 1)
  const layer2 = cards.filter((c) => c.layer === 2)
  const allRows = cards.flatMap((c) => c.serviceRows)
  const ratedRows = allRows.filter(
    (r) => r.inboundDiscount !== null || r.outboundDiscount !== null,
  )
  const allServices = [
    ...new Set(layer1.flatMap((c) => c.serviceRows.map((r) => r.serviceType))),
  ]

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f1f3]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0e2c46]" />
            <p className="text-sm font-semibold text-[#0e2c46]">Submit for Review</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#98a2b3] hover:text-[#667085] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Deal identity */}
          <div>
            <p className="text-[9px] font-bold text-[#98a2b3] uppercase tracking-widest mb-2">Deal</p>
            <p className="text-sm font-semibold text-[#0e2c46] leading-snug mb-1">
              {shell?.name ?? '—'}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <div>
                <p className="text-[9px] text-[#98a2b3] uppercase tracking-wide">Partner(s)</p>
                <p className="text-xs font-medium text-[#344054] mt-0.5">
                  {shell?.roamingPartners.join(', ') || '—'}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-[#98a2b3] uppercase tracking-wide">Period</p>
                <p className="text-xs font-medium text-[#344054] mt-0.5">
                  {shell?.period.start || '—'} – {shell?.period.end || '—'}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-[#98a2b3] uppercase tracking-wide">Currency</p>
                <p className="text-xs font-medium text-[#344054] mt-0.5">{shell?.currency ?? '—'}</p>
              </div>
              {shell?.autoRenewal && (
                <div>
                  <p className="text-[9px] text-[#98a2b3] uppercase tracking-wide">Auto-renewal</p>
                  <p className="text-xs font-medium text-[#82bc34] mt-0.5">Enabled</p>
                </div>
              )}
            </div>
          </div>

          {/* Statement summary */}
          <div>
            <p className="text-[9px] font-bold text-[#98a2b3] uppercase tracking-widest mb-2">Statements</p>
            <div className="rounded-xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667085]">Global statement cards</span>
                <span className="font-semibold text-[#0e2c46]">{layer1.length}</span>
              </div>
              {layer2.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#667085]">Partner overrides</span>
                  <span className="font-semibold text-[#0e2c46]">{layer2.length}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667085]">Service rows</span>
                <span className="font-semibold text-[#0e2c46]">{allRows.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-[#e4e7ec] pt-2 mt-1">
                <span className="text-[#667085]">Rates entered</span>
                <span className={`font-semibold ${ratedRows.length === allRows.length ? 'text-[#82bc34]' : 'text-[#dc6803]'}`}>
                  {ratedRows.length} / {allRows.length}
                </span>
              </div>
              {allServices.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {allServices.map((st) => (
                    <span
                      key={st}
                      className="text-[9px] font-semibold text-[#344054] bg-white border border-[#e4e7ec] rounded px-1.5 py-0.5"
                    >
                      {SERVICE_TYPE_LABELS[st] ?? st}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gaps */}
          {gaps.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col gap-1.5">
              <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mb-0.5">
                Attention
              </p>
              {gaps.map((gap, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-amber-500" />
                  {gap.text}
                </div>
              ))}
              {hasBlockingGaps && (
                <p className="text-[10px] text-amber-600 mt-1">
                  You can still submit — your reviewer will flag these items.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f0f1f3] bg-[#f9fafb]">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#d0d5dd] px-4 py-2 text-xs font-medium text-[#344054] hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1.5 rounded-lg bg-[#82bc34] text-white px-4 py-2 text-xs font-semibold hover:bg-[#6fa02c] transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  )
}
