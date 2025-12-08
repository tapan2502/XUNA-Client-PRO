import { Outlet } from "react-router-dom";
import HeroUIProSidebar from "./HeroUIProSidebar";
import HeroUINavbar from "./HeroUINavbar";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <HeroUINavbar />
      <div className="flex-1 flex overflow-hidden">
        <HeroUIProSidebar />
        <main className="flex-1 overflow-y-auto bg-default-50/50 dark:bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
