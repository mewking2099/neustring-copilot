import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DEAL_STEP_LABELS } from "@/data/dealConv"
import { Stepper } from "@/components/wizard/Stepper"

interface Props {
  step: number
  onNext: () => void
  onBack: () => void
}

// ── Step 1 — Deal Intent ────────────────────────────────────────────────────
const DEAL_TYPES = ["Bilateral", "Unilateral", "IOT-only", "MVNO"]

function Step1() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#667085]">What type of roaming arrangement are you creating?</p>
      <div role="radiogroup" aria-label="Deal type" className="flex flex-wrap gap-2">
        {DEAL_TYPES.map((t) => (
          <button
            key={t}
            role="radio"
            aria-checked={selected === t}
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
      <div aria-live="polite" aria-atomic="true">
        {selected && (
          <div className="bg-[#e8f2ce] rounded-lg px-3 py-2 text-sm text-[#0e2c46]">
            ✓ Deal type set to <strong>{selected}</strong>. Continue to select network partners.
          </div>
        )}
      </div>
    </div>
  )
}

// ── Step 2 — Select Networks ────────────────────────────────────────────────
const DEFAULT_TAGS = ["BFACT — Fascel (BF)", "BWAVC — Mascom (BW)", "CMTC — MTN CM", "GHGLO — Glo Ghana"]

function Step2() {
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS)
  const [input, setInput] = useState("")

  function addTag() {
    const t = input.trim()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setInput("")
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#667085]">Add TADIG codes for each network partner.</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-[#e8f2ce] text-[#0e2c46] rounded-full px-3 py-1 text-xs font-medium"
          >
            {tag}
            <button onClick={() => setTags((prev) => prev.filter((t) => t !== tag))} className="hover:text-red-600 transition-colors">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
          placeholder="Type TADIG code + Enter"
          className="flex-1 rounded-lg border border-[#d0d5dd] px-3 py-2 text-sm text-[#344054] placeholder:text-[#98a2b3] outline-none focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)]"
        />
        <button onClick={addTag} className="rounded-lg bg-[#0e2c46] text-white text-sm px-3 py-2 hover:bg-[#185992] transition-colors">Add</button>
      </div>
      {tags.length > 0 && (
        <div className="bg-[#e8f2ce] rounded-lg px-3 py-2 text-sm text-[#0e2c46]">
          ✓ {tags.length} network{tags.length > 1 ? "s" : ""} selected and GSMA-verified.
        </div>
      )}
    </div>
  )
}

// ── Step 3 — Services ───────────────────────────────────────────────────────
const SERVICES = [
  { name: "Data — GPRS / LTE / LTE-M / NB-IoT", status: "Included" },
  { name: "Voice — MTC",                         status: "Included" },
  { name: "SMS — MO + MT",                       status: "Included" },
  { name: "IoT APN",                             status: "Pending" },
]

function Step3() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-[#667085] mb-3">Confirm which services this deal covers.</p>
      {SERVICES.map((s) => (
        <div
          key={s.name}
          className="flex items-center justify-between rounded-lg border border-[#e4e7ec] bg-[#f2f4f7] px-3 py-2.5"
        >
          <span className="text-sm text-[#344054]">{s.name}</span>
          <span
            className={cn(
              "text-xs font-medium rounded-full px-2 py-0.5",
              s.status === "Included" ? "bg-[#82bc34] text-white" : "bg-amber-400 text-white"
            )}
          >
            {s.status === "Included" ? "✓ " : "⚠ "}{s.status}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Step 4 — Rate Configuration ─────────────────────────────────────────────
const RATES = [
  { service: "Data GPRS IOT",  rate: "0.85",  warn: false },
  { service: "Data LTE IOT",   rate: "0.72",  warn: false },
  { service: "Data NB-IoT",    rate: "0.45",  warn: true  },
  { service: "Voice MTC",      rate: "0.028", warn: false },
  { service: "SMS MO",         rate: "0.006", warn: false },
  { service: "SMS MT",         rate: "0.004", warn: false },
]

function Step4() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#667085] mb-1">Review and confirm rates for each service tier.</p>
      <div className="grid grid-cols-2 gap-2">
        {RATES.map((r) => (
          <div
            key={r.service}
            className={cn(
              "rounded-lg border px-3 py-3",
              r.warn ? "border-amber-300 bg-amber-50" : "border-[#e4e7ec] bg-[#f9fafb]"
            )}
          >
            <p className="text-[10px] text-[#667085] mb-0.5">{r.service}</p>
            <p className={cn("text-base font-semibold", r.warn ? "text-amber-700" : "text-[#0e2c46]")}>
              {r.rate}
            </p>
            {r.warn && <p role="alert" className="text-[10px] text-amber-600 mt-0.5">⚠ Below GSMA floor</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 5 — Deal Terms ─────────────────────────────────────────────────────
const TERMS = [
  { label: "Start Date",   value: "01 Jun 2025" },
  { label: "End Date",     value: "31 May 2027" },
  { label: "Billing",      value: "Monthly · EUR" },
  { label: "Auto-renew",   value: "Enabled" },
  { label: "Penalty",      value: "5% of annual value" },
  { label: "Dispute SLA",  value: "30 days" },
]

function Step5() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#667085] mb-1">Confirm deal terms before validation.</p>
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

// ── Step 6 — Validation ─────────────────────────────────────────────────────
const CHECKS = [
  { type: "pass", text: "TADIG codes verified — all GSMA-registered" },
  { type: "pass", text: "IOT rates within allowed limits" },
  { type: "pass", text: "All partners have active agreements" },
  { type: "warn", text: "Asymmetric commitment — inbound 40% higher than outbound. Review?" },
  { type: "warn", text: "NB-IoT rate below GSMA floor (0.45 < 0.50). Proceed?" },
]

function Step6() {
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

// ── Step 7 — Success ─────────────────────────────────────────────────────────
function Step7({ onReset }: { onReset: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center text-center py-6 gap-4">
      <div className="w-14 h-14 rounded-full bg-[#e8f2ce] flex items-center justify-center text-2xl">
        ✓
      </div>
      <div>
        <p className="text-lg font-semibold text-[#0e2c46]">Deal Submitted</p>
        <p className="text-sm text-[#667085] mt-1">Deal #29107 routed to J. Mercier for approval.</p>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => navigate("/chat")}
          className="rounded-lg bg-[#0e2c46] text-white text-sm px-4 py-2 hover:bg-[#185992] transition-colors"
        >
          View deal #29107
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

// ── DealWizard ───────────────────────────────────────────────────────────────
const STEP_SUBTITLES: Record<number, string> = {
  1: "Intent",
  2: "Select Networks",
  3: "Services",
  4: "Rate Configuration",
  5: "Deal Terms",
  6: "Validation",
  7: "Submitted",
}

export function DealWizard({ step, onNext, onBack }: Props) {
  function renderStep() {
    switch (step) {
      case 1: return <Step1 />
      case 2: return <Step2 />
      case 3: return <Step3 />
      case 4: return <Step4 />
      case 5: return <Step5 />
      case 6: return <Step6 />
      case 7: return <Step7 onReset={onBack} />
      default: return null
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 min-w-0">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-lg font-semibold text-[#0e2c46]">Create Roaming Deal</h1>
          <span className="text-xs font-medium bg-[#f2f4f7] text-[#344054] rounded-full px-2.5 py-0.5">
            #Draft-29101
          </span>
        </div>
        <p className="text-sm text-[#667085]">
          Step {step} of 7 — {STEP_SUBTITLES[step]}
        </p>
      </div>

      {/* Progress stepper */}
      <Stepper labels={DEAL_STEP_LABELS} step={step} />

      {/* Step card */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.06)] mb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav buttons (hidden on step 7) */}
      {step < 7 && (
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
            {step === 6 ? "Submit →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  )
}
