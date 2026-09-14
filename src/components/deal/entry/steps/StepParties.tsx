import { useState, type KeyboardEvent } from "react"
import type { RoamingChannel, AccessLevel } from "@/domain/deal/types"
import { ROAMING_CHANNEL_LABELS } from "@/domain/deal/discountFamilies"
import { getRecentPartners } from "@/data/wizardProvenance"
import type { PartnerSummary } from "@/data/wizardProvenance"

export interface PartiesDraft {
  myNetworks: string[]
  roamingChannel: RoamingChannel
  partnerMode: "partner" | "alliance"
  roamingPartners: string[]
  alliance: string
  accessLevel: AccessLevel
  negotiator: string
}

export function defaultPartiesDraft(): PartiesDraft {
  return {
    myNetworks: ["GBSM"],
    roamingChannel: "traditional",
    partnerMode: "partner",
    roamingPartners: [],
    alliance: "",
    accessLevel: "private",
    negotiator: "",
  }
}

const ACCESS_DESCRIPTIONS: Record<AccessLevel, string> = {
  private: "Visible only to you",
  company: "Visible to your affiliates",
  group: "Visible to all group members",
}

const RECENT_PARTNERS: PartnerSummary[] = getRecentPartners()

interface Props {
  draft: PartiesDraft
  onChange: (patch: Partial<PartiesDraft>) => void
}

function ChipInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[]
  onChange: (v: string[]) => void
  placeholder: string
}) {
  const [inputVal, setInputVal] = useState("")

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault()
      const code = inputVal.trim().toUpperCase()
      if (!values.includes(code)) {
        onChange([...values, code])
      }
      setInputVal("")
    } else if (e.key === "Backspace" && !inputVal && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  function removeChip(chip: string) {
    onChange(values.filter((v) => v !== chip))
  }

  return (
    <div className="flex flex-wrap gap-1.5 min-h-[40px] w-full border border-[#d0d5dd] rounded-lg px-3 py-2 focus-within:border-[#0e2c46] focus-within:ring-2 focus-within:ring-[rgba(14,44,70,0.1)] bg-white">
      {values.map((chip) => (
        <span
          key={chip}
          className="inline-flex items-center gap-1 bg-[#0e2c46] text-white text-xs font-medium px-2 py-0.5 rounded-full"
        >
          {chip}
          <button
            type="button"
            onClick={() => removeChip(chip)}
            className="ml-0.5 text-white/70 hover:text-white leading-none"
            aria-label={`Remove ${chip}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[80px] text-sm outline-none bg-transparent text-[#344054] placeholder:text-[#98a2b3]"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={values.length === 0 ? placeholder : ""}
      />
    </div>
  )
}

function SingleChipInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[]
  onChange: (v: string[]) => void
  placeholder: string
}) {
  const [inputVal, setInputVal] = useState("")

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault()
      const code = inputVal.trim().toUpperCase()
      onChange([code])
      setInputVal("")
    }
  }

  function clearChip() {
    onChange([])
  }

  return (
    <div className="flex flex-wrap gap-1.5 min-h-[40px] w-full border border-[#d0d5dd] rounded-lg px-3 py-2 focus-within:border-[#0e2c46] focus-within:ring-2 focus-within:ring-[rgba(14,44,70,0.1)] bg-white">
      {value.length > 0 ? (
        <span className="inline-flex items-center gap-1 bg-[#0e2c46] text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {value[0]}
          <button
            type="button"
            onClick={clearChip}
            className="ml-0.5 text-white/70 hover:text-white leading-none"
            aria-label="Remove"
          >
            ×
          </button>
        </span>
      ) : (
        <input
          className="flex-1 min-w-[80px] text-sm outline-none bg-transparent text-[#344054] placeholder:text-[#98a2b3]"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

export function StepParties({ draft, onChange }: Props) {
  const channels = Object.entries(ROAMING_CHANNEL_LABELS) as [RoamingChannel, string][]
  const accessLevels: AccessLevel[] = ["private", "company", "group"]

  return (
    <div className="flex flex-col gap-5">
      {/* My Networks */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#344054]">My Networks</label>
        <ChipInput
          values={draft.myNetworks}
          onChange={(v) => onChange({ myNetworks: v })}
          placeholder="Type TADIG code + Enter (e.g. ARAX1)"
        />
        <p className="text-xs text-[#667085]">Press Enter or comma after each TADIG code</p>
      </div>

      {/* Roaming Channel */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#344054]">Roaming Channel</label>
        <div className="flex gap-2 flex-wrap">
          {channels.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ roamingChannel: key })}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                draft.roamingChannel === key
                  ? "bg-[#0e2c46] text-white border-[#0e2c46]"
                  : "border-[#0e2c46] text-[#0e2c46] hover:bg-[#0e2c46]/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Partner / Alliance toggle */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-4 mb-1">
          <label className="text-sm font-medium text-[#344054]">Counterpart</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-1.5 text-sm text-[#344054] cursor-pointer">
              <input
                type="radio"
                name="partnerMode"
                value="partner"
                checked={draft.partnerMode === "partner"}
                onChange={() => onChange({ partnerMode: "partner" })}
                className="accent-[#0e2c46]"
              />
              Partner
            </label>
            <label className="flex items-center gap-1.5 text-sm text-[#344054] cursor-pointer">
              <input
                type="radio"
                name="partnerMode"
                value="alliance"
                checked={draft.partnerMode === "alliance"}
                onChange={() => onChange({ partnerMode: "alliance" })}
                className="accent-[#0e2c46]"
              />
              Alliance
            </label>
          </div>
        </div>

        {draft.partnerMode === "partner" ? (
          <div className="flex flex-col gap-2">
            {/* Recent partner suggestions */}
            {RECENT_PARTNERS.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {RECENT_PARTNERS.map((p) => {
                  const selected = draft.roamingPartners[0] === p.tadig
                  return (
                    <button
                      key={p.tadig}
                      type="button"
                      onClick={() => onChange({ roamingPartners: selected ? [] : [p.tadig] })}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                        selected
                          ? "bg-[#0e2c46] text-white border-[#0e2c46]"
                          : "bg-white border-[#d0d5dd] text-[#344054] hover:border-[#0e2c46] hover:text-[#0e2c46]"
                      }`}
                    >
                      <span className="font-semibold">{p.tadig}</span>
                      <span className={selected ? "text-white/70" : "text-[#98a2b3]"}>
                        {p.name} · {p.dealCount} deal{p.dealCount !== 1 ? "s" : ""}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
            <SingleChipInput
              value={draft.roamingPartners}
              onChange={(v) => onChange({ roamingPartners: v })}
              placeholder="Or type a TADIG code + Enter (e.g. GRAX1)"
            />
          </div>
        ) : (
          <input
            className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-sm text-[#344054] focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)] outline-none"
            value={draft.alliance}
            onChange={(e) => onChange({ alliance: e.target.value })}
            placeholder="Alliance name (e.g. GSMA Alliance)"
          />
        )}
      </div>

      {/* Access Level */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#344054]">Access Level</label>
        <div className="flex gap-2">
          {accessLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ accessLevel: level })}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${
                draft.accessLevel === level
                  ? "bg-[#0e2c46] text-white border-[#0e2c46]"
                  : "border-[#0e2c46] text-[#0e2c46] hover:bg-[#0e2c46]/5"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#667085]">{ACCESS_DESCRIPTIONS[draft.accessLevel]}</p>
      </div>

      {/* Negotiator */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#344054]">Negotiator</label>
        <input
          className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-sm text-[#344054] focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)] outline-none"
          value={draft.negotiator}
          onChange={(e) => onChange({ negotiator: e.target.value })}
          placeholder="Christophe.Demars"
        />
      </div>
    </div>
  )
}
