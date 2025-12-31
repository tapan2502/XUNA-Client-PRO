import { NavLink } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

interface SidebarNavItemProps {
  to: string
  label: string
  icon: LucideIcon
}

export default function SidebarNavItem({ to, label, icon: Icon, isCollapsed }: SidebarNavItemProps & { isCollapsed?: boolean }) {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? "bg-default-100 text-foreground shadow-sm"
            : "text-muted-foreground hover:bg-default-50 hover:text-foreground"
        } ${isCollapsed ? "justify-center px-2" : ""}`
      }
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
          {!isCollapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  )
}
