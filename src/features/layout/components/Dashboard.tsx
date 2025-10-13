import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import DashboardNavbar from "./DashboardNavbar"

export default function Dashboard() {
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto bg-default-50/50 dark:bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
