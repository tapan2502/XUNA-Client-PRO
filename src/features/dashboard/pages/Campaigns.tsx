"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { selectCurrentUserData, fetchUserDetails } from "@/store/authSlice"
import { Users, Eye, CheckCircle2, Clock } from "lucide-react"
import { Icon } from "@iconify/react"
import DataTable from "@/components/hero-ui/DataTable"
import { Button, Chip, Select, SelectItem } from "@heroui/react"
import CreateCampaignModal from "../components/CreateCampaignModal"
import CampaignDetailsModal from "../components/CampaignDetailsModal"

interface Column {
  uid: string
  name: string
  sortable?: boolean
}

export default function Campaigns() {
  const dispatch = useAppDispatch()
  const userData = useAppSelector(selectCurrentUserData)
  const batchCalls = userData?.batch_calls || []

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  // Refetch user data when component mounts to get latest campaigns
  useEffect(() => {
    dispatch(fetchUserDetails())
  }, [dispatch])

  // Map data to include id for DataTable
  const tableData = batchCalls.map((campaign) => ({
    ...campaign,
    id: campaign.batch_call_id,
  }))

  const columns: Column[] = [
    { uid: "call_name", name: "Campaign Name", sortable: true },
    { uid: "agent", name: "Agent", sortable: false },
    { uid: "created_at", name: "Created", sortable: true },
    { uid: "status", name: "Status", sortable: true },
    { uid: "actions", name: "Actions" },
  ]

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "call_name":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-default-foreground">{item.call_name}</span>
          </div>
        )
      case "agent":
        return <span className="text-small text-default-500">{item.agent_name || item.agent_id}</span>
      case "created_at":
        return (
          <div className="flex items-center gap-1 text-small text-default-500">
            <Clock size={14} />
            {new Date(item.created_at).toLocaleDateString()}
          </div>
        )
      case "status":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.status === "completed" ? "success" : "primary"}
            startContent={item.status === "completed" ? <CheckCircle2 size={14} /> : undefined}
            className="capitalize"
          >
            {item.status}
          </Chip>
        )
      case "actions":
        return (
          <Button
            size="sm"
            variant="light"
            onPress={() => setSelectedCampaignId(item.batch_call_id)}
            startContent={<Eye size={16} />}
          >
            View Details
          </Button>
        )
      default:
        return null
    }
  }

  const topBarAction = (
    <Button 
      color="primary" 
      className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
      onPress={() => setIsCreateModalOpen(true)} 
      startContent={<Icon icon="solar:add-circle-bold" width={20} />}
    >
      Create Campaign
    </Button>
  )

  const filterContent = (
    <Select
      label="Status"
      selectedKeys={[statusFilter]}
      onChange={(e) => setStatusFilter(e.target.value)}
      variant="bordered"
      size="sm"
      className="w-48"
    >
      <SelectItem key="all">All Status</SelectItem>
      <SelectItem key="completed">Completed</SelectItem>
      <SelectItem key="processing">Processing</SelectItem>
      <SelectItem key="failed">Failed</SelectItem>
    </Select>
  )

  // Apply status filter
  const filteredData =
    statusFilter === "all" ? tableData : tableData.filter((campaign) => campaign.status === statusFilter)

  return (
    <div className="flex flex-col gap-4 p-6 h-full overflow-hidden">
      <DataTable
        columns={columns}
        data={filteredData}
        renderCell={renderCell}
        initialVisibleColumns={["call_name", "agent", "created_at", "status", "actions"]}
        searchKeys={["call_name", "agent_name", "agent_id"]}
        searchPlaceholder="Search campaigns..."
        topBarTitle="Batch Calling"
        topBarCount={batchCalls.length}
        topBarAction={topBarAction}
        filterContent={filterContent}
        emptyContent="No campaigns found. Create one to get started."
      />

      <CreateCampaignModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <CampaignDetailsModal
        isOpen={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
        campaignId={selectedCampaignId}
      />
    </div>
  )
}
