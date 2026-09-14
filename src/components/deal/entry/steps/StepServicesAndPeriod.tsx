import type { ServiceType } from "@/domain/deal/types"
import { SERVICE_TYPE_LABELS } from "@/domain/deal/discountFamilies"

export interface ServicesAndPeriodDraft {
  serviceTypes: ServiceType[]
  periodStart: string
  periodEnd: string
  autoRenewal: boolean
  autoRenewalNoticeDays: number
}

export function defaultServicesAndPeriodDraft(): ServicesAndPeriodDraft {
  return {
    serviceTypes: [],
    periodStart: "",
    periodEnd: "",
    autoRenewal: false,
    autoRenewalNoticeDays: 30,
  }
}

interface Props {
  draft: ServicesAndPeriodDraft
  onChange: (patch: Partial<ServicesAndPeriodDraft>) => void
}

const ALL_SERVICE_TYPES = Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]

function periodError(start: string, end: string): string | null {
  if (!start || !end) return null
  if (end < start) return "End period must be on or after start period"
  return null
}

export function StepServicesAndPeriod({ draft, onChange }: Props) {
  const periodErr = periodError(draft.periodStart, draft.periodEnd)

  function toggleService(svc: ServiceType) {
    const current = draft.serviceTypes
    const next = current.includes(svc)
      ? current.filter((s) => s !== svc)
      : [...current, svc]
    onChange({ serviceTypes: next })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Service Types */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#344054]">Service Types</label>
        <div className="flex flex-wrap gap-2">
          {ALL_SERVICE_TYPES.map((svc) => {
            const selected = draft.serviceTypes.includes(svc)
            return (
              <button
                key={svc}
                type="button"
                onClick={() => toggleService(svc)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selected
                    ? "bg-[#0e2c46] text-white border-[#0e2c46]"
                    : "border-[#0e2c46] text-[#0e2c46] hover:bg-[#0e2c46]/5"
                }`}
              >
                {SERVICE_TYPE_LABELS[svc]}
              </button>
            )
          })}
        </div>
        {draft.serviceTypes.length === 0 && (
          <p className="text-xs text-[#667085]">Select at least one service type</p>
        )}
      </div>

      {/* Period */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#344054]">Period</label>
        <div className="flex gap-3 items-start">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-[#667085]">Start</label>
            <input
              type="month"
              className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-sm text-[#344054] focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)] outline-none"
              value={draft.periodStart}
              onChange={(e) => onChange({ periodStart: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-[#667085]">End</label>
            <input
              type="month"
              className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-sm text-[#344054] focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)] outline-none"
              value={draft.periodEnd}
              onChange={(e) => onChange({ periodEnd: e.target.value })}
            />
          </div>
        </div>
        {periodErr && <p className="text-xs text-red-500">{periodErr}</p>}
      </div>

      {/* Auto-renewal */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#344054]">Auto-renewal</p>
            <p className="text-xs text-[#667085]">Automatically renew the deal at period end</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={draft.autoRenewal}
            onClick={() => onChange({ autoRenewal: !draft.autoRenewal })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              draft.autoRenewal ? "bg-[#82bc34]" : "bg-[#d0d5dd]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                draft.autoRenewal ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {draft.autoRenewal && (
          <div className="flex flex-col gap-1 ml-0">
            <label className="text-xs text-[#667085]">Notice period (days)</label>
            <input
              type="number"
              min={1}
              max={365}
              className="w-32 border border-[#d0d5dd] rounded-lg px-3 py-2 text-sm text-[#344054] focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)] outline-none"
              value={draft.autoRenewalNoticeDays}
              onChange={(e) =>
                onChange({ autoRenewalNoticeDays: Math.max(1, parseInt(e.target.value) || 1) })
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
