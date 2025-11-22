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
    <div className="group surface-panel p-6 space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
          <LinkIcon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-base font-bold">Webhook</h3>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium block">Webhook URL</label>
        <div className="flex items-center gap-2 mb-2">
          <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Conversation Initiation Data</span>
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
          className="w-full px-4 py-3 bg-accent border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 text-sm"
          placeholder="https://api.example.com/webhook"
        />
        {!webhookUrl && <p className="text-xs text-muted-foreground">No webhook URL configured</p>}
      </div>
    </div>
    // </CHANGE>
  )
}
