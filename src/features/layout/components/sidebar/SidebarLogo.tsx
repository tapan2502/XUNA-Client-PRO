import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react"

interface SidebarLogoProps {
  isCollapsed?: boolean
  toggleCollapse: () => void
}

export default function SidebarLogo({ isCollapsed, toggleCollapse }: SidebarLogoProps) {
  return (
    <div className={`h-[60px] border-b border-[hsl(var(--divider))] flex items-center ${isCollapsed ? "justify-center" : "px-4"}`}>
      <button 
        onClick={toggleCollapse}
        className={`group flex items-center w-full h-full text-foreground hover:text-primary transition-colors ${isCollapsed ? "justify-center" : "justify-between"}`}
      >
        {isCollapsed ? (
          /* Collapsed: Show X logo box with hover effect */
          <div className="relative w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg shrink-0 overflow-hidden">
            {/* Default "X" - Hidden on hover when collapsed */}
            <span className="absolute transition-opacity duration-200 group-hover:opacity-0">
              X
            </span>
            
            {/* Expand Icon - Visible on hover when collapsed */}
            <PanelLeftOpen 
              size={18} 
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            />
          </div>
        ) : (
          /* Expanded: Show only XUNA text and collapse icon */
          <>
            <span className="text-xl font-bold tracking-wide">
              XUNA
            </span>
            <PanelLeftClose size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
          </>
        )}
      </button>
    </div>
  )
}
