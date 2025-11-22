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
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-[hsl(var(--sidebar-hover))] text-foreground"
            : "text-muted-foreground hover:bg-[hsl(var(--sidebar-hover))] hover:text-foreground"
        } ${isCollapsed ? "justify-center px-2" : ""}`
      }
      title={isCollapsed ? label : undefined}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}
