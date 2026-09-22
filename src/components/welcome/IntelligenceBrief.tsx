import { motion, type Variants } from 'framer-motion'

type SourceTag = 'data' | 'inferred' | 'external'

interface Finding {
  id: string
  text: string
  cta: string
  source: SourceTag
  hero?: boolean
}

const SOURCE_LABEL: Record<SourceTag, string> = {
  data:     'data',
  inferred: 'inferred',
  external: 'external',
}

const SOURCE_COLOR: Record<SourceTag, string> = {
  data:     'text-[#667085] bg-[#f2f4f7]',
  inferred: 'text-[#b54708] bg-[#fef6ee]',
  external: 'text-[#185992] bg-[#eff8ff]',
}

// Mock findings — in production Iris-generated from portfolio anomaly detection
// Hero = highest-impact finding. Always ranks first.
const MOCK_FINDINGS: Finding[] = [
  {
    id: 'f1',
    text: "3 APAC partners raised IOT rates since your last login. 2 of your active deals in that region are now underpriced against the new benchmark.",
    cta: "Draft counter-rates",
    source: 'inferred',
    hero: true,
  },
  {
    id: 'f2',
    text: "Vodafone India's inbound MOU on your UK→India corridor dropped 18% week-over-week — unusual for this season. Volume commitment may be at risk.",
    cta: "Model the shortfall",
    source: 'data',
  },
  {
    id: 'f3',
    text: "MTN Nigeria filed a new IOT rate card Tuesday. You have no active deal with them — low urgency, but worth watching.",
    cta: "Add to watchlist",
    source: 'external',
  },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

interface Props {
  onFindingClick: (text: string) => void
}

export function IntelligenceBrief({ onFindingClick }: Props) {
  const hero       = MOCK_FINDINGS.find((f) => f.hero)
  const secondaries = MOCK_FINDINGS.filter((f) => !f.hero)

  if (!hero && secondaries.length === 0) return null

  return (
    <motion.div className="w-full mb-6" variants={fadeUp}>
      <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-widest mb-3">
        Since you were last here
      </p>

      {/* Hero finding */}
      {hero && (
        <button
          type="button"
          onClick={() => onFindingClick(hero.cta)}
          className="group w-full text-left rounded-xl bg-white border border-[#e4e7ec] px-4 py-3.5 hover:border-[#0e2c46] hover:shadow-md transition-all mb-2"
        >
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#f79009] shrink-0 mt-[5px]" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#1d2939] leading-snug group-hover:text-[#0e2c46] transition-colors font-medium">
                {hero.text}
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <span className={`text-[9px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 ${SOURCE_COLOR[hero.source]}`}>
                  {SOURCE_LABEL[hero.source]}
                </span>
                <span className="text-[11px] font-semibold text-[#0e2c46] group-hover:underline">
                  {hero.cta} →
                </span>
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Secondary findings */}
      {secondaries.map((finding) => (
        <button
          key={finding.id}
          type="button"
          onClick={() => onFindingClick(finding.cta)}
          className="group w-full text-left flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d0d5dd] shrink-0 mt-[5px]" />
          <p className="text-[12px] text-[#667085] leading-snug group-hover:text-[#344054] transition-colors flex-1">
            {finding.text}
          </p>
          <span className={`shrink-0 text-[9px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 self-start mt-0.5 ${SOURCE_COLOR[finding.source]}`}>
            {SOURCE_LABEL[finding.source]}
          </span>
        </button>
      ))}
    </motion.div>
  )
}
