"use client"

import type React from "react"

import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "@/features/auth/pages/Login"
import Signup from "@/features/auth/pages/Signup"
import DashboardShell from "@/features/layout/components/Dashboard"
import DashboardHome from "@/features/dashboard/pages/DashboardHome"
import { useAppDispatch, useAppSelector } from "./hooks"
import { initAuthListener, selectAuthInitializing, selectEffectiveUser } from "@/store/authSlice"
import Profile from "@/features/profile/pages/Profile"
import AgentDetails from "@/features/agents/pages/AgentDetails"
import CallHistory from "@/features/call-history/pages/CallHistory"

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector(selectEffectiveUser)
  return user ? <>{children}</> : <Navigate to="/login" replace />
}
const PublicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector(selectEffectiveUser)
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function AppRoutes() {
  const dispatch = useAppDispatch()
  const initializing = useAppSelector(selectAuthInitializing)

  useEffect(() => {
    dispatch(initAuthListener())
  }, [dispatch])

  if (initializing) {
    return null
  }

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
          path="/dashboard"
          element={
            <Protected>
              <DashboardShell />
            </Protected>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="call-history" element={<CallHistory />} />
        </Route>
        <Route
          path="/dashboard/agents/:agentId"
          element={
            <Protected>
              <AgentDetails />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
