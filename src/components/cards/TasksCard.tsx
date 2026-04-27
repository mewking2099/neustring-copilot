import { useQuery } from "@tanstack/react-query"
import { fetchTasksData, type TaskPriority } from "@/services/rodeo"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

const PRIORITY_STYLE: Record<TaskPriority, string> = {
  Critical: "bg-[#fef3f2] text-[#b42318]",
  High:     "bg-[#fffaeb] text-[#b54708]",
  Medium:   "bg-[#f2f4f7] text-[#344054]",
}

interface Props { onChip?: (flowId: string) => void }

export function TasksCard({ onChip: _onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasksData,
  })

  if (isLoading) return <CardLoading title="Priority Tasks" rows={3} />
  if (isError || !data) return <CardError title="Priority Tasks" onRetry={refetch} />

  return (
    <CardShell title="Priority Tasks" subtitle={`${data.tasks.length} items require action · Today`}>
      <div className="divide-y divide-[#f2f4f7]">
        {data.tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLE[t.priority]}`}>
                  {t.priority}
                </span>
                <span className="text-[10px] text-[#98a2b3]">{t.deadline}</span>
              </div>
              <p className="text-sm text-[#344054] leading-snug truncate">{t.title}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#e8f2ce] text-[#0e2c46] text-[10px] font-bold flex items-center justify-center" aria-label={`Assigned to ${t.initials}`}>
                {t.initials}
              </div>
              <button className="text-xs text-[#0e2c46] font-medium border border-[#0e2c46] rounded-lg px-2.5 py-1 hover:bg-[#0e2c46] hover:text-white transition-colors">
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
