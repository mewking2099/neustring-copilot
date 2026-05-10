import { useEffect, useRef, useState } from "react"
import { FileText } from "lucide-react"
import type { CardProps } from "./index"

type UploadState = "idle" | "uploading" | "processing"

const PROCESSING_STEPS = [
  "Extracting clauses from uploaded contract",
  "Parsing Version 2 reference document",
  "Comparing clause-by-clause differences",
  "Classifying severity & generating recommendations",
]

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function ContractUploadCard({ onChip }: CardProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState("")
  const [completedSteps, setCompletedSteps] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const startedRef = useRef(false)

  async function startUpload(name: string) {
    if (startedRef.current) return
    startedRef.current = true
    setFileName(name)
    setUploadState("uploading")

    // Animate progress bar 0→100
    for (let p = 0; p <= 100; p += 5) {
      setProgress(p)
      await delay(60)
    }

    setUploadState("processing")
    setCompletedSteps(0)

    // Complete processing steps one by one
    for (let i = 1; i <= PROCESSING_STEPS.length; i++) {
      await delay(400)
      setCompletedSteps(i)
    }

    // Auto-advance
    await delay(300)
    onChip?.("contract-review-compare-result")
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) startUpload(file.name)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) startUpload(file.name)
  }

  // Auto-start simulation if no real file dropped within 2s
  useEffect(() => {
    const t = setTimeout(() => {
      if (!startedRef.current) startUpload("contract_v2_yaana.pdf")
    }, 2000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (uploadState === "idle") {
    return (
      <div className="mt-3 max-w-md">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors"
          style={{
            borderColor: dragOver ? "#0e2c46" : "#d0d5dd",
            backgroundColor: dragOver ? "#f2f4f7" : "white",
          }}
        >
          <div className="mb-3"><FileText className="w-8 h-8 text-[#98a2b3]" /></div>
          <p className="text-sm font-medium text-[#344054]">
            {dragOver ? "Drop to upload" : "Drop your contract file here"}
          </p>
          <p className="text-xs text-[#667085] mt-1">Supports .pdf, .docx, .txt · Max 10MB</p>
          <button className="mt-4 rounded-lg border border-[#d0d5dd] bg-white text-[#344054] text-xs px-3 py-1.5 hover:bg-[#f2f4f7] transition-colors">
            Browse files
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    )
  }

  if (uploadState === "uploading") {
    return (
      <div className="mt-3 max-w-md space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#0e2c46]" />
          <span className="text-sm text-[#344054] font-medium truncate">{fileName}</span>
          <span className="text-xs text-[#667085] ml-auto">{progress}%</span>
        </div>
        <div className="h-2 bg-[#e4e7ec] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(to right, #0e2c46, #82bc34)",
            }}
          />
        </div>
        <p className="text-xs text-[#667085]">Uploading…</p>
      </div>
    )
  }

  // processing
  return (
    <div className="mt-3 max-w-md space-y-2">
      <p className="text-sm font-medium text-[#344054] mb-3">Analyzing contract…</p>
      {PROCESSING_STEPS.map((s, i) => {
        const done = i < completedSteps
        const active = i === completedSteps
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {done ? (
                <span className="text-[#82bc34] text-sm font-bold">✓</span>
              ) : active ? (
                <svg className="w-4 h-4 animate-spin text-[#0e2c46]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#e4e7ec]" />
              )}
            </div>
            <span className={`text-xs ${done ? "text-[#82bc34] font-medium" : active ? "text-[#0e2c46]" : "text-[#98a2b3]"}`}>
              {s}
            </span>
          </div>
        )
      })}
    </div>
  )
}
