import { CONTRACT_CHANGES, type ContractChange } from "@/data/contractConv"

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

// ── Contract Review ───────────────────────────────────────────────────────────

export interface ContractReviewData {
  name: string
  id: string
  signedDate: string
  quickFacts: Array<{ label: string; value: string; sub: string }>
  sections: Array<{
    icon: string
    title: string
    color: { bg: string; border: string; dot: string }
    bullets: string[]
  }>
  flags: Array<{ sev: "Critical" | "Medium" | "Low"; text: string; hint: string }>
}

export async function fetchContractReviewData(_contractId?: string): Promise<ContractReviewData> {
  await delay(800)
  return {
    name: "Yaana Solutions LLC",
    id: "#CTR-28910",
    signedDate: "Signed Jan 2024 · Amended Apr 2025",
    quickFacts: [
      { label: "Agreement Type", value: "MSA",      sub: "Master Services" },
      { label: "Payment Terms",  value: "Net-30",   sub: "USD" },
      { label: "Late Interest",  value: "1.5%/mo",  sub: "or max allowed" },
      { label: "Cure Period",    value: "30 days",  sub: "for breach" },
      { label: "Liability Cap",  value: "12 months",sub: "of fees paid" },
      { label: "Arbitration",    value: "AAA",      sub: "California" },
    ],
    sections: [
      { icon: "📋", title: "Overview & Structure",        color: { bg: "#eef2f7", border: "#0e2c46", dot: "#0e2c46" },
        bullets: ["Master Services Agreement under GSMA BA.12 framework", "Effective January 2024 — Version 2 active April 2025", "Bilateral roaming arrangement with mutual traffic exchange"] },
      { icon: "👥", title: "Parties & Scope",             color: { bg: "#eff8ff", border: "#2e90fa", dot: "#2e90fa" },
        bullets: ["NeuString (Operator A) and Yaana Solutions LLC (Operator B)", "Scope: wholesale international roaming — voice, data, SMS", "Roaming services across Delaware, US jurisdiction"] },
      { icon: "💰", title: "Commercial Terms & Billing",  color: { bg: "#f0fdf4", border: "#16a34a", dot: "#16a34a" },
        bullets: ["Net-30 payment terms, USD billing currency", "Late payment interest: 1.5%/month or maximum permitted", "Quarterly reconciliation with 5-day dispute window"] },
      { icon: "⏱️", title: "Termination Rights",          color: { bg: "#fffbeb", border: "#ca8504", dot: "#ca8504" },
        bullets: ["30-day written notice for termination for convenience", "Immediate termination for material breach after 30-day cure period", "Survival of confidentiality and payment obligations"] },
      { icon: "⚖️", title: "Dispute Resolution",          color: { bg: "#eef2f7", border: "#0e2c46", dot: "#0e2c46" },
        bullets: ["Binding arbitration under AAA rules, California", "90-day negotiation period before initiating arbitration", "Each party bears own legal costs unless arbitrator orders otherwise"] },
      { icon: "🔒", title: "Confidentiality & Data Security", color: { bg: "#eff8ff", border: "#2e90fa", dot: "#2e90fa" },
        bullets: ["3-year post-termination confidentiality obligation", "GDPR-aligned data processing provisions", "Subscriber data access limited to roaming session metadata"] },
      { icon: "🛡️", title: "Warranties & Liability",      color: { bg: "#fff5f5", border: "#f04438", dot: "#f04438" },
        bullets: ["Service uptime SLA: 99.5% monthly availability", "Liability capped at 12 months of fees paid by claimant", "Consequential damages excluded with limited exceptions"] },
      { icon: "📐", title: "Operational & General",       color: { bg: "#f9fafb", border: "#d0d5dd", dot: "#667085" },
        bullets: ["GSMA technical standards compliance required", "Annual rate review with 45-day notice of proposed changes", "Force majeure excludes economic downturns and market changes"] },
    ],
    flags: [
      { sev: "Medium", text: "Governing law specifies 'United States' broadly — no specific state designated.", hint: "Consider adding Delaware or New York for more precise jurisdiction." },
      { sev: "Medium", text: "All implied warranties disclaimed (AS-IS, NO FAULT).", hint: "Standard in B2B telecom, but review against your internal vendor policy." },
      { sev: "Low",    text: "Customer gross-up obligation has no upper bound.", hint: "Add a cap or mutual gross-up to balance exposure." },
    ],
  }
}

// ── Contract Analysis ─────────────────────────────────────────────────────────

export interface ContractAnalysisResult {
  changes: ContractChange[]
}

export async function fetchContractAnalysisData(): Promise<ContractAnalysisResult> {
  await delay(750)
  return { changes: CONTRACT_CHANGES }
}
