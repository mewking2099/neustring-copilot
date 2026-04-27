import { RefreshCw } from "lucide-react"

interface Props {
  title?: string
  onRetry?: () => void
}

export function CardError({ title = "this card", onRetry }: Props) {
  return (
    <div
      className="w-full max-w-[560px] rounded-xl border border-[#fca5a5] bg-[#fff5f5] overflow-hidden mt-3"
      role="alert"
    >
      <div className="px-4 py-5 flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-[#b42318]">Failed to load {title}</p>
        <p className="text-xs text-[#667085]">Something went wrong. Check your connection and try again.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0e2c46] border border-[#0e2c46] rounded-lg px-3 py-1.5 hover:bg-[#0e2c46] hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
