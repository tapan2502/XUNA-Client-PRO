import type { ReactNode } from "react"

interface SidebarNavSectionProps {
  title?: string
  children: ReactNode
}

export default function SidebarNavSection({ title, children }: SidebarNavSectionProps) {
  return (
    <div className="space-y-1">
      {title && (
        <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
