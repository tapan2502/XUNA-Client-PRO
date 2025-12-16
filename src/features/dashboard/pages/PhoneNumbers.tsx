"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchPhoneNumbers, deletePhoneNumber } from "@/store/phoneNumbersSlice"
import {
  Phone,
  Trash2,
  UserPlus,
  PhoneOutgoing,
  AlertCircle,
  Plus,
} from "lucide-react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import ImportTwilioModal from "../components/ImportTwilioModal"
import ImportSIPModal from "../components/ImportSIPModal"
import AssignAgentModal from "../components/AssignAgentModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import { useSnackbar } from "@/components/ui/SnackbarProvider"
import DataTable, { DataTableColumn, useMemoizedCallback } from "@/components/hero-ui/DataTable"
import { Button, Chip, DropdownItem, User, RadioGroup, Radio } from "@heroui/react"
import { Icon } from "@iconify/react"
import React from "react"

// Types
type StatusFilter = "all" | "assigned" | "unassigned"

interface EnrichedPhoneNumber {
  id: string
  label: string
  phone_number: string
  provider: string
  assigned_agent: {
    agent_id: string
    agent_name: string
  } | null
  status: "assigned" | "unassigned"
}

const columns: DataTableColumn[] = [
  { uid: "name", name: "Name", sortable: true },
  { uid: "phone_number", name: "Phone Number", sortable: true },
  { uid: "provider", name: "Provider", sortable: true },
  { uid: "assigned_agent", name: "Assigned Agent", sortable: true },
  { uid: "actions", name: "Actions" },
]

const INITIAL_VISIBLE_COLUMNS = ["name", "phone_number", "provider", "assigned_agent", "actions"]

export default function PhoneNumbers() {
  const dispatch = useAppDispatch()
  const { phoneNumbers, loading, error } = useAppSelector((state) => state.phoneNumbers)
  const { showSnackbar } = useSnackbar()
  const [isTwilioModalOpen, setIsTwilioModalOpen] = useState(false)
  const [isSIPModalOpen, setIsSIPModalOpen] = useState(false)
  const [isAssignAgentModalOpen, setIsAssignAgentModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState<string>("")
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    dispatch(fetchPhoneNumbers())
  }, [dispatch])

  // Transform data for DataTable
  const enrichedPhoneNumbers: EnrichedPhoneNumber[] = useMemo(() => {
    return phoneNumbers.map((pn) => ({
      id: pn.phone_number_id,
      label: pn.label || "Untitled Number",
      phone_number: pn.phone_number,
      provider: pn.provider || "Twilio",
      assigned_agent: pn.assigned_agent,
      status: pn.assigned_agent ? "assigned" : "unassigned",
    }))
  }, [phoneNumbers])

  const handleAssignAgent = (phoneNumberId: string, currentAgentId?: string) => {
    setSelectedPhoneNumberId(phoneNumberId)
    setSelectedAgentId(currentAgentId)
    setIsAssignAgentModalOpen(true)
  }

  const confirmDelete = (phoneNumberId: string) => {
    setSelectedPhoneNumberId(phoneNumberId)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedPhoneNumberId) return

    setIsDeleting(true)
    try {
      await dispatch(deletePhoneNumber(selectedPhoneNumberId)).unwrap()

      showSnackbar({
        title: "Success",
        message: "Phone number deleted successfully",
        variant: "success",
      })
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Failed to delete phone number:", error)
      showSnackbar({
        title: "Error",
        message: "Failed to delete phone number",
        variant: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const itemFilter = useCallback(
    (item: EnrichedPhoneNumber) => {
      if (statusFilter === "all") return true
      return item.status === statusFilter
    },
    [statusFilter]
  )

  const renderCell = useMemoizedCallback((item: EnrichedPhoneNumber, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center text-default-500">
              <Phone size={16} />
            </div>
            <span className="text-small font-semibold text-default-foreground">{item.label}</span>
          </div>
        )
      case "phone_number":
        return (
          <span className="font-mono text-small text-default-600 bg-default-100 px-2 py-0.5 rounded border border-default-200">
            {item.phone_number}
          </span>
        )
      case "provider":
        return (
          <Chip className="capitalize" size="sm" variant="flat" color="primary">
            {item.provider}
          </Chip>
        )
      case "assigned_agent":
        return item.assigned_agent ? (
          <User
            avatarProps={{ radius: "full", size: "sm" }}
            classNames={{
              name: "text-default-foreground font-medium",
            }}
            name={item.assigned_agent.agent_name}
          />
        ) : (
          <div className="flex items-center gap-1.5 text-warning-500">
            <AlertCircle size={16} />
            <span className="text-small font-medium">Unassigned</span>
          </div>
        )
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="flat"
              color={item.assigned_agent ? "default" : "primary"}
              onPress={() => handleAssignAgent(item.id, item.assigned_agent?.agent_id)}
              startContent={<UserPlus size={16} />}
              className={!item.assigned_agent ? "shadow-sm" : ""}
            >
              {item.assigned_agent ? "Change" : "Assign"}
            </Button>
            
            {item.assigned_agent && (
              <Button
                size="sm"
                variant="flat"
                color="success"
                className="bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400"
                startContent={<PhoneOutgoing size={16} />}
              >
                Call
              </Button>
            )}

            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => confirmDelete(item.id)}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        )
      default:
        return null
    }
  })

  // Top Bar Actions
  const topBarAction = (
    <div className="flex gap-2">
      <Button
        color="primary"
        className="text-white shadow-sm font-medium"
        startContent={<Plus size={18} />}
        onPress={() => setIsTwilioModalOpen(true)}
      >
        Import from Twilio
      </Button>
      <Button
        color="primary"
        className="text-white shadow-sm font-medium"
        startContent={<Plus size={18} />}
        onPress={() => setIsSIPModalOpen(true)}
      >
        Import from SIP
      </Button>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <div className="h-full w-full">
        <DataTable<EnrichedPhoneNumber>
          columns={columns}
          data={enrichedPhoneNumbers}
          renderCell={renderCell}
          initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
          searchPlaceholder="Search phone numbers..."
          searchKeys={["label", "phone_number"]}
          topBarTitle="Phone Numbers"
          topBarCount={enrichedPhoneNumbers.length}
          topBarAction={topBarAction}
          emptyContent="No phone numbers found"
          filterContent={
            <RadioGroup label="Status" value={statusFilter} onValueChange={(val) => setStatusFilter(val as StatusFilter)}>
              <Radio value="all">All Status</Radio>
              <Radio value="assigned">Assigned</Radio>
              <Radio value="unassigned">Unassigned</Radio>
            </RadioGroup>
          }
          selectedActionsContent={
            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={16}/>}>
              Delete Selected
            </DropdownItem>
          }
          onItemFilter={itemFilter}
          sortableColumnKey="name"
          ariaLabel="Phone numbers table"
        />
      </div>

      <ImportTwilioModal isOpen={isTwilioModalOpen} onClose={() => setIsTwilioModalOpen(false)} />
      <ImportSIPModal isOpen={isSIPModalOpen} onClose={() => setIsSIPModalOpen(false)} />
      <AssignAgentModal
        isOpen={isAssignAgentModalOpen}
        onClose={() => setIsAssignAgentModalOpen(false)}
        phoneNumberId={selectedPhoneNumberId}
        currentAgentId={selectedAgentId}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Phone Number"
        message="Are you sure you want to delete this phone number? This action cannot be undone."
        confirmLabel="Delete"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </>
  )
}
