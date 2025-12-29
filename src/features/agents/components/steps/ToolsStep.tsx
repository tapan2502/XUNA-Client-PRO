"use client"

import type React from "react"

import { useState } from "react"
import { Settings, Webhook, Plus, X, ChevronRight, PenBox } from "lucide-react"
import type { BuiltInTool } from "@/store/agentsSlice"
import { ToolConfigModal } from "../ToolConfigModal"
import { Button, Card, CardBody, Chip } from "@heroui/react"

interface ToolsStepProps {
  toolIds: string[]
  setToolIds: React.Dispatch<React.SetStateAction<string[]>>
  builtInTools: Record<string, BuiltInTool | null>
  setBuiltInTools: React.Dispatch<React.SetStateAction<Record<string, BuiltInTool | null>>>
}

export function ToolsStep({ toolIds, setToolIds, builtInTools, setBuiltInTools }: ToolsStepProps) {
  const [isToolModalOpen, setIsToolModalOpen] = useState(false)
  const [editingToolId, setEditingToolId] = useState<string | null>(null)

  const handleAddTool = (tool: any) => {
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
    <div className="space-y-6">
      {/* Built-in Tool Presets */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="text-small font-medium text-default-900">Built-in Tool Presets</h3>
        </div>
        {/* Placeholder for built-in tool toggles */}
      </div>

      {/* Webhook Tools */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" />
            <h3 className="text-small font-medium text-default-900">Webhook tools</h3>
          </div>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => setIsToolModalOpen(true)}
            startContent={<Plus size={16} />}
          >
            Add Tool
          </Button>
        </div>

        {/* Tools List or Empty State */}
        {hasNoTools ? (
          <div className="rounded-lg border-2 border-dashed border-default-200 p-8 text-center">
            <p className="text-small text-default-500">No tools configured</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* System Tools */}
            {activeSystemTools.map(([key, tool]) => (
              <Card key={key} shadow="sm" className="border border-default-200">
                <CardBody className="flex flex-row items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success-50 dark:bg-success-900/20 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-success-600 dark:text-success-400" />
                    </div>
                    <div>
                      <div className="text-small font-medium text-default-900">
                        {tool!.name}
                        <Chip size="sm" color="success" variant="flat" className="ml-2 h-5 text-[10px]">
                          System
                        </Chip>
                      </div>
                      <div className="text-tiny text-default-500">
                        {tool!.description || `Built-in ${tool!.name} tool`}
                      </div>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleRemoveBuiltInTool(key)}
                  >
                    <X size={18} />
                  </Button>
                </CardBody>
              </Card>
            ))}

            {/* Custom Webhook Tools (from builtInTools) */}
            {activeWebhookTools.map(([key, tool]) => (
              <Card key={key} shadow="sm" className="border border-default-200">
                <CardBody className="flex flex-row items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                      <Webhook className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-small font-medium text-default-900">{tool!.name}</div>
                      <div className="text-tiny text-default-500">{tool!.description || "Webhook tool"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => {
                        setEditingToolId(key)
                        setIsToolModalOpen(true)
                      }}
                    >
                      <PenBox size={18} className="text-default-400" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleRemoveTool(key)}
                    >
                      <X size={18} />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* Legacy/Library Tools (from toolIds) */}
            {toolIds.map((toolId) => (
              <Card key={toolId} shadow="sm" className="border border-default-200">
                <CardBody className="flex flex-row items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-default-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-default-500" />
                    </div>
                    <div>
                      <div className="text-small font-medium text-default-900">{toolId}</div>
                      <div className="text-tiny text-default-500">Library Tool</div>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleRemoveTool(toolId)}
                  >
                    <X size={18} />
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tool Config Modal */}
      {isToolModalOpen && (
        <ToolConfigModal
          isOpen={isToolModalOpen}
          onClose={() => {
            setIsToolModalOpen(false)
            setEditingToolId(null)
          }}
          onSave={handleAddTool}
          editingToolId={editingToolId}
        />
      )}
    </div>
  )
}
