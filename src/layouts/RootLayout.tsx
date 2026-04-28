import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Rail } from "@/components/Rail"
import { NavSidebar } from "@/components/NavSidebar"
import { Topbar } from "@/components/Topbar"
import { useAppStore } from "@/store/app"

export function RootLayout() {
  const { setNavOpen } = useAppStore()
  const location = useLocation()

  // Auto-collapse sidebar on navigation
  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname, setNavOpen])

  // Auto-collapse sidebar below 1024px viewport width
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)")
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setNavOpen(false) }
    if (mq.matches) setNavOpen(false)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [setNavOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Column 1 — Rail */}
      <Rail />

      {/* Column 2 — Nav Sidebar */}
      <NavSidebar />

      {/* Column 3 — Main pane */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
