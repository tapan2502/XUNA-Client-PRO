"use client"

import { Card, CardBody, Textarea } from "@heroui/react"

interface PromptSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function PromptSection({ agent, onChange }: PromptSectionProps) {
  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-default-700">System Prompt</h3>
        <Textarea
          value={agent.conversation_config?.agent?.prompt?.prompt || ""}
          onValueChange={(value) => onChange("conversation_config.agent.prompt.prompt", value)}
          placeholder="Enter the system prompt for your agent..."
          minRows={10}
          variant="bordered"
          classNames={{
            input: "font-mono text-small"
          }}
        />
      </CardBody>
    </Card>
  )
}
