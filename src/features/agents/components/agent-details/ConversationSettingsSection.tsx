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
    <div className="surface-panel overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group w-full px-6 py-5 flex items-center justify-between hover:bg-accent/50 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          {/* </CHANGE> */}
          <h3 className="text-base font-bold">Advanced Conversation Settings</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground transition-transform duration-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-300" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 space-y-6 border-t-2 border-border bg-accent/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary" />
                <label className="text-sm font-semibold">Turn Timeout</label>
              </div>
              <span className="text-xs font-bold font-mono text-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 px-2.5 py-1 rounded-lg">
                {turn.turn_timeout || 7}s
              </span>
            </div>
            <div className="relative w-full h-3 flex items-center">
              <div className="absolute w-full h-2 bg-accent rounded-full" />
              <div
                className="absolute h-2 bg-gradient-to-r from-primary via-yellow-500 to-red-500 rounded-full pointer-events-none"
                style={{
                  width: `${(((turn.turn_timeout || 7) - 1) / 29) * 100}%`,
                }}
              />
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={turn.turn_timeout || 7}
                onChange={(e) => onChange("conversation_config.turn.turn_timeout", Number.parseInt(e.target.value))}
                className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Maximum wait time for user's reply before re-engaging (1-30 seconds)
            </p>
          </div>
          {/* </CHANGE> */}

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <PhoneOff className="w-4 h-4 text-primary" />
                <label className="text-sm font-semibold">Silence End Call Timeout</label>
              </div>
              <span className="text-xs font-bold font-mono text-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 px-2.5 py-1 rounded-lg">
                {turn.silence_end_call_timeout === -1 ? "Disabled" : `${turn.silence_end_call_timeout || 0}s`}
              </span>
            </div>
            <div className="relative w-full h-3 flex items-center">
              <div className="absolute w-full h-2 bg-accent rounded-full" />
              <div
                className="absolute h-2 bg-gradient-to-r from-primary via-yellow-500 to-red-500 rounded-full pointer-events-none"
                style={{
                  width: `${turn.silence_end_call_timeout === -1 ? 0 : (turn.silence_end_call_timeout / 300) * 100}%`,
                }}
              />
              <input
                type="range"
                min="-1"
                max="300"
                step="1"
                value={turn.silence_end_call_timeout ?? -1}
                onChange={(e) =>
                  onChange("conversation_config.turn.silence_end_call_timeout", Number.parseInt(e.target.value))
                }
                className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Maximum silence before ending call (-1 to disable, 0-300 seconds)
            </p>
          </div>
          {/* </CHANGE> */}

          <div className="space-y-3">
            <label className="text-sm font-semibold block">Turn Mode</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer group/radio">
                <input
                  type="radio"
                  name="turnMode"
                  value="silence"
                  checked={turn.mode === "silence"}
                  onChange={(e) => onChange("conversation_config.turn.mode", e.target.value)}
                  className="w-5 h-5 border-2 border-muted-foreground rounded-full appearance-none cursor-pointer checked:border-primary checked:border-[6px] transition-all hover:border-primary/50"
                />
                <span className="text-sm font-medium group-hover/radio:text-primary transition-colors">Silence</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group/radio">
                <input
                  type="radio"
                  name="turnMode"
                  value="turn"
                  checked={turn.mode === "turn"}
                  onChange={(e) => onChange("conversation_config.turn.mode", e.target.value)}
                  className="w-5 h-5 border-2 border-muted-foreground rounded-full appearance-none cursor-pointer checked:border-primary checked:border-[6px] transition-all hover:border-primary/50"
                />
                <span className="text-sm font-medium group-hover/radio:text-primary transition-colors">Turn</span>
              </label>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Choose how the agent detects when the user has finished speaking
            </p>
          </div>
          {/* </CHANGE> */}
        </div>
      )}
    </div>
  )
}
