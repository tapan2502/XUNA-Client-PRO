import {
  LayoutDashboard,
  Phone,
  Bot,
  BookOpen,
  Wrench,
  Megaphone,
  Users,
  Workflow,
  PhoneCall,
  SettingsIcon,
  Key,
  Mic,
} from "lucide-react"
import SidebarLogo from "./sidebar/SidebarLogo"
import SidebarWorkspaceSelector from "./sidebar/SidebarWorkspaceSelector"
import SidebarNavItem from "./sidebar/SidebarNavItem"
import SidebarNavSection from "./sidebar/SidebarNavSection"
import SidebarScheduleCall from "./sidebar/SidebarScheduleCall"
import SidebarUserProfile from "./sidebar/SidebarUserProfile"
import SidebarIconNav from "./sidebar/SidebarIconNav"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/phone-numbers", label: "Phone Numbers", icon: Phone },
  { to: "/dashboard/assistants", label: "Assistants", icon: Bot },
  { to: "/dashboard/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { to: "/dashboard/tools", label: "Tools & Functions", icon: Wrench },
  { to: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/dashboard/contacts", label: "Contacts", icon: Users },
  { to: "/dashboard/automation", label: "Automation", icon: Workflow },
  { to: "/dashboard/call-logs", label: "Call Logs", icon: PhoneCall },
]

const configItems = [
  { to: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { to: "/dashboard/voice-providers", label: "Voice API Providers", icon: Mic },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
]

export default function Sidebar() {
  return (
    <aside className="shrink-0 border-r border-[hsl(var(--divider))] bg-[hsl(var(--sidebar-bg))] flex h-screen">
      {/* Icon Navigation */}
      <SidebarIconNav />

      {/* Main Sidebar */}
      <div className="w-[240px] flex flex-col h-full">
        {/* Logo */}
        <SidebarLogo />

        {/* Workspace Selector */}
        <SidebarWorkspaceSelector />

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <SidebarNavSection>
            {navItems.map((item) => (
              <SidebarNavItem key={item.to} {...item} />
            ))}
          </SidebarNavSection>

          <div className="my-4 border-t border-[hsl(var(--divider))]" />

          {/* Configuration Section */}
          <SidebarNavSection title="CONFIGURATION">
            {configItems.map((item) => (
              <SidebarNavItem key={item.to} {...item} />
            ))}
          </SidebarNavSection>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[hsl(var(--divider))] space-y-3">
          <SidebarScheduleCall />
          <SidebarUserProfile />
        </div>
      </div>
    </aside>
  )
}
