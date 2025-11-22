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
    <div className="space-y-4">
      <div className="surface-panel overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group w-full px-6 py-5 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold">Privacy Settings</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {isExpanded && (
          <div className="p-6 space-y-5 border-t border-border bg-accent/30">
            {/* Record Voice */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold mb-0.5">Record Voice</h4>
                <p className="text-xs text-muted-foreground">Whether to record the conversation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.record_voice ?? true}
                  onChange={(e) => onChange("platform_settings.privacy.record_voice", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:via-yellow-500 peer-checked:to-red-500 shadow-sm"></div>
              </label>
            </div>

            {/* Retention Days */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Retention Days</label>
                <span className="text-xs font-mono text-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 px-2.5 py-1 rounded-lg">
                  {privacy.retention_days === -1 ? "No limit" : privacy.retention_days || 0}
                </span>
              </div>
              <div className="relative w-full h-3 flex items-center">
                <div className="absolute w-full h-2 bg-accent rounded-full" />
                <div
                  className="absolute h-2 bg-gradient-to-r from-primary via-yellow-500 to-red-500 rounded-full pointer-events-none"
                  style={{
                    width: `${privacy.retention_days === -1 ? 0 : (privacy.retention_days / 365) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min="-1"
                  max="365"
                  step="1"
                  value={privacy.retention_days ?? -1}
                  onChange={(e) =>
                    onChange("platform_settings.privacy.retention_days", Number.parseInt(e.target.value))
                  }
                  className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                The number of days to retain the conversation. -1 indicates no retention limit
              </p>
            </div>

            {/* Delete Transcript and PII */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold mb-0.5">Delete Transcript and PII</h4>
                <p className="text-xs text-muted-foreground">Whether to delete the transcript and PII</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.delete_transcript_and_pii ?? false}
                  onChange={(e) => onChange("platform_settings.privacy.delete_transcript_and_pii", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:via-yellow-500 peer-checked:to-red-500 shadow-sm"></div>
              </label>
            </div>

            {/* Delete Audio */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold mb-0.5">Delete Audio</h4>
                <p className="text-xs text-muted-foreground">Whether to delete the audio</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.delete_audio ?? false}
                  onChange={(e) => onChange("platform_settings.privacy.delete_audio", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:via-yellow-500 peer-checked:to-red-500 shadow-sm"></div>
              </label>
            </div>

            {/* Apply to Existing Conversations */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold mb-0.5">Apply to Existing Conversations</h4>
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
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:via-yellow-500 peer-checked:to-red-500 shadow-sm"></div>
              </label>
            </div>

            {/* Zero Retention Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold mb-0.5">Zero Retention Mode</h4>
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
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:via-yellow-500 peer-checked:to-red-500 shadow-sm"></div>
              </label>
            </div>
          </div>
        )}
      </div>
      {/* </CHANGE> */}

      <div className="group surface-panel p-6 space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-base font-bold">Conversation Initiation</h3>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer group/radio">
            <input
              type="radio"
              name="conversation_initiation"
              value="bot_starts"
              checked={conversationInitiation === "bot_starts"}
              onChange={(e) => onChange("platform_settings.conversation_initiation", e.target.value)}
              className="w-5 h-5 border-2 border-muted-foreground rounded-full appearance-none cursor-pointer checked:border-primary checked:border-[6px] transition-all hover:border-primary/50"
            />
            <span className="text-sm font-medium group-hover/radio:text-foreground transition-colors">
              Bot starts conversation
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer group/radio">
            <input
              type="radio"
              name="conversation_initiation"
              value="user_starts"
              checked={conversationInitiation === "user_starts"}
              onChange={(e) => onChange("platform_settings.conversation_initiation", e.target.value)}
              className="w-5 h-5 border-2 border-muted-foreground rounded-full appearance-none cursor-pointer checked:border-primary checked:border-[6px] transition-all hover:border-primary/50"
            />
            <span className="text-sm font-medium group-hover/radio:text-foreground transition-colors">
              User starts conversation
            </span>
          </label>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Choose whether the bot should greet the user first or wait for the user to speak.
        </p>
      </div>
      {/* </CHANGE> */}
    </div>
  )
}
