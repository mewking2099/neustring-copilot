import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useDealStore } from '@/store/deal'
import { ROAMING_CHANNEL_LABELS } from '@/domain/deal/discountFamilies'
import { SERVICE_TYPE_LABELS } from '@/domain/deal/discountFamilies'
import { QuickStartWizard } from '@/components/deal/entry/QuickStartWizard'

export function DealInfoPanel() {
  const { shell, cards } = useDealStore(
    useShallow((s) => ({ shell: s.shell, cards: s.cards })),
  )
  const [editOpen, setEditOpen] = useState(false)

  if (!shell) return null

  const layer1 = cards.filter((c) => c.layer === 1)
  const layer2 = cards.filter((c) => c.layer === 2)
  const totalRows = cards.reduce((n, c) => n + c.serviceRows.length, 0)
  const allServices = [
    ...new Set(layer1.flatMap((c) => c.serviceRows.map((r) => r.serviceType))),
  ]

  return (
    <div className="w-52 shrink-0 border-r border-[#e4e7ec] bg-[#f9fafb] flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-4 flex flex-col gap-4 overflow-y-auto flex-1">

        {/* Label + edit */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-wider">
            Deal Info
          </p>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1 text-[10px] text-[#667085] hover:text-[#0e2c46] transition-colors"
            title="Edit deal info"
          >
            <Pencil className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        {/* Roaming Channel */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-1">Roaming Channel</p>
          <p className="text-xs font-medium text-[#0e2c46]">
            {ROAMING_CHANNEL_LABELS[shell.roamingChannel] ?? shell.roamingChannel}
          </p>
        </div>

        {/* My Networks */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-1">My Networks</p>
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

        {/* Roaming Partners */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-1">
            Roaming Partner{shell.roamingPartners.length !== 1 ? 's' : ''}
          </p>
          {shell.roamingPartners.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {shell.roamingPartners.map((code) => (
                <span
                  key={code}
                  className="bg-[#e8edf5] text-[#0e2c46] text-[10px] rounded px-2 py-0.5 font-semibold"
                >
                  {code}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#98a2b3]">—</p>
          )}
        </div>

        {/* Period */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-1">Period</p>
          <p className="text-xs font-medium text-[#0e2c46]">
            {shell.period.start || '—'}
          </p>
          <p className="text-xs font-medium text-[#0e2c46]">
            {shell.period.end ? `→ ${shell.period.end}` : '→ end not set'}
          </p>
          {shell.autoRenewal && (
            <p className="text-[10px] text-[#82bc34] font-semibold mt-0.5">Auto-renews</p>
          )}
        </div>

        {/* Services */}
        {allServices.length > 0 && (
          <div>
            <p className="text-[10px] text-[#98a2b3] mb-1">Services</p>
            <div className="flex flex-wrap gap-1">
              {allServices.map((st) => (
                <span
                  key={st}
                  className="text-[9px] font-semibold text-[#344054] bg-white border border-[#e4e7ec] rounded px-1.5 py-0.5"
                >
                  {SERVICE_TYPE_LABELS[st] ?? st}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Statement stats */}
        {cards.length > 0 && (
          <div className="rounded-lg border border-[#e4e7ec] bg-white px-3 py-2.5 flex flex-col gap-1.5">
            <p className="text-[10px] text-[#98a2b3] font-semibold uppercase tracking-wide">Statements</p>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#667085]">Global cards</span>
              <span className="font-semibold text-[#0e2c46]">{layer1.length}</span>
            </div>
            {layer2.length > 0 && (
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#667085]">Overrides</span>
                <span className="font-semibold text-[#0e2c46]">{layer2.length}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[10px] border-t border-[#f0f1f3] pt-1.5 mt-0.5">
              <span className="text-[#667085]">Service rows</span>
              <span className="font-semibold text-[#0e2c46]">{totalRows}</span>
            </div>
          </div>
        )}

        {/* Currency */}
        <div>
          <p className="text-[10px] text-[#98a2b3] mb-1">Currency</p>
          <p className="text-xs font-semibold text-[#0e2c46]">{shell.currency}</p>
        </div>

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
