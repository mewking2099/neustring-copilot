import { useEffect, useRef, useState } from "react"
import { Plus, Mic, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isSendingRef = useRef(false)

  function handleSend() {
    if (isSendingRef.current) return
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    isSendingRef.current = true
    onSend(trimmed)
    setValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  // Reset the guard once the value has cleared (post-render)
  useEffect(() => {
    if (value === "") isSendingRef.current = false
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="border-t border-[#e4e7ec] bg-white px-4 py-3">
      <div className="flex items-end gap-2 rounded-2xl border border-[#d0d5dd] bg-[#f9fafb] px-3 py-2 focus-within:border-[#0e2c46] focus-within:ring-2 focus-within:ring-[rgba(14,44,70,0.12)] transition-all">
        <button
          aria-label="Attach file"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#667085] hover:text-[#0e2c46] hover:bg-[#f2f4f7] transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask NeuString anything…"
          rows={1}
          disabled={disabled}
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-[#182230] placeholder:text-[#98a2b3]",
            "outline-none leading-relaxed py-1 min-h-[32px] max-h-[160px]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />

        <button
          aria-label="Voice input"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#667085] hover:text-[#0e2c46] hover:bg-[#f2f4f7] transition-colors flex-shrink-0"
        >
          <Mic className="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors",
            canSend
              ? "bg-[#0e2c46] text-white hover:bg-[#185992]"
              : "bg-[#f2f4f7] text-[#d0d5dd] cursor-not-allowed"
          )}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-[10px] text-[#98a2b3] mt-2">
        NeuString can make mistakes. Review important information.
      </p>
    </div>
  )
}
