"use client"

import { useState, useEffect } from "react"
import { Search, X, Calendar, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [isSortOpen, setIsSortOpen] = useState(false)
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
              className="px-3 py-1.5 text-sm bg-card text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
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
              className="px-3 py-1.5 text-sm bg-card text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
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
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Agent</label>
          <div className="flex items-center space-x-1">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-3 py-1.5 text-sm bg-card text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
            >
              <option value="">All Agents</option>
              {getUniqueAgents().map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            {selectedAgent && (
              <button onClick={() => removeFilter("agent")} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Sentiment Analysis Filter */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Sentiment</label>
          <div className="flex items-center space-x-1">
            <select
              value={selectedEvaluation}
              onChange={(e) => setSelectedEvaluation(e.target.value)}
              className="px-3 py-1.5 text-sm bg-card text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
            >
              <option value="">All Sentiments</option>
              <option value="success">Positive</option>
              <option value="failed">Negative</option>
              <option value="unknown">Unknown</option>
            </select>
            {selectedEvaluation && (
              <button
                onClick={() => removeFilter("evaluation")}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Sort By</label>
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-card text-foreground rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{sortOrder === "latest" ? "Latest First" : "Oldest First"}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-40 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-40"
                  >
                    <button
                      onClick={() => {
                        setSortOrder("latest")
                        setIsSortOpen(false)
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors ${
                        sortOrder === "latest"
                          ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <span>Latest First</span>
                    </button>
                    <button
                      onClick={() => {
                        setSortOrder("oldest")
                        setIsSortOpen(false)
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors ${
                        sortOrder === "oldest"
                          ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <span>Oldest First</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {dateAfter && (
            <span className="hidden md:inline-flex items-center space-x-1 px-2 py-1 text-xs bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full">
              <span>After {new Date(dateAfter).toLocaleDateString()}</span>
              <button onClick={() => removeFilter("dateAfter")} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {dateBefore && (
            <span className="hidden md:inline-flex items-center space-x-1 px-2 py-1 text-xs bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full">
              <span>Before {new Date(dateBefore).toLocaleDateString()}</span>
              <button onClick={() => removeFilter("dateBefore")} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedAgent && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full">
              <span>{getUniqueAgents().find((a) => a.id === selectedAgent)?.name}</span>
              <button onClick={() => removeFilter("agent")} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedEvaluation && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full">
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
          className="w-full pl-10 pr-4 py-2 bg-card text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
        />
      </div>
    </div>
  )
}
