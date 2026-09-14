import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, FileUp, ArrowLeft, Upload } from 'lucide-react'
import { useDealStore } from '@/store/deal'
import { extractFromEmail, extractFromFile } from '@/domain/ingestion/mockExtractor'
import type { ExtractionResult } from '@/domain/ingestion/mockExtractor'
import { ExtractionPreview } from '@/components/deal/ingest/ExtractionPreview'
import type { DealShell, ServiceType } from '@/domain/deal/types'

// Sample email text loaded via the "Load sample" shortcut
const SAMPLE_EMAIL_1 = `From: negotiation@grax-telecom.com
To: iris@neustring.com
Subject: Roaming Agreement Proposal - ARAX1/GRAX1 2025

Dear Team,

Please find below the proposed terms for our bilateral roaming agreement:

My Networks: ARAX1, ARAX2
Roaming Partners: GRAX1, GRAX3
Agreement Period: 2025-01 to 2025-12
Currency: EUR
Auto-renewal: Yes (30 days notice)

Services:
- GPRS: Threshold model, 0-∞ volume, rate TBD
- Voice MO: Threshold model, rate TBD
- Voice MT: Commitment model, rate TBD
- SMS: Threshold model, rate TBD

Please review and confirm.

Best regards,
Christophe Demars`

const EXTRACTION_STEPS = [
  'Reading content...',
  'Identifying parties...',
  'Mapping statements...',
]

type IngestionState = 'idle' | 'extracting' | 'preview' | 'error'

interface Props {
  mode: 'email' | 'file'
  onBack: () => void
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function buildFullShell(partial: Partial<DealShell>, statements: ExtractionResult['statements']): DealShell {
  const id = 'draft-' + makeId()
  // Collect unique service types from extracted statements
  const derivedServices: ServiceType[] = [
    ...new Set(statements.flatMap((s) => s.serviceTypes)),
  ]

  return {
    id,
    name: `Extracted-${id}`,
    status: 'draft',
    roamingChannel: partial.roamingChannel ?? 'traditional',
    myNetworks: partial.myNetworks ?? [],
    roamingPartners: partial.roamingPartners ?? [],
    alliance: partial.alliance ?? null,
    serviceTypes: derivedServices,
    period: partial.period ?? { start: '', end: '' },
    autoRenewal: partial.autoRenewal ?? false,
    autoRenewalNoticeDays: partial.autoRenewalNoticeDays ?? null,
    budgetInclusion: partial.budgetInclusion ?? false,
    accessLevel: partial.accessLevel ?? 'private',
    negotiator: partial.negotiator ?? '',
    currency: partial.currency ?? 'EUR',
    excludeTax: partial.excludeTax ?? true,
    groupStatement: partial.groupStatement ?? false,
  }
}

export function DealIngestionView({ mode, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'email' | 'file'>(mode)
  const [emailText, setEmailText] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [ingestionState, setIngestionState] = useState<IngestionState>('idle')
  const [extractionStep, setExtractionStep] = useState(0)
  const [result, setResult] = useState<ExtractionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // --- Extraction logic ---

  function runExtractionAnimation(onDone: () => ExtractionResult | null) {
    setIngestionState('extracting')
    setExtractionStep(0)

    let step = 0
    const interval = setInterval(() => {
      step += 1
      if (step < EXTRACTION_STEPS.length) {
        setExtractionStep(step)
      } else {
        clearInterval(interval)
        const extracted = onDone()
        if (extracted) {
          setResult(extracted)
          setIngestionState('preview')
        } else {
          setIngestionState('error')
        }
      }
    }, 600)
  }

  function handleExtractEmail() {
    if (!emailText.trim()) return
    runExtractionAnimation(() => extractFromEmail(emailText))
  }

  function handleExtractFile(file: File) {
    setPendingFile(file)
    runExtractionAnimation(() => extractFromFile(file.name))
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleExtractFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleExtractFile(file)
  }

  function handleConfirm() {
    if (!result) return
    const shell = buildFullShell(result.shell, result.statements)
    const store = useDealStore.getState()
    store.initShell(shell, result.source === 'email' ? 'email_ingestion' : 'file_ingestion')
    useDealStore.setState({ statements: result.statements })
    store.logChange(`Deal seeded from ingestion (${result.sourceName})`, 'ingestion')
    navigate(`/deal/${shell.id}`)
  }

  function resetToIdle() {
    setIngestionState('idle')
    setResult(null)
    setExtractionStep(0)
    setPendingFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // --- Render states ---

  if (ingestionState === 'extracting') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {/* Animated spinner */}
          <div className="w-10 h-10 border-4 border-[#e4e7ec] border-t-[#82bc34] rounded-full animate-spin" />
          <div className="w-full space-y-2">
            {EXTRACTION_STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                    i <= extractionStep ? 'bg-[#82bc34]' : 'bg-[#d0d5dd]'
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${
                    i === extractionStep
                      ? 'text-[#0e2c46] font-medium'
                      : i < extractionStep
                      ? 'text-[#667085]'
                      : 'text-[#d0d5dd]'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (ingestionState === 'preview' && result) {
    return (
      <div className="flex flex-col h-full overflow-y-auto px-6 py-8 bg-[#f8f9fc]">
        {/* Back link */}
        <button
          type="button"
          onClick={resetToIdle}
          className="flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#0e2c46] mb-6 w-fit transition-colors"
        >
          <ArrowLeft size={14} />
          Back to entry options
        </button>

        <ExtractionPreview result={result} onBack={resetToIdle} onConfirm={handleConfirm} />
      </div>
    )
  }

  if (ingestionState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-6 max-w-sm w-full text-center">
          <p className="text-sm font-semibold text-[#b91c1c] mb-1">Could not extract deal details</p>
          <p className="text-xs text-[#ef4444] mb-5">
            The {activeTab === 'file' && pendingFile ? pendingFile.name : 'content'} did not contain
            enough recognisable structure. Try a different file or paste the email directly.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={resetToIdle}
              className="w-full px-4 py-2 text-sm font-medium text-[#344054] border border-[#d0d5dd] rounded-lg bg-white hover:bg-[#f2f4f7] transition-colors"
            >
              Try another {activeTab === 'file' ? 'file' : 'email'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full px-4 py-2 text-sm font-medium text-[#667085] hover:text-[#0e2c46] transition-colors"
            >
              Start from scratch
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Idle state ---
  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-8 bg-[#f8f9fc]">
      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#0e2c46] mb-6 w-fit transition-colors"
      >
        <ArrowLeft size={14} />
        Back to entry options
      </button>

      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-[#f2f4f7] rounded-lg w-fit">
          <TabButton
            active={activeTab === 'email'}
            icon={<Mail size={14} />}
            label="Import from email"
            onClick={() => setActiveTab('email')}
          />
          <TabButton
            active={activeTab === 'file'}
            icon={<FileUp size={14} />}
            label="Upload document"
            onClick={() => setActiveTab('file')}
          />
        </div>

        {/* Email mode */}
        {activeTab === 'email' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1.5">
                Paste your roaming proposal email below
              </label>
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste email content here..."
                rows={10}
                className="w-full rounded-lg border border-[#d0d5dd] bg-white px-3 py-2.5 text-xs font-mono text-[#344054] placeholder-[#d0d5dd] focus:outline-none focus:ring-2 focus:ring-[#82bc34] focus:border-transparent resize-y"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEmailText(SAMPLE_EMAIL_1)}
                className="text-xs text-[#667085] hover:text-[#0e2c46] underline underline-offset-2 transition-colors"
              >
                Load sample email
              </button>
              <div className="flex-1" />
              <button
                type="button"
                disabled={!emailText.trim()}
                onClick={handleExtractEmail}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#82bc34] rounded-lg hover:bg-[#6fa02c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Extract deal details
              </button>
            </div>
          </div>
        )}

        {/* File mode */}
        {activeTab === 'file' && (
          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv,.pdf"
              className="hidden"
              onChange={handleFileInput}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
                dragOver
                  ? 'border-[#82bc34] bg-[#f0f9e8]'
                  : 'border-[#d0d5dd] bg-white hover:border-[#82bc34] hover:bg-[#f8fdf3]'
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f2f4f7]">
                <Upload size={22} className="text-[#667085]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#344054]">
                  Drop an Excel or PDF here
                </p>
                <p className="text-xs text-[#667085] mt-0.5">or click to browse</p>
                <p className="text-[11px] text-[#98a2b3] mt-2">.xlsx · .csv · .pdf accepted</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-medium text-[#344054] border border-[#d0d5dd] rounded-lg bg-white hover:bg-[#f2f4f7] transition-colors"
              >
                Browse files
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
        active
          ? 'bg-white text-[#0e2c46] shadow-sm'
          : 'text-[#667085] hover:text-[#344054]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
