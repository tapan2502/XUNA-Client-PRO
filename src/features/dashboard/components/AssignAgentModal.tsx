import { useEffect, useState } from "react"
import { Check, Bot } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { updatePhoneNumber } from "@/store/phoneNumbersSlice"
import { fetchAgents } from "@/store/agentsSlice"
import { Button, Avatar } from "@heroui/react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"
import { PremiumPanelFooter } from "@/components/premium/PremiumPanelFooter"
import { SelectionCard } from "@/components/premium/SelectionCard"

interface AssignAgentModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumberId: string
  currentAgentId?: string
}

export default function AssignAgentModal({ isOpen, onClose, phoneNumberId, currentAgentId }: AssignAgentModalProps) {
  const dispatch = useAppDispatch()
  const { agents, loading: agentsLoading } = useAppSelector((state) => state.agents)
  const [selectedAgentId, setSelectedAgentId] = useState<string>(currentAgentId || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAgents())
      setSelectedAgentId(currentAgentId || "")
    }
  }, [isOpen, dispatch, currentAgentId])

  const handleSubmit = async () => {
    if (!selectedAgentId) return

    try {
      setIsSubmitting(true)
      await dispatch(
        updatePhoneNumber({
          phone_number_id: phoneNumberId,
          agent_id: selectedAgentId,
        }),
      ).unwrap()
      onClose()
    } catch (error) {
      console.error("Failed to assign agent:", error)
    } finally {
      setIsSubmitting(false)
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
          isLoading={isSubmitting}
          isDisabled={!selectedAgentId}
        >
          Save Assignment
        </Button>
      </div>
    </PremiumPanelFooter>
  )

  return (
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Agent"
      subtitle="Select an agent to handle calls for this number"
      size="md"
      footer={footer}
    >
      <PremiumPanelContent>
        <PremiumFormSection title="Available Agents" description="Choose an agent from the list below.">
            {agentsLoading ? (
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {agents.length === 0 ? (
                    <div className="text-center py-8 text-default-500 bg-default-50 rounded-lg col-span-2">
                    No agents found. Create an agent first.
                    </div>
                ) : (
                    agents.map((agent) => (
                    <SelectionCard
                        key={agent.agent_id}
                        title={agent.name}
                        description={`ID: ${agent.agent_id.slice(0, 8)}...`}
                        className="p-2"
                        icon={
                             <Avatar
                                name={agent.name}
                                size="sm"
                                isBordered
                                color={selectedAgentId === agent.agent_id ? "primary" : "default"}
                                className="shrink-0"
                            />
                        }
                        isSelected={selectedAgentId === agent.agent_id}
                        onClick={() => setSelectedAgentId(agent.agent_id)}
                    />
                    ))
                )}
                </div>
            )}
        </PremiumFormSection>
      </PremiumPanelContent>
    </PremiumSidePanel>
  )
}

