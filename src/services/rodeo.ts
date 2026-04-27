function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export type TaskPriority = "Critical" | "High" | "Medium"

export interface Task {
  priority: TaskPriority
  title: string
  deadline: string
  initials: string
}

export interface TasksData {
  tasks: Task[]
}

export async function fetchTasksData(): Promise<TasksData> {
  await delay(650)
  return {
    tasks: [
      { priority: "Critical", title: "Renew Vodafone DE rate agreement",    deadline: "Due 2 May",  initials: "JH" },
      { priority: "High",     title: "Resolve coherency failure — CTR-28801", deadline: "Due 6 May",  initials: "AS" },
      { priority: "Medium",   title: "Fill missing SMS rates for TZATN deal", deadline: "Due 12 May", initials: "ME" },
    ],
  }
}

// ── Approvals ─────────────────────────────────────────────────────────────────

export interface DealApproval {
  id: string
  counterparty: string
  value: string
  submittedBy: string
  date: string
}

export interface ApprovalsData {
  deals: DealApproval[]
}

export async function fetchApprovalsData(): Promise<ApprovalsData> {
  await delay(620)
  return {
    deals: [
      { id: "DEAL-4821", counterparty: "Vodafone Germany", value: "€2.4M", submittedBy: "J. Harrison", date: "23 Apr 2025" },
      { id: "DEAL-4798", counterparty: "Telenor Norway",   value: "€890K", submittedBy: "A. Singh",    date: "21 Apr 2025" },
    ],
  }
}

// ── Coherency ─────────────────────────────────────────────────────────────────

export type CoherencySeverity = "High" | "Medium"

export interface CoherencyFailure {
  contract: string
  clause: string
  conflict: string
  suggestion: string
  severity: CoherencySeverity
}

export interface CoherencyData {
  failures: CoherencyFailure[]
}

export async function fetchCoherencyData(): Promise<CoherencyData> {
  await delay(680)
  return {
    failures: [
      {
        contract: "CTR-28801 — Vodafone DE",
        clause: "Clause 4.2 — Rate Variance",
        conflict: "±9% variance conflicts with ±5% limit in CTR-28902",
        suggestion: "Align both contracts to ±5% industry standard",
        severity: "High",
      },
      {
        contract: "CTR-29101 — Yaana Solutions",
        clause: "Clause 7.1 — Billing Cycle",
        conflict: "30-day cycle conflicts with 60-day cycle in master agreement",
        suggestion: "Update clause to reference master agreement billing schedule",
        severity: "Medium",
      },
    ],
  }
}

// ── Gaps ──────────────────────────────────────────────────────────────────────

export type GapImpact = "Billing" | "Minor"

export interface ServiceGap {
  dealId: string
  partner: string
  service: string
  description: string
  impact: GapImpact
}

export interface GapsData {
  gaps: ServiceGap[]
}

export async function fetchGapsData(): Promise<GapsData> {
  await delay(640)
  return {
    gaps: [
      {
        dealId: "DEAL-4821", partner: "Vodafone DE",   service: "SMS-MT",
        description: "Missing outbound rate for DE→AT corridor",
        impact: "Billing",
      },
      {
        dealId: "DEAL-4798", partner: "Telenor NO",    service: "Data",
        description: "No rate entry for LTE-M / NB-IoT service tier",
        impact: "Minor",
      },
      {
        dealId: "DEAL-4712", partner: "DNA Finland",   service: "Voice",
        description: "Outbound peak-hour tariff not defined",
        impact: "Billing",
      },
    ],
  }
}

// ── Anomalies ─────────────────────────────────────────────────────────────────

export interface TrafficAnomaly {
  corridor: string
  service: string
  spikePercent: number
  detected: string
  cause: string
  action: string
}

export interface AnomalyData {
  anomalies: TrafficAnomaly[]
}

export async function fetchAnomalyData(): Promise<AnomalyData> {
  await delay(700)
  return {
    anomalies: [
      {
        corridor: "DE→FR", service: "Data",  spikePercent: 340,
        detected: "24 Apr 2025, 03:12 UTC",
        cause: "Possible SIM-box activity",
        action: "Block suspicious MSISDNs and alert fraud team",
      },
      {
        corridor: "FR→ES", service: "Voice", spikePercent: 87,
        detected: "23 Apr 2025, 18:45 UTC",
        cause: "Public holiday traffic surge",
        action: "Monitor — likely organic; revisit in 48h",
      },
    ],
  }
}
