import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useDealStore } from "@/store/deal"
import type { DealShell } from "@/domain/deal/types"

import { StepParties, defaultPartiesDraft } from "./steps/StepParties"
import type { PartiesDraft } from "./steps/StepParties"
import { StepServicesAndPeriod, defaultServicesAndPeriodDraft } from "./steps/StepServicesAndPeriod"
import type { ServicesAndPeriodDraft } from "./steps/StepServicesAndPeriod"
import { StepSettings, defaultSettingsDraft } from "./steps/StepSettings"
import type { SettingsDraft } from "./steps/StepSettings"
import { StepConfirm } from "./steps/StepConfirm"

interface Props {
  onClose: () => void
  initialShell?: import("@/domain/deal/types").DealShell
  quickMode?: boolean
}

const STEP_LABELS = ["Parties", "Services & Period", "Settings", "Confirm"]

const StepSlide = {
  initial: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

function buildShell(
  parties: PartiesDraft,
  services: ServicesAndPeriodDraft,
  settings: SettingsDraft,
): DealShell {
  const id = "draft-" + Math.random().toString(36).slice(2, 7)
  const partner =
    parties.partnerMode === "partner" ? parties.roamingPartners : []
  const alliance =
    parties.partnerMode === "alliance" ? parties.alliance || null : null

  const partnerLabel = partner.join(", ") || alliance || "unknown"
  const periodPart =
    services.periodStart && services.periodEnd
      ? `${services.periodStart}_${services.periodEnd}`
      : "open"
  const networkPart = parties.myNetworks.join(", ") || "unknown"
  const name = `${partnerLabel}_${periodPart}_[${networkPart}]`

  return {
    id,
    name,
    status: "draft",
    roamingChannel: parties.roamingChannel,
    myNetworks: parties.myNetworks,
    roamingPartners: partner,
    alliance,
    serviceTypes: services.serviceTypes,
    period: {
      start: services.periodStart || "",
      end: services.periodEnd || "",
    },
    autoRenewal: services.autoRenewal,
    autoRenewalNoticeDays: services.autoRenewal
      ? services.autoRenewalNoticeDays
      : null,
    budgetInclusion: settings.budgetInclusion,
    accessLevel: parties.accessLevel,
    negotiator: parties.negotiator,
    currency: settings.currency,
    excludeTax: settings.excludeTax,
    groupStatement: settings.groupStatement,
  }
}

function shellToPartiesDraft(shell: import("@/domain/deal/types").DealShell): PartiesDraft {
  return {
    myNetworks: shell.myNetworks,
    roamingChannel: shell.roamingChannel,
    partnerMode: shell.alliance ? "alliance" : "partner",
    roamingPartners: shell.roamingPartners,
    alliance: shell.alliance ?? "",
    accessLevel: shell.accessLevel,
    negotiator: shell.negotiator,
  }
}

function shellToServicesDraft(shell: import("@/domain/deal/types").DealShell): ServicesAndPeriodDraft {
  return {
    serviceTypes: shell.serviceTypes,
    periodStart: shell.period.start,
    periodEnd: shell.period.end,
    autoRenewal: shell.autoRenewal,
    autoRenewalNoticeDays: shell.autoRenewalNoticeDays ?? 30,
  }
}

function shellToSettingsDraft(shell: import("@/domain/deal/types").DealShell): SettingsDraft {
  return {
    budgetInclusion: shell.budgetInclusion,
    currency: shell.currency,
    excludeTax: shell.excludeTax,
    groupStatement: shell.groupStatement,
  }
}

export function QuickStartWizard({ onClose, initialShell, quickMode = false }: Props) {
  const navigate = useNavigate()
  const { initShell, patchShell } = useDealStore()
  const isEditMode = !!initialShell

  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [savedDraft, setSavedDraft] = useState(false)

  const [parties, setParties] = useState<PartiesDraft>(
    initialShell ? shellToPartiesDraft(initialShell) : defaultPartiesDraft(),
  )
  const [services, setServices] = useState<ServicesAndPeriodDraft>(
    initialShell ? shellToServicesDraft(initialShell) : defaultServicesAndPeriodDraft(),
  )
  const [settings, setSettings] = useState<SettingsDraft>(
    initialShell ? shellToSettingsDraft(initialShell) : defaultSettingsDraft(),
  )

  const overlayRef = useRef<HTMLDivElement>(null)

  // Trap focus inside the modal
  useEffect(() => {
    const firstFocusable = overlayRef.current?.querySelector<HTMLElement>(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()
  }, [step])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  function goNext() {
    setDir(1)
    setStep((s) => Math.min(s + 1, 4))
  }

  function goBack() {
    setDir(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  function handleCreate() {
    if (isEditMode) {
      // Edit mode — patch in-place, preserve statements
      const updated = buildShell(parties, services, settings)
      patchShell({
        name: updated.name,
        roamingChannel: updated.roamingChannel,
        myNetworks: updated.myNetworks,
        roamingPartners: updated.roamingPartners,
        alliance: updated.alliance,
        serviceTypes: updated.serviceTypes,
        period: updated.period,
        autoRenewal: updated.autoRenewal,
        autoRenewalNoticeDays: updated.autoRenewalNoticeDays,
        budgetInclusion: updated.budgetInclusion,
        accessLevel: updated.accessLevel,
        negotiator: updated.negotiator,
        currency: updated.currency,
        excludeTax: updated.excludeTax,
        groupStatement: updated.groupStatement,
      })
      onClose()
    } else {
      const shell = buildShell(parties, services, settings)
      initShell(shell, "scratch_wizard")
      navigate("/deal/" + shell.id)
      onClose()
    }
  }

  function handleSaveDraft() {
    if (isEditMode) return
    const shell = buildShell(parties, services, settings)
    initShell(shell, "scratch_wizard")
    setSavedDraft(true)
    setTimeout(() => setSavedDraft(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-label="Quick Setup wizard"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={overlayRef}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 mx-4 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-[#0e2c46]">
              {isEditMode ? "Edit Deal Info" : "Quick Draft"}
            </h2>
            {!quickMode && (
              <p className="text-xs text-[#667085]">Step {step} of 4</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#98a2b3] hover:text-[#344054] transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper — hidden in quick mode */}
        {!quickMode && (
          <div className="flex items-center gap-0 mb-6">
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1
              const isCompleted = stepNum < step
              const isCurrent = stepNum === step
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        isCompleted
                          ? "bg-[#82bc34] text-white"
                          : isCurrent
                            ? "bg-[#0e2c46] text-white"
                            : "bg-[#e4e7ec] text-[#98a2b3]"
                      }`}
                    >
                      {isCompleted ? "✓" : stepNum}
                    </div>
                    <span
                      className={`text-[10px] font-medium whitespace-nowrap ${
                        isCurrent ? "text-[#0e2c46]" : "text-[#98a2b3]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-2 mb-4 transition-colors ${
                        isCompleted ? "bg-[#82bc34]" : "bg-[#e4e7ec]"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Step content */}
        {quickMode ? (
          <>
            <StepParties
              draft={parties}
              onChange={(patch) => setParties((p) => ({ ...p, ...patch }))}
            />
            <div className="mt-5 pt-4 border-t border-[#e4e7ec]">
              <button
                type="button"
                onClick={handleCreate}
                className="w-full bg-[#82bc34] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#6fa02c] transition-colors"
              >
                Create Draft →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative overflow-hidden min-h-[320px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={StepSlide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {step === 1 && (
                    <StepParties
                      draft={parties}
                      onChange={(patch) => setParties((p) => ({ ...p, ...patch }))}
                    />
                  )}
                  {step === 2 && (
                    <StepServicesAndPeriod
                      draft={services}
                      onChange={(patch) => setServices((s) => ({ ...s, ...patch }))}
                    />
                  )}
                  {step === 3 && (
                    <StepSettings
                      draft={settings}
                      onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
                    />
                  )}
                  {step === 4 && (
                    <StepConfirm
                      parties={parties}
                      services={services}
                      settings={settings}
                      onConfirm={handleCreate}
                      onSaveDraft={isEditMode ? undefined : handleSaveDraft}
                      confirmLabel={isEditMode ? "Save Changes" : undefined}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {step < 4 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#e4e7ec]">
                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="text-sm text-[#667085] hover:text-[#344054] transition-colors"
                    >
                      Back
                    </button>
                  )}
                  {step >= 2 && (
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="text-sm text-[#667085] hover:text-[#344054] transition-colors"
                    >
                      {savedDraft ? "Draft saved" : "Save as Draft"}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={goNext}
                  className="bg-[#82bc34] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#6fa02c] transition-colors"
                >
                  {step === 3 ? "Review" : "Next"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
