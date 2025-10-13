import { Home, Grid3x3, Bell, MessageSquare, ThumbsUp, BarChart3, DollarSign, Settings } from "lucide-react"

const iconNavItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Grid3x3, label: "Apps", active: false },
  { icon: Bell, label: "Notifications", active: false },
  { icon: MessageSquare, label: "Messages", active: false },
  { icon: ThumbsUp, label: "Feedback", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: DollarSign, label: "Billing", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export default function SidebarIconNav() {
  return (
    <div className="w-16 flex flex-col items-center gap-2 py-4 border-r border-divider bg-[hsl(var(--sidebar-icon-nav-bg))]">
      {iconNavItems.map((item, index) => (
        <button
          key={index}
          className={`
            w-10 h-10 flex items-center justify-center rounded-lg
            transition-colors duration-200
            ${
              item.active
                ? "bg-[hsl(var(--sidebar-hover))] text-foreground"
                : "text-muted-foreground hover:bg-[hsl(var(--sidebar-hover))] hover:text-foreground"
            }
          `}
          title={item.label}
        >
          <item.icon className="w-5 h-5" strokeWidth={2} />
        </button>
      ))}

      <div className="mt-auto pt-4 border-t border-divider flex flex-col items-center gap-2">
        <button
          className="w-10 h-8 flex items-center justify-center rounded text-xs font-semibold text-muted-foreground hover:bg-[hsl(var(--sidebar-hover))] hover:text-foreground transition-colors"
          title="Language: Hungarian"
        >
          HU
        </button>
        <button
          className="w-10 h-8 flex items-center justify-center rounded text-xs font-semibold text-muted-foreground hover:bg-[hsl(var(--sidebar-hover))] hover:text-foreground transition-colors"
          title="Language: Turkish"
        >
          TV
        </button>
        <button
          className="w-10 h-8 flex items-center justify-center rounded text-xs font-semibold text-muted-foreground hover:bg-[hsl(var(--sidebar-hover))] hover:text-foreground transition-colors"
          title="Language: Hindi"
        >
          HP
        </button>
      </div>
    </div>
  )
}
