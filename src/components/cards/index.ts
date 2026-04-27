import type { ComponentType } from "react"
import { TrafficCard }           from "./TrafficCard"
import { ForecastCard }          from "./ForecastCard"
import { RankingsCard }          from "./RankingsCard"
import { PartnersCard }          from "./PartnersCard"
import { MultiRankingsCard }     from "./MultiRankingsCard"
import { NegotiationCard }       from "./NegotiationCard"
import { TasksCard }             from "./TasksCard"
import { ApprovalsCard }         from "./ApprovalsCard"
import { CoherencyCard }         from "./CoherencyCard"
import { GapsCard }              from "./GapsCard"
import { AnomalyCard }           from "./AnomalyCard"
import { HelpCard }              from "./HelpCard"
import { TadigCard }             from "./TadigCard"
import { ContractReviewCard }    from "./ContractReviewCard"
import { ContractUploadCard }    from "./ContractUploadCard"
import { ContractAnalysisCard }  from "./ContractAnalysisCard"

export interface CardProps {
  onChip?: (flowId: string) => void
}

export const CARD_REGISTRY: Record<string, ComponentType<CardProps>> = {
  traffic:                        TrafficCard,
  forecast:                       ForecastCard,
  rankings:                       RankingsCard,
  partners:                       PartnersCard,
  multirankings:                  MultiRankingsCard,
  negotiation:                    NegotiationCard,
  tasks:                          TasksCard,
  approvals:                      ApprovalsCard,
  coherency:                      CoherencyCard,
  gaps:                           GapsCard,
  anomaly:                        AnomalyCard,
  help:                           HelpCard,
  tadig:                          TadigCard,
  "contract-review-analyze":      ContractReviewCard,
  "contract-review-compare":      ContractUploadCard,
  "contract-review-compare-result": ContractAnalysisCard,
}
