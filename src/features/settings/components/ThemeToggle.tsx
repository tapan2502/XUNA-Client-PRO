import { useEffect } from "react"
import { Button } from "@heroui/react"
import { Sun, Moon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { setTheme } from "@/store/settingsSlice"
import { applyTheme } from "@/app/theme"

export default function ThemeToggle() {
  const d = useAppDispatch()
  const mode = useAppSelector((s) => s.settings.theme)

  // Ensure theme is applied on mount
  useEffect(() => {
    applyTheme(mode)
  }, [mode])

  const toggleTheme = () => {
    const next = mode === "light" ? "dark" : "light"
    d(setTheme(next))
    applyTheme(next)
    localStorage.setItem("theme", next)
  }

  return (
    <Button isIconOnly variant="light" size="sm" onPress={toggleTheme}>
      {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
