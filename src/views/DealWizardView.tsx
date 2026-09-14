import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DealWizard } from "@/components/wizard/DealWizard"
import type { WizardData } from "@/components/wizard/DealWizard"
import { WizardSideChat } from "@/components/wizard/WizardSideChat"
import { DEAL_WIZARD_CONFIG } from "@/data/dealConv"
import { useDealStore } from "@/store/deal"
import type { DealShell, ServiceType } from "@/domain/deal/types"
import { useState } from "react"

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

export function DealWizardView() {
  const navigate = useNavigate()
  const [wizStep, setWizStep] = useState(1)
  const [wizData, setWizData] = useState<WizardData>(INITIAL_DATA)

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
      name: `${wizData.dealType ?? "Bilateral"} — ${wizData.partnerName ?? wizData.partner ?? "TBD"}`,
      status: "draft",
      roamingChannel: "traditional",
      myNetworks: ["GBSM"],
      roamingPartners: wizData.partner ? [wizData.partner] : [],
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

    useDealStore.getState().initShell(
      shell,
      wizData.clonedFromId ? "cloned_deal" : "scratch_wizard",
    )
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
