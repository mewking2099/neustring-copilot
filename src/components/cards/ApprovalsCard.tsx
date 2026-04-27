import { useQuery } from "@tanstack/react-query"
import { fetchApprovalsData } from "@/services/rodeo"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

interface Props { onChip?: (flowId: string) => void }

export function ApprovalsCard({ onChip: _onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["approvals"],
    queryFn: fetchApprovalsData,
  })

  if (isLoading) return <CardLoading title="Approval Queue" rows={2} />
  if (isError || !data) return <CardError title="Approval Queue" onRetry={refetch} />

  return (
    <CardShell title="Approval Queue" subtitle={`${data.deals.length} deals pending your sign-off`}>
      <div className="divide-y divide-[#f2f4f7]">
        {data.deals.map((d) => (
          <div key={d.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#667085]">{d.id}</span>
                  <span className="text-xs text-[#98a2b3]">{d.date}</span>
                </div>
                <p className="text-sm font-medium text-[#182230] mt-0.5">{d.counterparty}</p>
                <p className="text-xs text-[#667085]">{d.value} · Submitted by {d.submittedBy}</p>
              </div>
            </div>
            <div className="flex gap-2" role="group" aria-label={`Actions for ${d.counterparty}`}>
              <button className="flex-1 text-xs font-semibold rounded-lg py-1.5 bg-[#82bc34] text-white hover:bg-[#6aa82a] transition-colors">
                Approve
              </button>
              <button className="flex-1 text-xs font-semibold rounded-lg py-1.5 border border-[#d0d5dd] text-[#344054] hover:border-[#0e2c46] hover:text-[#0e2c46] transition-colors">
                Request Changes
              </button>
              <button className="flex-1 text-xs font-semibold rounded-lg py-1.5 border border-[#fca5a5] text-[#b42318] hover:bg-[#fef3f2] transition-colors">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
