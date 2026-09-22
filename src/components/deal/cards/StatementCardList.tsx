import { useState } from 'react'
import { ChevronUp, ChevronDown, Layers, Sparkles } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useDealStore } from '@/store/deal'
import { StatementCard } from './StatementCard'

export function StatementCardList() {
  const [collapsed, setCollapsed] = useState(false)

  const { cards, shell, entrySource } = useDealStore(
    useShallow((s) => ({ cards: s.cards, shell: s.shell, entrySource: s.entrySource })),
  )

  const layer1Cards = cards.filter((c) => c.layer === 1)
  const overrideCards = cards.filter((c) => c.layer === 2)

  // Group overrides by parentCardId
  function overridesFor(parentId: string) {
    return overrideCards.filter((c) => c.parentCardId === parentId)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#e4e7ec] bg-white shrink-0">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 text-sm font-semibold text-[#0e2c46] hover:text-[#185992] transition-colors"
        >
          <span>
            Statement
            {cards.length > 0 && (
              <span className="ml-1.5 text-[10px] font-normal text-[#98a2b3]">
                {cards.length}
              </span>
            )}
          </span>
          {collapsed
            ? <ChevronDown className="w-4 h-4 text-[#667085]" />
            : <ChevronUp   className="w-4 h-4 text-[#667085]" />
          }
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-5 px-6 py-8">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#f0f3f8] flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#0e2c46]/40" />
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-[#344054] mb-1">No statement cards yet</p>
                <p className="text-xs text-[#98a2b3] leading-relaxed max-w-[260px]">
                  {entrySource === 'qualifying_intake'
                    ? "Your qualifying answers didn't seed any cards. Add service rows manually or restart the qualifying flow."
                    : 'Statement cards define pricing scope — one card per My Network × Partner combination.'}
                </p>
              </div>

              {/* Two paths */}
              <div className="flex flex-col gap-2 w-full max-w-[280px]">
                <div className="flex items-start gap-3 rounded-xl border border-[#82bc34]/30 bg-[#f6fbee] px-3 py-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#82bc34] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#344054]">From qualifying</p>
                    <p className="text-[10px] text-[#667085] leading-snug mt-0.5">
                      Answer the qualifying questions — cards pre-fill automatically.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-[#e4e7ec] bg-[#f9fafb] px-3 py-2.5">
                  <Layers className="w-3.5 h-3.5 text-[#667085] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#344054]">Build manually</p>
                    <p className="text-[10px] text-[#667085] leading-snug mt-0.5">
                      Use the wizard to define scope, then add service rows inside each card.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            layer1Cards.map((card) => (
              <div key={card.id} className="flex flex-col gap-2">
                {/* Layer 1 global card */}
                <StatementCard card={card} shell={shell} />

                {/* Layer 2 override cards — indented */}
                {overridesFor(card.id).map((override) => (
                  <div key={override.id} className="ml-6 border-l-2 border-[#0e2c46]/20 pl-3">
                    <StatementCard card={override} shell={shell} />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
