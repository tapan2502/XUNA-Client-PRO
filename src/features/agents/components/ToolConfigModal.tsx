import { useState, useEffect } from "react"
import { Button, Input, Textarea } from "@heroui/react"
import { BuiltInTool } from "@/store/agentsSlice"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumInput } from "@/components/premium/PremiumInput"
import { PremiumTextarea } from "@/components/premium/PremiumTextarea"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"

interface ToolConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (tool: BuiltInTool) => void
  editingTool?: BuiltInTool | null
}

export function ToolConfigModal({ isOpen, onClose, onSave, editingTool }: ToolConfigModalProps) {
  const [toolName, setToolName] = useState("")
  const [toolUrl, setToolUrl] = useState("")
  const [toolDescription, setToolDescription] = useState("")

  useEffect(() => {
    if (editingTool) {
      setToolName(editingTool.name)
      setToolDescription(editingTool.description || "")
      if (editingTool.type === "webhook" && (editingTool as any).api_schema) {
        setToolUrl((editingTool as any).api_schema.url || "")
      }
    } else {
      setToolName("")
      setToolUrl("")
      setToolDescription("")
    }
  }, [editingTool])

  const handleSave = () => {
    if (!toolName.trim()) return
    onSave({
      name: toolName,
      description: toolDescription,
      type: "webhook",
      disable_interruptions: false,
      force_pre_tool_speech: false,
      params: {},
      api_schema: {
        url: toolUrl,
        method: "POST",
        request_body_schema: {
          properties: {},
          type: "object"
        }
      }
    })
    handleClose()
  }

  const handleClose = () => {
    setToolName("")
    setToolUrl("")
    setToolDescription("")
    onClose()
  }

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <Button variant="light" onPress={handleClose} className="font-medium">
        Cancel
      </Button>
      <Button
        color="primary"
        className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
        onPress={handleSave}
        isDisabled={!toolName.trim()}
      >
        {editingTool ? "Update" : "Add"} Tool
      </Button>
    </div>
  )

  return (
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={handleClose}
      title={editingTool ? "Edit Tool" : "Add Webhook Tool"}
      subtitle="Configure a custom webhook tool for your agent"
      size="md"
      footer={footer}
    >
    <PremiumPanelContent>
      <PremiumFormSection>
        <PremiumInput
          label="Tool Name"
          placeholder="e.g., get_weather"
          description="Unique identifier for this tool"
          value={toolName}
          onValueChange={setToolName}
          isRequired
        />

        <PremiumInput
          label="Webhook URL"
          placeholder="https://api.example.com/webhook"
          description="The endpoint that will be called"
          value={toolUrl}
          onValueChange={setToolUrl}
          type="url"
        />

        <PremiumTextarea
          label="Description"
          placeholder="Describe what this tool does..."
          description="Helps the AI understand when to use this tool"
          value={toolDescription}
          onValueChange={setToolDescription}
          minRows={3}
        />
      </PremiumFormSection>
    </PremiumPanelContent>
    </PremiumSidePanel>
  )
}

