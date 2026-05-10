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
  { id: "forecast",    text: "Forecast inbound data from Deutsche Telekom for Q3 2025.",        flowId: "forecast"    },
  { id: "negotiation", text: "Summarise our Vodafone Germany negotiation and suggest next steps.", flowId: "negotiation" },
  { id: "rankings",    text: "Compare France → Spain and France → Italy corridor deals.",         flowId: "rankings"    },
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
    <div className="flex flex-col h-full bg-[#f2f4f7]">
      <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center text-center w-full max-w-xl">

          {/* Logo */}
          <img src={neuStringLogo} alt="NeuString" className="h-10 object-contain mb-8 select-none" />

          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#182230] mb-2">
              {getGreeting()}, {USER_FIRST_NAME}.
            </h1>
            <p className="text-sm text-[#667085]">
              Ask about partner forecasts, deals, corridors, contracts, or negotiations.
            </p>
          </div>

          {/* Suggestion chips */}
          <div className="w-full mb-6">
            <p className="text-[11px] font-normal text-[#c0c8d2] mb-3">
              Continue where you left off
            </p>
            <div className="grid grid-cols-3 gap-3">
              {SUGGESTION_CHIPS.map((chip) => {
                const used = usedChips.includes(chip.id)
                return (
                  <button
                    key={chip.id}
                    onClick={() => handleChip(chip)}
                    disabled={used}
                    className="rounded-xl border border-[#e4e7ec] bg-white px-4 py-4 text-left text-sm leading-snug text-[#344054] hover:border-[#0e2c46] hover:shadow-sm hover:text-[#0e2c46] transition-all disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {chip.text}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pinned quick-action row */}
          {pins.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center w-full">
              {pins.map((item) => (
                <div key={item.id} className="group/pin inline-flex items-center gap-1.5 rounded-full border border-[#d0d5dd] bg-white px-3 py-1.5 text-xs text-[#344054] font-medium hover:border-[#0e2c46] hover:text-[#0e2c46] transition-colors whitespace-nowrap">
                  <button onClick={() => handlePin(item)} className="flex items-center gap-1.5">
                    <item.icon className="w-3 h-3" />
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
