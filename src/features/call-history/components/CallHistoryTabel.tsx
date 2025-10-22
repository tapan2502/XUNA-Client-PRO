"use client"

import { motion } from "framer-motion"
import { Clock, MessageSquare, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { Conversation } from "@/store/callHistorySlice"

interface CallHistoryTableProps {
  conversations: Conversation[]
  onSelectConversation: (conversationId: string) => void
}

export default function CallHistoryTable({ conversations, onSelectConversation }: CallHistoryTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
            Positive
          </span>
        )
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Negative
          </span>
        )
      case "unknown":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            Unknown
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            Unknown
          </span>
        )
    }
  }

  const copyToClipboard = (text: string, conversationId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(conversationId)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <MessageSquare className="w-12 h-12 mx-auto text-[hsl(var(--primary))] mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No conversations found</h3>
        <p className="text-muted-foreground">Start a conversation with one of your agents to see the history here</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden divide-y divide-border">
        {conversations.slice(0, 10).map((c) => (
          <button
            key={c.conversation_id}
            onClick={() => onSelectConversation(c.conversation_id)}
            className="w-full text-left p-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{c.agent_name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{formatDate(c.start_time_unix_secs)}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(c.call_duration_secs)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {c.message_count} msgs
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground font-mono truncate">{c.agent_id}</div>
              </div>
              <div className="ml-3 shrink-0">{getStatusBadge(c.call_successful)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Messages
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sentiment Analysis
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {conversations.map((conversation) => (
              <motion.tr
                key={conversation.conversation_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onSelectConversation(conversation.conversation_id)}
                className="hover:bg-accent transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatDate(conversation.start_time_unix_secs)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{conversation.agent_name}</span>
                    <div className="flex items-center font-medium space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">{conversation.agent_id}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(conversation.agent_id, conversation.conversation_id)
                        }}
                        className={`p-1 rounded transition-colors ${
                          copiedId === conversation.conversation_id
                            ? "text-green-500 dark:text-green-400"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title={copiedId === conversation.conversation_id ? "Copied!" : "Copy Agent ID"}
                      >
                        {copiedId === conversation.conversation_id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatDuration(conversation.call_duration_secs)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{conversation.message_count}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(conversation.call_successful)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
