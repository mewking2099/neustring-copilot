import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-opacity disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-[10px] text-white [background-image:linear-gradient(105deg,#0e2c46_0%,#185992_104%)] hover:opacity-90",
        outline:
          "rounded-[10px] border border-[#0e2c46] text-[#0e2c46] bg-transparent hover:bg-[#f2f4f7]",
        ghost:
          "rounded-[10px] text-[#0e2c46] bg-transparent hover:bg-[#f2f4f7]",
        secondary:
          "rounded-[10px] text-white [background-image:linear-gradient(105deg,#82bc34_0%,#a2d55e_104%)] hover:opacity-90",
        "secondary-outline":
          "rounded-[10px] border border-[#82bc34] text-[#82bc34] bg-transparent hover:bg-[#e8f2ce]",
        destructive:
          "rounded-[10px] bg-[#f04438] text-white hover:bg-[#d92d22]",
        "destructive-outline":
          "rounded-[10px] border border-[#f04438] text-[#f04438] bg-transparent hover:bg-[#fef3f2]",
        "neutral-ghost":
          "rounded-[10px] text-[#475467] bg-transparent hover:bg-[#f2f4f7]",
        icon: "rounded-[10px] text-[#475467] bg-transparent hover:bg-[#f2f4f7]",
      },
      size: {
        sm: "px-3 py-1 text-xs [&_svg]:size-3",
        default: "px-4 py-1 text-sm [&_svg]:size-6",
        lg: "px-4 py-2 text-sm [&_svg]:size-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
