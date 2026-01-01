"use client"

import type React from "react"

import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "@/features/auth/pages/Login"
import Signup from "@/features/auth/pages/Signup"
import DashboardShell from "@/features/layout/components/Dashboard"
import DashboardHome from "@/features/dashboard/pages/DashboardHome"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useAppDispatch, useAppSelector } from "./hooks"
import { initAuthListener, selectAuthInitializing, selectEffectiveUser } from "@/store/authSlice"
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

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector(selectEffectiveUser)
  return user ? <>{children}</> : <Navigate to="/login" replace />
}
const PublicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector(selectEffectiveUser)
  return user ? <Navigate to="/agents" replace /> : <>{children}</>
}

export default function AppRoutes() {
  const dispatch = useAppDispatch()
  const initializing = useAppSelector(selectAuthInitializing)

  useEffect(() => {
    dispatch(initAuthListener())
  }, [dispatch])

  return (
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
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
