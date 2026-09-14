import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ClipboardList, Zap, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { DealIngestionView } from "@/views/DealIngestionView"
import { QuickStartWizard } from "@/components/deal/entry/QuickStartWizard"

type ActivePanel = "none" | "ingestion"

export function DealEntryView() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("none")
  const [quickDraftOpen, setQuickDraftOpen] = useState(false)

  useEffect(() => {
    document.title = "New Deal — NeuString Co-Pilot"
  }, [])

  if (activePanel === "ingestion") {
    return (
      <DealIngestionView
        mode="email"
        onBack={() => setActivePanel("none")}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-start h-full px-6 py-12 bg-[#f8f9fc] overflow-y-auto">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-[#0e2c46]">Create a Deal</h1>
            <p className="text-sm text-[#667085] mt-1">Choose how you want to start</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Guided Setup */}
            <div className={cn("rounded-xl border bg-white p-6 flex flex-col", "border-[#e4e7ec] hover:border-[#0e2c46] transition-colors")}>
              <div className="mb-4 text-[#0e2c46]"><ClipboardList size={28} /></div>
              <h2 className="text-sm font-semibold text-[#0e2c46] mb-1">Guided Setup</h2>
              <p className="text-xs text-[#667085] mb-6 flex-1">
                Step-by-step wizard with AI guidance. Best for complete deals with known rates.
              </p>
              <Link
                to="/deal/new"
                className="w-full bg-[#82bc34] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#6fa02c] transition-colors text-center block"
              >
                Start wizard →
              </Link>
            </div>

            {/* Quick Draft */}
            <div className={cn("rounded-xl border bg-white p-6 flex flex-col", "border-[#e4e7ec] hover:border-[#0e2c46] transition-colors")}>
              <div className="mb-4 text-[#0e2c46]"><Zap size={28} /></div>
              <h2 className="text-sm font-semibold text-[#0e2c46] mb-1">Quick Draft</h2>
              <p className="text-xs text-[#667085] mb-6 flex-1">
                Your network is pre-filled. Pick a partner and period — go straight to the deal canvas.
              </p>
              <button
                type="button"
                onClick={() => setQuickDraftOpen(true)}
                className="w-full border border-[#d0d5dd] text-[#344054] text-sm font-semibold py-2 rounded-lg hover:bg-[#f2f4f7] transition-colors"
              >
                Create draft →
              </button>
            </div>

            {/* From email or document */}
            <div className={cn("rounded-xl border bg-white p-6 flex flex-col", "border-[#e4e7ec] hover:border-[#0e2c46] transition-colors")}>
              <div className="mb-4 text-[#0e2c46]"><Mail size={28} /></div>
              <h2 className="text-sm font-semibold text-[#0e2c46] mb-1">From email or document</h2>
              <p className="text-xs text-[#667085] mb-6 flex-1">
                Paste an email or upload a file to auto-fill the deal.
              </p>
              <button
                type="button"
                onClick={() => setActivePanel("ingestion")}
                className="w-full border border-[#d0d5dd] text-[#344054] text-sm font-semibold py-2 rounded-lg hover:bg-[#f2f4f7] transition-colors"
              >
                Import →
              </button>
            </div>
          </div>
        </div>
      </div>

      {quickDraftOpen && (
        <QuickStartWizard quickMode onClose={() => setQuickDraftOpen(false)} />
      )}
    </>
  )
}
