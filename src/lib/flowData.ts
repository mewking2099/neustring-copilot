import type { ContractChoice } from "@/store/chat"

export const FLOW_TRIGGER_TEXT: Record<string, string> = {
  traffic:       "Show me current traffic patterns",
  forecast:      "Forecast inbound traffic from Deutsche Telekom for Q3 2025",
  rankings:      "Show corridor rankings",
  partners:      "Show partner status for Scandinavian network",
  multirankings: "Multi-service rankings for FRAF1",
  negotiation:   "Summarise Vodafone Germany negotiation and suggest next steps",
  help:          "Help me get started",
  tasks:         "Show my priority tasks",
  approvals:     "Show deals awaiting approval",
  coherency:     "Check contract coherency",
  gaps:          "Show missing rates and service gaps",
  anomaly:       "Show traffic anomalies",
  tadig:         "Verify TADIG codes",
  "contract-review":                "I'd like to review a contract",
  "contract-review-compare":        "Compare with another version",
  "contract-review-compare-result": "Analysis complete",
}

export const AI_TEXT: Record<string, string> = {
  traffic:       "Here's the traffic pattern analysis across your key corridors. I've highlighted the top corridors by volume and flagged any unusual trends.",
  forecast:      "Based on historical trends and current signals, here's the Q3 inbound traffic forecast from your top partners. The model projects a 14% increase from Deutsche Telekom.",
  rankings:      "Here are your top outbound corridors ranked by traffic volume. France → Germany leads this period, up 8% month-over-month.",
  partners:      "Current partner status for your Scandinavian network. Two partners are showing early expiry signals — I'd recommend scheduling a rate review.",
  multirankings: "Multi-service breakdown for the FRAF1 corridor across voice, data, and SMS. Data traffic is up 22% this quarter.",
  negotiation:   "Here's the negotiation summary for Vodafone Germany. Based on current rates and market benchmarks, I've outlined three suggested next steps.",
  help:          "Here's a quick guide to the most common flows. You can ask me about traffic, forecasts, deals, contracts, or partner status — or use the Operations panel on the left.",
  tasks:         "Here are your 3 highest-priority tasks this week, ranked by deadline and impact.",
  approvals:     "Two deals are currently awaiting your approval. I've summarised the key terms and flagged any deviations from policy.",
  coherency:     "Found coherency failures in your active contract portfolio. These clauses conflict across agreements and should be resolved before the next billing cycle.",
  gaps:          "Identified missing rate entries across 4 active deals. These gaps could lead to billing disputes — here's what needs to be filled.",
  anomaly:       "Detected 3 traffic anomalies in the last 48 hours. The largest spike is on the DE→FR corridor — 340% above the 7-day average.",
  tadig:         "Here are the TADIG verification results for your submitted codes.",
  "contract-review":                  "Sure. Which contract would you like to review?",
  "contract-review-analyze":          "Here's the full analysis of your selected contract.",
  "contract-review-compare":          "Upload the contract version you'd like to compare. You can drop a file or I'll simulate the upload.",
  "contract-review-compare-result":   "Analysis complete. Here's the clause-by-clause comparison.",
}

export const CONTRACT_CHOICES: ContractChoice[] = [
  {
    id: "CTR-29101",
    name: "Yaana Solutions LLC",
    version: "V1 (Jan 2024) vs V2 (Apr 2025)",
    summary: "8 changes across 6 clauses",
  },
  {
    id: "CTR-28902",
    name: "Deutsche Telekom AG",
    version: "V2 (Mar 2025) vs V3 (Dec 2025)",
    summary: "3 minor amendments",
  },
  {
    id: "CTR-28801",
    name: "Vodafone DE",
    version: "V1 (Sep 2023) vs V2 (Jan 2025)",
    summary: "12 changes, 2 critical flags",
  },
]
