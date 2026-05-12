import { motion } from "framer-motion"
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
    <motion.div
      className={cn(
        "w-full max-w-[560px] rounded-xl border border-[#e4e7ec] bg-white overflow-hidden mt-3",
        "shadow-[0px_1px_3px_rgba(16,24,40,0.10),0px_1px_2px_rgba(16,24,40,0.06)]",
        className
      )}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="px-4 pt-4 pb-3 border-b border-[#e4e7ec]">
        <div className="text-sm font-semibold text-[#0e2c46]">{title}</div>
        {subtitle && <div className="text-xs text-[#667085] mt-0.5">{subtitle}</div>}
      </div>
      {children}
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-4 pt-3 border-t border-[#f2f4f7]">
          {chips.map((c) => (
            <motion.button
              key={c.label}
              onClick={() => c.flowId && onChip?.(c.flowId)}
              aria-label={c.label}
              className="rounded-full border border-[#d0d5dd] bg-white px-3 py-1 text-xs text-[#344054] hover:border-[#0e2c46] hover:text-[#0e2c46] transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {c.label} <span aria-hidden="true">↗</span>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
