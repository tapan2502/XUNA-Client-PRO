import NavbarTabs from "./navbar/NavbarTabs"
import NavbarActions from "./navbar/NavbarActions"

export default function DashboardNavbar() {
  return (
    <header className="h-16 border-b border-divider bg-background flex items-center px-6 shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Left - Tabs */}
        <NavbarTabs />

        {/* Right - Actions */}
        <NavbarActions />
      </div>
    </header>
  )
}
