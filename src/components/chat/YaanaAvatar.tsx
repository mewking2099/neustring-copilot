import yaanaIcon from "@/assets/yaana-icon.svg"
import { cn } from "@/lib/utils"

export function YaanaAvatar({ className }: { className?: string }) {
  return (
    <div className={cn("w-7 h-7 rounded-full bg-[#0e2c46] flex items-center justify-center flex-shrink-0", className)}>
      <img src={yaanaIcon} alt="" className="w-4 h-4 object-contain" />
    </div>
  )
}
