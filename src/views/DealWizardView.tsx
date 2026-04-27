import { useState, useEffect } from "react"
import { DealWizard } from "@/components/wizard/DealWizard"
import { WizardSideChat } from "@/components/wizard/WizardSideChat"
import { DEAL_WIZARD_CONFIG } from "@/data/dealConv"

export function DealWizardView() {
  const [wizStep, setWizStep] = useState(1)

  useEffect(() => { document.title = "New Deal — NeuString Co-Pilot" }, [])

  function handleNext() {
    setWizStep((s) => Math.min(s + 1, 7))
  }

  function handleBack() {
    setWizStep((s) => Math.max(s - 1, 1))
  }

  return (
    <div className="flex h-full overflow-hidden">
      <DealWizard step={wizStep} onNext={handleNext} onBack={handleBack} />
      <WizardSideChat step={wizStep} onStepChange={setWizStep} config={DEAL_WIZARD_CONFIG} />
    </div>
  )
}
