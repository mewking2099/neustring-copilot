export function detectFlow(text: string): string {
  const t = text.toLowerCase()

  if (t.includes("contract") && t.includes("creat")) return "contract-create"
  if (t.includes("contract") && t.includes("edit"))  return "contract-edit"
  if (t.includes("contract") && (t.includes("review") || t.includes("analys"))) return "contract-review"
  if (t.includes("deal") && t.includes("creat"))     return "deal"
  if (t.includes("task") || t.includes("priority"))  return "tasks"
  if (t.includes("approv"))                          return "approvals"
  if (t.includes("coher"))                           return "coherency"
  if (t.includes("miss") || t.includes("gap"))       return "gaps"
  if (t.includes("anomal") || t.includes("spike"))   return "anomaly"
  if (t.includes("negotiat") || t.includes("vodafone")) return "negotiation"
  if (t.includes("tadig"))                           return "tadig"
  if (t.includes("tap") || t.includes("how do i"))  return "help"
  if (t.includes("forecast"))                        return "forecast"
  if (t.includes("ranking") || t.includes("fraf1")) return "multirankings"
  if (t.includes("partner") || t.includes("scandinavia")) return "partners"
  if (t.includes("corridor"))                        return "rankings"

  return "traffic"
}
