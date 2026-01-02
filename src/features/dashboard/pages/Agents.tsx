"use client"

import React from "react"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgents } from "@/store/agentsSlice"
import { CreateAgentModal } from "@/features/agents/components/CreateAgentModal"
import { useNavigate, useSearchParams } from "react-router-dom"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Headset, Eye, Trash2 } from "lucide-react"
import { Icon } from "@iconify/react"
import { Button, User, useDisclosure, Snippet, Switch, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react"
import DataTable, { type DataTableColumn } from "@/components/hero-ui/DataTable"
import { updateAgentStatus, deleteAgent } from "@/store/agentsSlice"

const columns: DataTableColumn[] = [
  { uid: "name", name: "Agent Name", sortable: true },
  { uid: "agent_id", name: "Agent ID" },
  { uid: "status", name: "Status" },
  { uid: "created_at", name: "Created At", sortable: true },
  { uid: "actions", name: "Actions" },
]

export default function Agents() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { agents, loading } = useAppSelector((state) => state.agents)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [agentToDelete, setAgentToDelete] = React.useState<any | null>(null)
  const { 
    isOpen: isDeleteModalOpen, 
    onOpen: onDeleteModalOpen, 
    onOpenChange: onDeleteModalOpenChange 
  } = useDisclosure()

  useEffect(() => {
    dispatch(fetchAgents())
  }, [dispatch])

  // Auto-open create modal if 'create' param is present
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      onOpen()
      // Remove the param after opening
      searchParams.delete('create')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, onOpen, setSearchParams])

  const handleDeletePress = (agent: any) => {
    setAgentToDelete(agent)
    onDeleteModalOpen()
  }

  const confirmDelete = async () => {
    if (agentToDelete) {
      await dispatch(deleteAgent(agentToDelete.agent_id))
      setAgentToDelete(null)
      onDeleteModalOpenChange()
    }
  }

  const handleStatusToggle = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    await dispatch(updateAgentStatus({ agentId, status: newStatus as "active" | "inactive" }))
  }

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
                base: "bg-primary",
              },
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
              pre: "font-mono text-default-500 text-small",
            }}
            codeString={item.agent_id}
          >
            {item.agent_id}
          </Snippet>
        )
      case "status":
        return (
          <div className="flex items-center gap-2">
            <Switch
              size="sm"
              isSelected={item.status === "active"}
              onValueChange={() => handleStatusToggle(item.agent_id, item.status)}
              aria-label="Agent Status"
            />
            <span className={`text-tiny capitalize ${item.status === "active" ? "text-success" : "text-default-400"}`}>
              {item.status || "inactive"}
            </span>
          </div>
        )
      case "created_at":
        return <span className="text-small text-default-500">{formatDate(item.created_at_unix_secs)}</span>
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={() => navigate(`/agents/${item.agent_id}`)}
              className="text-default-400 hover:text-primary transition-colors"
            >
              <Eye size={18} />
            </Button>
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={() => handleDeletePress(item)}
              className="text-default-400 hover:text-danger transition-colors"
            >
              <Trash2 size={18} />
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
      size="md"
      radius="md"
      onPress={onOpen}
      endContent={
        <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
          </svg>
        </div>
      }
      className="px-4 shadow-lg shadow-primary/20 font-medium h-10 text-white"
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
  const tableData = agents.map((agent) => ({
    ...agent,
    id: agent.agent_id,
  }))

  return (
    <div className="flex flex-col gap-12 p-10 h-full overflow-hidden">
      <DataTable
        columns={columns}
        data={tableData}
        renderCell={renderCell}
        initialVisibleColumns={["name", "agent_id", "status", "created_at", "actions"]}
        searchKeys={["name", "agent_id"]}
        searchPlaceholder="Search"
        topBarTitle="Agents"
        topBarCount={agents.length}
        topBarAction={topBarAction}
        emptyContent="No agents found. Create one to get started."
      />

      <CreateAgentModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => {
          onClose()
          dispatch(fetchAgents())
        }}
      />

      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Agent</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete <b>{agentToDelete?.name}</b>? This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
