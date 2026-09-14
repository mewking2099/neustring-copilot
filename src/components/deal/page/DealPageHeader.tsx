import { useDealStore } from '@/store/deal'

export function DealPageHeader() {
  const shell = useDealStore((s) => s.shell)
  if (!shell) return null

  return (
    <header className="flex items-center gap-3 px-4 py-2.5 border-b border-[#e4e7ec] bg-white shrink-0">
      {/* Deal name */}
      <span className="text-sm font-semibold text-[#0e2c46] truncate">
        {shell.name}
      </span>

      {/* Status badge */}
      <span className="text-xs border border-[#d0d5dd] rounded-full px-2 py-0.5 text-[#344054] shrink-0 flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0e2c46]" />
        Draft
      </span>

      {/* Negotiator */}
      {shell.negotiator && (
        <span className="text-xs text-[#667085] shrink-0">
          👤 {shell.negotiator}
        </span>
      )}

      <div className="flex-1" />

      {/* SAVE */}
      <button
        type="button"
        onClick={() => console.log('save')}
        className="bg-[#0e2c46] text-white text-xs font-semibold rounded-lg px-4 py-1.5 hover:bg-[#185992] transition-colors shrink-0"
      >
        SAVE
      </button>
    </header>
  )
}
