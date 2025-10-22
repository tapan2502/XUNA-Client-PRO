"use client"

import { useState, useEffect } from "react"
import { Search, Filter, SortAsc, Columns, MoreVertical, Plus, Copy } from "lucide-react"
import { CreateAgentModal } from "@/features/agents/components/CreateAgentModal"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgents } from "@/store/agentsSlice"
import { useNavigate } from "react-router-dom"

interface Client {
  id: string
  name: string
  assistantId: string
  model: string
  status: "Active" | "Paused" | "Inactive" | "Needs Work"
  billing: string
  phoneNumber: string
  services: string[]
  language: string
  languageFlag: string
  usage: number
  usageMax: number
  avatar: string
  assistant: string
  statusDot: "green" | "red" | "yellow"
}

export default function ClientsTable() {
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState("")
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { agents, loading, error } = useAppSelector((s) => s.agents)

  useEffect(() => {
    dispatch(fetchAgents())
  }, [dispatch])

  const filteredAgents = (agents || []).filter((a: any) => a?.name?.toLowerCase?.().includes(searchValue.toLowerCase()))

  const formatUnix = (secs?: number | null) => {
    if (!secs) return "—"
    try {
      return new Date(secs * 1000).toLocaleString()
    } catch {
      return "—"
    }
  }

  const getDotColorByLastCall = (secs?: number | null) => {
    if (secs) return "bg-green-500"
    return "bg-gray-500"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "Paused":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      case "Inactive":
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
      case "Needs Work":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
    }
  }

  const getDotColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-500"
      case "red":
        return "bg-red-500"
      case "yellow":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getUsageColor = (usage: number, max: number) => {
    const percentage = (usage / max) * 100
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Agents</h2>
          <span className="text-sm text-muted-foreground">{filteredAgents.length}</span>
        </div>
        <button
          onClick={() => setIsCreateAgentOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-lg text-sm font-medium text-foreground hover:bg-[hsl(var(--sidebar-hover))] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-lg text-sm font-medium text-foreground hover:bg-[hsl(var(--sidebar-hover))] transition-colors">
          <SortAsc className="w-4 h-4" />
          Sort
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-lg text-sm font-medium text-foreground hover:bg-[hsl(var(--sidebar-hover))] transition-colors">
          <Columns className="w-4 h-4" />
          Columns
        </button>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">2 Selected</span>
          <button className="px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-lg text-sm font-medium text-foreground hover:bg-[hsl(var(--sidebar-hover))] transition-colors">
            Selected Actions
          </button>
        </div>
      </div>

      {/* Feedback states */}
      {error ? (
        <div className="px-4 py-2 rounded-md border border-[hsl(var(--divider))] bg-[hsl(var(--card))] text-sm text-red-500">
          {error}
        </div>
      ) : null}

      {/* Table */}
      <div className="flex-1 min-h-0 flex flex-col bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-xl overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-[hsl(var(--sidebar-hover))] border-b border-[hsl(var(--divider))] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  AGENT
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  AGENT ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  MODEL
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  CREATED
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  LAST CALL
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  ROLE
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--divider))]">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`s-${i}`}>
                      <td className="px-4 py-4">
                        <div className="h-4 w-40 bg-[hsl(var(--sidebar-hover))] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-32 bg-[hsl(var(--sidebar-hover))] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-24 bg-[hsl(var(--sidebar-hover))] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-36 bg-[hsl(var(--sidebar-hover))] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-28 bg-[hsl(var(--sidebar-hover))] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-20 bg-[hsl(var(--sidebar-hover))] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4"></td>
                    </tr>
                  ))
                : filteredAgents.map((agent: any) => {
                    const llm =
                      agent?.conversation_config?.agent?.prompt?.llm ??
                      agent?.conversation_config?.agent?.prompt?.model_id ??
                      "—"
                    const created = formatUnix(agent?.created_at_unix_secs as number | undefined)
                    const lastCall = formatUnix(agent?.last_call_time_unix_secs as number | undefined)
                    const role = agent?.access_info?.role ?? agent?.access_level ?? "—"

                    return (
                      <tr
                        key={agent.agent_id}
                        onClick={() => navigate(`/dashboard/agents/${agent.agent_id}`)}
                        className="hover:bg-[hsl(var(--sidebar-hover))] transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getDotColorByLastCall(agent?.last_call_time_unix_secs)}`}
                            />
                            <span className="font-medium text-foreground">{agent.name || "Untitled Agent"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground truncate max-w-[160px]">
                              {agent.agent_id}
                            </span>
                            <button
                              className="p-1 hover:bg-[hsl(var(--sidebar-hover))] rounded transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigator.clipboard?.writeText(agent.agent_id)
                              }}
                              title="Copy Agent ID"
                            >
                              <Copy className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shrink-0">
                              <span className="text-white text-xs font-bold">
                                {(agent?.name || "A")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{llm}</p>
                              <p className="text-xs text-muted-foreground">LLM</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{created}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{lastCall}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-primary">{role}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 hover:bg-[hsl(var(--sidebar-hover))] rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--divider))] bg-[hsl(var(--card))] shrink-0">
          <span className="text-sm text-muted-foreground">2 of 10 selected</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-[hsl(var(--sidebar-hover))] rounded transition-colors">
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                    num === page
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-[hsl(var(--sidebar-hover))]"
                  }`}
                >
                  {num}
                </button>
              ))}
              <span className="px-2 text-muted-foreground">...</span>
              <button
                onClick={() => setPage(10)}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                  page === 10
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-[hsl(var(--sidebar-hover))]"
                }`}
              >
                10
              </button>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-[hsl(var(--sidebar-hover))] rounded transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
      <CreateAgentModal
        isOpen={isCreateAgentOpen}
        onClose={() => setIsCreateAgentOpen(false)}
        onSuccess={() => {
          setIsCreateAgentOpen(false)
          dispatch(fetchAgents())
        }}
      />
    </div>
  )
}
