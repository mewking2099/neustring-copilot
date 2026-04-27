export function TypingIndicator() {
  return (
    <div role="status" aria-label="NeuString is typing" className="flex items-start gap-2 px-4 py-2">
      <div aria-hidden="true" className="w-7 h-7 rounded-full bg-[#0e2c46] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        N
      </div>
      <div aria-hidden="true" className="bg-[#f2f4f7] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#667085] animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[#667085] animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[#667085] animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}
