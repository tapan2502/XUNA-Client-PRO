import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import DashboardNavbar from "./DashboardNavbar"

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
