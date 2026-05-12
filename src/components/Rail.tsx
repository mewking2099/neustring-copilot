import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { springSnappy } from "@/lib/animations"
import yaanaIcon from "@/assets/yaana-icon.svg"
import { useAppStore } from "@/store/app"
import {
  LayoutDashboard, MessageSquare, TrendingUp, DollarSign,
  FileText, User, Plane, Users, LayoutGrid, Globe,
  NotebookPen, Activity, Info, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"

const RAIL_ITEMS = [
  { id: "dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { id: "chat",       icon: MessageSquare,   label: "Chat" },
  { id: "analytics",  icon: TrendingUp,      label: "Analytics" },
  { id: "deals",      icon: DollarSign,      label: "Deals" },
  { id: "documents",  icon: FileText,        label: "Documents" },
  { id: "profile",    icon: User,            label: "Profile" },
  { id: "roaming",    icon: Plane,           label: "Roaming" },
  { id: "team",       icon: Users,           label: "Team" },
  { id: "views",      icon: LayoutGrid,      label: "Views" },
  { id: "global",     icon: Globe,           label: "Global" },
  { id: "notes",      icon: NotebookPen,     label: "Notes" },
  { id: "rodeo",      icon: Activity,        label: "RoDeO" },
]


export function Rail() {
  const { navOpen, toggleNav, activeRailItem, setActiveRailItem } = useAppStore()

  return (
    <div className="w-12 flex flex-col items-center bg-[#0e2c46] py-3 gap-1 shrink-0 h-full">
      {/* Logo */}
      <div className="w-8 h-8 flex items-center justify-center mb-1">
        <img src={yaanaIcon} alt="Yaana" className="w-7 h-7 object-contain" />
      </div>

      {/* Sidebar toggle */}
      <motion.button
        onClick={toggleNav}
        aria-label={navOpen ? "Collapse sidebar" : "Expand sidebar"}
        aria-expanded={navOpen}
        aria-controls="nav-sidebar"
        title={navOpen ? "Collapse sidebar" : "Expand sidebar"}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-lg transition-colors mb-1",
          navOpen
            ? "bg-white/8 text-white/70 hover:text-white hover:bg-white/10"
            : "text-[#ADD24F] hover:text-white hover:bg-white/10"
        )}
        style={!navOpen ? { backgroundColor: "rgba(173,210,79,0.18)" } : undefined}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        transition={springSnappy}
      >
        {navOpen
          ? <PanelLeftClose className="w-4 h-4" />
          : <PanelLeftOpen className="w-4 h-4" />
        }
      </motion.button>

      {/* Nav icons */}
      <nav aria-label="Main navigation" className="flex flex-col items-center gap-1">
        {RAIL_ITEMS.map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            aria-label={label}
            aria-pressed={activeRailItem === id}
            title={label}
            onClick={() => setActiveRailItem(id)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
              activeRailItem === id
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            transition={springSnappy}
          >
            <Icon className="w-4 h-4" />
          </motion.button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Info */}
      <motion.button
        aria-label="Help"
        title="Help"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        transition={springSnappy}
      >
        <Info className="w-4 h-4" />
      </motion.button>
    </div>
  )
}
