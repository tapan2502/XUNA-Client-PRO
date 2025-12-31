import logo from "@/assets/logo.png";

export default function SidebarLogo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className={`h-[80px] flex items-center ${isCollapsed ? "justify-center" : "px-6"}`}>
      <div className={`${isCollapsed ? "hidden" : "flex items-center"}`}>
        <img src={logo} alt="XUNA Logo" className="h-14 w-auto object-contain invert dark:invert-0" />
      </div>
    </div>
  )
}
