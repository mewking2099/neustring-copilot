import { Info } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import { ROAMING_CHANNEL_LABELS } from '@/domain/deal/discountFamilies'

export function ShellInfoBar() {
  const shell = useDealStore((s) => s.shell)
  if (!shell) return null

  function handleEdit() {
    console.log('open ShellDialog in edit mode')
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5 border-b border-[#e4e7ec] bg-[#fafafa] text-sm shrink-0">
      {/* Roaming Channel */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-[#667085]">Roaming Channel</span>
        <span className="font-medium text-[#0e2c46]">
          {ROAMING_CHANNEL_LABELS[shell.roamingChannel] ?? shell.roamingChannel}
        </span>
      </div>

      {/* My Networks */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-[#667085]">My Networks</span>
        <div className="flex gap-1 flex-wrap">
          {shell.myNetworks.map((code) => (
            <span
              key={code}
              className="bg-[#e8f2ce] text-[#0e2c46] text-xs rounded px-2 py-0.5 font-medium"
            >
              {code}
            </span>
          ))}
        </div>
      </div>

      {/* Roaming Partner */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-[#667085]">Roaming Partner</span>
        <div className="flex items-center gap-1">
          <span className="font-medium text-[#0e2c46]">
            {shell.roamingPartners.join(', ')}
          </span>
          <Info className="w-3 h-3 text-[#98a2b3]" />
        </div>
      </div>

      {/* Configure Networks */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="text-xs text-[#667085] underline cursor-pointer hover:text-[#0e2c46] transition-colors"
          onClick={() => console.log('configure networks')}
        >
          Configure Networks
        </button>
        <Info className="w-3 h-3 text-[#98a2b3]" />
      </div>

      {/* Period */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-[#667085]">Period</span>
        <span className="font-medium text-[#0e2c46]">
          {shell.period.start} – {shell.period.end}
        </span>
      </div>

      {/* EDIT button */}
      <button
        type="button"
        className="border border-[#d0d5dd] rounded px-3 py-1 text-xs font-medium ml-auto hover:bg-[#f2f4f7] transition-colors text-[#344054]"
        onClick={handleEdit}
      >
        EDIT
      </button>
    </div>
  )
}
