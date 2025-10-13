import { Phone } from "lucide-react"

export default function SidebarScheduleCall() {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-lg p-3 space-y-3">
      <p className="text-sm font-semibold text-foreground">Schedule a Call</p>
      <div className="flex items-center gap-2">
        <span className="text-lg">🇺🇸</span>
        <span className="text-sm font-medium text-foreground">+1</span>
      </div>
      <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
        <Phone className="w-4 h-4" />
        Call Me
      </button>
    </div>
  )
}
