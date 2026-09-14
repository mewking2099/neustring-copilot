import { useState } from "react"
import { cn } from "@/lib/utils"
import { Stepper } from "@/components/wizard/Stepper"
import { DEAL_STEP_LABELS } from "@/data/dealConv"
import {
  getRecentPartners,
  getLastDeal,
  getUsualDealType,
  getServiceFrequency,
  getRateSuggestion,
  getSuggestedCurrency,
  getSuggestedTerm,
  getAutoRenewalSuggestion,
} from "@/data/wizardProvenance"
import type { HistoricalDeal } from "@/data/dealHistory"

// ── Types ────────────────────────────────────────────────────────────────────

type RateKey = 'data' | 'voice' | 'sms' | 'iot'

export interface WizardData {
  partner: string | null
  partnerName: string | null
  dealType: string | null
  clonedFromId: string | null
  services: string[]
  rates: Partial<Record<RateKey, string>>
  ratesAccepted: RateKey[]
  userEditedRates: RateKey[]
  periodStart: string
  periodEnd: string
  termMonths: number
  currency: string
  autoRenewal: boolean
}

interface Props {
  step: number
  data: WizardData
  onDataChange: (patch: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
  onComplete: () => void
  onGoToStep: (step: number) => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const DEAL_TYPES = ["Bilateral", "Unilateral", "IOT-only", "MVNO"]

const ALL_SERVICES = [
  { key: "Data",  label: "Data — GPRS / LTE / LTE-M / NB-IoT", rateKey: "data"  as RateKey },
  { key: "Voice", label: "Voice — MTC",                          rateKey: "voice" as RateKey },
  { key: "SMS",   label: "SMS — MO + MT",                        rateKey: "sms"   as RateKey },
  { key: "IoT",   label: "IoT APN",                              rateKey: "iot"   as RateKey },
]

const RATE_UNIT: Record<RateKey, string> = {
  data: "/MB",
  voice: "/min",
  sms: "/msg",
  iot: "/MB",
}

const HIGH_BLAST: RateKey[] = ["data"]


function addMonths(isoDate: string, months: number): string {
  const d = new Date(isoDate)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

function ProvenanceTag({ dealId, date }: { dealId: string; date: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#667085] bg-[#f2f4f7] rounded px-1.5 py-0.5 border border-[#e4e7ec]">
      <svg className="w-2.5 h-2.5 text-[#82bc34]" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 1v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      {dealId} · {date}
    </span>
  )
}

// ── Zone 1 — Partner & Intent ─────────────────────────────────────────────────

function Zone1({
  data,
  onChange,
}: {
  data: WizardData
  onChange: (patch: Partial<WizardData>) => void
}) {
  const [customInput, setCustomInput] = useState("")
  const [customError, setCustomError] = useState("")

  const partners = getRecentPartners()
  const lastDeal: HistoricalDeal | null = data.partner ? getLastDeal(data.partner) : null
  const usualType = data.partner ? getUsualDealType(data.partner) : null

  function selectPartner(tadig: string, name: string) {
    onChange({ partner: tadig, partnerName: name, dealType: null, clonedFromId: null })
  }

  function handleCustomSelect() {
    const tadig = customInput.trim().toUpperCase()
    if (tadig.length < 4 || tadig.length > 6) {
      setCustomError("TADIG codes are 4–6 characters")
      return
    }
    setCustomError("")
    setCustomInput("")
    selectPartner(tadig, tadig)
  }

  function cloneFromLast() {
    if (!lastDeal) return
    const newRates: Partial<Record<RateKey, string>> = {}
    for (const key of ['data', 'voice', 'sms', 'iot'] as RateKey[]) {
      if (lastDeal.rates[key] !== undefined) newRates[key] = String(lastDeal.rates[key])
    }
    onChange({
      services: [...lastDeal.services],
      rates: newRates,
      ratesAccepted: Object.keys(newRates) as RateKey[],
      userEditedRates: [],
      clonedFromId: lastDeal.id,
      dealType: lastDeal.dealType,
    })
  }

  return (
    <div className="space-y-6">
      {/* Partner grid */}
      <div>
        <p className="text-xs font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">
          Recent partners
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {partners.map((p) => {
            const isSelected = data.partner === p.tadig
            return (
              <button
                key={p.tadig}
                type="button"
                onClick={() => selectPartner(p.tadig, p.name)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition-all",
                  isSelected
                    ? "border-[#82bc34] bg-[#f6fbee] ring-1 ring-[#82bc34]"
                    : "border-[#e4e7ec] bg-white hover:border-[#0e2c46] hover:bg-[#f9fafb]"
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-[#0e2c46] leading-tight">{p.name}</p>
                  {isSelected && (
                    <span className="text-[#82bc34] text-xs font-bold ml-1">✓</span>
                  )}
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
      </div>

      {/* Custom TADIG input */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-[#e4e7ec]" />
          <span className="text-[10px] text-[#98a2b3] uppercase tracking-wider shrink-0">or enter TADIG code</span>
          <div className="flex-1 h-px bg-[#e4e7ec]" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => { setCustomInput(e.target.value.toUpperCase()); setCustomError("") }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCustomSelect() } }}
              placeholder="e.g. FRAOR, DETAL"
              maxLength={6}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm text-[#344054] placeholder:text-[#98a2b3] outline-none transition-colors uppercase tracking-wider",
                customError
                  ? "border-red-300 focus:border-red-400"
                  : "border-[#d0d5dd] focus:border-[#0e2c46]",
                data.partner === customInput.trim().toUpperCase() && customInput.length >= 4
                  ? "border-[#82bc34] bg-[#f6fbee]"
                  : ""
              )}
            />
            {customError && <p className="text-[10px] text-red-500 mt-1">{customError}</p>}
          </div>
          <button
            type="button"
            onClick={handleCustomSelect}
            disabled={customInput.trim().length < 4}
            className="rounded-lg bg-[#0e2c46] text-white text-sm px-4 py-2 hover:bg-[#185992] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            Select
          </button>
        </div>
        {data.partner && !partners.some(p => p.tadig === data.partner) && (
          <p className="text-[11px] text-[#667085] mt-2">
            <span className="text-[#82bc34] font-semibold">✓</span> Custom partner <strong className="text-[#344054]">{data.partner}</strong> selected — no deal history available.
          </p>
        )}
      </div>

      {/* Deal type — shown after partner selected */}
      {data.partner && (
        <div>
          <p className="text-xs font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">
            Deal type
          </p>
          {usualType && (
            <p className="text-[11px] text-[#667085] mb-2">
              <span className="text-[#82bc34] font-semibold">↗</span> Usually{" "}
              <strong className="text-[#344054]">{usualType.type}</strong> with{" "}
              {data.partnerName} — {usualType.count}/{usualType.total} deals
            </p>
          )}
          <div role="radiogroup" aria-label="Deal type" className="flex flex-wrap gap-2">
            {DEAL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={data.dealType === t}
                onClick={() => onChange({ dealType: t })}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                  data.dealType === t
                    ? "bg-[#0e2c46] text-white border-[#0e2c46]"
                    : "bg-white text-[#0e2c46] border-[#0e2c46] hover:bg-[#f2f4f7]"
                )}
              >
                {t}
                {usualType?.type === t && (
                  <span className="ml-1.5 text-[9px] font-semibold text-[#82bc34] uppercase tracking-wide">usual</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clone-from-last card */}
      {lastDeal && (
        <div className="rounded-xl border border-dashed border-[#82bc34] bg-[#f6fbee] px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0e2c46]">
                Clone from {lastDeal.id}
              </p>
              <p className="text-[11px] text-[#667085] mt-0.5">
                {lastDeal.services.join(" · ")} · {lastDeal.termMonths}m · {lastDeal.currency}
                {" · "}Data €{lastDeal.rates.data?.toFixed(3)}/MB
                {" — "}{lastDeal.closedAt}
              </p>
            </div>
            <button
              type="button"
              onClick={cloneFromLast}
              className={cn(
                "shrink-0 ml-3 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                data.clonedFromId === lastDeal.id
                  ? "bg-[#82bc34] text-white"
                  : "bg-[#0e2c46] text-white hover:bg-[#185992]"
              )}
            >
              {data.clonedFromId === lastDeal.id ? "✓ Cloned" : "Clone →"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Zone 2 — Services & Rates ─────────────────────────────────────────────────

function Zone2({
  data,
  onChange,
}: {
  data: WizardData
  onChange: (patch: Partial<WizardData>) => void
}) {
  const freq = data.partner ? getServiceFrequency(data.partner) : null

  function toggleService(key: string, rateKey: RateKey) {
    if (data.services.includes(key)) {
      onChange({
        services: data.services.filter((s) => s !== key),
        rates: { ...data.rates, [rateKey]: undefined },
        ratesAccepted: data.ratesAccepted.filter((r) => r !== rateKey),
      })
    } else {
      const suggestion = data.partner ? getRateSuggestion(data.partner, rateKey) : null
      const newRate = suggestion ? String(suggestion.value) : ""
      const newRates = { ...data.rates, [rateKey]: newRate }
      const newAccepted = HIGH_BLAST.includes(rateKey)
        ? data.ratesAccepted
        : [...data.ratesAccepted.filter((r) => r !== rateKey), rateKey]
      onChange({
        services: [...data.services, key],
        rates: newRates,
        ratesAccepted: newAccepted,
      })
    }
  }

  function updateRate(rateKey: RateKey, val: string) {
    onChange({
      rates: { ...data.rates, [rateKey]: val },
      ratesAccepted: data.ratesAccepted.filter((r) => r !== rateKey),
      userEditedRates: [...new Set([...data.userEditedRates, rateKey])],
    })
  }

  function acceptRate(rateKey: RateKey) {
    onChange({ ratesAccepted: [...new Set([...data.ratesAccepted, rateKey])] })
  }

  return (
    <div className="space-y-5">
      {/* Service toggles */}
      <div>
        <p className="text-xs font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">Services</p>
        <div className="space-y-2">
          {ALL_SERVICES.map((s) => {
            const checked = data.services.includes(s.key)
            const f = freq?.[s.key]
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => toggleService(s.key, s.rateKey)}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors text-left",
                  checked ? "border-[#82bc34] bg-[#f6fbee]" : "border-[#e4e7ec] bg-[#f9fafb]"
                )}
              >
                <span className="text-sm text-[#344054]">{s.label}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {f && (
                    <span className="text-[10px] text-[#667085]">
                      {f.count}/{f.total} deals
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium rounded-full px-2 py-0.5",
                      checked ? "bg-[#82bc34] text-white" : "bg-[#e4e7ec] text-[#667085]"
                    )}
                  >
                    {checked ? "✓ On" : "Off"}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Rate inputs */}
      {ALL_SERVICES.filter((s) => data.services.includes(s.key)).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">Rates</p>
          <div className="space-y-3">
            {ALL_SERVICES.filter((s) => data.services.includes(s.key)).map((s) => {
              const suggestion = data.partner ? getRateSuggestion(data.partner, s.rateKey) : null
              const rateVal = data.rates[s.rateKey] ?? ""
              const isHighBlast = HIGH_BLAST.includes(s.rateKey)
              const isAccepted = data.ratesAccepted.includes(s.rateKey)
              const isEdited = data.userEditedRates.includes(s.rateKey)

              return (
                <div
                  key={s.rateKey}
                  className={cn(
                    "rounded-xl border px-4 py-3 transition-colors",
                    isAccepted
                      ? "border-[#82bc34] bg-[#f6fbee]"
                      : isHighBlast
                      ? "border-[#d0d5dd] bg-white"
                      : "border-[#e4e7ec] bg-[#f9fafb]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-[11px] font-semibold text-[#667085] uppercase tracking-wide">
                          {s.key} rate
                        </p>
                        {suggestion && !isEdited && (
                          <ProvenanceTag dealId={suggestion.sourceId} date={suggestion.sourceDate} />
                        )}
                        {isEdited && (
                          <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                            edited
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-[#667085]">€</span>
                        <input
                          type="number"
                          step="0.001"
                          value={rateVal}
                          onChange={(e) => updateRate(s.rateKey, e.target.value)}
                          placeholder="0.000"
                          className="w-24 text-base font-semibold text-[#0e2c46] bg-transparent outline-none border-b border-[#d0d5dd] focus:border-[#0e2c46] pb-0.5"
                        />
                        <span className="text-sm text-[#667085]">{RATE_UNIT[s.rateKey]}</span>
                      </div>
                      {suggestion && (
                        <p className="text-[10px] text-[#98a2b3] mt-1">
                          Last {suggestion.sampleSize}: €{suggestion.min.toFixed(3)}–€{suggestion.max.toFixed(3)} · avg €{suggestion.avg.toFixed(3)}
                        </p>
                      )}
                    </div>

                    {isHighBlast && (
                      <button
                        type="button"
                        onClick={() => acceptRate(s.rateKey)}
                        disabled={isAccepted || !rateVal}
                        className={cn(
                          "shrink-0 self-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors mt-4",
                          isAccepted
                            ? "bg-[#82bc34] text-white cursor-default"
                            : "bg-[#0e2c46] text-white hover:bg-[#185992] disabled:opacity-40 disabled:cursor-not-allowed"
                        )}
                      >
                        {isAccepted ? "✓ Accepted" : "Accept rate"}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Zone 3 — Terms & Compliance ───────────────────────────────────────────────

function Zone3({
  data,
  onChange,
}: {
  data: WizardData
  onChange: (patch: Partial<WizardData>) => void
}) {
  const suggestedTerm = data.partner ? getSuggestedTerm(data.partner) : null
  const suggestedCurrency = data.partner ? getSuggestedCurrency(data.partner) : null
  const suggestedAutoRenewal = data.partner ? getAutoRenewalSuggestion(data.partner) : null

  function handleTermChange(months: number) {
    const end = data.periodStart ? addMonths(data.periodStart, months) : ""
    onChange({ termMonths: months, periodEnd: end })
  }

  function handleStartChange(val: string) {
    const end = val && data.termMonths ? addMonths(val, data.termMonths) : ""
    onChange({ periodStart: val, periodEnd: end })
  }

  return (
    <div className="space-y-4">
      {/* Term */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-xs font-semibold text-[#667085] uppercase tracking-wide">Deal term</p>
          {suggestedTerm && (
            <span className="text-[10px] text-[#667085]">
              <span className="text-[#82bc34]">↗</span>{" "}
              {suggestedTerm.termMonths}m used {suggestedTerm.count}/{suggestedTerm.total} times
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {[12, 24, 36].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleTermChange(m)}
              className={cn(
                "flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors",
                data.termMonths === m
                  ? "border-[#0e2c46] bg-[#0e2c46] text-white"
                  : "border-[#e4e7ec] bg-[#f9fafb] text-[#344054] hover:border-[#0e2c46]"
              )}
            >
              {m}m
              {suggestedTerm?.termMonths === m && (
                <span className="block text-[9px] font-normal mt-0.5 opacity-75">usual</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-3 py-3">
          <p className="text-[10px] text-[#667085] mb-1">Start date</p>
          <input
            type="date"
            value={data.periodStart}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full text-sm font-semibold text-[#0e2c46] bg-transparent outline-none"
          />
        </div>
        <div className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-3 py-3">
          <p className="text-[10px] text-[#667085] mb-1">End date</p>
          <input
            type="date"
            value={data.periodEnd}
            onChange={(e) => onChange({ periodEnd: e.target.value })}
            className="w-full text-sm font-semibold text-[#0e2c46] bg-transparent outline-none"
          />
          {data.termMonths > 0 && data.periodStart && (
            <p className="text-[9px] text-[#98a2b3] mt-0.5">computed from term</p>
          )}
        </div>
      </div>

      {/* Currency */}
      <div className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-3 py-3">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[10px] text-[#667085]">Currency</p>
          {suggestedCurrency && (
            <ProvenanceTag dealId={suggestedCurrency.sourceId} date="" />
          )}
          {suggestedCurrency && (
            <span className="text-[10px] text-[#667085]">
              {suggestedCurrency.count}/{suggestedCurrency.total} deals
            </span>
          )}
        </div>
        <select
          value={data.currency}
          onChange={(e) => onChange({ currency: e.target.value })}
          className="text-sm font-semibold text-[#0e2c46] bg-transparent outline-none cursor-pointer w-full"
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Auto-renewal */}
      <div className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-3 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#667085] mb-0.5">Auto-renewal</p>
          <p className="text-sm font-semibold text-[#0e2c46]">
            {data.autoRenewal ? "Enabled" : "Disabled"}
          </p>
          {suggestedAutoRenewal && (
            <p className="text-[10px] text-[#98a2b3] mt-0.5">
              {suggestedAutoRenewal.count}/{suggestedAutoRenewal.total} past deals enabled
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange({ autoRenewal: !data.autoRenewal })}
          className={cn(
            "relative inline-flex h-[18px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
            data.autoRenewal ? "bg-[#82bc34]" : "bg-[#d0d5dd]"
          )}
          role="switch"
          aria-checked={data.autoRenewal}
        >
          <span
            className={cn(
              "pointer-events-none block h-[14px] w-[14px] rounded-full bg-white shadow transition-transform",
              data.autoRenewal ? "translate-x-[18px]" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Validation hints */}
      {data.termMonths > 0 && data.periodStart && (
        <div className="rounded-lg border border-[#82bc34] bg-[#f6fbee] px-3 py-2.5 flex items-center gap-2">
          <span className="text-[#82bc34] font-bold text-sm">✓</span>
          <p className="text-xs text-[#0e2c46]">
            {data.termMonths}-month term from {data.periodStart} to {data.periodEnd} · {data.currency} billing
            {data.autoRenewal ? " · auto-renews" : ""}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Zone 4 — Review ───────────────────────────────────────────────────────────

function Zone4({
  data,
  onComplete,
  onGoToZone,
}: {
  data: WizardData
  onComplete: () => void
  onGoToZone: (zone: number) => void
}) {
  const confirmedItems: { label: string; value: string; zone: number }[] = []
  const prefillItems:   { label: string; value: string; zone: number }[] = []

  function add(isConfirmed: boolean, label: string, value: string, zone: number) {
    if (isConfirmed) confirmedItems.push({ label, value, zone })
    else             prefillItems.push({ label, value, zone })
  }

  // Zone 1 fields
  if (data.partner) add(true, "Partner", `${data.partnerName} (${data.partner})`, 1)
  if (data.dealType) add(true, "Deal type", data.dealType, 1)
  if (data.clonedFromId) add(true, "Cloned from", data.clonedFromId, 1)

  // Zone 2 fields
  if (data.services.length) add(true, "Services", data.services.join(", "), 2)
  for (const s of ALL_SERVICES.filter((s) => data.services.includes(s.key))) {
    const val = data.rates[s.rateKey]
    if (!val) continue
    const isAccepted = data.ratesAccepted.includes(s.rateKey)
    const isEdited   = data.userEditedRates.includes(s.rateKey)
    add(isAccepted || isEdited, `${s.key} rate`, `€${parseFloat(val).toFixed(3)}${RATE_UNIT[s.rateKey]}`, 2)
  }

  // Zone 3 fields
  const termConfirmed = data.termMonths > 0
  add(termConfirmed, "Term", data.termMonths ? `${data.termMonths} months` : "—", 3)
  add(termConfirmed && !!data.periodStart, "Period", data.periodStart && data.periodEnd ? `${data.periodStart} → ${data.periodEnd}` : "—", 3)
  add(false, "Currency", data.currency, 3)
  add(false, "Auto-renewal", data.autoRenewal ? "Enabled" : "Disabled", 3)

  function ReviewRow({ label, value, zone }: { label: string; value: string; zone: number }) {
    return (
      <button
        type="button"
        onClick={() => onGoToZone(zone)}
        className="w-full py-2 border-b border-[#f2f4f7] last:border-0 text-left group hover:bg-white/60 rounded transition-colors px-1 -mx-1"
      >
        <p className="text-[10px] text-[#98a2b3] uppercase tracking-wide">{label}</p>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm font-medium text-[#0e2c46]">{value}</p>
          <span className="text-[10px] text-[#98a2b3] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
            Zone {zone} ↗
          </span>
        </div>
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Confirmed column */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#82bc34]" />
            <p className="text-[10px] font-semibold text-[#82bc34] uppercase tracking-wider">You confirmed</p>
          </div>
          <div className="rounded-xl border border-[#82bc34] bg-[#f6fbee] px-4 py-1">
            {confirmedItems.length > 0
              ? confirmedItems.map((item) => <ReviewRow key={item.label} {...item} />)
              : <p className="text-xs text-[#98a2b3] py-3">Nothing confirmed yet</p>
            }
          </div>
        </div>

        {/* Pre-filled column */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Pre-filled · not reviewed</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-1">
            {prefillItems.length > 0
              ? prefillItems.map((item) => <ReviewRow key={item.label} {...item} />)
              : <p className="text-xs text-[#82bc34] py-3 font-medium">All fields reviewed ✓</p>
            }
          </div>
          {prefillItems.length > 0 && (
            <p className="text-[10px] text-amber-600 mt-2 leading-relaxed">
              Click any row to jump back and review it.
            </p>
          )}
        </div>
      </div>

      {/* Go to canvas */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onComplete}
          className="flex-1 rounded-xl bg-[#0e2c46] text-white text-sm font-semibold py-3 hover:bg-[#185992] transition-colors"
        >
          Open Deal Canvas →
        </button>
        {prefillItems.length > 0 && (
          <p className="text-[11px] text-amber-600 max-w-[160px] leading-snug">
            {prefillItems.length} field{prefillItems.length > 1 ? "s" : ""} not reviewed — update on the canvas anytime.
          </p>
        )}
      </div>
    </div>
  )
}

// ── DealWizard ────────────────────────────────────────────────────────────────

const ZONE_SUBTITLES: Record<number, string> = {
  1: "Partner & Intent",
  2: "Services & Rates",
  3: "Terms",
  4: "Review",
}

export function DealWizard({ step, data, onDataChange, onNext, onBack, onComplete, onGoToStep }: Props) {
  function canAdvance(): boolean {
    if (step === 1) return !!data.partner && !!data.dealType
    if (step === 2) return data.services.length > 0
    if (step === 3) return !!data.periodStart && !!data.periodEnd && data.termMonths > 0
    return true
  }

  function renderZone() {
    switch (step) {
      case 1: return <Zone1 data={data} onChange={onDataChange} />
      case 2: return <Zone2 data={data} onChange={onDataChange} />
      case 3: return <Zone3 data={data} onChange={onDataChange} />
      case 4: return <Zone4 data={data} onComplete={onComplete} onGoToZone={onGoToStep} />
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
            #Draft
          </span>
          {data.clonedFromId && (
            <span className="text-xs font-medium bg-[#e8f2ce] text-[#4a7010] rounded-full px-2.5 py-0.5">
              Cloned from {data.clonedFromId}
            </span>
          )}
        </div>
        <p className="text-sm text-[#667085]">
          Zone {step} of 4 — {ZONE_SUBTITLES[step]}
        </p>
      </div>

      {/* Progress stepper */}
      <Stepper labels={DEAL_STEP_LABELS} step={step} />

      {/* Zone card */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.06)] mb-6 overflow-hidden">
        {renderZone()}
      </div>

      {/* Nav buttons (hidden on zone 4 — CTA is inside the zone) */}
      {step < 4 && (
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="border border-[#d0d5dd] bg-white text-[#344054] rounded-lg px-4 py-2 text-sm hover:bg-[#f2f4f7] transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance()}
            className="bg-[#0e2c46] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#185992] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 3 ? "Review →" : "Next →"}
          </button>
          {step === 1 && !canAdvance() && (
            <p className="text-xs text-[#98a2b3]">Select a partner and deal type to continue</p>
          )}
        </div>
      )}
    </div>
  )
}
