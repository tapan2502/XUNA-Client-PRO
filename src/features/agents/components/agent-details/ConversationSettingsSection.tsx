"use client"

import { MessageCircle, ChevronDown, ChevronUp, Clock, PhoneOff } from "lucide-react"
import { useState } from "react"

interface ConversationSettingsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function ConversationSettingsSection({ agent, onChange }: ConversationSettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const turn = agent.conversation_config?.turn || {}

  return (
    <div className="surface-panel overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[hsl(var(--accent))] transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="font-medium">Advanced Conversation Settings</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="p-6 space-y-6 border-t border-border bg-[hsl(var(--accent)_/_0.35)] dark:bg-[hsl(var(--accent)_/_0.4)]">
          {/* Turn Timeout */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
              <label className="text-sm font-medium">Turn Timeout ({turn.turn_timeout || 7}s)</label>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={turn.turn_timeout || 7}
              onChange={(e) => onChange("conversation_config.turn.turn_timeout", Number.parseInt(e.target.value))}
              className="w-full accent-[hsl(var(--primary))]"
            />
            <p className="text-xs text-muted-foreground">
              Maximum wait time for user's reply before re-engaging (1-30 seconds)
            </p>
          </div>

          {/* Silence End Call Timeout */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <PhoneOff className="w-4 h-4 text-[hsl(var(--primary))]" />
              <label className="text-sm font-medium">
                Silence End Call Timeout (
                {turn.silence_end_call_timeout === -1 ? "Disabled" : `${turn.silence_end_call_timeout || 0}s`})
              </label>
            </div>
            <input
              type="range"
              min="-1"
              max="300"
              step="1"
              value={turn.silence_end_call_timeout ?? -1}
              onChange={(e) =>
                onChange("conversation_config.turn.silence_end_call_timeout", Number.parseInt(e.target.value))
              }
              className="w-full accent-[hsl(var(--primary))]"
            />
            <p className="text-xs text-muted-foreground">
              Maximum silence before ending call (-1 to disable, 0-300 seconds)
            </p>
          </div>

          {/* Turn Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Turn Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="turnMode"
                  value="silence"
                  checked={turn.mode === "silence"}
                  onChange={(e) => onChange("conversation_config.turn.mode", e.target.value)}
                  className="w-4 h-4 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] accent-[hsl(var(--primary))]"
                />
                <span className="text-sm">Silence</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="turnMode"
                  value="turn"
                  checked={turn.mode === "turn"}
                  onChange={(e) => onChange("conversation_config.turn.mode", e.target.value)}
                  className="w-4 h-4 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] accent-[hsl(var(--primary))]"
                />
                <span className="text-sm">Turn</span>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose how the agent detects when the user has finished speaking
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
