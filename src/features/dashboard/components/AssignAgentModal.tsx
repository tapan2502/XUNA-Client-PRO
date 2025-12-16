"use client"

import { useEffect, useState } from "react"
import { Check, Bot } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { updatePhoneNumber } from "@/store/phoneNumbersSlice"
import { fetchAgents } from "@/store/agentsSlice"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Snippet,
  Avatar,
} from "@heroui/react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Bot size={24} className="text-primary" />
                <span>Assign Agent</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <p className="text-small text-default-500 font-medium">Select an agent to handle calls for this number</p>
                
                {agentsLoading ? (
                   <div className="flex justify-center py-8">
                     <LoadingSpinner />
                   </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {agents.length === 0 ? (
                      <div className="text-center py-8 text-default-500 bg-default-50 rounded-lg">
                        No agents found. Create an agent first.
                      </div>
                    ) : (
                      agents.map((agent) => (
                        <button
                          key={agent.agent_id}
                          onClick={() => setSelectedAgentId(agent.agent_id)}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left group ${
                            selectedAgentId === agent.agent_id
                              ? "border-primary bg-primary-50 dark:bg-primary-900/20"
                              : "border-default-200 hover:border-default-300 bg-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={agent.name}
                              size="sm"
                              isBordered
                              color={selectedAgentId === agent.agent_id ? "primary" : "default"}
                            />
                            <div className="flex flex-col">
                              <span className={`text-small font-semibold ${
                                selectedAgentId === agent.agent_id ? "text-primary" : "text-default-foreground"
                              }`}>
                                {agent.name}
                              </span>
                              <span className="text-tiny text-default-400">ID: {agent.agent_id.slice(0, 8)}...</span>
                            </div>
                          </div>
                          
                          {selectedAgentId === agent.agent_id && (
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                className="shadow-sm"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!selectedAgentId}
              >
                Save Assignment
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
