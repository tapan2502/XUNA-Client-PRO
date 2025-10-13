"use client"

import type React from "react"

import { useState } from "react"
import { Settings, Webhook, Plus, X, ChevronRight } from "lucide-react"
import type { BuiltInTool } from "@/store/agentsSlice"
import { ToolConfigModal } from "../ToolConfigModal"

interface ToolsStepProps {
  toolIds: string[]
  setToolIds: React.Dispatch<React.SetStateAction<string[]>>
  builtInTools: Record<string, BuiltInTool | null>
  setBuiltInTools: React.Dispatch<React.SetStateAction<Record<string, BuiltInTool | null>>>
}

export function ToolsStep({ toolIds, setToolIds, builtInTools, setBuiltInTools }: ToolsStepProps) {
  const [isToolModalOpen, setIsToolModalOpen] = useState(false)
  const [editingToolId, setEditingToolId] = useState<string | null>(null)

  const handleAddTool = (toolId: string) => {
    if (!toolIds.includes(toolId)) {
      setToolIds((prev) => [...prev, toolId])
    }
    setIsToolModalOpen(false)
    setEditingToolId(null)
  }

  const handleRemoveTool = (toolId: string) => {
    setToolIds((prev) => prev.filter((id) => id !== toolId))
  }

  const handleRemoveBuiltInTool = (key: string) => {
    setBuiltInTools((prev) => ({ ...prev, [key]: null }))
  }

  const activeBuiltInTools = Object.entries(builtInTools).filter(([_, v]) => v !== null)
  const hasNoTools = toolIds.length === 0 && activeBuiltInTools.length === 0

  return (
    <div className="space-y-6">
      {/* Built-in Tool Presets */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Built-in Tool Presets</h3>
        </div>
        {/* Placeholder for built-in tool toggles */}
      </div>

      {/* Webhook Tools */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Webhook tools</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsToolModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            Add Tool
          </button>
        </div>

        {/* Tools List or Empty State */}
        {hasNoTools ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No tools configured</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-800">
            {/* Built-in Tools */}
            {activeBuiltInTools.map(([key, tool]) => (
              <div key={key} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {tool!.name}
                      <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        System
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tool!.description || `Built-in ${tool!.name} tool`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveBuiltInTool(key)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Webhook Tools */}
            {toolIds.map((toolId) => (
              <div key={toolId} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Webhook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{toolId}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Webhook tool</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingToolId(toolId)
                      setIsToolModalOpen(true)
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                    title="Edit"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveTool(toolId)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
