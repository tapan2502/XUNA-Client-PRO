import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { selectCurrentUserData, fetchUserDetails } from "@/store/authSlice"
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  Users, 
  Eye,
  CheckCircle2,
  Clock
} from "lucide-react"
import CreateCampaignModal from "../components/CreateCampaignModal"
import CampaignDetailsModal from "../components/CampaignDetailsModal"
import { FilterDropdown } from "@/components/ui/FilterDropdown"

export default function Campaigns() {
  const dispatch = useAppDispatch()
  const userData = useAppSelector(selectCurrentUserData)
  const batchCalls = userData?.batch_calls || []
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Refetch user data when component mounts to get latest campaigns
  useEffect(() => {
    dispatch(fetchUserDetails())
  }, [dispatch])

  const filteredCampaigns = batchCalls.filter((campaign) => {
    const matchesSearch = campaign.call_name.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6 h-full p-6 max-w-7xl mx-auto w-full text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Batch Calling</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage batch calling campaigns</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-gradient text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Create Batch Campaign</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 items-center bg-card p-1 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search batch campaigns..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent focus:bg-accent/50 rounded-lg outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="h-8 w-[1px] bg-border mx-1" />
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "All Status", value: "all" },
            { label: "Completed", value: "completed" },
            { label: "Processing", value: "processing" },
            { label: "Failed", value: "failed" },
          ]}
          icon={<Filter size={16} />}
          className="mr-1"
          placeholder="All Status"
        />
      </div>

      {/* Campaigns List */}
      <div className="flex flex-col gap-3">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl border-dashed">
            <p>No campaigns found. Create one to get started.</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div 
              key={campaign.batch_call_id}
              className="group bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gradient text-white flex items-center justify-center shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{campaign.call_name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-foreground">Agent:</span> {campaign.agent_name || campaign.agent_id}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize flex items-center gap-1.5 ${
                  campaign.status === 'completed' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {campaign.status === 'completed' && <CheckCircle2 size={12} />}
                  {campaign.status}
                </span>
                
                <button 
                  onClick={() => setSelectedCampaignId(campaign.batch_call_id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateCampaignModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <CampaignDetailsModal
        isOpen={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
        campaignId={selectedCampaignId}
      />
    </div>
  )
}
