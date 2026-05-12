import { motion } from "framer-motion"
import yaanaIcon from "@/assets/yaana-icon.svg"

export function TypingIndicator() {
  return (
    <div role="status" aria-label="NeuString is typing" className="flex items-start gap-2 px-4 py-2">
      <div aria-hidden="true" className="w-7 h-7 rounded-full bg-[#0e2c46] flex items-center justify-center flex-shrink-0">
        <img src={yaanaIcon} alt="" className="w-4 h-4 object-contain" />
      </div>
      <div aria-hidden="true" className="bg-[#f2f4f7] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#667085] block"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.55,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  )
}
