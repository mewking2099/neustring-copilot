import { motion, type Variants } from 'framer-motion'

interface PulseItem {
  label: string
  count: number
  highlight?: boolean
}

// Mock — in production driven from portfolio aggregation
const PULSE_ITEMS: PulseItem[] = [
  { label: 'partners',            count: 47 },
  { label: 'renewals <30d',       count: 3,  highlight: true },
  { label: 'unanswered counters', count: 1,  highlight: true },
  { label: 'rate gaps flagged',   count: 2,  highlight: true },
]

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.3 } },
}

export function PortfolioPulse() {
  return (
    <motion.div
      className="w-full flex items-center gap-4 mb-7"
      variants={fadeIn}
    >
      {PULSE_ITEMS.map((item, i) => (
        <div key={item.label} className="flex items-baseline gap-1.5">
          <span className={`text-sm font-bold tabular-nums ${item.highlight ? 'text-[#0e2c46]' : 'text-[#98a2b3]'}`}>
            {item.count}
          </span>
          <span className="text-[11px] text-[#98a2b3]">{item.label}</span>
          {i < PULSE_ITEMS.length - 1 && (
            <span className="ml-3 text-[#e4e7ec] text-xs select-none">·</span>
          )}
        </div>
      ))}
    </motion.div>
  )
}
