import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_ACTIVE_DEALS, type ActiveDeal } from '@/data/mockActiveDeals'

const MAX_VISIBLE = 5

const URGENCY_DOT: Record<ActiveDeal['urgency'], string> = {
  expiring:  'bg-[#f04438]',
  countered: 'bg-[#f79009]',
  idle:      'bg-[#98a2b3]',
}

const CHIP_BORDER: Record<ActiveDeal['urgency'], string> = {
  expiring:  'border-[#fecdca] hover:border-[#f97066]',
  countered: 'border-[#fedf89] hover:border-[#fec84b]',
  idle:      'border-[#e4e7ec] hover:border-[#d0d5dd]',
}

const CHIP_BG: Record<ActiveDeal['urgency'], string> = {
  expiring:  'bg-[#fff8f7]',
  countered: 'bg-[#fffcf0]',
  idle:      'bg-white',
}

function UrgencyChip({ deal, onClick }: { deal: ActiveDeal; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left transition-all hover:shadow-sm ${CHIP_BG[deal.urgency]} ${CHIP_BORDER[deal.urgency]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${URGENCY_DOT[deal.urgency]}`} />
        <div className="leading-none">
          <p className="text-[11px] font-semibold text-[#0e2c46]">{deal.partnerName}</p>
          <p className="text-[9px] text-[#98a2b3] mt-[3px]">{deal.id} · {deal.services.join(' · ')}</p>
        </div>
      </button>

      {hovered && (
        <div className="absolute bottom-full left-0 mb-2 z-20 pointer-events-none">
          <div className="rounded-lg bg-[#0e2c46] px-3 py-2 shadow-lg">
            <p className="text-[10px] text-white leading-snug whitespace-nowrap max-w-[240px] whitespace-normal">
              {deal.urgencyReason}
            </p>
          </div>
          <div className="ml-4 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#0e2c46]" />
        </div>
      )}
    </div>
  )
}

export function DealUrgencyStrip() {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)

  const PRIORITY = { expiring: 0, countered: 1, idle: 2 }
  const sorted = [...MOCK_ACTIVE_DEALS].sort((a, b) => PRIORITY[a.urgency] - PRIORITY[b.urgency])
  const visible = showAll ? sorted : sorted.slice(0, MAX_VISIBLE)
  const hiddenCount = sorted.length - MAX_VISIBLE

  if (sorted.length === 0) return null

  return (
    <div className="shrink-0 border-t border-[#eaecf0] bg-white px-6 py-2.5">
      <div className="flex items-center gap-3 min-w-0">

        {/* Fixed label — does not scroll */}
        <span className="shrink-0 text-[9px] font-bold text-[#b0b8c4] uppercase tracking-widest select-none">
          Active deals
        </span>
        <div className="w-px h-3 bg-[#e4e7ec] shrink-0" />

        {/* Scrollable chips */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto min-w-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {visible.map((deal) => (
            <UrgencyChip
              key={deal.id}
              deal={deal}
              onClick={() => navigate('/deal/active')}
            />
          ))}

          {!showAll && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="shrink-0 rounded-lg border border-dashed border-[#d0d5dd] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#667085] hover:text-[#0e2c46] hover:border-[#0e2c46] transition-colors whitespace-nowrap"
            >
              +{hiddenCount} more
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
