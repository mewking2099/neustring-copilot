import { useShallow } from 'zustand/react/shallow'
import { useDealStore } from '@/store/deal'
import { generateHeadline } from '@/domain/ai/generateHeadline'
import { generateBullets } from '@/domain/ai/generateBullets'

export function TheReadPanel() {
  const state = useDealStore(useShallow((s) => ({
    shell: s.shell,
    statements: s.statements,
    aiChangeLog: s.aiChangeLog,
    entrySource: s.entrySource,
    draftId: s.draftId,
  })))

  const headline = generateHeadline(state)
  const bullets = generateBullets(state)
  const factCount = state.statements.length * 3

  return (
    <div className="mx-4 my-3 rounded-xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-4">
      <p className="text-[10px] font-semibold tracking-widest text-[#82bc34] uppercase mb-2">
        THE READ
      </p>
      <p className="text-sm font-semibold text-[#0e2c46] leading-snug mb-3">
        {headline}
      </p>
      {bullets.length > 0 && (
        <ul className="space-y-1 mb-3">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-[#344054] leading-relaxed">
              <span className="shrink-0 mt-0.5 text-[#82bc34]">·</span>
              {bullet}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[10px] text-[#98a2b3]">
        Summarised by the assistant from {factCount} measured facts
      </p>
    </div>
  )
}
