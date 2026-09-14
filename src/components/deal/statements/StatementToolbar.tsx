import { Settings, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDealStore } from '@/store/deal'

export function StatementToolbar() {
  const groupStatement = useDealStore((s) => s.shell?.groupStatement ?? false)
  const patchShell = useDealStore((s) => s.patchShell)

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-[#e4e7ec] bg-white text-xs text-[#344054]">
      {/* Exclude Tax */}
      <div className="flex items-center gap-1">
        <Settings className="w-3 h-3 text-[#667085]" />
        <span className="text-[#344054]">Exclude Tax</span>
      </div>

      {/* Currency */}
      <span className="font-medium text-[#0e2c46] border border-[#e4e7ec] rounded px-2 py-0.5 text-xs">
        EUR
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Group Statement */}
      <div className="flex items-center gap-2">
        <span className="text-[#344054]">Group Statement</span>
        <button
          type="button"
          onClick={() => patchShell({ groupStatement: !groupStatement })}
          className={cn(
            "relative inline-flex h-[18px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
            groupStatement ? "bg-[#82bc34]" : "bg-[#d0d5dd]"
          )}
          aria-checked={groupStatement}
          role="switch"
        >
          <span
            className={cn(
              "pointer-events-none block h-[14px] w-[14px] rounded-full bg-white shadow transition-transform",
              groupStatement ? "translate-x-[18px]" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Country Analysis */}
      <button
        type="button"
        className="flex items-center gap-1 text-[#667085] hover:text-[#0e2c46] transition-colors"
        onClick={() => console.log('country analysis')}
      >
        <BarChart2 className="w-3.5 h-3.5" />
        <span>Country Analysis</span>
      </button>
    </div>
  )
}
