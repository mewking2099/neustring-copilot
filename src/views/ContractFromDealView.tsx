import { useState, useEffect } from "react"
import { FileText, Zap, Wifi } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Stepper } from "@/components/wizard/Stepper"
import { WizardSideChat } from "@/components/wizard/WizardSideChat"
import { CONTRACT_FROM_DEAL_LABELS, CONTRACT_FROM_DEAL_CONFIG } from "@/data/contractConv"

// ── Step 1 — Select Deal ──────────────────────────────────────────────────────
const RECENT_DEALS = [
  { id: "#29107", name: "West Africa", detail: "6 networks · Data+Voice+SMS · €320K/yr · 24mo" },
  { id: "#28910", name: "Yaana Solutions LLC", detail: "2 networks · Data+Voice · €180K/yr · 24mo" },
  { id: "#27856", name: "Orange Spain", detail: "5 networks · All services · €450K/yr · 36mo" },
]

function Step1({ onSelect }: { onSelect: () => void }) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(id: string) {
    setSelected(id)
    onSelect()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#667085]">Search by deal ID or select from recents below.</p>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter deal ID e.g. 29107"
        className="w-full rounded-lg border border-[#d0d5dd] px-3 py-2 text-sm text-[#344054] placeholder:text-[#98a2b3] outline-none focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)]"
      />
      <div className="space-y-1.5">
        {RECENT_DEALS.map((d) => (
          <button
            key={d.id}
            onClick={() => handleSelect(d.id)}
            className={cn(
              "w-full flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
              selected === d.id
                ? "border-[#0e2c46] bg-[#0e2c46] text-white"
                : "border-[#e4e7ec] bg-[#f9fafb] hover:border-[#0e2c46] hover:bg-[#0e2c46] hover:text-white"
            )}
          >
            <span className="text-xs font-semibold mt-0.5 font-mono">{d.id}</span>
            <div>
              <p className="text-sm font-medium">{d.name}</p>
              <p className={cn("text-xs", selected === d.id ? "text-[#c8dde8]" : "text-[#667085]")}>{d.detail}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 2 — Select Template ──────────────────────────────────────────────────
const TEMPLATES: { icon: LucideIcon; name: string; desc: string }[] = [
  { icon: FileText, name: "GSMA BA.12 Standard", desc: "Full clause set with all standard protections" },
  { icon: Zap,      name: "Simplified",           desc: "Data + Voice only — removes SMS/IoT clauses" },
  { icon: Wifi,     name: "IOT-focused",           desc: "NB-IoT & LTE-M APN clauses included" },
]

function Step2() {
  const [selected, setSelected] = useState(0)
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#667085] mb-1">Choose the contract template to apply.</p>
      {TEMPLATES.map((t, i) => (
        <button
          key={t.name}
          onClick={() => setSelected(i)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
            selected === i
              ? "border-[#0e2c46] bg-[#0e2c46] text-white"
              : "border-[#e4e7ec] bg-[#f2f4f7] text-[#344054] hover:border-[#0e2c46] hover:bg-[#f2f4f7]"
          )}
        >
          <t.icon className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">{t.name}</p>
            <p className={cn("text-xs", selected === i ? "text-[#c8dde8]" : "text-[#667085]")}>{t.desc}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// ── Step 3 — Auto-populated Terms ─────────────────────────────────────────────
const AUTO_TERMS = [
  { label: "Counterparty",  value: "West Africa Partners" },
  { label: "Services",      value: "Data+Voice+SMS" },
  { label: "Duration",      value: "24 months" },
  { label: "Payment",       value: "EUR, Net-30" },
  { label: "Billing Start", value: "01 Jan 2025" },
  { label: "Template",      value: "GSMA BA.12" },
]

function Step3() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#667085] mb-1">All terms auto-populated from Deal #29107. Review before creating.</p>
      <div className="grid grid-cols-2 gap-2">
        {AUTO_TERMS.map((t) => (
          <div key={t.label} className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-3 py-3">
            <p className="text-[10px] text-[#667085] mb-0.5">{t.label}</p>
            <p className="text-sm font-semibold text-[#0e2c46]">{t.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#e8f2ce] rounded-lg px-3 py-2 text-sm text-[#0e2c46]">
        ✓ All terms auto-populated · Ready to create contract
      </div>
    </div>
  )
}

// ── Step 4 — Success ──────────────────────────────────────────────────────────
function Step4({ onReset }: { onReset: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center text-center py-6 gap-4">
      <div className="w-14 h-14 rounded-full bg-[#e8f2ce] flex items-center justify-center text-2xl">✓</div>
      <div>
        <p className="text-lg font-semibold text-[#0e2c46]">Contract Created</p>
        <p className="text-sm text-[#667085] mt-1">
          Contract #CTR-29202 created from Deal #29107 ✓ All terms auto-populated from the deal.
        </p>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => navigate("/chat")}
          className="rounded-lg bg-[#0e2c46] text-white text-sm px-4 py-2 hover:bg-[#185992] transition-colors"
        >
          View Contract #CTR-29202
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-[#d0d5dd] text-[#344054] text-sm px-4 py-2 hover:bg-[#f2f4f7] transition-colors"
        >
          Create another
        </button>
      </div>
    </div>
  )
}

// ── Contract From Deal Wizard ──────────────────────────────────────────────────
const STEP_SUBTITLES: Record<number, string> = {
  1: "Select Deal",
  2: "Select Template",
  3: "Review Terms",
  4: "Contract Ready",
}

function ContractFromDealWizard({
  step, onNext, onBack, onDealSelect,
}: {
  step: number
  onNext: () => void
  onBack: () => void
  onDealSelect: () => void
}) {
  function renderStep() {
    switch (step) {
      case 1: return <Step1 onSelect={onDealSelect} />
      case 2: return <Step2 />
      case 3: return <Step3 />
      case 4: return <Step4 onReset={() => { onBack(); onBack(); onBack() }} />
      default: return null
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 min-w-0">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-lg font-semibold text-[#0e2c46]">Create Contract from Deal</h1>
          <span className="text-xs font-medium bg-[#f2f4f7] text-[#344054] rounded-full px-2.5 py-0.5">
            #Draft-CTR-29202
          </span>
        </div>
        <p className="text-sm text-[#667085]">
          Step {step} of 4 — {STEP_SUBTITLES[step]}
        </p>
      </div>

      <Stepper labels={CONTRACT_FROM_DEAL_LABELS} step={step} />

      <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.06)] mb-6">
        {renderStep()}
      </div>

      {step < 4 && (
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={onBack}
              className="border border-[#d0d5dd] bg-white text-[#344054] rounded-lg px-4 py-2 text-sm hover:bg-[#f2f4f7] transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={onNext}
            className="bg-[#0e2c46] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#185992] transition-colors"
          >
            {step === 3 ? "Create Contract →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  )
}

// ── View ───────────────────────────────────────────────────────────────────────
export function ContractFromDealView() {
  const [step, setStep] = useState(1)

  useEffect(() => { document.title = "Contract from Deal — NeuString Co-Pilot" }, [])

  return (
    <div className="flex h-full overflow-hidden">
      <ContractFromDealWizard
        step={step}
        onNext={() => setStep((s) => Math.min(s + 1, 4))}
        onBack={() => setStep((s) => Math.max(s - 1, 1))}
        onDealSelect={() => setStep(2)}
      />
      <WizardSideChat step={step} onStepChange={setStep} config={CONTRACT_FROM_DEAL_CONFIG} />
    </div>
  )
}
