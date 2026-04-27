import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 rounded-[4px] border border-[#d0d5dd] bg-white " +
      "shadow-[0px_1px_2px_rgba(16,24,40,0.05)] " +
      "data-[state=checked]:bg-[#82bc34] data-[state=checked]:border-[#82bc34] " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82bc34] " +
      "disabled:bg-[#e4e7ec] disabled:cursor-not-allowed",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
