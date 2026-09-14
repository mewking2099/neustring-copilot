import { useState } from 'react'
import { ArrowLeftRight, Plus, HelpCircle } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useDealStore } from '@/store/deal'
import { deriveContextualActions } from '@/domain/ai/contextualActionRules'
import { getMockResponse } from '@/domain/ai/mockResponseTemplates'
import type { ContextualAction } from '@/domain/ai/contextualActionRules'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowLeftRight,
  Plus,
  HelpCircle,
}

interface Props {
  onAssistantMessage: (text: string) => void
}

export function ContextualActions({ onAssistantMessage }: Props) {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set())

  const state = useDealStore(useShallow((s) => ({
    shell: s.shell,
    statements: s.statements,
    aiChangeLog: s.aiChangeLog,
    entrySource: s.entrySource,
    draftId: s.draftId,
  })))

  const store = useDealStore.getState()
  const actions = deriveContextualActions(state)

  function handleAction(action: ContextualAction) {
    if (doneIds.has(action.id)) return

    function addAndSetTypes(direction: 'inbound' | 'outbound', types: import('@/domain/deal/types').ServiceType[]) {
      store.addStatement(direction)
      const newest = useDealStore.getState().statements.at(-1)
      if (newest) store.updateStatement(newest.id, { serviceTypes: types })
    }

    if (action.handler === 'copyToOutbound') {
      store.copyToOutbound()
    } else if (action.handler === 'addDataStatement') {
      addAndSetTypes('inbound', ['gprs', 'lte_m'])
    } else if (action.handler === 'addVoiceStatement') {
      addAndSetTypes('inbound', ['voice_mo', 'voice_mt'])
    } else if (action.handler === 'addSMSStatement') {
      addAndSetTypes('inbound', ['sms'])
    } else if (action.handler === 'addVoiceMT') {
      addAndSetTypes('inbound', ['voice_mt'])
    } else if (action.handler === 'addGPRS') {
      addAndSetTypes('inbound', ['gprs'])
    }

    store.logChange(`Quick action: ${action.label}`, 'ai.action')

    const response = getMockResponse(action.handler, useDealStore.getState())
    onAssistantMessage(response)

    // Show "Done" briefly
    setDoneIds((prev) => new Set([...prev, action.id]))
    setTimeout(() => {
      setDoneIds((prev) => {
        const next = new Set(prev)
        next.delete(action.id)
        return next
      })
    }, 1500)
  }

  if (actions.length === 0) return null

  return (
    <div className="px-4 pt-3 pb-3">
      <p className="text-[10px] font-semibold tracking-widest text-[#98a2b3] uppercase mb-2">
        Suggested Actions
      </p>
      <div className="space-y-1.5">
        {actions.map((action) => {
          const Icon = ICON_MAP[action.icon] ?? Plus
          const isDone = doneIds.has(action.id)

          const colorClass =
            action.type === 'add'
              ? 'border-[#82bc34] text-[#4a7010] hover:bg-[#f0f7e0]'
              : action.type === 'copy'
              ? 'border-[#0e2c46] text-[#0e2c46] hover:bg-[#f0f4f8]'
              : 'border-[#d0d5dd] text-[#344054] hover:border-[#0e2c46]'

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action)}
              disabled={isDone}
              className={`w-full flex items-center gap-2 text-left text-xs rounded-lg border px-3 py-2 transition-all bg-white ${colorClass} disabled:opacity-60 disabled:cursor-default`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{isDone ? 'Done' : action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
