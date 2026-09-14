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

export function AssistantPanel() {
  const [actionMessages, setActionMessages] = useState<AssistantMessage[]>([])

  function handleAssistantMessage(text: string) {
    setActionMessages((prev) => [...prev, { id: nextPanelId(), role: 'ai', text }])
  }

  return (
    <div className="w-80 border-l border-[#e4e7ec] bg-[#f9fafb] shrink-0 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#e4e7ec] flex items-center justify-between bg-white shrink-0">
        <div>
          <p className="text-sm font-semibold text-[#0e2c46]">AI Assistant</p>
          <p className="text-xs text-[#667085]">Deal mode</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#82bc34] block" aria-hidden="true" />
          <span className="text-xs text-[#82bc34] font-medium">Live</span>
        </div>
      </div>

      {/* Change log */}
      <div className="border-b border-[#e4e7ec] max-h-40 overflow-y-auto shrink-0 bg-white">
        <ChangeLogList />
      </div>

      {/* Contextual actions */}
      <div className="border-b border-[#e4e7ec] shrink-0 bg-white">
        <ContextualActions onAssistantMessage={handleAssistantMessage} />
      </div>

      {/* Message thread + input — takes remaining space */}
      <AssistantInput extraMessages={actionMessages} />
    </div>
  )
}
