import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { DealWizard } from "@/components/wizard/DealWizard"
import type { WizardData } from "@/components/wizard/DealWizard"
import { WizardSideChat } from "@/components/wizard/WizardSideChat"
import { DEAL_WIZARD_CONFIG } from "@/data/dealConv"
import { useDealStore } from "@/store/deal"
import type { DealShell, ServiceType } from "@/domain/deal/types"
import type { HistoricalDeal } from "@/data/dealHistory"
import type { QualifyingResult, ServiceName } from "@/domain/deal/qualifyingTypes"
import { buildCardsFromQualifying } from "@/domain/deal/cardMapper"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

const SERVICE_TYPE_MAP: Record<string, ServiceType[]> = {
  Data:  ["gprs", "lte_m", "nb_iot", "5g"],
  Voice: ["voice_mo", "voice_mt"],
  SMS:   ["sms"],
  IoT:   ["nb_iot"],
}

const INITIAL_DATA: WizardData = {
  partner: null,
  partnerName: null,
  partners: [],
  dealType: null,
  clonedFromId: null,
  services: ["Data", "Voice", "SMS"],
  rates: {},
  ratesAccepted: [],
  userEditedRates: [],
  periodStart: todayISO(),
  periodEnd: "",
  termMonths: 0,
  currency: "EUR",
  autoRenewal: false,
}

function buildInitialData(cloneFrom?: HistoricalDeal, qualifyingResult?: QualifyingResult): WizardData {
  if (cloneFrom) {
    return {
      ...INITIAL_DATA,
      partner: cloneFrom.partner,
      partnerName: cloneFrom.partnerName,
      partners: [cloneFrom.partner],
      dealType: cloneFrom.dealType,
      clonedFromId: cloneFrom.id,
      services: cloneFrom.services,
      currency: cloneFrom.currency,
      termMonths: cloneFrom.termMonths,
      autoRenewal: cloneFrom.autoRenewal,
    }
  }
  if (qualifyingResult) {
    return {
      ...INITIAL_DATA,
      services: qualifyingResult.services,
    }
  }
  return INITIAL_DATA
}

export function DealWizardView() {
  const navigate = useNavigate()
  const location = useLocation()
    // New flow: drawer passes { wizardData, initialStep }
  // Legacy flows: { cloneFrom } or { qualifyingResult }
  const locationState = location.state as {
    wizardData?: WizardData
    initialStep?: number
    cloneFrom?: HistoricalDeal
    qualifyingResult?: QualifyingResult
  } | null

  const [wizStep, setWizStep] = useState(() => locationState?.initialStep ?? 1)
  const [wizData, setWizData] = useState<WizardData>(() => {
    if (locationState?.wizardData) return locationState.wizardData
    return buildInitialData(locationState?.cloneFrom, locationState?.qualifyingResult)
  })

  useEffect(() => {
    document.title = "New Deal — Iris"
  }, [])

  function patchData(patch: Partial<WizardData>) {
    setWizData((prev) => ({ ...prev, ...patch }))
  }

  function handleComplete() {
    const id = "deal-" + Math.random().toString(36).slice(2, 8)

    const serviceTypes = [
      ...new Set(wizData.services.flatMap((s) => SERVICE_TYPE_MAP[s] ?? [])),
    ] as ServiceType[]

    const shell: DealShell = {
      id,
      name: `${wizData.dealType ?? "Bilateral"} — ${wizData.partners.length > 1 ? wizData.partners.join(' · ') : (wizData.partnerName ?? wizData.partner ?? "TBD")}`,
      status: "draft",
      roamingChannel: "traditional",
      myNetworks: ["GBSM"],
      roamingPartners: wizData.partners.length > 0 ? wizData.partners : [],
      alliance: null,
      serviceTypes,
      period: { start: wizData.periodStart, end: wizData.periodEnd },
      autoRenewal: wizData.autoRenewal,
      autoRenewalNoticeDays: wizData.autoRenewal ? 30 : null,
      budgetInclusion: false,
      accessLevel: "private",
      negotiator: "",
      currency: wizData.currency,
      excludeTax: true,
      groupStatement: false,
    }

    // Resolve a QualifyingResult for card seeding — either from legacy flow or synthesised from wizard data
    const legacyQR = locationState?.qualifyingResult
    const qualifyingResult: QualifyingResult | null = legacyQR ?? (wizData.services.length > 0
      ? {
          services: wizData.services as ServiceName[],
          directions: Object.fromEntries(
            wizData.services.map((s) => [s, "both" as const])
          ) as Partial<Record<ServiceName, "inbound" | "outbound" | "both">>,
          discountModel: wizData.services.includes("IoT") ? "iot-flat" : "threshold",
          entityScope: "group",
          statementCount: wizData.services.length * 2,
        }
      : null)

    const entrySource = wizData.clonedFromId
      ? "cloned_deal"
      : locationState?.wizardData
        ? "qualifying_intake"
        : legacyQR
          ? "qualifying_intake"
          : "scratch_wizard"

    useDealStore.getState().initShell(shell, entrySource)

    if (qualifyingResult) {
      const seeded = buildCardsFromQualifying(qualifyingResult)
      useDealStore.getState().seedCards(seeded)
    }

    navigate("/deal/" + id)
  }

  return (
    <div className="flex h-full overflow-hidden">
      <DealWizard
        step={wizStep}
        data={wizData}
        onDataChange={patchData}
        onNext={() => setWizStep((s) => Math.min(s + 1, 4))}
        onBack={() => setWizStep((s) => Math.max(s - 1, 1))}
        onComplete={handleComplete}
        onGoToStep={(s) => setWizStep(s)}
      />
      <WizardSideChat step={wizStep} onStepChange={setWizStep} config={DEAL_WIZARD_CONFIG} />
    </div>
  )
}
