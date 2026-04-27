import type React from "react"
import { cn } from "@/lib/utils"

interface Props {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: Props) {
  return (
    <div className={cn("animate-pulse rounded-md bg-[#f2f4f7]", className)} style={style} />
  )
}
