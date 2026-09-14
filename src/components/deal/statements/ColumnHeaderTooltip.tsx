import { useState } from 'react'

interface Props {
  label: string
  tip: string
  flex: string
}

export function ColumnHeaderTooltip({ label, tip, flex }: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={`${flex} relative`}>
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="flex items-center gap-1 text-[10px] font-semibold text-[#98a2b3] tracking-wider uppercase cursor-default"
      >
        {label}
        <span className="text-[#d0d5dd] text-[9px] leading-none">?</span>
      </button>

      {visible && (
        <div
          role="tooltip"
          className="absolute top-full left-0 mt-1.5 z-30 w-56 rounded-lg border border-[#e4e7ec] bg-white shadow-lg px-3 py-2.5 text-xs text-[#344054] leading-relaxed pointer-events-none"
        >
          {tip}
          <div className="absolute -top-1.5 left-3 w-2.5 h-2.5 rotate-45 border-l border-t border-[#e4e7ec] bg-white" />
        </div>
      )}
    </div>
  )
}
