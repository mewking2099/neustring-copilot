import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useDealStore } from '@/store/deal'
import { deriveContextualActions } from '@/domain/ai/contextualActionRules'
import { getMockResponse } from '@/domain/ai/mockResponseTemplates'
import type { ContextualAction } from '@/domain/ai/contextualActionRules'

interface Props {
  onAssistantMessage: (text: string) => void
}

export function ContextualActions({ onAssistantMessage }: Props) {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set())

  const { shell, cards } = useDealStore(
    useShallow((s) => ({ shell: s.shell, cards: s.cards })),
  )

  const actions = deriveContextualActions(shell, cards)

  function handleAction(action: ContextualAction) {
    if (doneIds.has(action.id)) return

    useDealStore.getState().logChange(`Quick action: ${action.label}`, 'ai.action')

    const response = getMockResponse(action.handler, shell, cards)
    onAssistantMessage(response)

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
    <div
      className="shrink-0 flex items-center gap-1.5 px-3 py-2 border-b border-[#f0f2f5] bg-white overflow-x-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      {actions.map((action) => {
        const isDone = doneIds.has(action.id)
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => handleAction(action)}
            disabled={isDone}
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium whitespace-nowrap transition-colors disabled:opacity-50 ${
              isDone
                ? 'border-[#82bc34] bg-[#f0f7e0] text-[#4a7010]'
                : 'border-[#e4e7ec] bg-[#f9fafb] text-[#344054] hover:border-[#0e2c46] hover:text-[#0e2c46]'
            }`}
          >
            {isDone ? '✓ Done' : action.label}
          </button>
        )
      })}
    </div>
  )
}
