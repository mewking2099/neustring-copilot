import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { springSnappy } from "@/lib/animations"
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
      {/* Iris sparkle mark */}
      <div className="w-8 h-8 flex items-center justify-center mb-1">
        <svg viewBox="200 8 44 46" className="w-5 h-5" fill="none" aria-label="Iris">
          <path
            d="M223.534 8.65137C225.724 13.3577 226.427 21.1527 228.865 27.1218C232.625 28.0506 240.716 29.6783 243.674 31.5816C241.757 33.5308 231.641 35.5591 228.269 36.3829C226.831 40.8677 225.253 48.5019 224.121 53.3224L223.633 53.349C222.36 52.247 219.625 39.2692 218.873 36.3346C213.253 34.6803 206.195 33.1251 200.418 31.6841C206.691 30.223 212.947 28.7012 219.195 27.1193C220.823 21.3976 221.914 14.7221 223.534 8.65137Z"
            fill="#ADD24F"
          />
        </svg>
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
