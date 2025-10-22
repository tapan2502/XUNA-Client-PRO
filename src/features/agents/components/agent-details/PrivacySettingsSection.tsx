"use client"

import { Shield, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { useState } from "react"

interface PrivacySettingsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function PrivacySettingsSection({ agent, onChange }: PrivacySettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const privacy = agent.platform_settings?.privacy || {}
  const conversationInitiation = agent.platform_settings?.conversation_initiation || "user_starts"

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <div className="surface-panel overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-[hsl(var(--accent))] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[hsl(var(--primary))]" />
            <h3 className="font-medium">Privacy Settings</h3>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {isExpanded && (
          <div className="p-6 space-y-6 border-t border-border bg-[hsl(var(--accent)_/_0.35)] dark:bg-[hsl(var(--accent)_/_0.4)]">
            {/* Record Voice */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Record Voice</h4>
                <p className="text-xs text-muted-foreground">Whether to record the conversation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.record_voice ?? true}
                  onChange={(e) => onChange("platform_settings.privacy.record_voice", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(var(--primary)_/_0.2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--primary))]"></div>
              </label>
            </div>

            {/* Retention Days */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Retention Days ({privacy.retention_days === -1 ? "No limit" : privacy.retention_days || 0})
              </label>
              <input
                type="range"
                min="-1"
                max="365"
                step="1"
                value={privacy.retention_days ?? -1}
                onChange={(e) => onChange("platform_settings.privacy.retention_days", Number.parseInt(e.target.value))}
                className="w-full accent-[hsl(var(--primary))]"
              />
              <p className="text-xs text-muted-foreground">
                The number of days to retain the conversation. -1 indicates no retention limit
              </p>
            </div>

            {/* Delete Transcript and PII */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Delete Transcript and PII</h4>
                <p className="text-xs text-muted-foreground">Whether to delete the transcript and PII</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.delete_transcript_and_pii ?? false}
                  onChange={(e) => onChange("platform_settings.privacy.delete_transcript_and_pii", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(var(--primary)_/_0.2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--primary))]"></div>
              </label>
            </div>

            {/* Delete Audio */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Delete Audio</h4>
                <p className="text-xs text-muted-foreground">Whether to delete the audio</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.delete_audio ?? false}
                  onChange={(e) => onChange("platform_settings.privacy.delete_audio", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(var(--primary)_/_0.2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--primary))]"></div>
              </label>
            </div>

            {/* Apply to Existing Conversations */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Apply to Existing Conversations</h4>
                <p className="text-xs text-muted-foreground">
                  Whether to apply the privacy settings to existing conversations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.apply_to_existing_conversations ?? false}
                  onChange={(e) =>
                    onChange("platform_settings.privacy.apply_to_existing_conversations", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(var(--primary)_/_0.2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--primary))]"></div>
              </label>
            </div>

            {/* Zero Retention Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Zero Retention Mode</h4>
                <p className="text-xs text-muted-foreground">
                  Whether to enable zero retention mode - no PII data is stored
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.zero_retention_mode ?? false}
                  onChange={(e) => onChange("platform_settings.privacy.zero_retention_mode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(var(--primary)_/_0.2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--primary))]"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Conversation Initiation */}
      <div className="surface-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="font-medium">Conversation Initiation</h3>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="conversation_initiation"
              value="bot_starts"
              checked={conversationInitiation === "bot_starts"}
              onChange={(e) => onChange("platform_settings.conversation_initiation", e.target.value)}
              className="w-4 h-4 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] accent-[hsl(var(--primary))]"
            />
            <span className="text-sm">Bot starts conversation</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="conversation_initiation"
              value="user_starts"
              checked={conversationInitiation === "user_starts"}
              onChange={(e) => onChange("platform_settings.conversation_initiation", e.target.value)}
              className="w-4 h-4 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] accent-[hsl(var(--primary))]"
            />
            <span className="text-sm">User starts conversation</span>
          </label>
        </div>

        <p className="text-xs text-muted-foreground">
          Choose whether the bot should greet the user first or wait for the user to speak.
        </p>
      </div>
    </div>
  )
}
