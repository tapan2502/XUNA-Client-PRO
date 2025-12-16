"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { selectCurrentUserData, fetchUserDetails } from "@/store/authSlice"
import { Phone, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import DataTable from "@/components/hero-ui/DataTable"
import { Chip } from "@heroui/react"

interface Column {
  uid: string
  name: string
  sortable?: boolean
}

export default function CallHistory() {
  const dispatch = useAppDispatch()
  const userData = useAppSelector(selectCurrentUserData)
  
  // Mock call history data - replace with actual API call
  const callHistory = []

  useEffect(() => {
    dispatch(fetchUserDetails())
  }, [dispatch])

  const columns: Column[] = [
    { uid: "phone_number", name: "Phone Number", sortable: true },
    { uid: "agent", name: "Agent", sortable: true },
    { uid: "duration", name: "Duration", sortable: true },
    { uid: "status", name: "Status", sortable: true },
    { uid: "timestamp", name: "Time", sortable: true },
  ]

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "phone_number":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-default-foreground">{item.phone_number}</span>
          </div>
        )
      case "agent":
        return <span className="text-small text-default-500">{item.agent_name || item.agent_id}</span>
      case "duration":
        return (
          <div className="flex items-center gap-1 text-small text-default-500">
            <Clock size={14} />
            {item.duration}
          </div>
        )
      case "status":
        const statusConfig = {
          completed: { color: "success" as const, icon: CheckCircle2 },
          failed: { color: "danger" as const, icon: XCircle },
          in_progress: { color: "warning" as const, icon: AlertCircle },
        }
        const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.in_progress
        return (
          <Chip
            size="sm"
            variant="flat"
            color={config.color}
            startContent={<config.icon size={14} />}
            className="capitalize"
          >
            {item.status.replace("_", " ")}
          </Chip>
        )
      case "timestamp":
        return (
          <span className="text-small text-default-500">
            {new Date(item.timestamp).toLocaleString()}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full p-4 w-full max-w-[95rem] mx-auto flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={callHistory}
        renderCell={renderCell}
        initialVisibleColumns={["phone_number", "agent", "duration", "status", "timestamp"]}
        searchKeys={["phone_number", "agent_name", "agent_id"]}
        searchPlaceholder="Search call history..."
        topBarTitle="Call History"
        topBarCount={callHistory.length}
        emptyContent="No call history found. Start making calls to see them here."
      />
    </div>
  )
}
