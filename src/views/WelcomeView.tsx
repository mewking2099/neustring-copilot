import { useState, useEffect } from "react"
import neuStringLogo from "@/assets/NeuString-logo.svg"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
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
  { id: "forecast",    accent: "#0e2c46", text: "Forecast inbound data from Deutsche Telekom for Q3 2025.",        flowId: "forecast"    },
  { id: "negotiation", accent: "#82bc34", text: "Summarise our Vodafone Germany negotiation and suggest next steps.", flowId: "negotiation" },
  { id: "rankings",    accent: "#185992", text: "Compare France → Spain and France → Italy corridor deals.",         flowId: "rankings"    },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
}

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
    <div className="flex flex-col h-full bg-gradient-to-br from-[#f8fafc] via-white to-[#eef4ff] relative overflow-hidden">

      {/* Decorative blobs */}
      <motion.div
        className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0e2c46] opacity-[0.04] blur-3xl"
        animate={{ x: [0, 12, -8, 0], y: [0, -10, 8, 0], scale: [1, 1.06, 0.96, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#82bc34] opacity-[0.07] blur-3xl"
        animate={{ x: [0, -10, 8, 0], y: [0, 10, -6, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 py-12 relative">
        <motion.div
          className="flex flex-col items-center text-center w-full max-w-3xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Logo */}
          <motion.img
            src={neuStringLogo}
            alt="NeuString"
            className="h-10 object-contain mb-8 select-none"
            variants={fadeUp}
          />

          {/* Greeting */}
          <motion.div className="mb-8" variants={fadeUp}>
            <h1 className="text-3xl font-bold text-[#182230] mb-2 tracking-tight">
              {getGreeting()},{" "}
              <span className="text-[#0e2c46] relative inline-block">
                {USER_FIRST_NAME}
                <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-[#82bc34]" />
              </span>
              .
            </h1>
            <p className="text-sm text-[#667085] mt-3">
              Ask about partner forecasts, deals, corridors, contracts, or negotiations.
            </p>
          </motion.div>

          {/* Suggestion chips */}
          <motion.div className="w-full mb-6 mt-6" variants={fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e4e7ec] to-[#e4e7ec]" />
              <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-widest whitespace-nowrap">
                Continue where you left off
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#e4e7ec] to-[#e4e7ec]" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SUGGESTION_CHIPS.map((chip) => {
                const used = usedChips.includes(chip.id)
                return (
                  <motion.button
                    key={chip.id}
                    onClick={() => handleChip(chip)}
                    disabled={used}
                    className="group flex flex-col items-start rounded-xl bg-white px-4 py-4 text-left text-sm leading-snug text-[#344054] disabled:opacity-40 disabled:pointer-events-none"
                    style={{
                      border: "1px solid #e4e7ec",
                      borderTop: `3px solid ${chip.accent}`,
                    }}
                    variants={fadeUp}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(14,44,70,0.10)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span className="group-hover:text-[#0e2c46] transition-colors line-clamp-3">{chip.text}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Pinned quick-action row */}
          <AnimatePresence>
            {pins.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 justify-center w-full"
                variants={fadeIn}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                {pins.map((item) => (
                  <div
                    key={item.id}
                    className="group/pin inline-flex items-center rounded-full border border-[#d0d5dd] bg-white px-3 py-1.5 text-xs text-[#344054] font-medium hover:border-[#0e2c46] hover:bg-[#0e2c46]/[0.04] hover:text-[#0e2c46] transition-colors whitespace-nowrap"
                  >
                    <button onClick={() => handlePin(item)} className="p-0">
                      {item.name}
                    </button>
                    <span className="w-0 shrink-0 overflow-hidden ml-0 group-hover/pin:w-3 group-hover/pin:ml-1.5 transition-all duration-150 flex items-center justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); unpinItem(item.id) }}
                        className="p-0 shrink-0 w-3 h-3 flex items-center justify-center opacity-0 group-hover/pin:opacity-60 hover:!opacity-100 text-[#667085] hover:text-[#f04438] transition-opacity"
                        title="Unpin"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}
