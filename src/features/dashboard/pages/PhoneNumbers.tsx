"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchPhoneNumbers, deletePhoneNumber } from "@/store/phoneNumbersSlice"
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Phone,
  Trash2,
  UserPlus,
  PhoneOutgoing,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import ImportTwilioModal from "../components/ImportTwilioModal"
import ImportSIPModal from "../components/ImportSIPModal"
import AssignAgentModal from "../components/AssignAgentModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import { useSnackbar } from "@/components/ui/SnackbarProvider"
import { FilterDropdown } from "@/components/ui/FilterDropdown"

type StatusFilter = "all" | "assigned" | "unassigned"

export default function PhoneNumbers() {
  const dispatch = useAppDispatch()
  const { phoneNumbers, loading, error } = useAppSelector((state) => state.phoneNumbers)
  const { showSnackbar } = useSnackbar()
  const [searchValue, setSearchValue] = useState("")
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

  const filteredPhoneNumbers = phoneNumbers.filter((pn) => {
    const matchesSearch =
      (pn.label || "").toLowerCase().includes(searchValue.toLowerCase()) || pn.phone_number.includes(searchValue)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "assigned" && pn.assigned_agent) ||
      (statusFilter === "unassigned" && !pn.assigned_agent)

    return matchesSearch && matchesStatus
  })

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
      // No need to fetch again if slice updates state, but fetching ensures sync
      // dispatch(fetchPhoneNumbers())
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

  return (
    <div className="flex flex-col gap-4 h-full p-4 max-w-7xl mx-auto w-full text-foreground">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Phone Numbers</h1>
          <p className="text-muted-foreground text-xs mt-1">Manage your Twilio phone numbers and agent assignments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsTwilioModalOpen(true)}
            className="flex items-center gap-2 bg-brand-gradient text-white font-medium px-3 py-1.5 rounded-lg transition-colors text-sm shadow-sm"
          >
            <Plus size={16} />
            Import from Twilio
          </button>
          <button
            onClick={() => setIsSIPModalOpen(true)}
            className="flex items-center gap-2 bg-brand-gradient text-white font-medium px-3 py-1.5 rounded-lg transition-colors text-sm shadow-sm"
          >
            <Plus size={16} />
            Import from SIP
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-card p-3 rounded-lg border border-border shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search phone numbers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-background hover:bg-accent/50 focus:bg-background border border-border focus:border-ring rounded-md outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="relative">
          <FilterDropdown
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as StatusFilter)}
            options={[
              { label: "All Status", value: "all" },
              { label: "Assigned", value: "assigned" },
              { label: "Unassigned", value: "unassigned" },
            ]}
            icon={<Filter size={14} />}
            placeholder="All Status"
          />
        </div>
      </div>

      {/* Phone Numbers List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <LoadingSpinner fullScreen />
        ) : filteredPhoneNumbers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No phone numbers found.</div>
        ) : (
          filteredPhoneNumbers.map((pn) => (
            <div
              key={pn.phone_number_id}
              className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all p-4"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left Side: Icon & Info */}
                <div className="flex items-start gap-3 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-base font-semibold text-card-foreground">{pn.label || "Untitled Number"}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Number:</span>
                      <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground border border-border">
                        {pn.phone_number}
                      </span>
                      <span className="text-muted-foreground ml-1">Provider:</span>
                      <span className="bg-muted px-1.5 py-0.5 rounded text-xs font-medium text-foreground capitalize border border-border">
                        {pn.provider || "Twilio"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Agent Status & Actions */}
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto justify-end">
                  {pn.assigned_agent ? (
                    <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border border-border">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Assigned Agent
                        </span>
                        <span className="text-xs font-bold text-foreground">{pn.assigned_agent.agent_name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-500 px-2">
                      <AlertCircle size={16} />
                      <span className="text-xs font-medium">No agent assigned</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {pn.assigned_agent ? (
                      <>
                        <button
                          onClick={() => handleAssignAgent(pn.phone_number_id, pn.assigned_agent?.agent_id)}
                          className="flex items-center gap-1.5 bg-background hover:bg-accent text-foreground border border-border font-medium px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm"
                        >
                          <UserPlus size={14} />
                          Change Agent
                        </button>
                        <button className="flex items-center gap-1.5 bg-white border-emerald-200 hover:bg-gray-50 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:hover:bg-emerald-900/30 dark:text-emerald-400 border font-medium px-3 py-1.5 rounded-lg transition-colors text-xs">
                          <PhoneOutgoing size={14} />
                          Outbound Call
                        </button>
                        <button
                          onClick={() => confirmDelete(pn.phone_number_id)}
                          className="flex items-center gap-1.5 bg-white border-red-200 hover:bg-gray-50 text-red-700 dark:bg-red-900/20 dark:border-red-900/30 dark:hover:bg-red-900/30 dark:text-red-400 border font-medium px-3 py-1.5 rounded-lg transition-colors text-xs"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAssignAgent(pn.phone_number_id)}
                          className="flex items-center gap-1.5 bg-brand-gradient text-white font-medium px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm"
                        >
                          <UserPlus size={14} />
                          Assign Agent
                        </button>
                        <button
                          onClick={() => confirmDelete(pn.phone_number_id)}
                          className="flex items-center gap-1.5 bg-white border-red-200 hover:bg-gray-50 text-red-700 dark:bg-red-900/20 dark:border-red-900/30 dark:hover:bg-red-900/30 dark:text-red-400 border font-medium px-3 py-1.5 rounded-lg transition-colors text-xs"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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
    </div>
  )
}
