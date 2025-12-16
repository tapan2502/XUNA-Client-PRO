"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchConversations, fetchConversationDetails, clearSelectedConversation } from "@/store/callHistorySlice"
import { Phone, Clock, MessageSquare, Copy, Check } from "lucide-react"
import { Chip, Button } from "@heroui/react"
import DataTable from "@/components/hero-ui/DataTable"
import CallHistoryDetails from "../components/CallHistoryDetails"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

interface Column {
  uid: string
  name: string
  sortable?: boolean
}

export default function CallHistory() {
  const dispatch = useAppDispatch()
  const { conversations, selectedConversation, loading, detailsLoading } = useAppSelector((state) => state.callHistory)

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  useEffect(() => {
    if (selectedConversationId) {
      dispatch(fetchConversationDetails(selectedConversationId))
    } else {
      dispatch(clearSelectedConversation())
    }
  }, [selectedConversationId, dispatch])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const copyToClipboard = (text: string, conversationId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(conversationId)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  // Map conversations to include id for DataTable
  const tableData = conversations.map((conv) => ({
    ...conv,
    id: conv.conversation_id,
  }))

  const columns: Column[] = [
    { uid: "timestamp", name: "Date & Time", sortable: true },
    { uid: "agent", name: "Agent", sortable: true },
    { uid: "duration", name: "Duration", sortable: true },
    { uid: "messages", name: "Messages", sortable: true },
    { uid: "sentiment", name: "Sentiment", sortable: true },
    { uid: "actions", name: "Actions" },
  ]

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "timestamp":
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-default-400" />
            <span className="text-small">{formatDate(item.start_time_unix_secs)}</span>
          </div>
        )
      case "agent":
        return (
          <div className="flex flex-col gap-1">
            <span className="text-small font-medium">{item.agent_name}</span>
            <div className="flex items-center gap-2">
              <span className="text-tiny text-default-400 font-mono">{item.agent_id}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyToClipboard(item.agent_id, item.conversation_id)
                }}
                className={`p-0.5 rounded transition-colors ${
                  copiedId === item.conversation_id
                    ? "text-success"
                    : "text-default-400 hover:text-default-600"
                }`}
                title={copiedId === item.conversation_id ? "Copied!" : "Copy Agent ID"}
              >
                {copiedId === item.conversation_id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )
      case "duration":
        return <span className="text-small font-mono">{formatDuration(item.call_duration_secs)}</span>
      case "messages":
        return (
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4 text-default-400" />
            <span className="text-small">{item.message_count}</span>
          </div>
        )
      case "sentiment":
        const sentimentConfig = {
          success: { color: "success" as const, label: "Positive" },
          failed: { color: "danger" as const, label: "Negative" },
          unknown: { color: "default" as const, label: "Unknown" },
        }
        const config =
          sentimentConfig[item.call_successful as keyof typeof sentimentConfig] || sentimentConfig.unknown
        return (
          <Chip size="sm" variant="flat" color={config.color}>
            {config.label}
          </Chip>
        )
      case "actions":
        return (
          <div className="flex items-center justify-center">
            <Button size="sm" variant="flat" onPress={() => setSelectedConversationId(item.conversation_id)}>
              View Details
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="h-full p-4 w-full max-w-[95rem] mx-auto flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={tableData}
        renderCell={renderCell}
        initialVisibleColumns={["timestamp", "agent", "duration", "messages", "sentiment", "actions"]}
        searchKeys={["agent_name", "agent_id", "conversation_id"]}
        searchPlaceholder="Search conversations..."
        topBarTitle="Call History"
        topBarCount={conversations.length}
        emptyContent="No call history found. Start making calls to see them here."
      />

      {/* Details Sidebar */}
      {selectedConversationId && (
        <CallHistoryDetails
          details={selectedConversation}
          onClose={() => setSelectedConversationId(null)}
          loading={detailsLoading}
        />
      )}
    </div>
  )
}
