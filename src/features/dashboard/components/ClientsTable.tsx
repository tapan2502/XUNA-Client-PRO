"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, MoreVertical, Copy } from "lucide-react"
import { CreateAgentModal } from "@/features/agents/components/CreateAgentModal"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgents } from "@/store/agentsSlice"
import { useNavigate } from "react-router-dom"
import { FilterDropdown } from "@/components/ui/FilterDropdown"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

const getRandomPhone = () =>
  `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`

const getRandomLanguage = () => {
  const langs = [
    { name: "English", code: "us" },
    { name: "German", code: "de" },
    { name: "Spanish", code: "es" },
    { name: "Mandarin", code: "cn" },
    { name: "Portuguese", code: "pt" },
  ]
  return langs[Math.floor(Math.random() * langs.length)]
}

const getRandomUsage = () => Math.floor(Math.random() * 6000)

const getRandomModelUser = () => {
  const models = ["Tony Reichert", "Zoe Lang", "Jane Fisher", "William Howard", "Kristen Copper"]
  return models[Math.floor(Math.random() * models.length)]
}

export default function ClientsTable() {
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const rowsPerPage = 10

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { agents, loading, error } = useAppSelector((s) => s.agents)

  useEffect(() => {
    dispatch(fetchAgents())
  }, [dispatch])

  const enrichedAgents = useMemo(() => {
    return (agents || []).map((agent: any) => {
      const modelUser = getRandomModelUser()

      return {
        id: agent.agent_id,
        name: agent.name || "Untitled Agent",
        assistantId: agent.agent_id,
        model: "ChatGPT 4o",
        modelUser: modelUser,
        status: ["active", "paused", "inactive"][Math.floor(Math.random() * 3)],
        billing: "stripe",
        phoneNumber: getRandomPhone(),
        language: getRandomLanguage(),
        usage: getRandomUsage(),
        usageMax: 6000,
      }
    })
  }, [agents])

  const filteredItems = useMemo(() => {
    let filtered = enrichedAgents

    if (searchValue) {
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          agent.assistantId.toLowerCase().includes(searchValue.toLowerCase()) ||
          agent.modelUser.toLowerCase().includes(searchValue.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((agent) => agent.status === statusFilter)
    }

    return filtered
  }, [enrichedAgents, searchValue, statusFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredItems.slice(start, end)
  }, [page, filteredItems])

  useEffect(() => {
    setPage(1)
  }, [searchValue, statusFilter])

  const handleViewDetails = (agentId: string) => {
    navigate(`/dashboard/agents/${agentId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500"
      case "paused":
        return "bg-red-500"
      case "needs work":
        return "bg-amber-500"
      default:
        return "bg-zinc-400"
    }
  }

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
      case "paused":
        return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-900/30"
      case "needs work":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
    }
  }

  return (
    <>
      {loading && <LoadingSpinner fullScreen />}
      
      <div className="flex flex-col gap-4 h-full p-4 mx-auto w-full text-foreground">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-all text-sm text-foreground placeholder:text-muted-foreground shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto items-center">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "All Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Paused", value: "paused" },
              { label: "Inactive", value: "inactive" },
            ]}
            icon={<Filter size={14} />}
            placeholder="Filter by Status"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-10 text-center"></th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[140px]">
                  Client
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[160px]">
                  Assistant ID
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[140px]">
                  Model
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px]">
                  Status
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                  Billing
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[160px]">
                  Phone Number
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[200px]">
                  Services
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[140px]">
                  Language
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[160px]">
                  Usage
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right min-w-[80px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground text-sm">
                    {searchValue ? "No results found" : "No agents found"}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="group hover:bg-accent transition-colors">
                    <td className="p-4 text-center">
                      <div className={`w-2 h-2 rounded-full mx-auto ${getStatusColor(item.status)}`} />
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-foreground text-sm whitespace-nowrap">{item.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border border-border">
                          {item.assistantId.substring(0, 8)}...
                        </span>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground font-medium text-sm whitespace-nowrap">{item.modelUser}</span>
                        <span className="text-muted-foreground text-xs whitespace-nowrap">{item.model}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeStyles(item.status)}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)}`} />
                        <span className="capitalize">{item.status}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer">
                        {item.billing}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-foreground text-sm font-medium whitespace-nowrap">
                        <img
                          alt="US Flag"
                          className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                          src="https://flagcdn.com/us.svg"
                        />
                        {item.phoneNumber}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                        {item.services.map((service: string) => (
                          <span
                            key={service}
                            className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded border border-border"
                          >
                            {service}
                          </span>
                        ))}
                        {item.moreServices && (
                          <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded border border-border">
                            {item.moreServices}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-foreground text-sm font-medium whitespace-nowrap">
                        <img
                          alt={item.language.name}
                          className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                          src={`https://flagcdn.com/${item.language.code}.svg`}
                        />
                        {item.language.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 w-32">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.usage > 5000 ? "bg-red-500" : item.usage > 3000 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${(item.usage / item.usageMax) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {item.usage.toLocaleString()} / {item.usageMax.toLocaleString()} min
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border p-4 flex items-center justify-between bg-muted/50">
          <span className="text-xs text-muted-foreground">
            Showing {items.length > 0 ? (page - 1) * rowsPerPage + 1 : 0} to{" "}
            {Math.min(page * rowsPerPage, filteredItems.length)} of {filteredItems.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                    page === p
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
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
    </>
  )
}
