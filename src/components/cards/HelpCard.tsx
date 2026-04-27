import { useQuery } from "@tanstack/react-query"
import { fetchHelpData } from "@/services/analytics"
import { CardShell } from "./CardShell"
import { CardLoading } from "./CardLoading"
import { CardError } from "./CardError"

interface Props { onChip?: (flowId: string) => void }

export function HelpCard({ onChip }: Props) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["help"],
    queryFn: fetchHelpData,
  })

  if (isLoading) return <CardLoading title="Help" rows={5} />
  if (isError || !data) return <CardError title="Help" onRetry={refetch} />

  return (
    <CardShell
      title="How to group TADIG codes for a multi-country deal"
      subtitle="Step-by-step walkthrough"
      chips={data.chips}
      onChip={onChip}
    >
      <div className="px-4 py-4 space-y-3">
        {data.steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-5 h-5 rounded-full bg-[#0e2c46] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
              {i + 1}
            </span>
            <p className="text-sm text-[#344054] leading-relaxed">{step}</p>
          </div>
        ))}

        <div className="mt-4 rounded-lg bg-[#182230] px-4 py-3 font-mono text-xs text-[#82bc34] leading-relaxed" aria-label="Code example">
          <div className="text-[#667085] mb-1">{"// Example: reference group in deal API"}</div>
          <div>{"{"}</div>
          <div className="pl-4">
            <span className="text-[#c2ddf5]">"tadig_group"</span>{": "}
            <span className="text-[#82bc34]">"east-africa-2025"</span>{","}
          </div>
          <div className="pl-4">
            <span className="text-[#c2ddf5]">"services"</span>{": ["}
            <span className="text-[#82bc34]">"DATA"</span>{", "}
            <span className="text-[#82bc34]">"VOICE"</span>{"]"}
          </div>
          <div>{"}"}</div>
        </div>
      </div>
    </CardShell>
  )
}
