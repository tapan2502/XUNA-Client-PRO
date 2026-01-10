"use client"

import type React from "react"

import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "@/features/auth/pages/Login"
import Signup from "@/features/auth/pages/Signup"
import DashboardShell from "@/features/layout/components/Dashboard"
import DashboardHome from "@/features/dashboard/pages/DashboardHome"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"
import { useAppDispatch, useAppSelector } from "./hooks"
import { 
  initAuthListener, 
  selectAuthInitializing, 
  selectEffectiveUser,
  selectIsImpersonationLoading,
  setIsImpersonationLoading
} from "@/store/authSlice"
import Profile from "@/features/profile/pages/Profile"
import AgentDetails from "@/features/agents/pages/AgentDetails"
import CallHistory from "@/features/call-history/pages/CallHistory"
import PhoneNumbers from "@/features/dashboard/pages/PhoneNumbers"
import Agents from "@/features/dashboard/pages/Agents"
import KnowledgeBase from "@/features/dashboard/pages/KnowledgeBase"
import KnowledgeBaseDetails from "@/features/dashboard/pages/KnowledgeBaseDetails"
import Campaigns from "@/features/dashboard/pages/Campaigns"
import Tools from "@/features/dashboard/pages/Tools"
import Settings from "@/features/settings/pages/Settings"
import Billing from "@/features/billing/pages/Billing"

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector(selectEffectiveUser)
  const initializing = useAppSelector(selectAuthInitializing)

  if (initializing) return <LoadingSpinner />
  return user ? <>{children}</> : <Navigate to="/login" replace />
}
const PublicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector(selectEffectiveUser)
  const initializing = useAppSelector(selectAuthInitializing)

  if (initializing) return <LoadingSpinner />
  return user ? <Navigate to="/agents" replace /> : <>{children}</>
}

export default function AppRoutes() {
  const dispatch = useAppDispatch()
  const initializing = useAppSelector(selectAuthInitializing)
  const isImpersonationLoading = useAppSelector(selectIsImpersonationLoading)

  useEffect(() => {
    dispatch(initAuthListener())
  }, [dispatch])

  // Fail-safe for indefinite loading state
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isImpersonationLoading) {
      console.log('[AppRoutes] Loading fail-safe timer started (4s)');
      timeout = setTimeout(() => {
        console.warn('[AppRoutes] Loading fail-safe triggered. Force clearing loading state.');
        dispatch(setIsImpersonationLoading(false));
      }, 4000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isImpersonationLoading, dispatch]);

  return (
    <>
      {isImpersonationLoading && <LoadingOverlay />}
      <BrowserRouter>
        <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnly>
              <Signup />
            </PublicOnly>
          }
        />
        <Route
          path="/"
          element={
            <Protected>
              <DashboardShell />
            </Protected>
          }
        >
          <Route index element={<Navigate to="/agents" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="call-history" element={<CallHistory />} />

          <Route path="phone-numbers" element={<PhoneNumbers />} />
          <Route path="agents" element={<DashboardHome />} />
          <Route path="agents/:agentId" element={<AgentDetails />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="knowledge-base/:documentId" element={<KnowledgeBaseDetails />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="tools" element={<Tools />} />
          <Route path="settings" element={<Settings />} />
          <Route path="billing" element={<Billing />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </>
  )
}
