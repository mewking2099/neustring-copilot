import { useState, useEffect } from "react"
import neuStringLogo from "@/assets/NeuString-logo.svg"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { useAppStore } from "@/store/app"
import { ChatInput } from "@/components/chat/ChatInput"

const USER_FIRST_NAME = "Alex"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

const SUGGESTION_CHIPS = [
  { id: "forecast",    icon: "📡", text: "Forecast inbound data from Deutsche Telekom for Q3 2025.",                  flowId: "forecast"     },
  { id: "negotiation", icon: "🤝", text: "Summarise our Vodafone Germany negotiation and suggest next steps.",          flowId: "negotiation"  },
  { id: "rankings",    icon: "✈", text: "Compare France → Spain and France → Italy corridor deals.",                   flowId: "rankings"     },
]

export function WelcomeView() {
  const navigate = useNavigate()
  const { pins, unpinItem, setPendingFlow, setPendingUserMessage } = useAppStore()
  const [usedChips, setUsedChips] = useState<string[]>([])

  useEffect(() => { document.title = "NeuString Co-Pilot" }, [])

  function handleChip(chip: typeof SUGGESTION_CHIPS[0]) {
    if (usedChips.includes(chip.id)) return
    setUsedChips((prev) => [...prev, chip.id])
    setPendingFlow(chip.flowId)
    navigate("/chat")
  }

  function handlePin(item: typeof pins[0]) {
    setPendingFlow(item.flowId ?? null)
    navigate(item.route)
  }

  function handleSend(text: string) {
    setPendingUserMessage(text)
    navigate("/chat")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center text-center max-w-xl w-full gap-4">

        {/* Logo */}
        <div className="flex items-center select-none mb-2">
          <img src={neuStringLogo} alt="NeuString" className="h-12 object-contain" />
        </div>

        {/* Greeting */}
        <h1 className="text-2xl font-semibold text-[#182230]">
          {getGreeting()}, {USER_FIRST_NAME}.
        </h1>
        <p className="text-sm text-[#667085] -mt-2">
          Ask about partner forecasts, deals, corridors, contracts, or negotiations.
        </p>

        {/* Suggestion chips */}
        <div className="w-full max-w-2xl mt-2">
          <p className="text-xs font-medium text-[#667085] mb-2 text-left">Quick start</p>
          <div className="grid grid-cols-3 gap-2">
            {SUGGESTION_CHIPS.map((chip) => {
              const used = usedChips.includes(chip.id)
              return (
                <button
                  key={chip.id}
                  onClick={() => handleChip(chip)}
                  disabled={used}
                  className="flex flex-col gap-2 rounded-xl border border-[#e4e7ec] bg-white px-3 py-3 text-left text-xs text-[#344054] hover:border-[#0e2c46] hover:bg-[#f2f4f7] hover:text-[#0e2c46] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  {chip.text}
                </button>
              )
            })}
          </div>
        </div>

        {/* Pinned quick-action row */}
        {pins.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-2 w-full max-w-lg">
            {pins.map((item) => (
              <div key={item.id} className="group/pin inline-flex items-center gap-1.5 rounded-full border border-[#d0d5dd] bg-white px-3 py-1.5 text-xs text-[#344054] font-medium hover:border-[#0e2c46] hover:text-[#0e2c46] transition-colors whitespace-nowrap">
                <button onClick={() => handlePin(item)} className="flex items-center gap-1.5">
                  <span className="text-xs">{item.icon}</span>
                  {item.name}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); unpinItem(item.id) }}
                  className="w-0 overflow-hidden group-hover/pin:w-3 opacity-0 group-hover/pin:opacity-60 hover:!opacity-100 text-[#667085] hover:text-[#f04438] transition-all"
                  title="Unpin"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  )
}
