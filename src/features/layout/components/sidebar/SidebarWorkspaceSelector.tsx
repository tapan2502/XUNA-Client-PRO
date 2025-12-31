import { ChevronDown } from "lucide-react"

export default function SidebarWorkspaceSelector() {
  return (
    <div className="px-5 py-2">
      <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-default-50 border border-default-200 dark:border-white/5 hover:bg-default-100 transition-all shadow-sm">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">X</span>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-bold text-foreground">Xuna AI</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Core workspace</p>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>
    </div>
  )
}
