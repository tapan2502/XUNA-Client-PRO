"use client"

import { useState, useEffect } from "react"
import { Search, X, Calendar, ChevronDown } from "lucide-react"
import { FilterDropdown } from "@/components/ui/FilterDropdown"
import type { Conversation } from "@/store/callHistorySlice"

interface CallHistoryFiltersProps {
  conversations: Conversation[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  dateAfter: string
  setDateAfter: (date: string) => void
  dateBefore: string
  setDateBefore: (date: string) => void
  selectedAgent: string
  setSelectedAgent: (agent: string) => void
  selectedEvaluation: string
  setSelectedEvaluation: (evaluation: string) => void
  sortOrder: "latest" | "oldest"
  setSortOrder: (order: "latest" | "oldest") => void
}

export default function CallHistoryFilters({
  conversations,
  searchQuery,
  setSearchQuery,
  dateAfter,
  setDateAfter,
  dateBefore,
  setDateBefore,
  selectedAgent,
  setSelectedAgent,
  selectedEvaluation,
  setSelectedEvaluation,
  sortOrder,
  setSortOrder,
}: CallHistoryFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const getUniqueAgents = () => {
    const agents = conversations.reduce(
      (acc, conv) => {
        if (!acc.find((a) => a.id === conv.agent_id)) {
          acc.push({ id: conv.agent_id, name: conv.agent_name })
        }
        return acc
      },
      [] as { id: string; name: string }[],
    )
    return agents.sort((a, b) => a.name.localeCompare(b.name))
  }

  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case "dateAfter":
        setDateAfter("")
        break
      case "dateBefore":
        setDateBefore("")
        break
      case "agent":
        setSelectedAgent("")
        break
      case "evaluation":
        setSelectedEvaluation("")
        break
    }
  }

  useEffect(() => {
    const filters = []
    if (dateAfter) filters.push("dateAfter")
    if (dateBefore) filters.push("dateBefore")
    if (selectedAgent) filters.push("agent")
    if (selectedEvaluation) filters.push("evaluation")
    setActiveFilters(filters)
  }, [dateAfter, dateBefore, selectedAgent, selectedEvaluation])

  const agentOptions = getUniqueAgents().map((agent) => ({
    label: agent.name,
    value: agent.id,
  }))

  const sentimentOptions = [
    { label: "Positive", value: "success" },
    { label: "Negative", value: "failed" },
    { label: "Unknown", value: "unknown" },
  ]

  const sortOptions = [
    { label: "Latest First", value: "latest" },
    { label: "Oldest First", value: "oldest" },
  ]

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Date After Filter (hidden on mobile) */}
        <div className="hidden md:flex flex-col space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Date After</label>
          <div className="flex items-center space-x-1">
            <input
              type="date"
              value={dateAfter}
              onChange={(e) => setDateAfter(e.target.value)}
              className="px-3 py-1.5 text-sm bg-card text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-[38px]"
            />
            {dateAfter && (
              <button
                onClick={() => removeFilter("dateAfter")}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Date Before Filter (hidden on mobile) */}
        <div className="hidden md:flex flex-col space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Date Before</label>
          <div className="flex items-center space-x-1">
            <input
              type="date"
              value={dateBefore}
              onChange={(e) => setDateBefore(e.target.value)}
              className="px-3 py-1.5 text-sm bg-card text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-[38px]"
            />
            {dateBefore && (
              <button
                onClick={() => removeFilter("dateBefore")}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Agent Filter */}
        <FilterDropdown
          label="Agent"
          value={selectedAgent}
          options={agentOptions}
          onChange={setSelectedAgent}
          onClear={() => setSelectedAgent("")}
          placeholder="All Agents"
        />

        {/* Sentiment Analysis Filter */}
        <FilterDropdown
          label="Sentiment"
          value={selectedEvaluation}
          options={sentimentOptions}
          onChange={setSelectedEvaluation}
          onClear={() => setSelectedEvaluation("")}
          placeholder="All Sentiments"
        />

        {/* Sort Dropdown */}
        <FilterDropdown
          label="Sort By"
          value={sortOrder}
          options={sortOptions}
          onChange={(val) => setSortOrder(val as "latest" | "oldest")}
          placeholder="Sort By"
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {dateAfter && (
            <span className="hidden md:inline-flex items-center space-x-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              <span>After {new Date(dateAfter).toLocaleDateString()}</span>
              <button onClick={() => removeFilter("dateAfter")} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {dateBefore && (
            <span className="hidden md:inline-flex items-center space-x-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              <span>Before {new Date(dateBefore).toLocaleDateString()}</span>
              <button onClick={() => removeFilter("dateBefore")} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedAgent && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              <span>{getUniqueAgents().find((a) => a.id === selectedAgent)?.name}</span>
              <button onClick={() => removeFilter("agent")} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedEvaluation && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              <span>
                {selectedEvaluation === "success"
                  ? "Positive"
                  : selectedEvaluation === "failed"
                    ? "Negative"
                    : "Unknown"}
              </span>
              <button onClick={() => removeFilter("evaluation")} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by agent name, agent ID, or conversation ID..."
          className="w-full pl-10 pr-4 py-2 bg-card text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  )
}
