import { useEffect, useState } from "react"
import { Mail } from "lucide-react"
import { useAppStore } from "@/store/app"
import { DealIngestionView } from "@/views/DealIngestionView"

type ActivePanel = "none" | "ingestion"

export function DealEntryView() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("none")
  const setQualifyingDrawerOpen = useAppStore((s) => s.setQualifyingDrawerOpen)

  useEffect(() => {
    document.title = "New Deal — NeuString Co-Pilot"
    // Open the unified creation drawer immediately — this IS the entry point
    setQualifyingDrawerOpen(true)
  }, [setQualifyingDrawerOpen])

  if (activePanel === "ingestion") {
    return (
      <DealIngestionView
        mode="email"
        onBack={() => setActivePanel("none")}
      />
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-[#f8f9fc]">
      <div className="w-full max-w-xs text-center space-y-4">
        <p className="text-sm text-[#98a2b3]">
          Use the drawer to set up a new deal, or import from a document.
        </p>

        <button
          type="button"
          onClick={() => setActivePanel("ingestion")}
          className="w-full flex items-center gap-3 rounded-xl border border-[#e4e7ec] bg-white px-5 py-4 text-left hover:border-[#0e2c46] transition-colors"
        >
          <Mail className="w-5 h-5 text-[#0e2c46] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#0e2c46]">From email or document</p>
            <p className="text-xs text-[#667085] mt-0.5">Paste an email or upload a file to auto-fill</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setQualifyingDrawerOpen(true)}
          className="text-xs text-[#667085] hover:text-[#0e2c46] transition-colors underline underline-offset-2"
        >
          Open deal setup drawer
        </button>
      </div>
    </div>
  )
}
