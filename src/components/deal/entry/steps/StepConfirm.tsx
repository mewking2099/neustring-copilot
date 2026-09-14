import type { PartiesDraft } from "./StepParties"
import type { ServicesAndPeriodDraft } from "./StepServicesAndPeriod"
import type { SettingsDraft } from "./StepSettings"
import { SERVICE_TYPE_LABELS, ROAMING_CHANNEL_LABELS } from "@/domain/deal/discountFamilies"

interface Props {
  parties: PartiesDraft
  services: ServicesAndPeriodDraft
  settings: SettingsDraft
  onConfirm: () => void
  onSaveDraft?: () => void
  confirmLabel?: string
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2 border-b border-[#f2f4f7] last:border-0">
      <span className="text-xs text-[#667085] w-28 shrink-0 pt-0.5">{label}</span>
      <div className="text-xs text-[#344054] font-medium flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-[#0e2c46] text-white text-xs font-medium px-2 py-0.5 rounded-full">
      {label}
    </span>
  )
}

export function StepConfirm({ parties, services, settings, onConfirm, onSaveDraft, confirmLabel }: Props) {
  const counterpart =
    parties.partnerMode === "partner"
      ? parties.roamingPartners[0] ?? "—"
      : parties.alliance || "—"

  const counterpartLabel =
    parties.partnerMode === "partner" ? "Roaming Partner" : "Alliance"

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#f8f9fc] rounded-xl border border-[#e4e7ec] px-4 py-3">
        <SummaryRow label="My Networks">
          {parties.myNetworks.length > 0 ? (
            parties.myNetworks.map((n) => <Chip key={n} label={n} />)
          ) : (
            <span className="text-[#98a2b3]">—</span>
          )}
        </SummaryRow>

        <SummaryRow label="Channel">
          <span>{ROAMING_CHANNEL_LABELS[parties.roamingChannel]}</span>
        </SummaryRow>

        <SummaryRow label={counterpartLabel}>
          {counterpart !== "—" ? (
            <Chip label={counterpart} />
          ) : (
            <span className="text-[#98a2b3]">—</span>
          )}
        </SummaryRow>

        <SummaryRow label="Period">
          {services.periodStart && services.periodEnd ? (
            <span>
              {services.periodStart} → {services.periodEnd}
            </span>
          ) : (
            <span className="text-[#98a2b3]">Not set</span>
          )}
        </SummaryRow>

        <SummaryRow label="Services">
          {services.serviceTypes.length > 0 ? (
            services.serviceTypes.map((s) => (
              <Chip key={s} label={SERVICE_TYPE_LABELS[s] ?? s} />
            ))
          ) : (
            <span className="text-[#98a2b3]">—</span>
          )}
        </SummaryRow>

        <SummaryRow label="Auto-renewal">
          <span>
            {services.autoRenewal
              ? `Yes — ${services.autoRenewalNoticeDays}d notice`
              : "No"}
          </span>
        </SummaryRow>

        <SummaryRow label="Currency">
          <span>{settings.currency}</span>
        </SummaryRow>

        <SummaryRow label="Tax">
          <span>{settings.excludeTax ? "Exclude tax" : "Include tax"}</span>
        </SummaryRow>

        <SummaryRow label="Access Level">
          <span className="capitalize">{parties.accessLevel}</span>
        </SummaryRow>

        {settings.groupStatement && (
          <SummaryRow label="Group Statement">
            <span>Enabled</span>
          </SummaryRow>
        )}

        {settings.budgetInclusion && (
          <SummaryRow label="Budget">
            <span>Included</span>
          </SummaryRow>
        )}

        {parties.negotiator && (
          <SummaryRow label="Negotiator">
            <span>{parties.negotiator}</span>
          </SummaryRow>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 bg-[#0e2c46] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#185992] transition-colors"
        >
          {confirmLabel ?? "Create Deal"}
        </button>
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="flex-1 border border-[#d0d5dd] text-[#344054] text-sm font-semibold py-2.5 rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Save as Draft
          </button>
        )}
      </div>
    </div>
  )
}
