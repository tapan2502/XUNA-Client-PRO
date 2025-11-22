"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ToolConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (toolId: string) => void
  editingToolId?: string | null
}

export function ToolConfigModal({ isOpen, onClose, onSave, editingToolId }: ToolConfigModalProps) {
  const [toolName, setToolName] = useState("")
  const [toolUrl, setToolUrl] = useState("")
  const [toolDescription, setToolDescription] = useState("")

  useEffect(() => {
    if (editingToolId) {
      setToolName(editingToolId)
      // In a real app, you'd fetch the tool details here
    } else {
      setToolName("")
      setToolUrl("")
      setToolDescription("")
    }
  }, [editingToolId])

  const handleSave = () => {
    if (!toolName.trim()) return
    onSave(toolName)
    handleClose()
  }

  const handleClose = () => {
    setToolName("")
    setToolUrl("")
    setToolDescription("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingToolId ? "Edit Tool" : "Add Webhook Tool"}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tool Name *</label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g., get_weather"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Webhook URL</label>
            <input
              type="url"
              value={toolUrl}
              onChange={(e) => setToolUrl(e.target.value)}
              placeholder="https://api.example.com/webhook"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              value={toolDescription}
              onChange={(e) => setToolDescription(e.target.value)}
              placeholder="Describe what this tool does..."
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!toolName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-gradient rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingToolId ? "Update" : "Add"} Tool
          </button>
        </div>
      </div>
    </div>
  )
}
