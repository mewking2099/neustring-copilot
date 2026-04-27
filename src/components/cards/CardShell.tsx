import { cn } from "@/lib/utils"

export interface ChipDef {
  label: string
  flowId?: string
}

interface CardShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  chips?: ChipDef[]
  onChip?: (flowId: string) => void
  className?: string
}

export function CardShell({ title, subtitle, children, chips, onChip, className }: CardShellProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[560px] rounded-xl border border-[#e4e7ec] bg-white overflow-hidden mt-3",
        "shadow-[0px_1px_3px_rgba(16,24,40,0.10),0px_1px_2px_rgba(16,24,40,0.06)]",
        className
      )}
    >
      <div className="px-4 pt-4 pb-3 border-b border-[#e4e7ec]">
        <div className="text-sm font-semibold text-[#0e2c46]">{title}</div>
        {subtitle && <div className="text-xs text-[#667085] mt-0.5">{subtitle}</div>}
      </div>
      {children}
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-4 pt-3 border-t border-[#f2f4f7]">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={() => c.flowId && onChip?.(c.flowId)}
              aria-label={c.label}
              className="rounded-full border border-[#d0d5dd] bg-white px-3 py-1 text-xs text-[#344054] hover:border-[#0e2c46] hover:text-[#0e2c46] transition-colors"
            >
              {c.label} <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
