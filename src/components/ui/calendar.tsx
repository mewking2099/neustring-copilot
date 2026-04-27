import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-white border border-[#d0d5dd] rounded-lg p-3 " +
        "shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] " +
        "w-[240px]",
        className
      )}
      classNames={{
        months: cn("flex flex-col gap-3", defaultClassNames.months),
        month: cn("flex flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "border-[#0e2c46] rounded-[10px] h-9 px-3 py-1 hover:bg-[#f2f4f7] aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "border-[#0e2c46] rounded-[10px] h-9 px-3 py-1 hover:bg-[#f2f4f7] aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "text-sm font-medium text-[#182230] text-center select-none",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 h-8 flex items-center justify-center text-sm font-normal text-[#475467] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex mt-0", defaultClassNames.week),
        day: cn(
          "flex-1 h-8 relative p-0",
          defaultClassNames.day
        ),
        range_start: cn("bg-[#e8f2ce] rounded-l-[4px]", defaultClassNames.range_start),
        range_middle: cn("bg-[#e8f2ce] rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-[#e8f2ce] rounded-r-[4px]", defaultClassNames.range_end),
        outside: cn("text-[#98a2b3] opacity-100", defaultClassNames.outside),
        disabled: cn("text-[#98a2b3] cursor-not-allowed", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <ChevronLeftIcon className="size-4" />
          return <ChevronRightIcon className="size-4" />
        },
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today}
      data-outside={modifiers.outside}
      data-disabled={modifiers.disabled}
      className={cn(
        "h-8 w-8 rounded-[4px] text-sm font-normal text-[#0e2c46] " +
        "inline-flex items-center justify-center mx-auto " +
        "hover:bg-[#f2f4f7] transition-colors cursor-pointer " +
        "focus-visible:outline-none focus-visible:shadow-[0px_0px_0px_1px_white,0px_0px_0px_2px_#c2ddf5] " +
        // selected single day — navy bg
        "data-[selected-single=true]:bg-[#0e2c46] data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-[#0e2c46] " +
        // range start/end — navy bg
        "data-[range-start=true]:bg-[#0e2c46] data-[range-start=true]:text-white data-[range-start=true]:rounded-l-[4px] data-[range-start=true]:rounded-r-none " +
        "data-[range-end=true]:bg-[#0e2c46] data-[range-end=true]:text-white data-[range-end=true]:rounded-r-[4px] data-[range-end=true]:rounded-l-none " +
        // range middle — lime tint
        "data-[range-middle=true]:bg-[#e8f2ce] data-[range-middle=true]:text-[#0e2c46] data-[range-middle=true]:rounded-none data-[range-middle=true]:hover:bg-[#e8f2ce] " +
        // today
        "data-[today=true]:font-medium " +
        // outside month
        "data-[outside=true]:text-[#98a2b3] " +
        // disabled
        "data-[disabled=true]:text-[#98a2b3] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:hover:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Calendar }
