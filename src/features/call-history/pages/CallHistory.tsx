"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchConversations, fetchConversationDetails, clearSelectedConversation } from "@/store/callHistorySlice"
import { Headphones, BarChart, Search } from "lucide-react"
import CallHistoryFilters from "../components/CallHistoryFilters"
import CallHistoryDetails from "../components/CallHistoryDetails"
import CallHistoryTable from "../components/CallHistoryTabel"

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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Call History</h1>
                <p className="text-sm text-muted-foreground mt-1">View and analyze your conversation history</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-accent px-4 py-2 rounded-lg">
              <BarChart className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{conversations.length} Total Calls</span>
            </div>

            {(searchQuery || activeFilters > 0) && (
              <div className="hidden lg:flex items-center space-x-2 bg-[hsl(var(--primary))]/10 px-4 py-2 rounded-lg">
                <Search className="w-4 h-4 text-[hsl(var(--primary))]" />
                <span className="text-sm font-medium text-[hsl(var(--primary))]">
                  {filteredConversations.length} Filtered Results
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6">
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
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <CallHistoryTable conversations={filteredConversations} onSelectConversation={setSelectedConversationId} />
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
