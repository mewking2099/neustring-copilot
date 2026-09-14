export interface DealReply {
  id: string
  btn: string
  userText: string
  aiText: string
  next?: number
}

import type { WizardConvConfig } from "@/data/contractConv"

export const DEAL_CONV: Record<number, DealReply[]> = {
  1: [
    {
      id: "1a", btn: "Vodafone UK (GBVOD)",
      userText: "Select Vodafone UK — GBVOD",
      aiText: "GBVOD selected ✓ You have 5 deals with Vodafone UK — all Bilateral, EUR, Data+Voice+SMS. I'll pre-fill rates and terms from your most recent deal (DL-4471 · Jun 2025). Select your deal type to continue.",
      next: undefined,
    },
    {
      id: "1b", btn: "Deutsche Telekom (DTEDT)",
      userText: "Select Deutsche Telekom — DTEDT",
      aiText: "DTEDT selected ✓ 3 deals on record — 2 Bilateral, 1 Unilateral. Last deal DL-4320 (Apr 2025) was Data+Voice at EUR. I'll suggest rates from that baseline.",
      next: undefined,
    },
    {
      id: "1c", btn: "Clone last GBVOD deal",
      userText: "Clone rates and terms from the last GBVOD deal",
      aiText: "Cloning DL-4471 ✓ Services: Data, Voice, SMS. Rates: €0.850/MB data · €0.029/min voice · €0.007/msg SMS. 24-month term, EUR. All pre-filled — review on the canvas. Moving to Zone 2.",
      next: 2,
    },
  ],
  2: [
    {
      id: "2a", btn: "Keep Data + Voice + SMS",
      userText: "Keep Data, Voice, and SMS services",
      aiText: "Data + Voice + SMS confirmed ✓ That matches 4/5 of your GBVOD deals. Rates pre-filled from DL-4471: €0.850 · €0.029 · €0.007. Accept the data rate to lock it in.",
    },
    {
      id: "2b", btn: "Data + Voice only",
      userText: "Data and Voice only — drop SMS",
      aiText: "Data + Voice confirmed. SMS removed. Rates pre-filled: €0.850/MB · €0.029/min. Accept the data rate when you're ready.",
    },
    {
      id: "2c", btn: "Why accept the data rate?",
      userText: "Why do I need to accept the data rate separately?",
      aiText: "Data rates are high-impact — a wrong value can mean significant billing exposure. We require explicit confirmation so it never silently carries over from an old deal without review. Voice and SMS are accepted automatically as they're lower-risk.",
    },
  ],
  3: [
    {
      id: "3a", btn: "24 months — usual with GBVOD",
      userText: "Set 24 months — that's the usual term",
      aiText: "24-month term set ✓ Same as DL-4471 and DL-3980. Start today, ends in 24 months. EUR billing confirmed from history.",
      next: undefined,
    },
    {
      id: "3b", btn: "12 months instead",
      userText: "Actually make it 12 months",
      aiText: "12-month term confirmed. Shorter than your usual 24m with GBVOD — note this means earlier renewal risk. EUR billing, auto-renewal off (matches 4/5 deals).",
      next: undefined,
    },
    {
      id: "3c", btn: "Terms look good — review",
      userText: "Terms look good, take me to review",
      aiText: "Terms locked ✓ Heading to the review zone — you'll see exactly what's confirmed vs pre-filled.",
      next: 4,
    },
  ],
  4: [
    {
      id: "4a", btn: "Open the deal canvas",
      userText: "Looks good — open the canvas",
      aiText: "Deal created ✓ Canvas is ready. Any pre-filled fields are flagged — click to review before submitting for approval.",
      next: undefined,
    },
    {
      id: "4b", btn: "What are pre-filled fields?",
      userText: "What exactly are pre-filled fields?",
      aiText: "Pre-filled means Iris suggested the value from your deal history, but you didn't explicitly click Accept or edit it. They're safe to proceed with — just worth reviewing on the canvas, especially the data rate.",
    },
  ],
}

export const DEAL_STEP_LABELS = ["Partner", "Services & Rates", "Terms", "Review"]

export const STEP_PILL_CLASS: Record<number, string> = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-[#e8f2ce] text-[#4d7c0f]",
  3: "bg-amber-100 text-amber-800",
  4: "bg-[#e8f2ce] text-[#4d7c0f]",
}

export const STEP_PILL_LABEL: Record<number, string> = {
  1: "Partner",
  2: "Services & Rates",
  3: "Terms",
  4: "Review",
}

export const STEP_INTRO: Record<number, string> = {
  1: "Let's start. Pick a recent partner — I'll pull your deal history and pre-fill what I can. You can also clone your last deal in one click.",
  2: "Which services should this deal cover? Rates are pre-filled from your last deal with this partner. Accept the data rate to lock it in.",
  3: "Set the deal term, dates, and billing currency. I've pre-filled from your history — confirm anything that needs review.",
  4: "Here's your deal summary split into what you confirmed and what I pre-filled. Open the canvas to finalise.",
}

export const DEAL_WIZARD_CONFIG: WizardConvConfig = {
  modeLabel: "Guided deal creation",
  conv: DEAL_CONV,
  pillClass: STEP_PILL_CLASS,
  pillLabel: STEP_PILL_LABEL,
  stepIntro: STEP_INTRO,
}
