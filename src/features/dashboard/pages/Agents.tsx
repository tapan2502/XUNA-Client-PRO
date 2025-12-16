import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgents } from "@/store/agentsSlice"
import { CreateAgentModal } from "@/features/agents/components/CreateAgentModal"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { 
  Headset,
  MoreVertical,
  ArrowRight,
  Plus,
  Trash2,
  Copy
} from "lucide-react"
import { Button, User, useDisclosure, Snippet } from "@heroui/react"
import DataTable, { DataTableColumn } from "@/components/hero-ui/DataTable"

const columns: DataTableColumn[] = [
  { uid: "name", name: "Agent Name", sortable: true },
  { uid: "agent_id", name: "Agent ID" },
  { uid: "created_at", name: "Created At", sortable: true },
  { uid: "actions", name: "Actions" },
]

export default function Agents() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { agents, loading } = useAppSelector((state) => state.agents)
  const { isOpen, onOpen, onClose } = useDisclosure()

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

  const renderCell = (item: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "full",
              size: "sm",
              icon: <Headset className="w-4 h-4 text-white" />,
              classNames: {
                base: "bg-primary"
              }
            }}
            classNames={{
              name: "text-default-foreground font-medium",
            }}
            name={item.name}
          />
        )
      case "agent_id":
        return (
          <Snippet 
            symbol="" 
            variant="flat" 
            size="sm" 
            classNames={{
              base: "bg-transparent p-0",
              pre: "font-mono text-default-500 text-small"
            }}
            codeString={item.agent_id}
          >
            {item.agent_id}
          </Snippet>
        )
      case "created_at":
        return (
          <span className="text-small text-default-500">
            {formatDate(item.created_at_unix_secs)}
          </span>
        )
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="light"
              color="primary"
              isIconOnly
              onPress={() => navigate(`/dashboard/assistants/${item.agent_id}`)}
              className="text-default-400 data-[hover=true]:text-primary"
            >
              <ArrowRight size={18} />
            </Button>
          </div>
        )
      default:
        return item[columnKey as keyof typeof item]
    }
  }

  const topBarAction = (
    <Button
      color="primary"
      className="text-white shadow-sm font-medium"
      startContent={<Plus size={18} />}
      onPress={onOpen}
    >
      Create Agent
    </Button>
  )

  if (loading && agents.length === 0) {
     return (
       <div className="flex items-center justify-center h-full p-8">
         <LoadingSpinner />
       </div>
     )
  }

  // DataTable requires an 'id' property
  const tableData = agents.map(agent => ({
    ...agent,
    id: agent.agent_id
  }))

  return (
    <div className="h-full p-4 w-full max-w-[95rem] mx-auto flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={tableData}
        renderCell={renderCell}
        initialVisibleColumns={["name", "agent_id", "created_at", "actions"]}
        searchKeys={["name", "agent_id"]}
        searchPlaceholder="Search agents..."
        topBarTitle="AI Agents"
        topBarCount={agents.length}
        topBarAction={topBarAction}
        emptyContent="No agents found. Create one to get started."
        onRowAction={(key) => navigate(`/dashboard/agents/${key}`)}
      />

      <CreateAgentModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => {
          onClose()
          dispatch(fetchAgents())
        }}
      />
    </div>
  )
}
