"use client"

import { useEffect, useState } from "react"
import { X, Loader2, Bot, Check } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { updatePhoneNumber } from "@/store/phoneNumbersSlice"
import { fetchAgents } from "@/store/agentsSlice"

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Assign Agent</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Select Agent</label>
              {agentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {agents.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                      No agents found. Create an agent first.
                    </div>
                  ) : (
                    agents.map((agent) => (
                      <button
                        key={agent.agent_id}
                        onClick={() => setSelectedAgentId(agent.agent_id)}
                        className={`flex items-center justify-between p-3.5 rounded-lg border-2 transition-all text-left font-medium ${
                          selectedAgentId === agent.agent_id
                            ? "bg-primary border-primary text-primary-foreground shadow-md scale-[1.02]"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:shadow-sm"
                        }`}
                      >
                        <span className="text-sm">{agent.name}</span>
                        {selectedAgentId === agent.agent_id && (
                          <div className="bg-primary-foreground/20 rounded-full p-0.5">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/30">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors text-sm shadow-sm hover:shadow"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedAgentId}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Save Assignment
          </button>
        </div>
      </div>
    </div>
  )
}
