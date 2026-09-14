import { useState } from 'react'
import { Info } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import { ROAMING_CHANNEL_LABELS } from '@/domain/deal/discountFamilies'
import { QuickStartWizard } from '@/components/deal/entry/QuickStartWizard'

export function DealInfoPanel() {
  const shell = useDealStore((s) => s.shell)
  const [editOpen, setEditOpen] = useState(false)
  if (!shell) return null

  return (
    <div className="w-52 shrink-0 border-r border-[#e4e7ec] bg-[#f9fafb] flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-4 flex flex-col gap-3">
        <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-wider">
          Deal Info
        </p>

        {/* Roaming Channel */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-0.5">Roaming Channel</p>
          <p className="text-xs font-medium text-[#0e2c46]">
            {ROAMING_CHANNEL_LABELS[shell.roamingChannel] ?? shell.roamingChannel}
          </p>
        </div>

        {/* My Networks */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-0.5">My Networks</p>
          <div className="flex flex-wrap gap-1">
            {shell.myNetworks.map((code) => (
              <span
                key={code}
                className="bg-[#e8f2ce] text-[#0e2c46] text-[10px] rounded px-2 py-0.5 font-semibold"
              >
                {code}
              </span>
            ))}
          </div>
        </div>

        {/* Roaming Partner */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-0.5">Roaming Partner</p>
          <div className="flex items-center gap-1">
            <p className="text-xs font-medium text-[#0e2c46]">
              {shell.roamingPartners.join(', ') || '—'}
            </p>
            <Info className="w-3 h-3 text-[#98a2b3] shrink-0" />
          </div>
        </div>

        {/* Period */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-0.5">Period</p>
          <p className="text-xs font-medium text-[#0e2c46]">
            {shell.period.start || '—'} – {shell.period.end || '—'}
          </p>
        </div>

        {/* Configure Networks */}
        <button
          type="button"
          className="flex items-center gap-1 text-[10px] text-[#667085] hover:text-[#0e2c46] transition-colors self-start"
          onClick={() => console.log('configure networks')}
        >
          <span className="underline">Configure Networks</span>
          <Info className="w-3 h-3" />
        </button>

        {/* EDIT */}
        <button
          type="button"
          className="w-full bg-white border border-[#e4e7ec] rounded-lg px-3 py-1.5 text-xs font-medium text-[#344054] hover:border-[#0e2c46] transition-colors"
          onClick={() => setEditOpen(true)}
        >
          EDIT
        </button>
      </div>

      {editOpen && (
        <QuickStartWizard
          initialShell={shell}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  )
}
