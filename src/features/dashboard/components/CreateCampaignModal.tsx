import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { createBatchCall } from "@/store/campaignsSlice"
import { fetchAgents } from "@/store/agentsSlice"
import { fetchPhoneNumbers } from "@/store/phoneNumbersSlice"
import { X, Upload, FileText, Loader2, Calendar } from "lucide-react"
import { useSnackbar } from "@/components/ui/SnackbarProvider"

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const dispatch = useAppDispatch()
  const { showSnackbar } = useSnackbar()
  const { agents } = useAppSelector((state) => state.agents)
  const { phoneNumbers } = useAppSelector((state) => state.phoneNumbers)
  
  const [campaignName, setCampaignName] = useState("")
  const [selectedAgentId, setSelectedAgentId] = useState("")
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState("")
  const [recipientInputMethod, setRecipientInputMethod] = useState<"paste" | "csv">("paste")
  const [pastedNumbers, setPastedNumbers] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [scheduledTime, setScheduledTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAgents())
      dispatch(fetchPhoneNumbers())
    }
  }, [isOpen, dispatch])

  if (!isOpen) return null

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0])
    }
  }

  const parseRecipients = async (): Promise<{ phone_number: string; name?: string }[]> => {
    if (recipientInputMethod === "paste") {
      return pastedNumbers
        .split(/[\n,]+/)
        .map(num => num.trim())
        .filter(num => num.length > 0)
        .map(num => ({ phone_number: num }))
    } else if (csvFile) {
      // Basic CSV parsing
      const text = await csvFile.text()
      const lines = text.split('\n')
      return lines
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const [phone, name] = line.split(',')
          return { phone_number: phone.trim(), name: name?.trim() }
        })
        .filter(r => r.phone_number)
    }
    return []
  }

  const handleSubmit = async () => {
    if (!campaignName || !selectedAgentId || !selectedPhoneNumberId) {
      showSnackbar({ title: "Error", message: "Please fill in all required fields", variant: "error" })
      return
    }

    const recipients = await parseRecipients()
    if (recipients.length === 0) {
      showSnackbar({ title: "Error", message: "Please add at least one recipient", variant: "error" })
      return
    }

    setIsLoading(true)
    try {
      await dispatch(createBatchCall({
        call_name: campaignName,
        agent_id: selectedAgentId,
        agent_phone_number_id: selectedPhoneNumberId,
        recipients,
        scheduled_time_unix: scheduledTime ? Math.floor(new Date(scheduledTime).getTime() / 1000) : undefined
      })).unwrap()
      
      showSnackbar({ title: "Success", message: "Campaign created successfully", variant: "success" })
      onClose()
      // Reset form
      setCampaignName("")
      setSelectedAgentId("")
      setSelectedPhoneNumberId("")
      setPastedNumbers("")
      setCsvFile(null)
      setScheduledTime("")
    } catch (error) {
      console.error("Failed to create campaign:", error)
      showSnackbar({ title: "Error", message: "Failed to create campaign", variant: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <div className="p-1.5 bg-brand-gradient rounded-lg">
              <div className="w-4 h-4 border-2 border-white rounded-full" />
            </div>
            <h2 className="font-semibold text-lg">Create Batch Campaign</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Campaign Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter campaign name"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Agent Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Agent</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all appearance-none text-gray-900 dark:text-gray-100"
            >
              <option value="">Select an agent</option>
              {agents.map(agent => (
                <option key={agent.agent_id} value={agent.agent_id}>{agent.name}</option>
              ))}
            </select>
          </div>

          {/* Phone Number Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone Number</label>
            <select
              value={selectedPhoneNumberId}
              onChange={(e) => setSelectedPhoneNumberId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all appearance-none text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a phone number</option>
              {phoneNumbers.map(phone => (
                <option key={phone.phone_number_id} value={phone.phone_number_id}>{phone.phone_number}</option>
              ))}
            </select>
          </div>

          {/* Recipients */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone Numbers</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={recipientInputMethod === "paste"}
                  onChange={() => setRecipientInputMethod("paste")}
                  className="w-4 h-4 text-[#3b82f6] focus:ring-[#3b82f6]"
                />
                <span className="text-sm">Paste Numbers</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={recipientInputMethod === "csv"}
                  onChange={() => setRecipientInputMethod("csv")}
                  className="w-4 h-4 text-[#3b82f6] focus:ring-[#3b82f6]"
                />
                <span className="text-sm">Upload CSV File</span>
              </label>
            </div>

            {recipientInputMethod === "paste" ? (
              <textarea
                value={pastedNumbers}
                onChange={(e) => setPastedNumbers(e.target.value)}
                placeholder="Enter phone numbers (one per line or separated by commas)&#10;+1234567890&#10;+1987654321"
                className="w-full h-32 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all resize-none font-mono text-sm text-gray-900 dark:text-gray-100"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative">
                <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {csvFile ? csvFile.name : "Click to upload CSV"}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">Phone Number, Name (optional)</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Enter phone numbers in E.164 format, separated by new lines, commas, or spaces
            </p>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Schedule (Optional)</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all text-gray-900 dark:text-gray-100"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Leave empty to start immediately</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-gradient rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  )
}
