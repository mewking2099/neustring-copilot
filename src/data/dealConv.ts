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
      id: "1a", btn: "Bilateral deal",
      userText: "I'd like to create a Bilateral deal",
      aiText: "Bilateral confirmed ✓ Both operators exchange roaming traffic. Deal type locked. Now let's pick your network partners.",
      next: 2,
    },
    {
      id: "1b", btn: "Unilateral inbound",
      userText: "Set up a Unilateral inbound deal",
      aiText: "Switched to Unilateral Inbound. One-way roaming from partner into your network. Deal type locked. Which network partner?",
      next: 2,
    },
    {
      id: "1c", btn: "What's the difference?",
      userText: "What's the difference between deal types?",
      aiText: "Bilateral = two-way exchange: both operators route traffic to each other. Unilateral = one-way: only one operator's subscribers roam. IOT-only covers inter-operator billing only, no commercial commitment.",
    },
  ],
  2: [
    {
      id: "2a", btn: "West Africa regional group",
      userText: "Use the West Africa regional group",
      aiText: "West Africa resolved: BFACT (Fascel), BWAVC (Mascom), CMTC (MTN CM), GHGLO (Glo Ghana), MLORG (Orange ML), SNTEL (Sonatel). All 6 GSMA-verified ✓",
      next: 3,
    },
    {
      id: "2b", btn: "Scandinavia partners",
      userText: "Add Scandinavia partners",
      aiText: "Scandinavia group loaded: SWTAB (Telia SE), NOTEL (Telenor NO), FINNO (DNA FI), DNKTDC (TDC DK), DNKIA (Hi3G DK). 5 networks loaded ✓",
      next: 3,
    },
    {
      id: "2c", btn: "Add DNKIA and DEUD1",
      userText: "Add DNKIA and DEUD1 manually",
      aiText: "DNKIA (Hi3G Denmark) + DEUD1 (1&1 Germany) added. Both GSMA-verified ✓ Ready to continue.",
      next: 3,
    },
  ],
  3: [
    {
      id: "3a", btn: "All services — Data, Voice, SMS",
      userText: "Include all services: Data, Voice, SMS",
      aiText: "Data (GPRS/LTE/5G), Voice (MTC), SMS (MO+MT) all confirmed ✓ IoT APN flagged as pending. Proceeding to rate config.",
      next: 4,
    },
    {
      id: "3b", btn: "Data and Voice only",
      userText: "Data and Voice only — no SMS",
      aiText: "Data + Voice confirmed. SMS excluded ✓ Rates will cover Data and Voice tiers only. Moving to rate config.",
      next: 4,
    },
  ],
  4: [
    {
      id: "4a", btn: "Clone from deal #23525",
      userText: "Clone rates from deal #23525",
      aiText: "Rates cloned from DEAL-23525 ✓ NB-IoT adjusted to 0.45 (GSMA benchmark floor). Review the grid and confirm when ready.",
    },
    {
      id: "4b", btn: "Apply market benchmarks",
      userText: "Apply current market benchmarks",
      aiText: "Market benchmarks applied ✓ Data LTE at 0.72, Voice MTC at 0.028, SMS MO at 0.006. NB-IoT flagged below floor — proceed with caution.",
    },
    {
      id: "4c", btn: "Rates confirmed",
      userText: "Rates confirmed — move to terms",
      aiText: "Rates locked ✓ Moving to deal terms. You can still return to edit if needed.",
      next: 5,
    },
  ],
  5: [
    {
      id: "5a", btn: "24 months, auto-renew, EUR",
      userText: "Set 24 months, auto-renew, EUR billing",
      aiText: "Terms set ✓ 24-month term, auto-renew enabled, EUR billing. Running final validation now...",
      next: 6,
    },
    {
      id: "5b", btn: "36 months, USD",
      userText: "36 months, billed in USD",
      aiText: "36-month term confirmed. USD billing — FX rate lock added (quarterly refix). Running validation.",
      next: 6,
    },
  ],
  6: [
    {
      id: "6a", btn: "Accept and submit",
      userText: "Accept warnings and submit the deal",
      aiText: "Deal #29107 submitted ✓ Routed to J. Mercier for approval. You'll receive a notification when reviewed.",
      next: 7,
    },
    {
      id: "6b", btn: "Explain asymmetric commitment",
      userText: "What does asymmetric commitment mean?",
      aiText: "Your inbound traffic commitment is ~40% higher than outbound. This is common when the partner has a larger subscriber base. It's not a blocker — you can add a volume cap to manage exposure.",
    },
  ],
  7: [
    {
      id: "7a", btn: "View deal summary",
      userText: "Show me the deal summary",
      aiText: "Deal #29107 ✓ Bilateral · 6 West Africa networks · 24 months · €320K/yr estimated. Pending approval from J. Mercier. Expected SLA: 3 business days.",
    },
    {
      id: "7b", btn: "Create another",
      userText: "Create another deal",
      aiText: "Starting fresh! What type of deal would you like to create?",
      next: 1,
    },
  ],
}

export const DEAL_STEP_LABELS = ["Intent", "Networks", "Services", "Rates", "Terms", "Validate", "Submit"]

export const STEP_PILL_CLASS: Record<number, string> = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-[#e8f2ce] text-[#4d7c0f]",
  3: "bg-amber-100 text-amber-800",
  4: "bg-blue-100 text-blue-800",
  5: "bg-[#e8f2ce] text-[#4d7c0f]",
  6: "bg-red-100 text-red-800",
  7: "bg-[#e8f2ce] text-[#4d7c0f]",
}

export const STEP_PILL_LABEL: Record<number, string> = {
  1: "Intent",
  2: "Networks",
  3: "Services",
  4: "Rates",
  5: "Terms",
  6: "Validating",
  7: "Complete",
}

export const STEP_INTRO: Record<number, string> = {
  1: "Let's start with the deal type. What kind of roaming arrangement are you setting up?",
  2: "Now pick the network partners. Use a predefined regional group or add individual TADIG codes.",
  3: "Which services should this deal cover? I'll flag anything that needs special handling.",
  4: "Time to configure the rates. I can clone from an existing deal or apply current market benchmarks.",
  5: "Let's set the deal terms — duration, billing currency, and renewal conditions.",
  6: "Running validation now. Review any flags before submitting.",
  7: "Deal submitted! You can view the summary or start a new deal.",
}

export const DEAL_WIZARD_CONFIG: WizardConvConfig = {
  modeLabel: "Guided deal creation",
  conv: DEAL_CONV,
  pillClass: STEP_PILL_CLASS,
  pillLabel: STEP_PILL_LABEL,
  stepIntro: STEP_INTRO,
}
