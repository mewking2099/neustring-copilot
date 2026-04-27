import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full px-3 py-0.5 " +
  "text-xs font-normal leading-[18px] whitespace-nowrap " +
  "transition-opacity [&_svg]:size-3",
  {
    variants: {
      variant: {
        // ── Solid ────────────────────────────────────────────────────
        "solid-brand-primary":
          "text-white [background-image:linear-gradient(104.48deg,#0e2c46_0.29%,#185992_103.96%)] hover:opacity-80 disabled:opacity-50",
        "solid-brand-secondary":
          "text-white [background-image:linear-gradient(104.48deg,#82bc34_0.29%,#a2d55e_103.96%)] hover:opacity-80 disabled:opacity-50",
        "solid-green":
          "bg-[#4ca30d] text-white hover:opacity-80 disabled:opacity-50",
        "solid-yellow":
          "bg-[#ca8504] text-white hover:opacity-80 disabled:opacity-50",
        "solid-red":
          "bg-[#f04438] text-white hover:opacity-80 disabled:opacity-50",
        "solid-blue":
          "bg-[#2e90fa] text-white hover:opacity-80 disabled:opacity-50",
        "solid-gray":
          "bg-[#667085] text-white hover:opacity-80 disabled:opacity-50",
        "solid-white":
          "bg-white text-[#182230] border border-[#e4e7ec] hover:opacity-80 disabled:opacity-50",
        // ── Outline ──────────────────────────────────────────────────
        "outline-brand-primary":
          "border border-[#0e2c46] text-[#0e2c46] bg-transparent hover:opacity-80 disabled:opacity-50",
        "outline-brand-secondary":
          "border border-[#82bc34] text-[#82bc34] bg-transparent hover:opacity-80 disabled:opacity-50",
        "outline-green":
          "border border-[#4ca30d] text-[#4ca30d] bg-transparent hover:opacity-80 disabled:opacity-50",
        "outline-yellow":
          "border border-[#ca8504] text-[#ca8504] bg-transparent hover:opacity-80 disabled:opacity-50",
        "outline-red":
          "border border-[#f04438] text-[#f04438] bg-transparent hover:opacity-80 disabled:opacity-50",
        "outline-blue":
          "border border-[#2e90fa] text-[#2e90fa] bg-transparent hover:opacity-80 disabled:opacity-50",
        "outline-gray":
          "border border-[#667085] text-[#667085] bg-transparent hover:opacity-80 disabled:opacity-50",
        "outline-white":
          "border border-white text-white bg-transparent hover:opacity-80 disabled:opacity-50",
      },
    },
    defaultVariants: { variant: "solid-brand-primary" },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
