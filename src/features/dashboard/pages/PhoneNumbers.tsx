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
  Bot,
  Copy,
  Settings,
  Trash2,
  UserPlus,
  PhoneOutgoing,
  AlertCircle,
  Loader2,
} from "lucide-react"
import ImportTwilioModal from "../components/ImportTwilioModal"
import ImportSIPModal from "../components/ImportSIPModal"
import AssignAgentModal from "../components/AssignAgentModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import { useSnackbar } from "@/components/ui/SnackbarProvider"

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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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

  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter)
    setIsFilterOpen(false)
  }

  const getFilterLabel = () => {
    switch (statusFilter) {
      case "assigned":
        return "Assigned"
      case "unassigned":
        return "Unassigned"
      default:
        return "All Status"
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
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-3 py-1.5 rounded-lg transition-colors text-sm shadow-sm"
          >
            <Plus size={16} />
            Import from Twilio
          </button>
          <button
            onClick={() => setIsSIPModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-3 py-1.5 rounded-lg transition-colors text-sm shadow-sm"
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
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-background border border-border text-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors min-w-[130px] justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <Filter size={14} />
              <span className="font-medium">{getFilterLabel()}</span>
            </div>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute right-0 mt-1 w-full bg-card border-2 border-border rounded-lg shadow-xl z-20 py-1">
                <button
                  onClick={() => handleStatusFilterChange("all")}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    statusFilter === "all" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => handleStatusFilterChange("assigned")}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    statusFilter === "assigned" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                  }`}
                >
                  Assigned
                </button>
                <button
                  onClick={() => handleStatusFilterChange("unassigned")}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    statusFilter === "unassigned" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                  }`}
                >
                  Unassigned
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Phone Numbers List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
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
                    {pn.assigned_agent ? (
                      <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded-md w-fit border border-emerald-100 dark:border-emerald-900/20">
                        <Bot size={12} />
                        <span className="text-[10px] font-medium truncate max-w-[200px]">
                          {pn.assigned_agent.agent_name}
                        </span>
                        <button className="p-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded transition-colors">
                          <Copy size={10} />
                        </button>
                      </div>
                    ) : null}
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
                    <button className="p-1.5 text-muted-foreground hover:bg-accent rounded-md transition-colors">
                      <Settings size={18} />
                    </button>

                    {pn.assigned_agent ? (
                      <>
                        <button
                          onClick={() => handleAssignAgent(pn.phone_number_id, pn.assigned_agent?.agent_id)}
                          className="flex items-center gap-1.5 bg-background hover:bg-accent text-foreground border border-border font-medium px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm"
                        >
                          <UserPlus size={14} />
                          Change Agent
                        </button>
                        <button className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 font-medium px-3 py-1.5 rounded-lg transition-colors text-xs">
                          <PhoneOutgoing size={14} />
                          Outbound Call
                        </button>
                        <button 
                          onClick={() => confirmDelete(pn.phone_number_id)}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 font-medium px-3 py-1.5 rounded-lg transition-colors text-xs"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAssignAgent(pn.phone_number_id)}
                          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm"
                        >
                          <UserPlus size={14} />
                          Assign Agent
                        </button>
                        <button 
                          onClick={() => confirmDelete(pn.phone_number_id)}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 font-medium px-3 py-1.5 rounded-lg transition-colors text-xs"
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
