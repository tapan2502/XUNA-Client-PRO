import { Button } from "@heroui/react"
import { Sun, Moon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { setTheme } from "@/store/settingsSlice"
import { applyTheme } from "@/app/theme"

export default function ThemeToggle() {
  const d = useAppDispatch()
  const mode = useAppSelector((s) => s.settings.theme)

  const toggleTheme = () => {
    const next = mode === "light" ? "dark" : "light"
    d(setTheme(next))
    applyTheme(next)
  }

  return (
    <Button isIconOnly variant="light" size="sm" onPress={toggleTheme}>
      {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
