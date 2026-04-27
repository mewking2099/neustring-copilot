import { create } from "zustand"

export interface ContractChoice {
  id: string
  name: string
  version: string
  summary: string
}

export interface Message {
  id: string
  role?: "user" | "ai"
  kind?: "divider"
  label?: string
  text?: string
  card?: string
  contractChoices?: ContractChoice[]
  isDeal?: boolean
}

interface ChatState {
  messages: Message[]
  isTyping: boolean
  addMessage: (msg: Omit<Message, "id">) => void
  clearMessages: () => void
  setIsTyping: (v: boolean) => void
}

let msgCounter = 0

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, { ...msg, id: `msg-${++msgCounter}` }],
    })),

  clearMessages: () => set({ messages: [], isTyping: false }),

  setIsTyping: (v) => set({ isTyping: v }),
}))
