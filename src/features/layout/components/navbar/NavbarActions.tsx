import ThemeToggle from "@/features/settings/components/ThemeToggle"
import { Button } from "@heroui/react"
import { SettingsIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NavbarActions() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-1 bg-default-100 dark:bg-default-50/50 px-2 py-1.5 rounded-full ml-2 border border-divider/50">
      <ThemeToggle />

      <Button 
        isIconOnly 
        variant="light" 
        size="sm" 
        className="text-default-500 hover:text-foreground transition-colors" 
        aria-label="Settings"
        onPress={() => navigate("/dashboard/settings")}
      >
        <SettingsIcon className="size-[18px]" strokeWidth={2} />
      </Button>
    </div>
  )
}
