import { ChevronDown } from "lucide-react"

export default function SidebarUserProfile() {
  return (
    <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] transition-colors">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
        <span className="text-white text-xs font-bold">KM</span>
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-foreground truncate">Kate Moore</p>
        <p className="text-xs text-muted-foreground truncate">Customer Support</p>
      </div>
      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  )
}
