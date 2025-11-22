"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchConversations, fetchConversationDetails, clearSelectedConversation } from "@/store/callHistorySlice"
import { Headphones, BarChart, Search } from "lucide-react"
import CallHistoryFilters from "../components/CallHistoryFilters"
import CallHistoryDetails from "../components/CallHistoryDetails"
import CallHistoryTable from "../components/CallHistoryTabel"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function CallHistory() {
  const dispatch = useAppDispatch()
  const { conversations, selectedConversation, loading, detailsLoading } = useAppSelector((state) => state.callHistory)

  const [searchQuery, setSearchQuery] = useState("")
  const [dateAfter, setDateAfter] = useState("")
  const [dateBefore, setDateBefore] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")
  const [selectedEvaluation, setSelectedEvaluation] = useState("")
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest")
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

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

  const filteredConversations = conversations
    .filter((conversation) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        conversation.agent_name.toLowerCase().includes(searchLower) ||
        conversation.agent_id.toLowerCase().includes(searchLower) ||
        conversation.conversation_id.toLowerCase().includes(searchLower)

      const matchesDateAfter = !dateAfter || conversation.start_time_unix_secs >= new Date(dateAfter).getTime() / 1000
      const matchesDateBefore =
        !dateBefore || conversation.start_time_unix_secs <= new Date(dateBefore).getTime() / 1000
      const matchesAgent = !selectedAgent || conversation.agent_id === selectedAgent
      const matchesEvaluation = !selectedEvaluation || conversation.call_successful === selectedEvaluation

      return matchesSearch && matchesDateAfter && matchesDateBefore && matchesAgent && matchesEvaluation
    })
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return b.start_time_unix_secs - a.start_time_unix_secs
      } else {
        return a.start_time_unix_secs - b.start_time_unix_secs
      }
    })

  const activeFilters = [dateAfter, dateBefore, selectedAgent, selectedEvaluation].filter(Boolean).length

  if (loading && conversations.length === 0) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="flex flex-col gap-4 h-full p-4 max-w-7xl mx-auto w-full text-foreground">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Call History</h1>
          <p className="text-muted-foreground text-xs mt-1">View and analyze your conversation history</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border border-border">
            <BarChart className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">{conversations.length} Total Calls</span>
          </div>

          {(searchQuery || activeFilters > 0) && (
            <div className="hidden lg:flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
              <Search className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">
                {filteredConversations.length} Filtered Results
              </span>
            </div>
          )}
        </div>
        </div>

      {/* Filters */}
      <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
          <CallHistoryFilters
            conversations={conversations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateAfter={dateAfter}
            setDateAfter={setDateAfter}
            dateBefore={dateBefore}
            setDateBefore={setDateBefore}
            selectedAgent={selectedAgent}
            setSelectedAgent={setSelectedAgent}
            selectedEvaluation={selectedEvaluation}
            setSelectedEvaluation={setSelectedEvaluation}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>


      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex-1 min-h-0">
        <div className="overflow-y-auto h-full">
          <CallHistoryTable conversations={filteredConversations} onSelectConversation={setSelectedConversationId} />
        </div>
      </div>

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
