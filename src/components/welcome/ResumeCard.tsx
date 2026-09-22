import { FileText, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { DealShell } from '@/domain/deal/types'

interface Props {
  shell: DealShell
  onDismiss: () => void
}

export function ResumeCard({ shell, onDismiss }: Props) {
  const partnerCount = shell.roamingPartners.length
  const services = shell.serviceTypes.slice(0, 3).join(' · ')

  return (
    <motion.div
      className="w-full mb-5"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center gap-3 rounded-xl border border-[#0e2c46]/20 bg-[#0e2c46]/[0.04] px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-[#0e2c46]/10 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[#0e2c46]/60" />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-semibold text-[#0e2c46] truncate">{shell.name}</p>
          <p className="text-[10px] text-[#667085] mt-0.5">
            {partnerCount} partner{partnerCount !== 1 ? 's' : ''}
            {services ? ` · ${services}` : ''}
            {' · '}<span className="capitalize">{shell.status}</span>
          </p>
        </div>

        <Link
          to="/deal/active"
          className="shrink-0 rounded-lg bg-[#0e2c46] text-white text-[11px] font-semibold px-3 py-1.5 hover:bg-[#185992] transition-colors"
        >
          Resume →
        </Link>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-[#98a2b3] hover:text-[#667085] transition-colors p-0.5"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
