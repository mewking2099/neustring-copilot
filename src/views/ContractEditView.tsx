import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Stepper } from "@/components/wizard/Stepper"
import { WizardSideChat } from "@/components/wizard/WizardSideChat"
import { CONTRACT_EDIT_LABELS, CONTRACT_EDIT_CONFIG } from "@/data/contractConv"

// ── Step 1 — Select Contract ──────────────────────────────────────────────────
const CONTRACTS = [
  { id: "CTR-28910", name: "Yaana Solutions LLC",  status: "Active",   date: "Jan 2024" },
  { id: "CTR-29089", name: "Deutsche Telekom AG",  status: "Active",   date: "Mar 2025" },
  { id: "CTR-28742", name: "Orange Spain (ESORG1)", status: "Active",   date: "Jan 2026" },
]

function Step1() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#667085]">Select the contract you'd like to edit.</p>
      {CONTRACTS.map((c) => (
        <button
          key={c.id}
          onClick={() => setSelected(c.id)}
          className={cn(
            "w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
            selected === c.id
              ? "border-[#0e2c46] bg-[#0e2c46] text-white"
              : "border-[#e4e7ec] bg-[#f9fafb] hover:border-[#0e2c46] hover:bg-[#f2f4f7]"
          )}
        >
          <div>
            <p className="text-sm font-medium">{c.name}</p>
            <p className={cn("text-xs font-mono", selected === c.id ? "text-[#c8dde8]" : "text-[#667085]")}>
              {c.id} · {c.date}
            </p>
          </div>
          <span className={cn(
            "text-xs rounded-full px-2 py-0.5 font-medium",
            selected === c.id ? "bg-white text-[#0e2c46]" : "bg-[#e8f2ce] text-[#4d7c0f]"
          )}>
            {c.status}
          </span>
        </button>
      ))}
    </div>
  )
}

// ── Step 2 — Clause Tree ──────────────────────────────────────────────────────
const CLAUSE_TREE = [
  { id: "1", name: "1. Definitions", children: [] },
  { id: "3", name: "3. Commercial Terms", children: [
    { id: "3.1", name: "3.1 Payment Terms" },
    { id: "3.2", name: "3.2 Billing Currency" },
  ]},
  { id: "5", name: "5. Service Levels", children: [] },
  { id: "8", name: "8. Confidentiality", children: [
    { id: "8.2", name: "8.2 Scope of Confidential Information" },
    { id: "8.4", name: "8.4 Data Retention" },
  ]},
  { id: "11", name: "11. Dispute Resolution", children: [] },
  { id: "14", name: "14. Force Majeure", children: [] },
]

function Step2() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["3", "8"]))
  const [selected, setSelected] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-1">
      <p className="text-sm text-[#667085] mb-3">Select the clause you want to modify.</p>
      {CLAUSE_TREE.map((c) => (
        <div key={c.id}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={c.children.length > 0 ? expanded.has(c.id) : undefined}
            aria-pressed={c.children.length === 0 ? selected === c.id : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors",
              selected === c.id ? "bg-[#0e2c46] text-white" : "hover:bg-[#f2f4f7] text-[#344054]"
            )}
            onClick={() => {
              if (c.children.length > 0) toggleExpand(c.id)
              else setSelected(c.id)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                if (c.children.length > 0) toggleExpand(c.id)
                else setSelected(c.id)
              }
            }}
          >
            {c.children.length > 0 && (
              <span aria-hidden="true" className="text-[10px] text-[#98a2b3]">{expanded.has(c.id) ? "▾" : "▸"}</span>
            )}
            <span className="text-sm font-medium">{c.name}</span>
          </div>
          {c.children.length > 0 && expanded.has(c.id) && (
            <div className="ml-6 space-y-0.5 mt-0.5">
              {c.children.map((sub) => (
                <div
                  key={sub.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected === sub.id}
                  onClick={() => setSelected(sub.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setSelected(sub.id)
                    }
                  }}
                  className={cn(
                    "rounded-lg px-3 py-2 cursor-pointer text-sm transition-colors",
                    selected === sub.id ? "bg-[#0e2c46] text-white" : "hover:bg-[#f2f4f7] text-[#667085]"
                  )}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 3 — Propose Changes ──────────────────────────────────────────────────
const CURRENT_TEXT = `All parties to this Agreement shall maintain the confidentiality of Confidential Information for a period of three (3) years following the termination or expiration of this Agreement.`

function Step3() {
  const [proposed, setProposed] = useState("")

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-medium text-[#98a2b3] uppercase tracking-wide mb-1.5">Current language — Clause 8.2</p>
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-[#344054] leading-relaxed italic">
          {CURRENT_TEXT}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-medium text-[#98a2b3] uppercase tracking-wide mb-1.5">Proposed new language</p>
        <textarea
          value={proposed}
          onChange={(e) => setProposed(e.target.value)}
          placeholder="Enter your proposed clause text…"
          rows={4}
          className="w-full rounded-lg border border-[#d0d5dd] bg-[#f9fafb] px-3 py-2.5 text-sm text-[#344054] placeholder:text-[#98a2b3] outline-none focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)] resize-none"
        />
      </div>
    </div>
  )
}

// ── Step 4 — Validation & Save ────────────────────────────────────────────────
const EDIT_CHECKS = [
  { type: "pass", text: "Change scope verified — within permitted clause types" },
  { type: "pass", text: "No conflicting clauses identified" },
  { type: "warn", text: "5-year term exceeds GSMA BA.12 standard (3 years). Recommend adding a review clause at year 3." },
  { type: "pass", text: "Counterparty notification will be sent on save" },
]

function Step4({ onReset }: { onReset: () => void }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  if (saved) {
    return (
      <div className="flex flex-col items-center text-center py-6 gap-4">
        <div className="w-14 h-14 rounded-full bg-[#e8f2ce] flex items-center justify-center text-2xl">✓</div>
        <div>
          <p className="text-lg font-semibold text-[#0e2c46]">Change Saved</p>
          <p className="text-sm text-[#667085] mt-1">
            Clause 8.2 updated. Change logged in the audit trail. Counterparty notified.
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate("/chat")}
            className="rounded-lg bg-[#0e2c46] text-white text-sm px-4 py-2 hover:bg-[#185992] transition-colors"
          >
            View contract
          </button>
          <button
            onClick={onReset}
            className="rounded-lg border border-[#d0d5dd] text-[#344054] text-sm px-4 py-2 hover:bg-[#f2f4f7] transition-colors"
          >
            Edit another clause
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[#667085] mb-1">Validation complete. Confirm to save the change.</p>
      {EDIT_CHECKS.map((c, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5",
            c.type === "pass" ? "bg-[#82bc34]" : "bg-amber-400"
          )}>
            {c.type === "pass" ? "✓" : "!"}
          </div>
          <span className={cn("text-sm leading-relaxed", c.type === "warn" && "text-amber-700")}>{c.text}</span>
        </div>
      ))}
      <button
        onClick={() => setSaved(true)}
        className="mt-2 bg-[#0e2c46] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#185992] transition-colors"
      >
        Confirm & Save
      </button>
    </div>
  )
}

// ── Contract Edit Wizard ───────────────────────────────────────────────────────
const STEP_SUBTITLES: Record<number, string> = {
  1: "Select Contract",
  2: "Select Clause",
  3: "Propose Changes",
  4: "Validate & Save",
}

function ContractEditWizard({ step, onNext, onBack }: { step: number; onNext: () => void; onBack: () => void }) {
  function renderStep() {
    switch (step) {
      case 1: return <Step1 />
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
          <h1 className="text-lg font-semibold text-[#0e2c46]">Edit Contract</h1>
        </div>
        <p className="text-sm text-[#667085]">
          Step {step} of 4 — {STEP_SUBTITLES[step]}
        </p>
      </div>

      <Stepper labels={CONTRACT_EDIT_LABELS} step={step} />

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
            {step === 3 ? "Run Validation →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  )
}

// ── View ───────────────────────────────────────────────────────────────────────
export function ContractEditView() {
  const [step, setStep] = useState(1)

  useEffect(() => { document.title = "Edit Contract — NeuString Co-Pilot" }, [])

  return (
    <div className="flex h-full overflow-hidden">
      <ContractEditWizard
        step={step}
        onNext={() => setStep((s) => Math.min(s + 1, 4))}
        onBack={() => setStep((s) => Math.max(s - 1, 1))}
      />
      <WizardSideChat step={step} onStepChange={setStep} config={CONTRACT_EDIT_CONFIG} />
    </div>
  )
}
