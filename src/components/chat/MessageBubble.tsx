import { useState } from "react"
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import yaanaIcon from "@/assets/yaana-icon.svg"
import type { Variants } from "framer-motion"
import type { Message, ContractChoice } from "@/store/chat"
import { CARD_REGISTRY } from "@/components/cards"

interface Props {
  message: Message
  onContractSelect?: (choice: ContractChoice) => void
  onChip?: (flowId: string) => void
}

const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
}

function ContractChoiceList({
  choices,
  onSelect,
}: {
  choices: ContractChoice[]
  onSelect?: (c: ContractChoice) => void
}) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {choices.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect?.(c)}
          className="flex items-center gap-3 rounded-xl border border-[#d0d5dd] bg-white px-4 py-3 text-left hover:border-[#0e2c46] hover:bg-[#f8fafc] transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wide bg-[#f2f4f7] rounded px-1.5 py-0.5">
                {c.id}
              </span>
            </div>
            <p className="text-sm font-medium text-[#182230] truncate">{c.name}</p>
            <p className="text-xs text-[#667085] truncate">{c.version}</p>
            <p className="text-xs text-[#667085] mt-0.5">{c.summary}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#98a2b3] group-hover:text-[#0e2c46] flex-shrink-0 transition-colors" />
        </button>
      ))}
    </div>
  )
}

function MessageActions({ onCopy }: { onCopy: () => void }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Message copied" : ""}
      </span>
      <button
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy message"}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#98a2b3] hover:text-[#0e2c46] hover:bg-[#f2f4f7] transition-colors"
      >
        {copied ? (
          <span aria-hidden="true" className="text-[10px] font-medium text-[#82bc34]">✓</span>
        ) : (
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
        )}
      </button>
      <button aria-label="Mark as helpful" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#98a2b3] hover:text-[#0e2c46] hover:bg-[#f2f4f7] transition-colors">
        <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      <button aria-label="Mark as not helpful" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#98a2b3] hover:text-[#0e2c46] hover:bg-[#f2f4f7] transition-colors">
        <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      <button aria-label="Regenerate response" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#98a2b3] hover:text-[#0e2c46] hover:bg-[#f2f4f7] transition-colors">
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export function MessageBubble({ message, onContractSelect, onChip }: Props) {
  if (message.kind === "divider") {
    return (
      <motion.div
        className="flex items-center gap-3 px-4 py-4"
        variants={bubbleVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex-1 h-px bg-[#e4e7ec]" />
        <span className="text-xs text-[#98a2b3] font-medium whitespace-nowrap select-none">{message.label}</span>
        <div className="flex-1 h-px bg-[#e4e7ec]" />
      </motion.div>
    )
  }

  const isUser = message.role === "user"

  if (isUser) {
    return (
      <motion.div
        className="flex justify-end px-4 py-2"
        variants={bubbleVariants}
        initial="hidden"
        animate="show"
      >
        <div className="max-w-[72%] bg-[#0e2c46] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
          {message.text}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="group flex items-start gap-2 px-4 py-2"
      variants={bubbleVariants}
      initial="hidden"
      animate="show"
    >
      <div className="w-7 h-7 rounded-full bg-[#0e2c46] flex items-center justify-center flex-shrink-0 self-start mt-2.5">
        <img src={yaanaIcon} alt="Yaana" className="w-4 h-4 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-[#f2f4f7] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#182230] leading-relaxed max-w-[85%]">
          {message.text}
          {message.contractChoices && message.contractChoices.length > 0 && (
            <ContractChoiceList choices={message.contractChoices} onSelect={onContractSelect} />
          )}
          {message.card && (() => {
            const CardComponent = CARD_REGISTRY[message.card!]
            return CardComponent ? <CardComponent onChip={onChip} /> : null
          })()}
        </div>
        <MessageActions onCopy={() => navigator.clipboard.writeText(message.text ?? "")} />
      </div>
    </motion.div>
  )
}
