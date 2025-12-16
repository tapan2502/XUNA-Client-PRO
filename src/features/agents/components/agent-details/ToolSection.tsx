"use client"

import { Card, CardBody, Chip } from "@heroui/react"
import { Wrench } from "lucide-react"

interface ToolsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function ToolsSection({ agent, onChange }: ToolsSectionProps) {
  const toolIds = agent.conversation_config?.agent?.prompt?.tool_ids || []
  const builtInTools = agent.conversation_config?.agent?.prompt?.built_in_tools || {}

  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-default-700">Tools</h3>
        </div>
        {toolIds.length === 0 && Object.keys(builtInTools).length === 0 ? (
          <p className="text-small text-default-400">No tools configured</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {toolIds.map((toolId: string) => (
              <Chip key={toolId} variant="flat" size="sm" color="primary">
                {toolId}
              </Chip>
            ))}
            {Object.keys(builtInTools).map((key) => (
              <Chip key={key} variant="flat" size="sm" color="success">
                {key}
              </Chip>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
