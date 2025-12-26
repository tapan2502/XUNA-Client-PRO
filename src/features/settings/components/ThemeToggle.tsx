import { useEffect } from "react"
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

  const handleSetTheme = (newTheme: "light" | "dark") => {
    d(setTheme(newTheme))
    applyTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <div className="flex items-center gap-1 bg-default-200/50 dark:bg-default-100/50 p-1 rounded-full border border-divider/50">
      <button
        type="button"
        onClick={() => handleSetTheme("light")}
        className={`flex items-center justify-center w-10 h-8 rounded-full transition-all duration-200 ${
          mode === "light" 
            ? "bg-white text-yellow-500 shadow-sm" 
            : "text-default-400 hover:text-default-600"
        }`}
        aria-label="Light mode"
      >
        <Sun size={14} strokeWidth={mode === "light" ? 2.5 : 2} />
      </button>
      <button
        type="button"
        onClick={() => handleSetTheme("dark")}
        className={`flex items-center justify-center w-10 h-8 rounded-full transition-all duration-200 ${
          mode === "dark" 
            ? "bg-default-200/80 dark:bg-default-100 text-blue-400 shadow-sm" 
            : "text-default-400 hover:text-default-600"
        }`}
        aria-label="Dark mode"
      >
        <Moon size={14} strokeWidth={mode === "dark" ? 2.5 : 2} />
      </button>
    </div>
  )
}
