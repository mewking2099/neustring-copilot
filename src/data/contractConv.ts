// ── Shared wizard conversation types ─────────────────────────────────────────

export interface WizardConvReply {
  id: string
  btn: string
  userText: string
  aiText: string
  next?: number
}

export interface WizardConvConfig {
  conv: Record<number, WizardConvReply[]>
  pillClass: Record<number, string>
  pillLabel: Record<number, string>
  stepIntro: Record<number, string>
  modeLabel: string
}

// ── Flow A — Create Contract (Manual) ─────────────────────────────────────────

export const CONTRACT_CREATE_LABELS = ["Type", "Parties", "Clauses", "Terms", "Validate", "Submit"]

export const CONTRACT_CREATE_CONFIG: WizardConvConfig = {
  modeLabel: "Contract creation",
  conv: {
    1: [
      {
        id: "c1a", btn: "Bilateral Wholesale Roaming",
        userText: "Bilateral Wholesale Roaming",
        aiText: "Type: Bilateral Wholesale Roaming 🔒 Locked. Who are the parties?",
        next: 2,
      },
      {
        id: "c1b", btn: "Unilateral Inbound",
        userText: "Unilateral Inbound",
        aiText: "Unilateral Inbound confirmed. Ready for party details.",
        next: 2,
      },
    ],
    2: [
      {
        id: "c2a", btn: "Yaana Solutions LLC · Delaware",
        userText: "Counterparty: Yaana Solutions LLC, Delaware",
        aiText: "Counterparty set ✓ Yaana Solutions LLC — Delaware, US · Governing law: Delaware. Choose clauses.",
        next: 3,
      },
    ],
    3: [
      {
        id: "c3a", btn: "Use GSMA standard clauses",
        userText: "Use GSMA standard clauses",
        aiText: "Standard clauses applied ✓ Confidentiality, Payment Terms, SLA, Dispute Resolution all included. Moving to terms.",
        next: 4,
      },
    ],
    4: [
      {
        id: "c4a", btn: "Net-30, 24 months, EUR",
        userText: "Net-30, 24 months, EUR",
        aiText: "Commercial terms set ✓ Net-30, 24-month term, EUR billing. Running legal validation.",
        next: 5,
      },
    ],
    5: [
      {
        id: "c5a", btn: "Accept and submit",
        userText: "Accept warnings and submit",
        aiText: "Contract submitted ✓ Routed to J. Harrison via DocuSign.",
        next: 6,
      },
      {
        id: "c5b", btn: "What's the data retention warning?",
        userText: "Explain the data retention warning",
        aiText: "Clause 8.4 has no data retention limit. GDPR best practice recommends 36 months post-termination. You can proceed and update it later.",
      },
    ],
    6: [
      {
        id: "c6a", btn: "View contract",
        userText: "View contract #CTR-29201",
        aiText: "Contract #CTR-29201 is live in DocuSign, awaiting J. Harrison's e-signature. Expected turnaround: 2 business days.",
      },
    ],
  },
  pillClass: {
    1: "bg-blue-100 text-blue-800",
    2: "bg-[#0e2c46] text-white",
    3: "bg-[#e8f2ce] text-[#4d7c0f]",
    4: "bg-amber-100 text-amber-800",
    5: "bg-[#e8f2ce] text-[#4d7c0f]",
    6: "bg-[#e8f2ce] text-[#4d7c0f]",
  },
  pillLabel: { 1: "Type", 2: "Parties", 3: "Clauses", 4: "Terms", 5: "Validating", 6: "Submitted" },
  stepIntro: {
    1: "What type of contract are you creating? Start by selecting the agreement structure.",
    2: "Who's the counterparty? Enter the entity name and jurisdiction.",
    3: "Choose which clauses to include. GSMA standard clauses cover the most common scenarios.",
    4: "Set the commercial terms — payment schedule, duration, and billing currency.",
    5: "Legal validation complete. Review any warnings before submitting.",
    6: "Contract submitted! It's been routed for e-signature via DocuSign.",
  },
}

// ── Flow B — Create from Deal ─────────────────────────────────────────────────

export const CONTRACT_FROM_DEAL_LABELS = ["Deal", "Template", "Create", "Ready"]

export const CONTRACT_FROM_DEAL_CONFIG: WizardConvConfig = {
  modeLabel: "Create from deal",
  conv: {
    1: [
      {
        id: "fd1a", btn: "Deal #29107 — West Africa",
        userText: "Select Deal #29107 — West Africa",
        aiText: "Deal #29107 loaded ✓ 6 networks · Data+Voice+SMS · €320K/yr · 24 months. Choose a contract template.",
        next: 2,
      },
    ],
    2: [
      {
        id: "fd2a", btn: "GSMA BA.12 Standard",
        userText: "Use GSMA BA.12 Standard template",
        aiText: "GSMA BA.12 selected ✓ Full clause set with all standard protections. Populating terms from deal...",
        next: 3,
      },
      {
        id: "fd2b", btn: "Simplified (Data+Voice only)",
        userText: "Use the Simplified template",
        aiText: "Simplified template selected ✓ SMS/IoT clauses removed. Populating commercial terms from deal...",
        next: 3,
      },
    ],
    3: [
      {
        id: "fd3a", btn: "Create contract",
        userText: "Create contract from deal #29107",
        aiText: "Contract created ✓ All terms auto-populated from Deal #29107.",
        next: 4,
      },
    ],
    4: [
      {
        id: "fd4a", btn: "View Contract #CTR-29202",
        userText: "View Contract #CTR-29202",
        aiText: "Contract #CTR-29202 is ready. Terms matched the deal exactly — no adjustments needed.",
      },
    ],
  },
  pillClass: {
    1: "bg-blue-100 text-blue-800",
    2: "bg-[#e8f2ce] text-[#4d7c0f]",
    3: "bg-amber-100 text-amber-800",
    4: "bg-[#e8f2ce] text-[#4d7c0f]",
  },
  pillLabel: { 1: "Deal", 2: "Template", 3: "Create", 4: "Ready" },
  stepIntro: {
    1: "Which deal should this contract be based on? Search by ID or select a recent deal.",
    2: "Pick a contract template. GSMA BA.12 is the default for most wholesale agreements.",
    3: "All terms have been auto-populated from the deal. Review and confirm.",
    4: "Contract created! All terms were pulled directly from the deal.",
  },
}

// ── Flow C — Edit Contract ────────────────────────────────────────────────────

export const CONTRACT_EDIT_LABELS = ["Select", "Clause", "Propose", "Save"]

export const CONTRACT_EDIT_CONFIG: WizardConvConfig = {
  modeLabel: "Contract editing",
  conv: {
    1: [
      {
        id: "e1a", btn: "Open Yaana Solutions LLC",
        userText: "Open Yaana Solutions LLC contract",
        aiText: "Contract loaded ✓ CTR-28910 · Yaana Solutions LLC · Active. Which clause would you like to edit?",
        next: 2,
      },
    ],
    2: [
      {
        id: "e2a", btn: "Confidentiality clause",
        userText: "Edit Confidentiality clause",
        aiText: "Clause 8.2 loaded. Current language: 3-year post-termination confidentiality period. Propose your new text.",
        next: 3,
      },
      {
        id: "e2b", btn: "Payment Terms clause",
        userText: "Edit Payment Terms clause",
        aiText: "Clause 3.1 loaded. Current terms: Net-30, EUR, late payment 1.5%/mo. What changes would you like to propose?",
        next: 3,
      },
    ],
    3: [
      {
        id: "e3a", btn: "Update to 5-year term",
        userText: "Update to 5-year confidentiality term",
        aiText: "Change noted. Running legal validation — 5-year term exceeds GSMA BA.12 standard (3 years). Recommend adding a review clause at year 3.",
        next: 4,
      },
    ],
    4: [
      {
        id: "e4a", btn: "Confirm and save",
        userText: "Confirm and save the change",
        aiText: "Saved ✓ Clause 8.2 updated. Change logged in the audit trail. Counterparty notified.",
      },
    ],
  },
  pillClass: {
    1: "bg-blue-100 text-blue-800",
    2: "bg-[#0e2c46] text-white",
    3: "bg-amber-100 text-amber-800",
    4: "bg-[#e8f2ce] text-[#4d7c0f]",
  },
  pillLabel: { 1: "Select", 2: "Clause", 3: "Propose", 4: "Saved" },
  stepIntro: {
    1: "Which contract would you like to edit? Open a recent contract or search by ID.",
    2: "Which clause needs updating? Select from the clause tree or use a quick reply.",
    3: "Current clause language is shown. Propose your revised text or use a quick reply.",
    4: "Change validated. Confirm to save and notify the counterparty.",
  },
}

// ── Contract analysis data (Flow D) ──────────────────────────────────────────

export interface ContractChange {
  id: number
  severity: "Critical" | "Medium" | "Low"
  type: string
  title: string
  explanation: string
  removed: string
  added: string
  recommendation: string
}

export const CONTRACT_CHANGES: ContractChange[] = [
  {
    id: 1, severity: "Critical", type: "Financial",
    title: "Interest Rate: 1.5%/mo → 5.5%/mo",
    explanation: "The late payment interest rate has been increased by 4 percentage points, significantly increasing financial exposure.",
    removed: "Interest on overdue amounts shall accrue at a rate of 1.5% per month.",
    added: "Interest on overdue amounts shall accrue at a rate of 5.5% per month or the maximum rate permitted by applicable law.",
    recommendation: "Reject this change. The proposed rate is 3× the market standard. Counter-propose with 2% maximum.",
  },
  {
    id: 2, severity: "Critical", type: "Jurisdiction",
    title: "Governing Law: United States → United Kingdom",
    explanation: "Jurisdiction shift from US to UK has significant implications for dispute resolution and applicable regulations.",
    removed: "This Agreement shall be governed by the laws of the State of Delaware, United States.",
    added: "This Agreement shall be governed by the laws of England and Wales, United Kingdom.",
    recommendation: "Flag for legal review. UK jurisdiction may be acceptable depending on your operational footprint, but requires assessment of Brexit-related regulatory implications.",
  },
  {
    id: 3, severity: "Medium", type: "Legal",
    title: "Confidentiality scope narrowed",
    explanation: "The definition of 'Confidential Information' has been narrowed, potentially excluding certain operational data from protection.",
    removed: "Confidential Information includes all technical, business, financial, and operational data exchanged under this Agreement.",
    added: "Confidential Information includes only explicitly marked or designated information exchanged under this Agreement.",
    recommendation: "Negotiate to restore the broader definition or add a schedule explicitly listing protected data categories.",
  },
  {
    id: 4, severity: "Medium", type: "Financial",
    title: "Insurance requirement reduced",
    explanation: "Minimum insurance coverage amounts have been reduced, lowering the financial protection available in case of claims.",
    removed: "Each party shall maintain general liability insurance of no less than $10,000,000 per occurrence.",
    added: "Each party shall maintain general liability insurance of no less than $2,000,000 per occurrence.",
    recommendation: "Verify this aligns with your internal risk policy. If $10M is a corporate minimum, reject this reduction.",
  },
  {
    id: 5, severity: "Medium", type: "Dispute",
    title: "Dispute resolution moved to London (LCIA)",
    explanation: "Arbitration venue moved from San Francisco (JAMS) to London (LCIA), adding travel costs and procedural complexity.",
    removed: "Disputes shall be resolved through binding arbitration administered by JAMS in San Francisco, California.",
    added: "Disputes shall be resolved through binding arbitration administered by LCIA in London, England.",
    recommendation: "Evaluate based on your legal team's preference. If US operations are primary, push back on this change.",
  },
  {
    id: 6, severity: "Medium", type: "Financial",
    title: "Payment terms: Net-30 → Net-45",
    explanation: "Payment window extended from Net-30 to Net-45, impacting cash flow timing.",
    removed: "Invoices are due and payable within 30 days of receipt.",
    added: "Invoices are due and payable within 45 days of receipt.",
    recommendation: "Acceptable if counterparty is strategic. Counter-propose Net-35 as a compromise.",
  },
  {
    id: 7, severity: "Low", type: "Operational",
    title: "Termination notice: 30 days → 60 days",
    explanation: "Required notice for termination for convenience increased from 30 to 60 days.",
    removed: "Either party may terminate this Agreement for convenience upon 30 days written notice.",
    added: "Either party may terminate this Agreement for convenience upon 60 days written notice.",
    recommendation: "Generally acceptable. 60-day notice is standard for agreements of this value.",
  },
  {
    id: 8, severity: "Low", type: "Operational",
    title: "Force majeure updated to include pandemics",
    explanation: "Pandemic events have been explicitly added to the force majeure definition.",
    removed: "Force majeure events include acts of God, war, strikes, and government actions.",
    added: "Force majeure events include acts of God, war, strikes, government actions, pandemics, and epidemics declared by WHO.",
    recommendation: "Accept this change. Explicit pandemic inclusion is now standard market practice post-COVID-19.",
  },
]

export const SEV_CONFIG = {
  Critical: { border: "#f04438", bg: "#fff5f5", color: "#b42318", icon: "🔴" },
  Medium:   { border: "#ca8504", bg: "#fffaeb", color: "#92400e", icon: "🟡" },
  Low:      { border: "#2e90fa", bg: "#eff8ff", color: "#175cd3", icon: "🔵" },
} as const
