import type { ReactNode } from "react"

interface SidebarNavSectionProps {
  title?: string
  children: ReactNode
}

export default function SidebarNavSection({ title, children, isCollapsed }: SidebarNavSectionProps & { isCollapsed?: boolean }) {
  return (
    <div className="space-y-1">
      {title && !isCollapsed && (
        <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] opacity-60">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
