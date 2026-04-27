import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const switchTrack = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0d5dd] focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "data-[state=unchecked]:bg-[#f2f4f7] data-[state=checked]:bg-[#82bc34]",
  {
    variants: {
      size: {
        sm:      "h-[18px] w-[36px]",
        default: "h-[20px] w-[36px]",
        lg:      "h-[24px] w-[44px]",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const switchThumb = cva(
  "pointer-events-none block rounded-full bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] " +
  "ring-0 transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        sm:      "h-[14px] w-[14px] data-[state=checked]:translate-x-[18px]",
        default: "h-[16px] w-[16px] data-[state=checked]:translate-x-[16px]",
        lg:      "h-[20px] w-[20px] data-[state=checked]:translate-x-[20px]",
      },
    },
    defaultVariants: { size: "default" },
  }
)

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchTrack> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchTrack({ size }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={cn(switchThumb({ size }))} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
