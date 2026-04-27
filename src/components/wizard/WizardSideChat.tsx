import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { WizardConvConfig, WizardConvReply } from "@/data/contractConv"

interface SideMessage {
  id: string
  role: "user" | "ai"
  text: string
}

interface Props {
  step: number
  onStepChange: (step: number) => void
  config: WizardConvConfig
}

let msgId = 0
function nextId() { return `sm-${++msgId}` }

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function WizardSideChat({ step, onStepChange, config }: Props) {
  const { conv, pillClass, pillLabel, stepIntro, modeLabel } = config

  const [messages, setMessages] = useState<SideMessage[]>([
    { id: nextId(), role: "ai", text: stepIntro[1] },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [usedReplies, setUsedReplies] = useState<Set<string>>(new Set())
  const [inputVal, setInputVal] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevStep = useRef(step)

  useEffect(() => {
    if (prevStep.current === step) return
    prevStep.current = step
    addAiMessage(stepIntro[step] ?? "")
    setUsedReplies(new Set())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  function addAiMessage(text: string) {
    setMessages((prev) => [...prev, { id: nextId(), role: "ai", text }])
  }

  async function handleReply(reply: WizardConvReply) {
    if (usedReplies.has(reply.id) || isTyping) return
    setUsedReplies((prev) => new Set([...prev, reply.id]))
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: reply.userText }])

    setIsTyping(true)
    await delay(950)
    setIsTyping(false)

    addAiMessage(reply.aiText)

    if (reply.next != null) {
      await delay(350)
      onStepChange(reply.next)
    }
  }

  async function handleSendFree() {
    const text = inputVal.trim()
    if (!text || isTyping) return
    setInputVal("")
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }])
    setIsTyping(true)
    await delay(950)
    setIsTyping(false)
    addAiMessage("Got it — I've noted that. Continue with the wizard or use a quick reply below.")
  }

  const replies = conv[step] ?? []

  return (
    <div className="flex flex-col h-full w-80 border-l border-[#e4e7ec] bg-[#f9fafb]">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-[#e4e7ec] bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0e2c46]">AI Assistant</p>
            <p className="text-xs text-[#667085]">{modeLabel}</p>
          </div>
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", pillClass[step] ?? "bg-[#f2f4f7] text-[#344054]")}>
            {pillLabel[step] ?? `Step ${step}`}
          </span>
        </div>
      </div>

      {/* Message scroll */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed",
              msg.role === "user"
                ? "ml-auto bg-[#0e2c46] text-white rounded-tr-sm"
                : "bg-white border border-[#e4e7ec] text-[#344054] rounded-tl-sm"
            )}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div role="status" aria-label="AI Assistant is typing" className="bg-white border border-[#e4e7ec] rounded-xl rounded-tl-sm px-3 py-2 inline-flex items-center gap-1 max-w-[90%]">
            {[0, 150, 300].map((d) => (
              <span
                key={d}
                aria-hidden="true"
                className="w-1 h-1 rounded-full bg-[#667085] animate-bounce"
                style={{ animationDelay: `${d}ms` }}
              />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {replies.length > 0 && (
        <div className="shrink-0 px-3 pt-2 pb-2 border-t border-[#e4e7ec] bg-white space-y-1.5">
          <p className="text-[10px] font-medium text-[#98a2b3] uppercase tracking-wide px-1">Quick replies</p>
          {replies.map((r) => {
            const used = usedReplies.has(r.id)
            return (
              <button
                key={r.id}
                onClick={() => handleReply(r)}
                disabled={used || isTyping}
                className={cn(
                  "w-full flex items-center gap-2 rounded-full border px-3 py-1.5 text-left text-[11.5px] transition-all",
                  used
                    ? "border-[#e4e7ec] bg-[#f2f4f7] text-[#98a2b3] opacity-50 cursor-not-allowed"
                    : r.next != null
                    ? "border-[#0e2c46] bg-white text-[#0e2c46] hover:bg-[#f2f4f7] font-medium"
                    : "border-[#d0d5dd] bg-white text-[#344054] hover:border-[#0e2c46] hover:text-[#0e2c46]"
                )}
              >
                <span className="text-[10px] flex-shrink-0">
                  {used ? "✓" : r.next != null ? "→" : "?"}
                </span>
                {r.btn}
              </button>
            )
          })}
        </div>
      )}

      {/* Free-text input */}
      <div className="shrink-0 px-3 pb-3 pt-2 bg-white border-t border-[#f2f4f7]">
        <label htmlFor="wizard-free-text" className="sr-only">Ask a question</label>
        <div className="flex items-center gap-2 rounded-lg border border-[#d0d5dd] bg-[#f9fafb] px-3 py-1.5 focus-within:border-[#0e2c46]">
          <input
            id="wizard-free-text"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendFree() } }}
            placeholder="Ask something…"
            disabled={isTyping}
            className="flex-1 bg-transparent text-xs text-[#344054] placeholder:text-[#98a2b3] outline-none"
          />
          <button
            onClick={handleSendFree}
            disabled={!inputVal.trim() || isTyping}
            aria-label="Send message"
            className="w-5 h-5 rounded flex items-center justify-center bg-[#0e2c46] text-white disabled:opacity-30 transition-opacity"
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
              <path d="M6 10V2M6 2L2 6M6 2l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
