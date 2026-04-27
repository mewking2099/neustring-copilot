import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg border bg-white font-normal text-[#182230] " +
  "shadow-[0px_1px_2px_rgba(16,24,40,0.05)] " +
  "placeholder:text-[#667085] placeholder:font-normal " +
  "transition-[border-color,box-shadow] " +
  "border-[#d0d5dd] " +
  "focus-visible:outline-none focus-visible:border-[#0e2c46] focus-visible:shadow-[0px_0px_0px_2px_rgba(24,89,146,0.3)] " +
  "aria-[invalid=true]:border-[#f04438] " +
  "aria-[invalid=true]:focus-visible:border-[#f04438] aria-[invalid=true]:focus-visible:shadow-[0px_0px_0px_2px_rgba(240,68,56,0.3)] " +
  "disabled:bg-[#f2f4f7] disabled:border-[#e4e7ec] disabled:text-[#667085] disabled:cursor-not-allowed disabled:shadow-none",
  {
    variants: {
      size: {
        xl:      "px-4 py-4 text-xl leading-[30px]",
        default: "px-3 py-3 text-sm leading-[20px]",
        md:      "px-3 py-1.5 text-sm leading-[20px]",
        sm:      "px-3 py-1 text-xs leading-[18px]",
      },
    },
    defaultVariants: { size: "default" },
  }
)

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ size }), className)}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

// ── InputField — compound input with optional leading/trailing slots ──────────

const sizeMap = {
  xl:      { py: "py-4",   px: "px-4", text: "text-xl",  icon: "size-5"   },
  default: { py: "py-3",   px: "px-4", text: "text-sm",  icon: "size-5"   },
  md:      { py: "py-1.5", px: "px-4", text: "text-sm",  icon: "size-4"   },
  sm:      { py: "py-1",   px: "px-4", text: "text-xs",  icon: "size-3.5" },
} as const

interface InputFieldProps {
  size?: keyof typeof sizeMap
  error?: boolean
  leading?: React.ReactNode
  trailing?: React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  className?: string
}

function InputField({
  size = "default",
  error = false,
  leading,
  trailing,
  inputProps,
  className,
}: InputFieldProps) {
  const s = sizeMap[size]
  return (
    <div
      className={cn(
        "flex items-center w-full rounded-lg border bg-white overflow-hidden",
        "shadow-[0px_1px_2px_rgba(16,24,40,0.05)]",
        "focus-within:border-[#0e2c46] focus-within:shadow-[0px_0px_0px_2px_rgba(24,89,146,0.3)]",
        error
          ? "border-[#f04438] focus-within:border-[#f04438] focus-within:shadow-[0px_0px_0px_2px_rgba(240,68,56,0.3)]"
          : "border-[#d0d5dd]",
        className
      )}
    >
      {leading && (
        <>
          <div className={cn("flex items-center gap-1 shrink-0 pl-4 pr-2 text-[#667085]", s.py, s.text)}>
            {leading}
          </div>
          <div className="w-px self-stretch bg-[#d0d5dd]" />
        </>
      )}
      <input
        className={cn(
          "flex-1 min-w-0 bg-transparent outline-none font-normal text-[#182230]",
          "placeholder:text-[#667085]",
          "px-2 disabled:text-[#667085] disabled:cursor-not-allowed",
          s.py, s.text
        )}
        {...inputProps}
      />
      {trailing && (
        <>
          <div className="w-px self-stretch bg-[#d0d5dd]" />
          <div className={cn("flex items-center gap-1 shrink-0 pl-2 pr-4 text-[#667085]", s.py, s.text)}>
            {trailing}
          </div>
        </>
      )}
    </div>
  )
}

export { Input, inputVariants, InputField }
