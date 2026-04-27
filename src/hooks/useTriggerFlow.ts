import { useNavigate } from "react-router-dom"
import { useChatStore } from "@/store/chat"
import { AI_TEXT, FLOW_TRIGGER_TEXT, CONTRACT_CHOICES } from "@/lib/flowData"

const WIZARD_FLOWS = new Set(["contract-create", "contract-edit", "deal"])

// These flows add no user message — they fire silently from card callbacks
const SILENT_FLOWS = new Set(["contract-review-compare-result"])

export function useTriggerFlow() {
  const navigate = useNavigate()
  const { addMessage, setIsTyping } = useChatStore()

  async function triggerFlow(flowId: string) {
    if (WIZARD_FLOWS.has(flowId)) {
      if (flowId === "deal") navigate("/deal/new")
      else if (flowId === "contract-create") navigate("/contract/new")
      else if (flowId === "contract-edit") navigate("/contract/1/edit")
      return
    }

    if (!SILENT_FLOWS.has(flowId)) {
      const userText = FLOW_TRIGGER_TEXT[flowId] ?? flowId
      addMessage({ role: "user", text: userText })
    }

    setIsTyping(true)
    await delay(1300)
    setIsTyping(false)

    if (flowId === "contract-review") {
      addMessage({
        role: "ai",
        text: AI_TEXT["contract-review"] ?? "Sure. Which contract would you like to review?",
        contractChoices: CONTRACT_CHOICES,
      })
    } else {
      addMessage({
        role: "ai",
        text: AI_TEXT[flowId] ?? "Here's the information you requested.",
        card: flowId,
      })
    }
  }

  async function sendUserMessage(text: string) {
    addMessage({ role: "user", text })

    setIsTyping(true)
    await delay(1300)
    setIsTyping(false)

    addMessage({
      role: "ai",
      text: AI_TEXT["traffic"] ?? "Here's the information you requested.",
    })
  }

  return { triggerFlow, sendUserMessage }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
