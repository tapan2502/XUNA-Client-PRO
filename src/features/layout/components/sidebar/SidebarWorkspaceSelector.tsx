import { ChevronDown } from "lucide-react"

export default function SidebarWorkspaceSelector() {
  return (
    <div className="px-3 py-4">
      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] transition-colors">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">X</span>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-foreground">Xuna AI</p>
          <p className="text-xs text-muted-foreground">Core workspace</p>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>
    </div>
  )
}
