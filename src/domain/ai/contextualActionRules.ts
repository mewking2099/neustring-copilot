import type { DealState } from '@/domain/deal/types'

export interface ContextualAction {
  id: string
  label: string
  icon: string  // Lucide icon name as a string key — component resolves it
  type: 'add' | 'copy' | 'explain' | 'warn'
  handler: 'copyToOutbound' | 'addVoiceMT' | 'addGPRS' | 'explainBUB'
    | 'addDataStatement' | 'addVoiceStatement' | 'addSMSStatement'
}

export function deriveContextualActions(state: DealState): ContextualAction[] {
  const { shell, statements } = state
  const actions: ContextualAction[] = []

  const inbound = statements.filter(s => s.direction === 'inbound')
  const outbound = statements.filter(s => s.direction === 'outbound')
  const shellServices = shell?.serviceTypes ?? []

  const hasData  = shellServices.some(t => ['gprs', 'lte_m', 'nb_iot', '5g'].includes(t))
  const hasVoice = shellServices.some(t => ['voice_mo', 'voice_mt'].includes(t))
  const hasSms   = shellServices.includes('sms')

  // Empty canvas — suggest contextual add actions based on what the deal covers
  if (statements.length === 0) {
    if (hasData) {
      actions.push({
        id: 'add-data-first',
        label: '+ Add Data statement',
        icon: 'Plus',
        type: 'add',
        handler: 'addDataStatement',
      })
    }
    if (hasVoice) {
      actions.push({
        id: 'add-voice-first',
        label: '+ Add Voice statement',
        icon: 'Plus',
        type: 'add',
        handler: 'addVoiceStatement',
      })
    }
    if (hasSms) {
      actions.push({
        id: 'add-sms-first',
        label: '+ Add SMS statement',
        icon: 'Plus',
        type: 'add',
        handler: 'addSMSStatement',
      })
    }
    // Fallback if no shell services declared yet
    if (actions.length === 0) {
      actions.push({
        id: 'add-data-fallback',
        label: '+ Add first statement',
        icon: 'Plus',
        type: 'add',
        handler: 'addDataStatement',
      })
    }
    return actions.slice(0, 4)
  }

  // Inbound exists but outbound empty → offer copy
  if (inbound.length > 0 && outbound.length === 0) {
    actions.push({
      id: 'copy-to-outbound',
      label: 'Mirror to Outbound',
      icon: 'ArrowLeftRight',
      type: 'copy',
      handler: 'copyToOutbound',
    })
  }

  // Missing voice MT statement
  const hasVoiceMT = statements.some(s => s.serviceTypes.includes('voice_mt'))
  if (!hasVoiceMT && hasVoice) {
    actions.push({
      id: 'add-voice-mt',
      label: '+ Add Voice MT',
      icon: 'Plus',
      type: 'add',
      handler: 'addVoiceMT',
    })
  }

  // Missing GPRS statement
  const hasGPRS = statements.some(s => s.serviceTypes.includes('gprs'))
  if (!hasGPRS && hasData) {
    actions.push({
      id: 'add-gprs',
      label: '+ Add GPRS Data',
      icon: 'Plus',
      type: 'add',
      handler: 'addGPRS',
    })
  }

  // B/UB model in use → contextual explain (kept as it's deal-state-aware)
  const hasBUB = statements.some(s => s.model.family === 'B')
  if (hasBUB) {
    actions.push({
      id: 'explain-bub',
      label: '? Why Balanced/Unbalanced?',
      icon: 'HelpCircle',
      type: 'explain',
      handler: 'explainBUB',
    })
  }

  return actions.slice(0, 4)
}
