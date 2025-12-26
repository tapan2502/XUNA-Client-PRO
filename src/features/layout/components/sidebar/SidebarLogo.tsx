import logo from "@/assets/logo.png";

export default function SidebarLogo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className={`h-[60px] border-b border-[hsl(var(--divider))] flex items-center ${isCollapsed ? "justify-center" : "px-4"}`}>
      <div className="flex items-center justify-center w-full h-full">
        <img src={logo} alt="XUNA Logo" className="h-10 w-auto object-contain invert dark:invert-0" />
      </div>
    </div>
  )
}
