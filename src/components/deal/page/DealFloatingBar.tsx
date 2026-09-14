import { BarChart2, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useDealStore } from '@/store/deal'

export function DealFloatingBar() {
  const navigate = useNavigate()
  const groupStatement = useDealStore((s) => s.shell?.groupStatement ?? false)
  const excludeTax     = useDealStore((s) => s.shell?.excludeTax ?? true)
  const currency       = useDealStore((s) => s.shell?.currency ?? 'EUR')
  const patchShell     = useDealStore((s) => s.patchShell)

  return (
    <div className="flex items-center gap-1 bg-white rounded-2xl border border-[#e4e7ec] shadow-lg px-3 py-2">
      {/* Deal options */}
      <div className="flex items-center gap-2.5 text-xs">
        {/* Exclude Tax */}
        <button
          type="button"
          onClick={() => patchShell({ excludeTax: !excludeTax })}
          className={cn(
            'flex items-center gap-1 rounded-lg px-2 py-1 transition-colors border',
            excludeTax
              ? 'border-[#82bc34] text-[#4a7010] bg-[#f6fbee]'
              : 'border-[#e4e7ec] text-[#667085] hover:border-[#d0d5dd]',
          )}
        >
          <Settings className="w-3 h-3" />
          <span>Excl. Tax</span>
        </button>

        {/* Currency */}
        <span className="text-[10px] font-semibold text-[#0e2c46] border border-[#e4e7ec] rounded-lg px-2 py-1">
          {currency}
        </span>

        {/* Group Statement */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#667085]">Group</span>
          <button
            type="button"
            onClick={() => patchShell({ groupStatement: !groupStatement })}
            className={cn(
              'relative inline-flex h-[16px] w-[30px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              groupStatement ? 'bg-[#82bc34]' : 'bg-[#d0d5dd]',
            )}
            role="switch"
            aria-checked={groupStatement}
          >
            <span
              className={cn(
                'pointer-events-none block h-[12px] w-[12px] rounded-full bg-white shadow transition-transform',
                groupStatement ? 'translate-x-[14px]' : 'translate-x-0',
              )}
            />
          </button>
        </div>

        {/* Country Analysis */}
        <button
          type="button"
          onClick={() => console.log('country analysis')}
          className="flex items-center gap-1 text-[#667085] hover:text-[#0e2c46] transition-colors rounded-lg px-2 py-1 hover:bg-[#f9fafb]"
        >
          <BarChart2 className="w-3 h-3" />
          <span>Analysis</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[#e4e7ec] mx-1 shrink-0" />

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => navigate('/deal/entry')}
          className="rounded-lg border border-[#d0d5dd] px-3 py-1.5 text-xs font-medium text-[#344054] hover:bg-[#f9fafb] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => console.log('save')}
          className="rounded-lg border border-[#0e2c46] px-3 py-1.5 text-xs font-medium text-[#0e2c46] hover:bg-[#f2f4f7] transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => window.open('/deal-summary.html', '_blank')}
          className="rounded-lg bg-[#82bc34] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#6fa02c] transition-colors"
        >
          Create Deal
        </button>
      </div>
    </div>
  )
}
