export interface SettingsDraft {
  budgetInclusion: boolean
  excludeTax: boolean
  currency: string
  groupStatement: boolean
}

export function defaultSettingsDraft(): SettingsDraft {
  return {
    budgetInclusion: false,
    excludeTax: true,
    currency: "EUR",
    groupStatement: false,
  }
}

interface Props {
  draft: SettingsDraft
  onChange: (patch: Partial<SettingsDraft>) => void
}

const CURRENCIES = ["EUR", "USD", "GBP", "XDR"]

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-[#82bc34]" : "bg-[#d0d5dd]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

export function StepSettings({ draft, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Budget inclusion */}
      <div className="flex items-center justify-between gap-4 py-1">
        <div>
          <p className="text-sm font-medium text-[#344054]">Include in budget scenarios</p>
          <p className="text-xs text-[#667085]">
            The deal's IOT rates will override fallback rates in budget calculations.
          </p>
        </div>
        <Toggle
          checked={draft.budgetInclusion}
          onChange={() => onChange({ budgetInclusion: !draft.budgetInclusion })}
        />
      </div>

      <div className="border-t border-[#e4e7ec]" />

      {/* Tax */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#344054]">Tax</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[#344054] cursor-pointer">
            <input
              type="radio"
              name="tax"
              value="exclude"
              checked={draft.excludeTax}
              onChange={() => onChange({ excludeTax: true })}
              className="accent-[#0e2c46]"
            />
            Exclude tax
          </label>
          <label className="flex items-center gap-2 text-sm text-[#344054] cursor-pointer">
            <input
              type="radio"
              name="tax"
              value="include"
              checked={!draft.excludeTax}
              onChange={() => onChange({ excludeTax: false })}
              className="accent-[#0e2c46]"
            />
            Include tax
          </label>
        </div>
      </div>

      <div className="border-t border-[#e4e7ec]" />

      {/* Currency */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#344054]">Currency</label>
        <select
          className="w-40 border border-[#d0d5dd] rounded-lg px-3 py-2 text-sm text-[#344054] focus:border-[#0e2c46] focus:ring-2 focus:ring-[rgba(14,44,70,0.1)] outline-none bg-white"
          value={draft.currency}
          onChange={(e) => onChange({ currency: e.target.value })}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-[#e4e7ec]" />

      {/* Group Statement */}
      <div className="flex items-center justify-between gap-4 py-1">
        <div>
          <p className="text-sm font-medium text-[#344054]">Group statement</p>
          <p className="text-xs text-[#667085]">
            Pools all network affiliates together for balanced/unbalanced calculations.
          </p>
        </div>
        <Toggle
          checked={draft.groupStatement}
          onChange={() => onChange({ groupStatement: !draft.groupStatement })}
        />
      </div>
    </div>
  )
}
