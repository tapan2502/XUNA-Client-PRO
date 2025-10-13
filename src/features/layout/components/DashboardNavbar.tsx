import NavbarTabs from "./navbar/NavbarTabs"
import NavbarActions from "./navbar/NavbarActions"
import NavbarUserMenu from "./navbar/NavbarUserMenu"

export default function DashboardNavbar() {
  return (
    <header className="h-16 border-b border-divider bg-background flex items-center px-6 shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Left - Tabs */}
        <NavbarTabs />

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          <NavbarActions />
          <div className="w-px h-6 bg-divider mx-1" />
          <NavbarUserMenu />
        </div>
      </div>
    </header>
  )
}
