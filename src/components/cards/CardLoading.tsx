import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  title?: string
  rows?: number
  hasChart?: boolean
}

export function CardLoading({ title = "Loading…", rows = 3, hasChart }: Props) {
  return (
    <div className="w-full max-w-[560px] rounded-xl border border-[#e4e7ec] bg-white overflow-hidden mt-3 shadow-[0px_1px_3px_rgba(16,24,40,0.10),0px_1px_2px_rgba(16,24,40,0.06)]">
      <div className="px-4 pt-4 pb-3 border-b border-[#e4e7ec]">
        <Skeleton className="h-4 w-44 mb-1.5" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="px-4 py-4 space-y-3">
        {hasChart && <Skeleton className="h-32 w-full" />}
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" style={{ opacity: 1 - i * 0.15 }} />
        ))}
      </div>
      <p className="sr-only">Loading {title}</p>
    </div>
  )
}
