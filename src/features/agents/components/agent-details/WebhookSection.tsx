"use client"

import { LinkIcon } from "lucide-react"

interface WebhookSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function WebhookSection({ agent, onChange }: WebhookSectionProps) {
  const webhookUrl =
    agent.platform_settings?.workspace_overrides?.conversation_initiation_client_data_webhook?.url || ""

  return (
    <div className="surface-panel p-6 space-y-4">
      <div className="flex items-center gap-2">
        <LinkIcon className="w-5 h-5 text-[hsl(var(--primary))]" />
        <h3 className="font-medium">Webhook</h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Webhook URL</label>
        <div className="flex items-center gap-2 mb-2">
          <LinkIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Conversation Initiation Data</span>
        </div>
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) =>
            onChange(
              "platform_settings.workspace_overrides.conversation_initiation_client_data_webhook.url",
              e.target.value,
            )
          }
          className="w-full px-4 py-3 bg-[hsl(var(--accent))] border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)_/_0.3)] focus:border-[hsl(var(--primary)_/_0.4)] transition-all"
          placeholder="https://api.example.com/webhook"
        />
        {!webhookUrl && <p className="text-xs text-muted-foreground">No webhook URL configured</p>}
      </div>
    </div>
  )
}
