"use client"

import { Card, CardBody, Input } from "@heroui/react"
import { Webhook } from "lucide-react"

interface WebhookSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function WebhookSection({ agent, onChange }: WebhookSectionProps) {
  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Webhook className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-default-700">Webhook URL</h3>
        </div>
        <Input
          type="url"
          value={agent.platform_settings?.workspace_overrides?.conversation_initiation_client_data_webhook?.url || ""}
          onValueChange={(value) =>
            onChange("platform_settings.workspace_overrides.conversation_initiation_client_data_webhook.url", value)
          }
          placeholder="https://example.com/webhook"
          variant="bordered"
          size="sm"
        />
      </CardBody>
    </Card>
  )
}
