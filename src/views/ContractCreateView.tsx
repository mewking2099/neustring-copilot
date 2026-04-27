import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Stepper } from "@/components/wizard/Stepper"
import { WizardSideChat } from "@/components/wizard/WizardSideChat"
import { CONTRACT_CREATE_LABELS, CONTRACT_CREATE_CONFIG } from "@/data/contractConv"

// ── Step 1 — Contract Type ────────────────────────────────────────────────────
const CONTRACT_TYPES = ["Bilateral", "Unilateral", "IOT-only", "MVNO"]

function Step1() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#667085]">Select the type of roaming contract to create.</p>
      <div className="flex flex-wrap gap-2">
        {CONTRACT_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
              selected === t
                ? "bg-[#0e2c46] text-white border-[#0e2c46]"
                : "bg-white text-[#0e2c46] border-[#0e2c46] hover:bg-[#f2f4f7]"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      {selected && (
        <div className="bg-[#e8f2ce] rounded-lg px-3 py-2 text-sm text-[#0e2c46] flex items-center gap-2">
          <span>🔒</span>
          <span>Type: <strong>{selected} Wholesale Roaming</strong></span>
        </div>
      )}
    </div>
  )
}

// ── Step 2 — Party Details ────────────────────────────────────────────────────
function Step2() {
  const [value, setValue] = useState("")
  const [verified, setVerified] = useState(false)

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#667085]">Enter the counterparty entity name and jurisdiction.</p>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setVerified(false) }}
          placeholder="Counterparty name, entity, jurisdiction…"
          className="flex-1 rounded-lg border border-[#d0d5dd] px-3 py-2 text-sm text-[#344054] placeholder:text-[#98a2b3] outline-none focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)]"
        />
        <button
          onClick={() => { if (value.trim()) setVerified(true) }}
          className="rounded-lg bg-[#0e2c46] text-white text-sm px-3 py-2 hover:bg-[#185992] transition-colors"
        >
          Verify
        </button>
      </div>
      {verified && (
        <div className="bg-[#e8f2ce] rounded-lg px-3 py-2 text-sm text-[#0e2c46]">
          ✓ <strong>{value || "Yaana Solutions LLC"}</strong> — Delaware, US · Governing law: Delaware
        </div>
      )}
    </div>
  )
}

// ── Step 3 — Clauses ──────────────────────────────────────────────────────────
const CLAUSES = [
  { name: "Confidentiality",   desc: "Broad GSMA-aligned definition",          status: "Included" },
  { name: "Payment Terms",     desc: "Net-30, EUR, late payment 1.5%/mo",      status: "Included" },
  { name: "SLA",               desc: "99.5% uptime commitment",                status: "Included" },
  { name: "Dispute Resolution", desc: "JAMS arbitration, San Francisco",        status: "Included" },
]

function Step3() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-[#667085] mb-3">Review the GSMA standard clauses included in this contract.</p>
      {CLAUSES.map((c) => (
        <div
          key={c.name}
          className="flex items-center justify-between rounded-lg border border-[#e4e7ec] bg-[#f2f4f7] px-3 py-2.5"
        >
          <div>
            <p className="text-sm font-medium text-[#182230]">{c.name}</p>
            <p className="text-xs text-[#667085]">{c.desc}</p>
          </div>
          <span className="text-xs font-medium bg-[#82bc34] text-white rounded-full px-2 py-0.5 shrink-0 ml-2">
            ✓ {c.status}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Step 4 — Commercial Terms ─────────────────────────────────────────────────
const TERMS = [
  { label: "Payment",       value: "Net-30" },
  { label: "Term",          value: "24 months" },
  { label: "Auto-renew",   value: "Enabled" },
  { label: "Late payment",  value: "1.5%/mo" },
  { label: "Termination",   value: "30 days notice" },
  { label: "Governing law", value: "Delaware, US" },
]

function Step4() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#667085] mb-1">Review and confirm the commercial terms.</p>
      <div className="grid grid-cols-2 gap-2">
        {TERMS.map((t) => (
          <div key={t.label} className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-3 py-3">
            <p className="text-[10px] text-[#667085] mb-0.5">{t.label}</p>
            <p className="text-sm font-semibold text-[#0e2c46]">{t.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 5 — Legal Validation ─────────────────────────────────────────────────
const CHECKS = [
  { type: "pass", text: "GSMA BA.12 template compliance verified" },
  { type: "pass", text: "Confidentiality clause — GDPR compatible" },
  { type: "pass", text: "Payment terms within market benchmark" },
  { type: "pass", text: "Governing law — Delaware, US confirmed" },
  { type: "pass", text: "Dispute resolution — JAMS arbitration valid" },
  { type: "warn", text: "No data retention limit specified in clause 8.4. Recommend: 36 months post-termination." },
]

function Step5() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#667085] mb-1">Validation complete. Review any warnings before submitting.</p>
      {CHECKS.map((c, i) => (
        <div key={i} className="flex items-start gap-2">
          <div
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5",
              c.type === "pass" ? "bg-[#82bc34]" : "bg-amber-400"
            )}
          >
            {c.type === "pass" ? "✓" : "!"}
          </div>
          <span className={cn("text-sm leading-relaxed", c.type === "warn" && "text-amber-700")}>
            {c.text}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Step 6 — Success ──────────────────────────────────────────────────────────
function Step6({ onReset }: { onReset: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center text-center py-6 gap-4">
      <div className="w-14 h-14 rounded-full bg-[#e8f2ce] flex items-center justify-center text-2xl">✓</div>
      <div>
        <p className="text-lg font-semibold text-[#0e2c46]">Contract Submitted</p>
        <p className="text-sm text-[#667085] mt-1">
          Contract #CTR-29201 routed to J. Harrison (Yaana) for e-signature via DocuSign.
        </p>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => navigate("/chat")}
          className="rounded-lg bg-[#0e2c46] text-white text-sm px-4 py-2 hover:bg-[#185992] transition-colors"
        >
          View contract #CTR-29201
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

// ── Contract Create Wizard ─────────────────────────────────────────────────────
const STEP_SUBTITLES: Record<number, string> = {
  1: "Contract Type",
  2: "Party Details",
  3: "Clauses",
  4: "Commercial Terms",
  5: "Legal Validation",
  6: "Submitted",
}

function ContractCreateWizard({ step, onNext, onBack }: { step: number; onNext: () => void; onBack: () => void }) {
  function renderStep() {
    switch (step) {
      case 1: return <Step1 />
      case 2: return <Step2 />
      case 3: return <Step3 />
      case 4: return <Step4 />
      case 5: return <Step5 />
      case 6: return <Step6 onReset={onBack} />
      default: return null
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 min-w-0">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-lg font-semibold text-[#0e2c46]">Create Contract</h1>
          <span className="text-xs font-medium bg-[#f2f4f7] text-[#344054] rounded-full px-2.5 py-0.5">
            #Draft-CTR-29201
          </span>
        </div>
        <p className="text-sm text-[#667085]">
          Step {step} of 6 — {STEP_SUBTITLES[step]}
        </p>
      </div>

      <Stepper labels={CONTRACT_CREATE_LABELS} step={step} />

      <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.06)] mb-6">
        {renderStep()}
      </div>

      {step < 6 && (
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
            {step === 5 ? "Submit →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  )
}

// ── View ───────────────────────────────────────────────────────────────────────
export function ContractCreateView() {
  const [step, setStep] = useState(1)

  useEffect(() => { document.title = "New Contract — NeuString Co-Pilot" }, [])

  return (
    <div className="flex h-full overflow-hidden">
      <ContractCreateWizard
        step={step}
        onNext={() => setStep((s) => Math.min(s + 1, 6))}
        onBack={() => setStep((s) => Math.max(s - 1, 1))}
      />
      <WizardSideChat step={step} onStepChange={setStep} config={CONTRACT_CREATE_CONFIG} />
    </div>
  )
}
