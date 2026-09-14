import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDealStore } from '@/store/deal'

import { DealPageHeader } from '@/components/deal/page/DealPageHeader'
import { DealInfoPanel } from '@/components/deal/page/DealInfoPanel'
import { DealFloatingBar } from '@/components/deal/page/DealFloatingBar'
import { StatementSection } from '@/components/deal/statements/StatementSection'
import { StatementSettingsModal } from '@/components/deal/statements/StatementSettingsModal'
import { TheReadPanel } from '@/components/deal/ai/theRead/TheReadPanel'
import { AssistantPanel } from '@/components/deal/ai/AssistantPanel'

export function DealPageView() {
  const shell = useDealStore((s) => s.shell)
  const [settingsOpen, setSettingsOpen] = useState<string | null>(null)

  useEffect(() => {
    document.title = shell
      ? `${shell.name} — NeuString Co-Pilot`
      : 'Deal — NeuString Co-Pilot'
  }, [shell])

  if (!shell) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-[#667085]">
        <p className="text-sm">
          No deal loaded.{' '}
          <Link to="/deal/entry" className="text-[#0e2c46] underline hover:no-underline">
            Start a new deal
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f4f5f7]">
      {/* Slim top bar */}
      <DealPageHeader />

      {/* Three-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — deal info + scenario */}
        <DealInfoPanel />

        {/* MIDDLE — statement cards + read, floating bar at bottom */}
        <div className="flex-1 overflow-hidden flex flex-col relative min-w-0">
          <div className="flex-1 overflow-y-auto pb-20">
            <StatementSection onOpenSettings={(id) => setSettingsOpen(id)} />
            <TheReadPanel />
          </div>

          {/* Floating action bar — centered at bottom of middle column */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <DealFloatingBar />
            </div>
          </div>
        </div>

        {/* RIGHT — AI assistant */}
        <AssistantPanel />
      </div>

      {settingsOpen && (
        <StatementSettingsModal
          statementId={settingsOpen}
          onClose={() => setSettingsOpen(null)}
        />
      )}
    </div>
  )
}
