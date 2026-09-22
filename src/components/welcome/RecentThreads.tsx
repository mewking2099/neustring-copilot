import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Thread {
  id: string
  title: string
  preview: string
  age: string
  status: 'drafting' | 'analysing' | 'idle'
  resume?: boolean
}

const STATUS_DOT: Record<Thread['status'], string> = {
  drafting:  'bg-[#82bc34]',
  analysing: 'bg-[#185992]',
  idle:      'bg-[#d0d5dd]',
}

// Mock threads — in production from conversation history
const MOCK_THREADS: Thread[] = [
  {
    id: 't1',
    title:   'SFR vs Orange France — West Africa corridor',
    preview: 'Comparing bilateral rate cards, Senegal and Ivory Coast focus',
    age:     'Fri 5:12pm',
    status:  'drafting',
    resume:  true,
  },
  {
    id: 't2',
    title:   'Rate parity — MTN Nigeria vs Airtel Nigeria',
    preview: 'IOT benchmark gap identified, counter-rate draft in progress',
    age:     '2h ago',
    status:  'analysing',
  },
  {
    id: 't3',
    title:   'Auto-renewal risk scan — APAC portfolio',
    preview: 'Checked 8 deals, 3 notice windows flagged',
    age:     'Yesterday',
    status:  'idle',
  },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

interface Props {
  onThreadClick: (title: string) => void
}

export function RecentThreads({ onThreadClick }: Props) {
  if (MOCK_THREADS.length === 0) return null

  return (
    <motion.div className="w-full mb-6" variants={fadeUp}>
      <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-widest mb-3">
        Pick up a thread
      </p>
      <div className="rounded-xl bg-white border border-[#e4e7ec] overflow-hidden">
        {MOCK_THREADS.map((thread, i) => (
          <button
            key={thread.id}
            type="button"
            onClick={() => onThreadClick(thread.title)}
            className={`group w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f8fafc] transition-colors ${
              i < MOCK_THREADS.length - 1 ? 'border-b border-[#f2f4f7]' : ''
            }`}
          >
            {/* Status dot */}
            <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[thread.status]}`} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {thread.resume && (
                  <span className="text-[9px] font-bold text-[#82bc34] uppercase tracking-wide shrink-0">
                    ← resume
                  </span>
                )}
                <p className="text-[12px] font-semibold text-[#344054] group-hover:text-[#0e2c46] transition-colors truncate">
                  {thread.title}
                </p>
              </div>
              <p className="text-[11px] text-[#98a2b3] mt-0.5 truncate leading-none">
                {thread.preview}
              </p>
            </div>

            {/* Age + arrow */}
            <span className="shrink-0 text-[10px] text-[#b0b8c4] whitespace-nowrap">{thread.age}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#d0d5dd] shrink-0 group-hover:text-[#0e2c46] transition-colors" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}
