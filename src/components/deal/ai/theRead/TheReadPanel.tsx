import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { RefreshCw, AlertTriangle, Info } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import { generateHeadline } from '@/domain/ai/generateHeadline'
import { generateBullets } from '@/domain/ai/generateBullets'
import { generateGaps } from '@/domain/ai/generateGaps'
import { cn } from '@/lib/utils'

export function TheReadPanel() {
  const { shell, cards } = useDealStore(
    useShallow((s) => ({ shell: s.shell, cards: s.cards })),
  )
  const [refreshKey, setRefreshKey] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const headline = generateHeadline(shell, cards)
  const bullets  = generateBullets(shell, cards)
  const gaps     = generateGaps(shell, cards)

  const factCount = cards.reduce((n, c) => n + c.serviceRows.length, 0) * 3 + cards.length

  function refresh() {
    setSpinning(true)
    setTimeout(() => {
      setRefreshKey((k) => k + 1)
      setSpinning(false)
    }, 600)
  }

  const hasContent = shell && cards.length > 0

  return (
    <div
      key={refreshKey}
      className="mx-4 mb-4 mt-2 rounded-xl border border-[#e4e7ec] bg-white shadow-sm overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f1f3] bg-[#f9fafb]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82bc34] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#82bc34]" />
          </span>
          <span className="text-[10px] font-bold tracking-widest text-[#82bc34] uppercase">
            The Read
          </span>
        </div>
        <button
          type="button"
          onClick={refresh}
          title="Re-analyse"
          className="flex items-center gap-1 text-[10px] text-[#98a2b3] hover:text-[#667085] transition-colors"
        >
          <RefreshCw className={cn('w-3 h-3', spinning && 'animate-spin')} />
          <span>Analyse</span>
        </button>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Headline */}
        <p className={cn(
          'text-sm font-semibold leading-snug',
          hasContent ? 'text-[#0e2c46]' : 'text-[#98a2b3]',
        )}>
          {headline}
        </p>

        {hasContent && (
          <>
            {/* Key facts */}
            <div>
              <p className="text-[9px] font-bold text-[#98a2b3] uppercase tracking-widest mb-2">
                Key facts
              </p>
              <ul className="flex flex-col gap-1.5">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#344054] leading-relaxed">
                    <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-[#82bc34]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            {gaps.length > 0 && (
              <div>
                <p className="text-[9px] font-bold text-[#98a2b3] uppercase tracking-widest mb-2">
                  Gaps
                </p>
                <ul className="flex flex-col gap-1.5">
                  {gaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                      {gap.severity === 'warn' ? (
                        <AlertTriangle className="shrink-0 mt-0.5 w-3 h-3 text-[#dc6803]" />
                      ) : (
                        <Info className="shrink-0 mt-0.5 w-3 h-3 text-[#667085]" />
                      )}
                      <span className={gap.severity === 'warn' ? 'text-[#7a2e0e]' : 'text-[#667085]'}>
                        {gap.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <p className="text-[10px] text-[#98a2b3] pt-1 border-t border-[#f0f1f3]">
              {factCount} measured fact{factCount !== 1 ? 's' : ''} across {cards.length} statement card{cards.length !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
