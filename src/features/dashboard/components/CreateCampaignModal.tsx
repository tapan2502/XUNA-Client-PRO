import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { createBatchCall } from "@/store/campaignsSlice"
import { fetchAgents } from "@/store/agentsSlice"
import { fetchPhoneNumbers } from "@/store/phoneNumbersSlice"
import { Upload, FileText, Loader2, Calendar } from "lucide-react"
import { useSnackbar } from "@/components/ui/SnackbarProvider"
import { Button, Select, SelectItem, Textarea, Tabs, Tab, Input } from "@heroui/react"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumInput } from "@/components/premium/PremiumInput"
import { PremiumSelect } from "@/components/premium/PremiumSelect"
import { PremiumTextarea } from "@/components/premium/PremiumTextarea"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"
import { PremiumPanelFooter } from "@/components/premium/PremiumPanelFooter"


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

  const footer = (
    <PremiumPanelFooter>
      <div className="flex justify-end gap-2 w-full">
        <Button variant="light" onPress={onClose} className="font-medium">
          Cancel
        </Button>
        <Button
          color="primary"
          className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
          onPress={handleSubmit}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Create Campaign
        </Button>
      </div>
    </PremiumPanelFooter>
  )

  return (
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Create Batch Campaign"
      subtitle="Launch a new outbound campaign to multiple recipients."
      size="lg"
      footer={footer}
    >
      <PremiumPanelContent>
        <PremiumFormSection title="Campaign Details">
            <PremiumInput
                label="Campaign Name"
                placeholder="e.g., Q4 Sales Outreach"
                value={campaignName}
                onValueChange={setCampaignName}
                labelPlacement="outside"
                isRequired
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PremiumSelect
                    label="Agent"
                    placeholder="Select an agent"
                    selectedKeys={selectedAgentId ? [selectedAgentId] : []}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                >
                    {agents.map(agent => (
                        <SelectItem key={agent.agent_id} textValue={agent.name}>
                            {agent.name}
                        </SelectItem>
                    ))}
                </PremiumSelect>

                <PremiumSelect
                    label="Phone Number"
                    placeholder="Select a phone number"
                    selectedKeys={selectedPhoneNumberId ? [selectedPhoneNumberId] : []}
                    onChange={(e) => setSelectedPhoneNumberId(e.target.value)}
                >
                    {phoneNumbers.map(phone => (
                        <SelectItem key={phone.phone_number_id} textValue={phone.phone_number}>
                            {phone.phone_number} {phone.label ? `(${phone.label})` : ""}
                        </SelectItem>
                    ))}
                </PremiumSelect>
            </div>
        </PremiumFormSection>

        <PremiumFormSection title="Recipients" description="Add phone numbers to call.">
             <Tabs 
                selectedKey={recipientInputMethod} 
                onSelectionChange={(key) => setRecipientInputMethod(key as "paste" | "csv")}
                variant="underlined"
                color="primary"
                classNames={{
                    tabList: "w-full border-b border-gray-200 dark:border-gray-700",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-4 h-10",
                    tabContent: "group-data-[selected=true]:text-primary"
                }}
            >
                <Tab key="paste" title="Paste Numbers">
                     <div className="pt-4">
                        <PremiumTextarea
                            placeholder="Enter phone numbers (one per line or separated by commas)&#10;+1234567890&#10;+1987654321"
                            value={pastedNumbers}
                            onValueChange={setPastedNumbers}
                            minRows={5}
                        />
                         <p className="text-xs text-gray-500 mt-2">
                            Enter phone numbers in E.164 format, separated by new lines, commas, or spaces
                        </p>
                    </div>
                </Tab>
                <Tab key="csv" title="Upload CSV">
                    <div className="pt-4">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative bg-gray-50/30">
                            <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {csvFile ? csvFile.name : "Click to upload CSV"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Phone Number, Name (optional)</span>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleCsvChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </PremiumFormSection>

        <PremiumFormSection title="Schedule" description="Optional: Schedule this campaign for later.">
             <div className="relative">
                <Input
                    type="datetime-local"
                    label="Start Time"
                    labelPlacement="outside"
                    placeholder="Select date and time"
                    value={scheduledTime}
                    onValueChange={setScheduledTime}
                    variant="bordered"
                    classNames={{
                        inputWrapper: "h-10 bg-white dark:bg-black/20 border-divider shadow-sm group-data-[focus=true]:border-primary transition-all duration-200 rounded-xl",
                        label: "text-foreground font-semibold text-[13px] mb-1.5"
                    }}
                />
            </div>
        </PremiumFormSection>
      </PremiumPanelContent>
    </PremiumSidePanel>
  )
}

