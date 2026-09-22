import { useState, useEffect } from "react"
import irisLogo from "@/assets/iris-logo.svg"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { useShallow } from "zustand/react/shallow"
import { useAppStore } from "@/store/app"
import { useDealStore } from "@/store/deal"
import { ChatInput } from "@/components/chat/ChatInput"
import { detectFlow } from "@/lib/intentRouter"
import { PortfolioPulse } from "@/components/welcome/PortfolioPulse"
import { IntelligenceBrief } from "@/components/welcome/IntelligenceBrief"
import { RecentThreads } from "@/components/welcome/RecentThreads"
import { ResumeCard } from "@/components/welcome/ResumeCard"

const USER_FIRST_NAME = "Alex"

// Placeholder rotates through context-driven suggestions — not calendar, not random
// In production these are derived from live deal state and recent findings
const CONTEXT_PLACEHOLDERS = [
  "Draft a counter-rate for MTN Nigeria…",
  "Check auto-renewal windows closing in the next 60 days…",
  "Compare my APAC deals against the new IOT benchmark…",
  "Summarise what moved in my portfolio this week…",
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
}

export function WelcomeView() {
  const navigate = useNavigate()

  const { setPendingFlow, setPendingUserMessage, logQuery } = useAppStore(
    useShallow((s) => ({
      setPendingFlow:        s.setPendingFlow,
      setPendingUserMessage: s.setPendingUserMessage,
      logQuery:              s.logQuery,
    }))
  )

  const shell = useDealStore((s) => s.shell)

  const [resumeDismissed, setResumeDismissed] = useState(false)
  const [placeholderIdx]                      = useState(() => new Date().getHours() % CONTEXT_PLACEHOLDERS.length)

  useEffect(() => { document.title = "NeuString Co-Pilot" }, [])

  function send(text: string, flowId?: string) {
    logQuery(text)
    if (flowId) {
      setPendingFlow(flowId)
    } else {
      const detected = detectFlow(text)
      if (detected !== "traffic") setPendingFlow(detected)
      else setPendingUserMessage(text)
    }
    navigate("/chat")
  }

  const showResume = shell !== null && !resumeDismissed

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

      <div className="flex-1 overflow-y-auto flex items-start justify-center px-6 py-8 relative">
        <motion.div
          className="flex flex-col w-full max-w-2xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Logo + greeting — compact, no anchor sentence */}
          <motion.div className="flex flex-col items-center text-center mb-7" variants={fadeUp}>
            <img
              src={irisLogo}
              alt="Iris"
              className="h-9 object-contain mb-5 select-none"
            />
            <h1 className="text-3xl font-bold text-[#182230] tracking-tight">
              {getGreeting()},{" "}
              <span className="text-[#0e2c46] relative inline-block">
                {USER_FIRST_NAME}
                <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-[#82bc34]" />
              </span>
              .
            </h1>
          </motion.div>

          {/* Portfolio pulse — thin account-state summary */}
          <motion.div variants={fadeIn}>
            <PortfolioPulse />
          </motion.div>

          {/* Resume mid-flow card — only if active deal in store */}
          <AnimatePresence>
            {showResume && (
              <motion.div variants={fadeIn} className="mb-6">
                <ResumeCard shell={shell} onDismiss={() => setResumeDismissed(true)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Intelligence brief — hero + secondary findings with source tags */}
          <motion.div variants={fadeIn}>
            <IntelligenceBrief onFindingClick={(cta) => send(cta)} />
          </motion.div>

          {/* Recent threads — with status dots + preview lines */}
          <motion.div variants={fadeIn}>
            <RecentThreads onThreadClick={(title) => send(`Resume thread: ${title}`)} />
          </motion.div>

        </motion.div>
      </div>

      <ChatInput
        onSend={(text) => send(text)}
        placeholder={CONTEXT_PLACEHOLDERS[placeholderIdx]}
      />
    </div>
  )
}
