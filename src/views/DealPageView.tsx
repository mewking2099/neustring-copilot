import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDealStore } from '@/store/deal'

import { DealPageHeader } from '@/components/deal/page/DealPageHeader'
import { DealInfoPanel } from '@/components/deal/page/DealInfoPanel'
import { DealFloatingBar } from '@/components/deal/page/DealFloatingBar'
import { StatementCardList } from '@/components/deal/cards/StatementCardList'
import { TheReadPanel } from '@/components/deal/ai/theRead/TheReadPanel'
import { AssistantPanel } from '@/components/deal/ai/AssistantPanel'

export function DealPageView() {
  const shell       = useDealStore((s) => s.shell)
  const entrySource = useDealStore((s) => s.entrySource)
  const cardCount   = useDealStore((s) => s.cards.length)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const showSeedBanner =
    entrySource === 'qualifying_intake' && cardCount > 0 && !bannerDismissed

  useEffect(() => {
    document.title = shell
      ? `${shell.name} — NeuString Co-Pilot`
      : 'Deal — NeuString Co-Pilot'
  }, [shell])

  if (!shell) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-[#667085] px-8">
        <div className="w-12 h-12 rounded-2xl bg-[#f0f3f8] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0e2c46]/30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6M9 16h6M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/>
            <rect x="7" y="2" width="10" height="4" rx="1"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#344054] mb-1">No deal loaded</p>
          <p className="text-xs text-[#98a2b3] max-w-xs leading-relaxed">
            Start a new deal from the wizard or open an existing deal from your dashboard.
          </p>
        </div>
        <Link
          to="/deal/entry"
          className="rounded-lg bg-[#0e2c46] text-white text-xs font-semibold px-4 py-2 hover:bg-[#185992] transition-colors"
        >
          Start a new deal →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f4f5f7]">
      <DealPageHeader />

      <div className="flex flex-1 overflow-hidden">
        <DealInfoPanel />

        <div className="flex-1 overflow-hidden flex flex-col relative min-w-0">
          <div className="flex-1 overflow-y-auto pb-20">
            {showSeedBanner && (
              <div className="mx-4 mt-4 flex items-start gap-3 rounded-xl border border-[#82bc34]/40 bg-[#82bc34]/[0.07] px-4 py-3">
                <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[#82bc34] flex items-center justify-center">
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-white">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#2d5a0e]">
                    Global statement card pre-filled
                  </p>
                  <p className="text-xs text-[#4a7c1a] mt-0.5 leading-relaxed">
                    Based on your qualifying answers. Review each service row, fill in rates, then add partner-specific overrides.
                  </p>
                </div>
                <button
                  onClick={() => setBannerDismissed(true)}
                  className="shrink-0 text-[#82bc34] hover:text-[#5a8c1e] transition-colors p-0.5 -mt-0.5 -mr-0.5"
                  aria-label="Dismiss"
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 2l8 8M10 2l-8 8"/>
                  </svg>
                </button>
              </div>
            )}
            <StatementCardList />
            <TheReadPanel />
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <DealFloatingBar />
            </div>
          </div>
        </div>

        <AssistantPanel />
      </div>
    </div>
  )
}
