"use client"

import { useState } from "react"
import { Card, CardBody, Button, Tooltip, Divider } from "@heroui/react"
import { Wrench, Globe, Settings, Plus, Trash2, PenBox, ChevronRight } from "lucide-react"
import { ToolConfigDialog } from "./ToolConfigDialog"

interface ToolsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
  agents: any[]
}

export function ToolsSection({ agent, onChange, agents }: ToolsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingToolName, setEditingToolName] = useState<string | null>(null)
  const [editingToolType, setEditingToolType] = useState<"webhook" | "system" | null>(null)

  const toolIds = agent.conversation_config?.agent?.prompt?.tool_ids || []
  const builtInTools = agent.conversation_config?.agent?.prompt?.built_in_tools || {}

  const handleAddTool = (tool: any) => {
    if (tool.type === "system") {
      const newBuiltInTools = { ...builtInTools, [tool.name]: tool }
      onChange("conversation_config.agent.prompt.built_in_tools", newBuiltInTools)
    } else {
      const newToolIds = [...toolIds, tool.name]
      onChange("conversation_config.agent.prompt.tool_ids", newToolIds)
      const newBuiltInTools = { ...builtInTools, [tool.name]: tool }
      onChange("conversation_config.agent.prompt.built_in_tools", newBuiltInTools)
    }
  }

  const handleUpdateTool = (tool: any) => {
    if (editingToolName !== null) {
      const newBuiltInTools = { ...builtInTools, [tool.name]: tool }
      if (tool.name !== editingToolName) {
        delete newBuiltInTools[editingToolName]
      }
      onChange("conversation_config.agent.prompt.built_in_tools", newBuiltInTools)
    }
  }

  const handleDeleteTool = (name: string, type: "webhook" | "system") => {
    const newBuiltInTools = { ...builtInTools }
    delete newBuiltInTools[name]
    onChange("conversation_config.agent.prompt.built_in_tools", newBuiltInTools)
    
    const newToolIds = toolIds.filter((id: string) => id !== name)
    onChange("conversation_config.agent.prompt.tool_ids", newToolIds)
  }

  const systemTools = Object.entries(builtInTools || {})
    .filter(([_, config]: [string, any]) => config && config.type === "system")
    .map(([name, config]) => ({ name, ...(config as any) }))

  const webhookTools = Object.entries(builtInTools || {})
    .filter(([_, config]: [string, any]) => config && (config.type === "webhook" || !config.type))
    .map(([name, config]) => ({ name, ...(config as any) }))

  const openAddModal = () => {
    setEditingToolName(null)
    setEditingToolType(null)
    setIsModalOpen(true)
  }

  const openEditModal = (tool: any) => {
    setEditingToolName(tool.name)
    setEditingToolType(tool.type)
    setIsModalOpen(true)
  }

  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-default-700">Tools & Integrations</h3>
          </div>
          <Button 
            size="sm" 
            variant="flat" 
            color="primary" 
            startContent={<Plus size={16} />}
            onPress={openAddModal}
            className="font-semibold"
          >
            Add
          </Button>
        </div>

        <div className="space-y-8">
          {/* System Tools Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-default-400 uppercase tracking-wider px-1">System Tools</h4>
            <div className="space-y-2">
              {systemTools.length === 0 ? (
                <p className="text-tiny text-default-400 italic px-1">No system tools configured</p>
              ) : (
                systemTools.map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-default-50 transition-colors border border-transparent hover:border-default-200 group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Settings size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-small font-semibold text-default-900">{tool.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-bold uppercase">System</span>
                        </div>
                        <p className="text-tiny text-default-500">{tool.description || "Built-in functionality"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button isIconOnly size="sm" variant="light" onPress={() => openEditModal(tool)}>
                        <PenBox size={16} className="text-default-400" />
                      </Button>
                      <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDeleteTool(tool.name, "system")}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Divider />

          {/* Webhook Tools Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-default-400 uppercase tracking-wider px-1">Webhooks</h4>
            <div className="space-y-2">
              {webhookTools.length === 0 ? (
                <p className="text-tiny text-default-400 italic px-1">No webhooks configured</p>
              ) : (
                webhookTools.map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-default-50 transition-colors border border-transparent hover:border-default-200 group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Globe size={18} />
                      </div>
                      <div>
                        <span className="text-small font-semibold text-default-900">{tool.name}</span>
                        <p className="text-tiny text-default-500">{tool.description || "Custom API integration"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button isIconOnly size="sm" variant="light" onPress={() => openEditModal(tool)}>
                        <PenBox size={16} className="text-default-400" />
                      </Button>
                      <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDeleteTool(tool.name, "webhook")}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardBody>

      <ToolConfigDialog 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingToolName !== null ? handleUpdateTool : handleAddTool}
        editingTool={editingToolName !== null ? builtInTools[editingToolName] : null}
        agents={agents}
      />
    </Card>
  )
}
