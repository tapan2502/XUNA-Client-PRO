import { NavLink } from "react-router-dom"

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Deployments", href: "/dashboard/deployments" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Team", href: "/dashboard/team" },
  { label: "Settings", href: "/dashboard/settings" },
]

export default function NavbarTabs() {
  return (
    <div className="flex items-center gap-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.href}
          to={tab.href}
          className={({ isActive }) =>
            `text-sm font-medium transition-colors relative py-1 ${
              isActive ? "text-primary" : "text-foreground-600 hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {tab.label}
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
