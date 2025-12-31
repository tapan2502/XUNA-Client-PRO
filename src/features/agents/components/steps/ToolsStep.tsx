import { useState } from "react"
import { Settings, Webhook, Plus, X, PencilLine, Wrench } from "lucide-react"
import type { BuiltInTool } from "@/store/agentsSlice"
import { ToolConfigModal } from "../ToolConfigModal"
import { Button, Chip } from "@heroui/react"
import { cn } from "@/lib/utils"
import { SelectionCard } from "@/components/premium/SelectionCard"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"

interface ToolsStepProps {
  toolIds: string[]
  setToolIds: React.Dispatch<React.SetStateAction<string[]>>
  builtInTools: Record<string, BuiltInTool | null>
  setBuiltInTools: React.Dispatch<React.SetStateAction<Record<string, BuiltInTool | null>>>
}

export function ToolsStep({ toolIds, setToolIds, builtInTools, setBuiltInTools }: ToolsStepProps) {
  const [isToolModalOpen, setIsToolModalOpen] = useState(false)
  const [editingToolId, setEditingToolId] = useState<string | null>(null)

  const handleAddTool = (tool: BuiltInTool) => {
    // If we were editing, and the name changed, remove the old one
    if (editingToolId && editingToolId !== tool.name) {
      setBuiltInTools((prev) => {
        const newState = { ...prev }
        delete newState[editingToolId]
        return newState
      })
    }
    
    // Add to builtInTools, NOT toolIds
    // toolIds is for shared library tools
    setBuiltInTools((prev) => ({ ...prev, [tool.name]: tool }))
    setIsToolModalOpen(false)
    setEditingToolId(null)
  }

  const handleRemoveTool = (toolName: string) => {
    // Remove from builtInTools
    setBuiltInTools((prev) => {
      const newState = { ...prev }
      delete newState[toolName]
      return newState
    })
    
    // Also remove from toolIds if it was there (legacy/cleanup)
    setToolIds((prev) => prev.filter((id) => id !== toolName))
  }

  const handleRemoveBuiltInTool = (key: string) => {
    setBuiltInTools((prev) => ({ ...prev, [key]: null }))
  }

  // Separate system tools (presets) from custom webhook tools
  const activeSystemTools = Object.entries(builtInTools)
    .filter(([_, v]) => v !== null && v.type === "system")
  
  const activeWebhookTools = Object.entries(builtInTools)
    .filter(([_, v]) => v !== null && v.type === "webhook")

  const hasNoTools = toolIds.length === 0 && activeSystemTools.length === 0 && activeWebhookTools.length === 0

  return (
    <div className="space-y-10">
      {/* Built-in Tool Presets - Placeholder for now as per original code logic */}
      
      {/* Webhook Tools */}
      <PremiumFormSection
        title="Agent Capabilities"
        description="Configure tools that your agent can use to perform actions or retrieve information."
        action={
            <Button
                color="primary"
                className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
                onPress={() => setIsToolModalOpen(true)}
                startContent={<Plus size={16} />}
            >
                Add Tool
            </Button>
        }
      >
        {hasNoTools ? (
            <div className="rounded-xl border-2 border-dashed border-divider p-8 text-center bg-default-50/50 dark:bg-black/20">
                <Wrench className="w-8 h-8 mx-auto text-default-300 dark:text-default-700 mb-2" />
                <p className="text-sm text-default-500 font-medium">No tools configured. Add a webhook to extend capabilities.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-3">
                {/* System Tools */}
                {activeSystemTools.map(([key, tool]) => (
                    <SelectionCard
                        key={key}
                        title={tool!.name}
                        description={tool!.description || `Built-in system capability`}
                        icon={<Settings size={20} />}
                        isSelected={true}
                        disabled={true} // System tools distinct look
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                        rightContent={
                            <div className="flex items-center gap-2">
                                <Chip size="sm" color="success" variant="flat" className="h-6">System</Chip>
                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleRemoveBuiltInTool(key)}>
                                    <X size={18} />
                                </Button>
                            </div>
                        }
                    />
                ))}

                 {/* Custom Webhook Tools */}
                 {activeWebhookTools.map(([key, tool]) => (
                    <SelectionCard
                        key={key}
                        title={tool!.name}
                        description={tool!.description || "Custom Webhook"}
                        icon={<Webhook size={20} />}
                        isSelected={true}
                        onClick={() => {
                            setEditingToolId(key)
                            setIsToolModalOpen(true)
                        }}
                        rightContent={
                            <div className="flex items-center gap-1">
                                <Button isIconOnly size="sm" variant="light" onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingToolId(key)
                                    setIsToolModalOpen(true)
                                }}>
                                    <PencilLine size={18} className="text-default-400" />
                                </Button>
                                <Button isIconOnly size="sm" variant="light" color="danger" onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveTool(key)
                                }}>
                                    <X size={18} />
                                </Button>
                            </div>
                        }
                    />
                 ))}
                 
                {/* Legacy library tools */}
                {toolIds.map((toolId) => (
                    <SelectionCard
                        key={toolId}
                        title={toolId}
                        description="Library Tool"
                        icon={<Settings size={20} />}
                        isSelected={true}
                        rightContent={
                             <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleRemoveTool(toolId)}>
                                <X size={18} />
                            </Button>
                        }
                    />
                ))}
            </div>
        )}
      </PremiumFormSection>

      {/* Tool Config Modal */}
      {isToolModalOpen && (
        <ToolConfigModal
          isOpen={isToolModalOpen}
          onClose={() => {
            setIsToolModalOpen(false)
            setEditingToolId(null)
          }}
          onSave={handleAddTool}
          editingTool={editingToolId ? builtInTools[editingToolId] : null}
        />
      )}
    </div>
  )
}
