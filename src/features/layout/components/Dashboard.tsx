import { Outlet, Navigate } from "react-router-dom"
import HeroUIProSidebar from "./HeroUIProSidebar"
import HeroUINavbar from "./HeroUINavbar"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useAppSelector } from "@/app/hooks"
import { selectAuthInitializing, selectEffectiveUser } from "@/store/authSlice"

export default function Dashboard() {
  const initializing = useAppSelector(selectAuthInitializing);
  const user = useAppSelector(selectEffectiveUser);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <HeroUINavbar />
      <div className="flex-1 flex overflow-hidden">
        <HeroUIProSidebar />
        <main className="flex-1 overflow-y-auto bg-default-50/50 dark:bg-background relative">
          {initializing ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : !user ? (
            <Navigate to="/login" replace />
          ) : (
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            }>
              <Outlet />
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}