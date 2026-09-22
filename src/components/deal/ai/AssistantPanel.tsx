import { useState } from 'react'
import { ChangeLogList } from './ChangeLogList'
import { ContextualActions } from './ContextualActions'
import { AssistantInput } from './AssistantInput'

interface AssistantMessage {
  id: string
  role: 'ai'
  text: string
}

let panelMsgCounter = 0
function nextPanelId() { return `panel-ai-${++panelMsgCounter}` }

type Tab = 'chat' | 'activity'

export function AssistantPanel() {
  const [tab, setTab] = useState<Tab>('chat')
  const [actionMessages, setActionMessages] = useState<AssistantMessage[]>([])

  function handleAssistantMessage(text: string) {
    setActionMessages((prev) => [...prev, { id: nextPanelId(), role: 'ai', text }])
    // Switch to chat so the response is visible
    setTab('chat')
  }

  return (
    <div className="w-72 border-l border-[#e4e7ec] bg-[#f9fafb] shrink-0 flex flex-col h-full overflow-hidden">

      {/* Header + tab bar */}
      <div className="shrink-0 bg-white border-b border-[#e4e7ec]">
        <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0e2c46]">Iris</p>
            <p className="text-[10px] text-[#667085]">Deal assistant</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#82bc34] block" aria-hidden="true" />
            <span className="text-[11px] text-[#82bc34] font-medium">Live</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-2 gap-0">
          {(['chat', 'activity'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors capitalize ${
                tab === t
                  ? 'border-[#0e2c46] text-[#0e2c46]'
                  : 'border-transparent text-[#98a2b3] hover:text-[#344054]'
              }`}
            >
              {t === 'chat' ? 'Ask Iris' : 'Activity'}
            </button>
          ))}
        </div>
      </div>

      {/* Chat tab */}
      {tab === 'chat' && (
        <>
          {/* Compact contextual action pills — only appears when actions exist */}
          <ContextualActions onAssistantMessage={handleAssistantMessage} />
          {/* Full-height message thread + input */}
          <AssistantInput extraMessages={actionMessages} />
        </>
      )}

      {/* Activity tab */}
      {tab === 'activity' && (
        <div className="flex-1 overflow-y-auto">
          <ChangeLogList />
        </div>
      )}
    </div>
  )
}
