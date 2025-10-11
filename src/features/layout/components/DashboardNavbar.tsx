import {
  Navbar,
  NavbarContent,
  Button,
  Badge,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react"
import { Search, Bell, SettingsIcon } from "lucide-react"
import { useAppSelector } from "@/app/hooks"
import { selectEffectiveUser } from "@/store/authSlice"
import ThemeToggle from "@/features/settings/components/ThemeToggle"

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Deployments", href: "/dashboard/deployments" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Team", href: "/dashboard/team" },
  { label: "Settings", href: "/dashboard/settings" },
]

export default function DashboardNavbar() {
  const user = useAppSelector(selectEffectiveUser)

  return (
    <Navbar
      maxWidth="full"
      classNames={{
        wrapper: "px-6",
        base: "bg-background border-b border-divider",
      }}
    >
      {/* Left - Tabs */}
      <NavbarContent justify="start" className="gap-6">
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className="text-sm font-medium text-foreground-600 hover:text-foreground transition-colors"
          >
            {tab.label}
          </a>
        ))}
      </NavbarContent>

      {/* Right - Actions */}
      <NavbarContent justify="end" className="gap-3">
        <Button isIconOnly variant="light" size="sm">
          <Search className="size-4" />
        </Button>

        <ThemeToggle />

        <Button isIconOnly variant="light" size="sm">
          <SettingsIcon className="size-4" />
        </Button>

        <Badge content="5" color="danger" size="sm">
          <Button isIconOnly variant="light" size="sm">
            <Bell className="size-4" />
          </Button>
        </Badge>

        <Dropdown>
          <DropdownTrigger>
            <Avatar as="button" size="sm" src="/placeholder-user.jpg" className="cursor-pointer" />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="profile">Profile</DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  )
}
