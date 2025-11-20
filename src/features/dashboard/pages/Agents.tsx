import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgents } from "@/store/agentsSlice"
import { CreateAgentModal } from "@/features/agents/components/CreateAgentModal"
import { useNavigate } from "react-router-dom"
import { 
  Headset, 
  MoreVertical, 
  ArrowRight, 
  Plus, 
  Download, 
  Upload 
} from "lucide-react"

export default function Agents() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { agents, loading } = useAppSelector((state) => state.agents)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAgents())
  }, [dispatch])

  const formatDate = (unixSecs: number) => {
    if (!unixSecs) return ""
    const date = new Date(unixSecs * 1000)
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date)
  }

  return (
    <div className="flex flex-col gap-4 h-full p-4 max-w-7xl mx-auto w-full text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Agents</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage your AI agents</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-accent text-foreground text-sm font-medium transition-colors shadow-sm">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-accent text-foreground text-sm font-medium transition-colors shadow-sm">
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#65a30d] hover:bg-[#4d7c0f] text-white text-sm font-medium rounded-lg transition-colors shadow-sm ml-auto sm:ml-0"
          >
            <Plus size={18} />
            <span>Create Agent</span>
          </button>
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No agents found. Create one to get started.</div>
        ) : (
          <div className="divide-y divide-border">
            {agents.map((agent) => (
              <div 
                key={agent.agent_id} 
                className="group p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/agents/${agent.agent_id}`)}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#ecfccb] dark:bg-[#365314] flex items-center justify-center shrink-0 text-[#65a30d] dark:text-[#ecfccb]">
                  <Headset size={24} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Created {formatDate(agent.created_at_unix_secs)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle menu
                    }}
                    className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-background transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                  <div className="p-2 text-muted-foreground group-hover:text-foreground transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          dispatch(fetchAgents())
        }}
      />
    </div>
  )
}
