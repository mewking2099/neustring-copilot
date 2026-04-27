import { useEffect, useRef } from "react"
import { useChatStore } from "@/store/chat"
import { useAppStore } from "@/store/app"
import { useTriggerFlow } from "@/hooks/useTriggerFlow"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { TypingIndicator } from "@/components/chat/TypingIndicator"
import { ChatInput } from "@/components/chat/ChatInput"
import { detectFlow } from "@/lib/intentRouter"
import { FLOW_LABELS } from "@/data/flows"
import type { ContractChoice } from "@/store/chat"

const WIZARD_FLOWS = new Set(["contract-create", "contract-edit", "deal"])

export default function ChatView() {
  const { messages, isTyping, addMessage, setIsTyping } = useChatStore()
  const { pendingFlowId, setPendingFlow, pendingUserMessage, setPendingUserMessage } = useAppStore()
  const { triggerFlow, sendUserMessage } = useTriggerFlow()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { document.title = "Chat — NeuString Co-Pilot" }, [])

  // Reactive: fires whenever pendingFlowId is set (works for both first mount
  // and inline flow-switching while already on /chat).
  useEffect(() => {
    if (!pendingFlowId) return
    // If there's an existing conversation, insert a labeled divider first.
    if (useChatStore.getState().messages.length > 0) {
      addMessage({ kind: "divider", label: FLOW_LABELS[pendingFlowId] ?? pendingFlowId })
    }
    setPendingFlow(null)
    triggerFlow(pendingFlowId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFlowId])

  // Reactive: fires when WelcomeView hands off a free-text message.
  useEffect(() => {
    if (!pendingUserMessage) return
    setPendingUserMessage(null)
    sendUserMessage(pendingUserMessage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingUserMessage])

  // Auto-scroll on new messages or typing state
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  function handleSend(text: string) {
    const flowId = detectFlow(text)
    if (WIZARD_FLOWS.has(flowId)) {
      addMessage({ role: "user", text })
      triggerFlow(flowId)
    } else if (flowId === "contract-review") {
      triggerFlow(flowId)
    } else {
      sendUserMessage(text)
    }
  }

  async function handleContractSelect(choice: ContractChoice) {
    addMessage({ role: "user", text: `${choice.name} — ${choice.version}` })
    setIsTyping(true)
    await delay(1300)
    setIsTyping(false)
    addMessage({
      role: "ai",
      text: "Here's the full analysis of your selected contract.",
      card: "contract-review-analyze",
    })
  }

  const isEmpty = messages.length === 0 && !isTyping

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto py-4">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-[#0e2c46] flex items-center justify-center text-white text-xl font-bold">
              N
            </div>
            <p className="text-[#667085] text-sm max-w-xs">
              Ask me about traffic, forecasts, deals, contracts, or partner status — or select a flow from the Operations menu.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onContractSelect={handleContractSelect}
            onChip={triggerFlow}
          />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
