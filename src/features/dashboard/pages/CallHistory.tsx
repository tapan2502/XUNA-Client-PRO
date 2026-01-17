"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { selectCurrentUserData, fetchUserDetails } from "@/store/authSlice"
import { Phone, Clock, CheckCircle2, XCircle, AlertCircle, MoreVertical, Eye, Trash2 } from "lucide-react"
import XunaTable from "@/components/hero-ui/XunaTable"
import { Chip, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react"
import { Icon } from "@iconify/react"

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
    { uid: "actions", name: "" },
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
      case "actions":
        return (
          <div className="flex justify-end pr-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" className="text-default-500 hover:text-foreground">
                  <MoreVertical size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Call Activity Actions">
                <DropdownItem 
                  key="view" 
                  startContent={<Eye size={18} />}
                >
                  View Details
                </DropdownItem>
                <DropdownItem 
                  key="delete" 
                  className="text-danger" 
                  color="danger" 
                  startContent={<Trash2 size={18} />}
                >
                  Delete Log
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-10 p-6 h-full overflow-hidden">
      <XunaTable
        columns={columns}
        data={callHistory}
        renderCell={renderCell}
        initialVisibleColumns={["phone_number", "agent", "duration", "status", "timestamp", "actions"]}
        searchKeys={["phone_number", "agent_name", "agent_id"]}
        searchPlaceholder="Search call history..."
        topBarTitle="Call History"
        topBarCount={callHistory.length}
        emptyContent="No call history found. Start making calls to see them here."
      />
    </div>
  )
}
