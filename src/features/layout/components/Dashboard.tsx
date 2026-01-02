import { Outlet, Navigate } from "react-router-dom"
import HeroUINavbar from "./HeroUINavbar"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useAppSelector } from "@/app/hooks"
import { selectAuthInitializing, selectEffectiveUser } from "@/store/authSlice"
import { Component, ErrorInfo, ReactNode } from "react"

class SimpleErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("SimpleErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 border border-red-200 rounded-2xl m-4">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <pre className="text-sm overflow-auto max-w-full">{this.state.error?.toString()}</pre>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import CompactSidebar from "@/components/hero-ui/sidebar/CompactSidebar"
import XunaSidebar from "@/components/hero-ui/sidebar/XunaSidebar"

export default function Dashboard() {
  const initializing = useAppSelector(selectAuthInitializing);
  const user = useAppSelector(selectEffectiveUser);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <HeroUINavbar />
      <div className="flex-1 flex overflow-hidden relative">
        <CompactSidebar />
        <XunaSidebar />
        <main className="flex-1 overflow-y-auto bg-default-50/50 dark:bg-background relative p-0">
          {initializing ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : !user ? (
            <Navigate to="/login" replace />
          ) : (
            <SimpleErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              }>
                <Outlet />
              </Suspense>
            </SimpleErrorBoundary>
          )}
        </main>
      </div>
    </div>
  );
}