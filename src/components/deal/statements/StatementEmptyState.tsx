import { useDealStore } from '@/store/deal'

interface Props {
  direction: 'inbound' | 'outbound'
}

export function StatementEmptyState({ direction }: Props) {
  const addStatement = useDealStore((s) => s.addStatement)

  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center mb-3">
        <svg viewBox="0 0 20 20" className="w-5 h-5 text-[#98a2b3]" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor" opacity=".4" />
          <rect x="3" y="9" width="10" height="2" rx="1" fill="currentColor" opacity=".4" />
          <rect x="3" y="13" width="6" height="2" rx="1" fill="currentColor" opacity=".3" />
          <circle cx="16" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 12.5v3M14.5 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-[#344054] mb-1">
        No {direction} pricing yet
      </p>
      <p className="text-xs text-[#98a2b3] mb-4 max-w-[220px] leading-relaxed">
        {direction === 'inbound'
          ? 'Define how you bill the partner when their subscribers roam on your network.'
          : 'Define what you pay the partner when your subscribers roam on their network.'}
      </p>
      <button
        type="button"
        onClick={() => addStatement(direction)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0e2c46] text-white text-xs font-semibold px-4 py-2 hover:bg-[#185992] transition-colors"
      >
        <span className="text-base leading-none">+</span>
        Add {direction} statement
      </button>
    </div>
  )
}
