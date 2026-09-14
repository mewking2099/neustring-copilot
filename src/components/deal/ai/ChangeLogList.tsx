import { useState } from 'react'
import { useDealStore } from '@/store/deal'

const MAX_VISIBLE = 15

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 3600)
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`
  return `${diffMin}h ago`
}

export function ChangeLogList() {
  const aiChangeLog = useDealStore((s) => s.aiChangeLog)
  const [showAll, setShowAll] = useState(false)

  const entries = showAll ? aiChangeLog : aiChangeLog.slice(0, MAX_VISIBLE)
  const hasMore = aiChangeLog.length > MAX_VISIBLE

  return (
    <div className="px-4 pt-3 pb-2">
      <p className="text-xs font-semibold text-[#0e2c46] mb-2">
        {aiChangeLog.length} change{aiChangeLog.length !== 1 ? 's' : ''}
      </p>
      <div>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-2 py-1.5 border-b border-[#f2f4f7] last:border-0"
          >
            <span className="text-[10px] text-[#98a2b3] shrink-0 mt-0.5 w-14">
              {relativeTime(entry.timestamp)}
            </span>
            <span className="text-xs text-[#344054] leading-snug">
              {entry.message}
            </span>
          </div>
        ))}
      </div>
      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-1.5 text-[10px] text-[#667085] hover:text-[#0e2c46] transition-colors"
        >
          Show more
        </button>
      )}
    </div>
  )
}
