import { useRef, useState, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useDealStore } from '@/store/deal'
import { getMockResponseFromText } from '@/domain/ai/mockResponseTemplates'

interface SideMessage {
  id: string
  role: 'user' | 'ai'
  text: string
}

let msgCounter = 0
function nextId() { return `ai-msg-${++msgCounter}` }

interface Props {
  extraMessages?: SideMessage[]
}

export function AssistantInput({ extraMessages = [] }: Props) {
  const [localMessages, setLocalMessages] = useState<SideMessage[]>([])
  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const state = useDealStore(useShallow((s) => ({
    shell: s.shell,
    statements: s.statements,
    aiChangeLog: s.aiChangeLog,
    entrySource: s.entrySource,
    draftId: s.draftId,
  })))

  // Merge extra messages (from ContextualActions) with local thread
  const allMessages = [...localMessages, ...extraMessages].sort((a, b) =>
    a.id.localeCompare(b.id),
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages, isTyping])

  async function handleSend() {
    const text = inputVal.trim()
    if (!text || isTyping) return
    setInputVal('')

    const userMsg: SideMessage = { id: nextId(), role: 'user', text }
    setLocalMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    await new Promise<void>((resolve) => setTimeout(resolve, 800))

    const response = getMockResponseFromText(text, state)
    setIsTyping(false)
    setLocalMessages((prev) => [...prev, { id: nextId(), role: 'ai', text: response }])
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
      {/* Message bubbles */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {allMessages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'ml-auto bg-[#0e2c46] text-white rounded-tr-sm'
                : 'bg-white border border-[#e4e7ec] text-[#344054] rounded-tl-sm'
            }`}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div
            role="status"
            aria-label="AI Assistant is typing"
            className="bg-white border border-[#e4e7ec] rounded-xl rounded-tl-sm px-3 py-2 inline-flex items-center gap-1 max-w-[85%]"
          >
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

      {/* Input bar */}
      <div className="shrink-0 px-3 pb-3 pt-2 border-t border-[#f2f4f7] bg-white">
        <label htmlFor="ai-assistant-input" className="sr-only">Ask the AI assistant</label>
        <div className="flex items-center gap-2 rounded-lg border border-[#d0d5dd] bg-[#f9fafb] px-3 py-1.5 focus-within:border-[#0e2c46] transition-colors">
          <input
            id="ai-assistant-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void handleSend()
              }
            }}
            placeholder="Ask something…"
            disabled={isTyping}
            className="flex-1 bg-transparent text-xs text-[#344054] placeholder:text-[#98a2b3] outline-none"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!inputVal.trim() || isTyping}
            aria-label="Send message"
            className="w-5 h-5 rounded flex items-center justify-center bg-[#0e2c46] text-white disabled:opacity-30 transition-opacity"
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
              <path
                d="M6 10V2M6 2L2 6M6 2l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
