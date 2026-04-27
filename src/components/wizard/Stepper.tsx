import { Fragment } from "react"
import { cn } from "@/lib/utils"

interface Props {
  labels: string[]
  step: number
}

export function Stepper({ labels, step }: Props) {
  return (
    <>
      <p aria-live="polite" className="sr-only">
        Step {step} of {labels.length}: {labels[step - 1]}
      </p>
      <div role="list" aria-label="Progress steps" className="flex items-center gap-0 mb-6">
        {labels.map((label, i) => {
          const status = i + 1 < step ? "complete" : i + 1 === step ? "current" : "upcoming"
          return (
            <Fragment key={label}>
              <div role="listitem" className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  aria-current={status === "current" ? "step" : undefined}
                  aria-label={`Step ${i + 1}: ${label} — ${status}`}
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold",
                    status === "complete" && "bg-[#82bc34] text-white",
                    status === "current"  && "bg-[#0e2c46] text-white ring-2 ring-[#0e2c46] ring-offset-2",
                    status === "upcoming" && "bg-[#f2f4f7] text-[#667085]"
                  )}
                >
                  {status === "complete" ? "✓" : i + 1}
                </div>
                <span className={cn(
                  "text-[9px] font-medium hidden sm:block",
                  status === "current" ? "text-[#0e2c46]" : "text-[#98a2b3]"
                )}>
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <div className={cn("flex-1 h-0.5 mb-3", status === "complete" ? "bg-[#82bc34]" : "bg-[#e4e7ec]")} aria-hidden="true" />
              )}
            </Fragment>
          )
        })}
      </div>
    </>
  )
}
