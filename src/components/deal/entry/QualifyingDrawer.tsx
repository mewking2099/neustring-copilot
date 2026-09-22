import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react"
import { useAppStore } from "@/store/app"
import { useDealStore } from "@/store/deal"
import { cn } from "@/lib/utils"
import {
  getRecentPartners,
  getServiceFrequency,
  getUsualDealType,
  getSuggestedTerm,
  getSuggestedCurrency,
  getAutoRenewalSuggestion,
} from "@/data/wizardProvenance"
import { buildCardsFromQualifying } from "@/domain/deal/cardMapper"
import type { DealShell, ServiceType } from "@/domain/deal/types"
import type { ServiceName, QualifyingResult } from "@/domain/deal/qualifyingTypes"

type Intent = "new" | "renewal" | "amendment"
type Skeleton = "conventional" | "iot"

const INTENT_OPTIONS: { id: Intent; label: string; desc: string }[] = [
  { id: "new",       label: "New deal",   desc: "No prior agreement" },
  { id: "renewal",   label: "Renewal",    desc: "Extending existing" },
  { id: "amendment", label: "Amendment",  desc: "Changing active deal" },
]

const ALL_SERVICES = ["Data", "Voice", "SMS", "IoT"] as const

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function addMonths(isoDate: string, months: number): string {
  const d = new Date(isoDate)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

interface AIDraft {
  services: string[]
  term: number
  currency: string
  autoRenewal: boolean
  dealType: string
  servicesConfidence: "high" | "low"
  termConfidence: "high" | "low"
}

function buildAIDraft(tadig: string, skeleton: Skeleton): AIDraft {
  const freq = getServiceFrequency(tadig)
  const termSugg = getSuggestedTerm(tadig)
  const currSugg = getSuggestedCurrency(tadig)
  const renewalSugg = getAutoRenewalSuggestion(tadig)
  const usualType = getUsualDealType(tadig)

  let services: string[]
  let servicesConfidence: "high" | "low"

  if (skeleton === "iot") {
    services = ["IoT"]
    servicesConfidence = "high"
  } else {
    const hasDealHistory = Object.values(freq).some((f) => f.total > 0)
    services = hasDealHistory
      ? (["Data", "Voice", "SMS"] as const).filter((svc) => {
          const f = freq[svc]
          return !f || f.count / f.total >= 0.5
        })
      : ["Data", "Voice"]
    servicesConfidence = hasDealHistory ? "high" : "low"
  }

  const term = termSugg?.termMonths ?? 12
  const currency = currSugg?.currency ?? "EUR"
  const autoRenewal = renewalSugg?.value ?? false
  const dealType = usualType?.type ?? (skeleton === "iot" ? "IOT-only" : "Bilateral")
  const termConfidence = termSugg && termSugg.count / termSugg.total >= 0.6 ? "high" : "low"

  return { services, term, currency, autoRenewal, dealType, servicesConfidence, termConfidence }
}

const STEP_TITLES = ["Who & why?", "Iris draft — confirm or adjust"]

export function QualifyingDrawer() {
  const navigate = useNavigate()
  const { qualifyingDrawerOpen, setQualifyingDrawerOpen } = useAppStore()

  const [step, setStep] = useState(0)

  // Step 1 state
  const [partners, setPartners] = useState<string[]>([])
  const [partnerName, setPartnerName] = useState<string | null>(null)
  const [intent, setIntent] = useState<Intent | null>(null)
  const [skeleton, setSkeleton] = useState<Skeleton>("conventional")
  const [customInput, setCustomInput] = useState("")
  const [customError, setCustomError] = useState("")

  // Step 2 — AI draft state (editable)
  const [draftServices, setDraftServices] = useState<string[]>([])
  const [draftTerm, setDraftTerm] = useState(12)
  const [draftCurrency, setDraftCurrency] = useState("EUR")
  const [draftAutoRenewal, setDraftAutoRenewal] = useState(false)
  const [draftDealType, setDraftDealType] = useState<string | null>(null)
  const [servicesConfidence, setServicesConfidence] = useState<"high" | "low">("high")
  const [termConfidence, setTermConfidence] = useState<"high" | "low">("high")

  const allPartners = getRecentPartners()
  const primaryPartner = partners[0] ?? null

  function close() {
    setQualifyingDrawerOpen(false)
    setTimeout(() => {
      setStep(0)
      setPartners([])
      setPartnerName(null)
      setIntent(null)
      setSkeleton("conventional")
      setCustomInput("")
      setCustomError("")
    }, 300)
  }

  function togglePartner(tadig: string, name: string) {
    const already = partners.includes(tadig)
    if (already) {
      const next = partners.filter((p) => p !== tadig)
      setPartners(next)
      if (partners[0] === tadig) {
        const nextPrimary = next[0]
        setPartnerName(nextPrimary ? (allPartners.find((p) => p.tadig === nextPrimary)?.name ?? nextPrimary) : null)
      }
    } else {
      setPartners((prev) => [...prev, tadig])
      if (partners.length === 0) setPartnerName(name)
    }
  }

  function handleCustomAdd() {
    const tadig = customInput.trim().toUpperCase()
    if (tadig.length < 4 || tadig.length > 6) {
      setCustomError("TADIG codes are 4–6 characters")
      return
    }
    setCustomError("")
    setCustomInput("")
    if (!partners.includes(tadig)) {
      setPartners((prev) => [...prev, tadig])
      if (partners.length === 0) setPartnerName(tadig)
    }
  }

  function advanceToStep2() {
    if (!primaryPartner || !intent) return
    const draft = buildAIDraft(primaryPartner, skeleton)
    setDraftServices(draft.services)
    setDraftTerm(draft.term)
    setDraftCurrency(draft.currency)
    setDraftAutoRenewal(draft.autoRenewal)
    setDraftDealType(draft.dealType)
    setServicesConfidence(draft.servicesConfidence)
    setTermConfidence(draft.termConfidence)
    setStep(1)
  }

  const SERVICE_TYPE_MAP: Record<string, ServiceType[]> = {
    Data:  ["gprs", "lte_m", "nb_iot", "5g"],
    Voice: ["voice_mo", "voice_mt"],
    SMS:   ["sms"],
    IoT:   ["nb_iot"],
  }

  function handleOpenCanvas() {
    const start = todayISO()
    const end = draftTerm ? addMonths(start, draftTerm) : ""
    const id = "deal-" + Math.random().toString(36).slice(2, 8)

    const serviceTypes = [
      ...new Set(draftServices.flatMap((s) => SERVICE_TYPE_MAP[s] ?? [])),
    ] as ServiceType[]

    const shell: DealShell = {
      id,
      name: `${draftDealType ?? "Bilateral"} — ${
        partners.length > 1 ? partners.join(" · ") : (partnerName ?? partners[0] ?? "TBD")
      }`,
      status: "draft",
      roamingChannel: "traditional",
      myNetworks: ["GBSM"],
      roamingPartners: partners,
      alliance: null,
      serviceTypes,
      period: { start, end },
      autoRenewal: draftAutoRenewal,
      autoRenewalNoticeDays: draftAutoRenewal ? 30 : null,
      budgetInclusion: false,
      accessLevel: "private",
      negotiator: "",
      currency: draftCurrency,
      excludeTax: true,
      groupStatement: false,
    }

    const qualifyingResult: QualifyingResult = {
      services: draftServices as ServiceName[],
      directions: Object.fromEntries(
        draftServices.map((s) => [s, "both" as const])
      ) as Partial<Record<ServiceName, "inbound" | "outbound" | "both">>,
      discountModel: skeleton === "iot" ? "iot-flat" : "threshold",
      entityScope: "group",
      statementCount: draftServices.length * 2,
    }

    useDealStore.getState().initShell(shell, "qualifying_intake")
    useDealStore.getState().seedCards(buildCardsFromQualifying(qualifyingResult))

    close()
    navigate("/deal/" + id)
  }

  const customTadigs = partners.filter((t) => !allPartners.some((p) => p.tadig === t))
  const canStep1Advance = partners.length > 0 && intent !== null

  return (
    <AnimatePresence>
      {qualifyingDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh]"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#e4e7ec]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-2 pb-4 border-b border-[#f2f4f7]">
              <div>
                <p className="text-xs text-[#82bc34] font-semibold uppercase tracking-wide">
                  Step {step + 1} of 2
                </p>
                <h2 className="text-base font-semibold text-[#0e2c46] mt-0.5">
                  {STEP_TITLES[step]}
                </h2>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f2f4f7] transition-colors"
              >
                <X className="w-4 h-4 text-[#667085]" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-[#f2f4f7]">
              <div
                className="h-full bg-[#82bc34] transition-all duration-300"
                style={{ width: `${((step + 1) / 2) * 100}%` }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                >

                  {/* ── Step 1: Who & Why ── */}
                  {step === 0 && (
                    <div className="space-y-6">

                      {/* Partner grid */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-[#98a2b3] uppercase tracking-wider">
                            Select partner(s)
                          </p>
                          {partners.length > 1 && (
                            <p className="text-[11px] text-[#82bc34] font-semibold">
                              {partners.length} selected
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {allPartners.map((p) => {
                            const selected = partners.includes(p.tadig)
                            return (
                              <button
                                key={p.tadig}
                                type="button"
                                onClick={() => togglePartner(p.tadig, p.name)}
                                className={cn(
                                  "rounded-xl border px-4 py-3 text-left transition-all",
                                  selected
                                    ? "border-[#82bc34] bg-[#f6fbee] ring-1 ring-[#82bc34]"
                                    : "border-[#e4e7ec] bg-white hover:border-[#0e2c46] hover:bg-[#f9fafb]"
                                )}
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <p className="text-sm font-semibold text-[#0e2c46] leading-tight">{p.name}</p>
                                  {selected && <span className="text-[#82bc34] font-bold ml-1">✓</span>}
                                </div>
                                <p className="text-[10px] text-[#667085] mb-1.5">{p.tadig}</p>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-semibold text-white bg-[#0e2c46] rounded-full px-2 py-0.5">
                                    {p.dealCount} deal{p.dealCount !== 1 ? "s" : ""}
                                  </span>
                                  <span className="text-[10px] text-[#98a2b3]">Last: {p.lastDealDate}</span>
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {/* TADIG input */}
                        <div className="mt-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 h-px bg-[#e4e7ec]" />
                            <span className="text-[10px] text-[#98a2b3] uppercase tracking-wider shrink-0">
                              or enter TADIG
                            </span>
                            <div className="flex-1 h-px bg-[#e4e7ec]" />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customInput}
                              onChange={(e) => { setCustomInput(e.target.value.toUpperCase()); setCustomError("") }}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCustomAdd() } }}
                              placeholder="e.g. FRAOR, DETAL"
                              maxLength={6}
                              className={cn(
                                "flex-1 rounded-lg border px-3 py-2 text-sm text-[#344054] placeholder:text-[#98a2b3] outline-none transition-colors uppercase tracking-wider",
                                customError ? "border-red-300" : "border-[#d0d5dd] focus:border-[#0e2c46]"
                              )}
                            />
                            <button
                              type="button"
                              onClick={handleCustomAdd}
                              disabled={customInput.trim().length < 4}
                              className="rounded-lg bg-[#0e2c46] text-white text-sm px-4 py-2 hover:bg-[#185992] transition-colors disabled:opacity-40 shrink-0"
                            >
                              Add
                            </button>
                          </div>
                          {customError && <p className="text-[10px] text-red-500 mt-1">{customError}</p>}
                          {customTadigs.length > 0 && (
                            <p className="text-[11px] text-[#667085] mt-2">
                              <span className="text-[#82bc34] font-semibold">✓</span>{" "}
                              Custom: <strong className="text-[#344054]">{customTadigs.join(", ")}</strong> — no history.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Intent */}
                      <div>
                        <p className="text-xs font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">
                          What kind of deal?
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {INTENT_OPTIONS.map(({ id, label, desc }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setIntent(id)}
                              className={cn(
                                "flex flex-col gap-1 rounded-xl border-2 p-3 text-left transition-all",
                                intent === id
                                  ? "border-[#0e2c46] bg-[#0e2c46]"
                                  : "border-[#e4e7ec] bg-white hover:border-[#0e2c46]/30"
                              )}
                            >
                              <p className={cn("text-sm font-semibold", intent === id ? "text-white" : "text-[#182230]")}>
                                {label}
                              </p>
                              <p className={cn("text-[10px]", intent === id ? "text-white/60" : "text-[#98a2b3]")}>
                                {desc}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* IoT toggle */}
                      <div className="flex items-center justify-between rounded-xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0e2c46]">IoT deal</p>
                          <p className="text-[10px] text-[#98a2b3] mt-0.5">
                            Different rate structure from conventional roaming
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSkeleton((s) => s === "iot" ? "conventional" : "iot")}
                          className={cn(
                            "relative inline-flex h-[18px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                            skeleton === "iot" ? "bg-[#82bc34]" : "bg-[#d0d5dd]"
                          )}
                          role="switch"
                          aria-checked={skeleton === "iot"}
                        >
                          <span className={cn(
                            "pointer-events-none block h-[14px] w-[14px] rounded-full bg-white shadow transition-transform",
                            skeleton === "iot" ? "translate-x-[18px]" : "translate-x-0"
                          )} />
                        </button>
                      </div>

                    </div>
                  )}

                  {/* ── Step 2: AI Draft ── */}
                  {step === 1 && (
                    <div className="space-y-5">

                      {/* Iris banner */}
                      <div className="flex items-center gap-2.5 rounded-xl bg-[#f6fbee] border border-[#82bc34]/40 px-4 py-3">
                        <Sparkles className="w-4 h-4 text-[#82bc34] shrink-0" />
                        <p className="text-[12px] text-[#344054] leading-snug">
                          Based on your history with{" "}
                          <strong>{partnerName ?? partners[0]}</strong>
                          {partners.length > 1 ? ` +${partners.length - 1} more` : ""}.
                          Adjust anything, then open the canvas.
                        </p>
                      </div>

                      {/* Services */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-[#98a2b3] uppercase tracking-wider">
                            Services
                          </p>
                          <span className={cn(
                            "text-[9px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5",
                            servicesConfidence === "high"
                              ? "text-[#667085] bg-[#f2f4f7]"
                              : "text-amber-700 bg-amber-50 border border-amber-200"
                          )}>
                            {servicesConfidence === "high" ? "from history" : "low confidence — verify"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ALL_SERVICES.map((svc) => {
                            const on = draftServices.includes(svc)
                            return (
                              <button
                                key={svc}
                                type="button"
                                onClick={() =>
                                  setDraftServices((s) =>
                                    on ? s.filter((x) => x !== svc) : [...s, svc]
                                  )
                                }
                                className={cn(
                                  "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                                  on
                                    ? "border-[#82bc34] bg-[#f6fbee] text-[#0e2c46]"
                                    : "border-[#e4e7ec] bg-white text-[#98a2b3] hover:border-[#d0d5dd]"
                                )}
                              >
                                {on && <Check className="w-3.5 h-3.5 text-[#82bc34]" />}
                                {svc}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Term */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-[#98a2b3] uppercase tracking-wider">
                            Term
                          </p>
                          {termConfidence === "low" && (
                            <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 uppercase tracking-wide rounded px-1.5 py-0.5">
                              mixed history
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {[12, 24, 36].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setDraftTerm(m)}
                              className={cn(
                                "flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors",
                                draftTerm === m
                                  ? "border-[#0e2c46] bg-[#0e2c46] text-white"
                                  : "border-[#e4e7ec] bg-[#f9fafb] text-[#344054] hover:border-[#0e2c46]"
                              )}
                            >
                              {m}m
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Currency + Auto-renewal */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3">
                          <p className="text-[10px] text-[#667085] mb-1">Currency</p>
                          <select
                            value={draftCurrency}
                            onChange={(e) => setDraftCurrency(e.target.value)}
                            className="text-sm font-semibold text-[#0e2c46] bg-transparent outline-none cursor-pointer w-full"
                          >
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                        <div className="rounded-xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-[#667085] mb-0.5">Auto-renewal</p>
                            <p className="text-sm font-semibold text-[#0e2c46]">
                              {draftAutoRenewal ? "On" : "Off"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDraftAutoRenewal((v) => !v)}
                            className={cn(
                              "relative inline-flex h-[18px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                              draftAutoRenewal ? "bg-[#82bc34]" : "bg-[#d0d5dd]"
                            )}
                            role="switch"
                            aria-checked={draftAutoRenewal}
                          >
                            <span className={cn(
                              "pointer-events-none block h-[14px] w-[14px] rounded-full bg-white shadow transition-transform",
                              draftAutoRenewal ? "translate-x-[18px]" : "translate-x-0"
                            )} />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#98a2b3] text-center leading-relaxed">
                        Rates, directions, and entity scope are set on the canvas — pre-filled from your deal history.
                      </p>

                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-[#f2f4f7] px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                {step === 1 && (
                  <p className="text-xs text-[#667085] truncate">
                    <span className="font-semibold text-[#0e2c46]">
                      {partners.length > 1 ? `${partners.length} partners` : (partnerName ?? partners[0])}
                    </span>
                    {draftServices.length > 0 && ` · ${draftServices.join(", ")} · ${draftTerm}m · ${draftCurrency}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {step > 0 && (
                  <button
                    onClick={() => setStep(0)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-[#d0d5dd] text-sm font-medium text-[#344054] hover:bg-[#f2f4f7] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                {step === 0 ? (
                  <button
                    onClick={advanceToStep2}
                    disabled={!canStep1Advance}
                    className="flex items-center gap-1 px-5 py-2 rounded-lg bg-[#0e2c46] text-white text-sm font-semibold hover:bg-[#0a2038] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleOpenCanvas}
                    disabled={draftServices.length === 0}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#82bc34] text-white text-sm font-semibold hover:bg-[#6fa02c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Open canvas
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
