import { CheckCircle, XCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchTadigData } from "@/services/analytics"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

interface Props { onChip?: (flowId: string) => void }

export function TadigCard({ onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tadig"],
    queryFn: fetchTadigData,
  })

  if (isLoading) return <CardLoading title="TADIG Verification" rows={4} />
  if (isError || !data) return <CardError title="TADIG Verification" onRetry={refetch} />

  const verified = data.codes.filter((c) => c.verified).length

  return (
    <CardShell
      title="East Africa TADIG Group"
      subtitle={`${data.codes.length} codes · ${verified} verified`}
      chips={data.chips}
      onChip={onChip}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#f2f4f7] bg-[#f9fafb]">
              <th className="px-4 py-2.5 text-left font-medium text-[#667085]">Code</th>
              <th className="px-4 py-2.5 text-left font-medium text-[#667085]">Operator</th>
              <th className="px-4 py-2.5 text-left font-medium text-[#667085]">Country</th>
              <th className="px-4 py-2.5 text-left font-medium text-[#667085]">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.codes.map((row, i) => (
              <tr key={row.code} className={i % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}>
                <td className="px-4 py-2.5 font-mono font-medium text-[#0e2c46]">{row.code}</td>
                <td className="px-4 py-2.5 text-[#344054]">{row.operator}</td>
                <td className="px-4 py-2.5 text-[#667085]">{row.country}</td>
                <td className="px-4 py-2.5">
                  {row.verified ? (
                    <span className="inline-flex items-center gap-1 text-[#027a48]">
                      <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#b42318]">
                      <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardShell>
  )
}
