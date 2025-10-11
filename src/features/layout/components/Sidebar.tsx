import { NavLink } from "react-router-dom"
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
import { Button, Avatar, Divider } from "@heroui/react"

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
    <aside className="w-64 shrink-0 border-r border-divider bg-content1 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="text-2xl font-bold">XUNA</div>
        </div>
      </div>

      {/* Workspace Selector */}
      <div className="px-4 pb-4">
        <Button
          variant="flat"
          className="w-full justify-start"
          startContent={<Avatar size="sm" name="XA" className="size-6" />}
        >
          <div className="flex flex-col items-start flex-1">
            <span className="text-sm font-medium">Xuna AI</span>
            <span className="text-xs text-foreground-500">Core workspace</span>
          </div>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground-600 hover:bg-content2"
                }`
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <Divider className="my-4" />

        {/* Configuration Section */}
        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-foreground-500 uppercase">Configuration</div>
          {configItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground-600 hover:bg-content2"
                }`
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section - Schedule Call */}
      <div className="p-4 border-t border-divider">
        <div className="bg-content2 rounded-lg p-3 mb-3">
          <p className="text-sm font-medium mb-2">Schedule a Call</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🇺🇸</span>
            <span className="text-sm">+1</span>
          </div>
          <Button color="primary" size="sm" className="w-full">
            Call Me
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <Avatar size="sm" src="/placeholder-user.jpg" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Kate Moore</p>
            <p className="text-xs text-foreground-500 truncate">Customer Support</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
