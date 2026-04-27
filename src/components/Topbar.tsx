import { Bell } from "lucide-react"

const USER = { name: "Alex Moreau", role: "Account Manager", initials: "AM" }

export function Topbar() {
  return (
    <div className="flex items-center justify-between h-14 px-6 border-b border-[#e4e7ec] bg-white shrink-0">
      {/* Left — NeuString wordmark */}
      <div className="flex items-center gap-1 select-none">
        <span className="text-[#2e90fa] font-bold text-lg leading-none">Neu</span>
        <span className="text-[#0e2c46] font-bold text-lg leading-none">String</span>
      </div>

      {/* Right — user strip */}
      <div className="flex items-center gap-3">
        {/* Demo count pill */}
        <span className="text-xs text-[#667085] bg-[#f2f4f7] rounded-full px-2.5 py-0.5 font-medium">
          16 flows
        </span>

        {/* Name | Role */}
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-[#344054]">{USER.name}</span>
          <span className="text-[#d0d5dd]">|</span>
          <span className="text-[#667085]">{USER.role}</span>
        </div>

        {/* Bell */}
        <button aria-label="Notifications" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#667085] hover:bg-[#f2f4f7] hover:text-[#0e2c46] transition-colors">
          <Bell className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#0e2c46] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-semibold">{USER.initials}</span>
        </div>
      </div>
    </div>
  )
}
