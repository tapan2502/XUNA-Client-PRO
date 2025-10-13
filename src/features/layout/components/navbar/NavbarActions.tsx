import { Button } from "@heroui/react"
import { Search, Bell, SettingsIcon } from "lucide-react"
import ThemeToggle from "@/features/settings/components/ThemeToggle"

export default function NavbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button isIconOnly variant="light" size="sm" className="text-foreground-600" aria-label="Search">
        <Search className="size-[18px]" strokeWidth={2} />
      </Button>

      <ThemeToggle />

      <Button isIconOnly variant="light" size="sm" className="text-foreground-600" aria-label="Settings">
        <SettingsIcon className="size-[18px]" strokeWidth={2} />
      </Button>

      <div className="relative">
        <Button isIconOnly variant="light" size="sm" className="text-foreground-600" aria-label="Notifications">
          <Bell className="size-[18px]" strokeWidth={2} />
        </Button>
        <span
          className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          5
        </span>
      </div>
    </div>
  )
}
