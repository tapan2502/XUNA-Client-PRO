"use client"

import { Volume2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface VoiceSettingsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function VoiceSettingsSection({ agent, onChange }: VoiceSettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const tts = agent.conversation_config?.tts || {}

  return (
    <div className="surface-panel overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[hsl(var(--accent))] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="font-medium">Advanced Voice Settings</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="p-6 space-y-6 border-t border-border bg-[hsl(var(--accent)_/_0.35)] dark:bg-[hsl(var(--accent)_/_0.4)]">
          {/* Optimize Streaming Latency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Optimize Streaming Latency ({tts.optimize_streaming_latency || 0})
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={tts.optimize_streaming_latency || 0}
              onChange={(e) =>
                onChange("conversation_config.tts.optimize_streaming_latency", Number.parseInt(e.target.value))
              }
              className="w-full accent-[hsl(var(--primary))]"
            />
            <p className="text-xs text-muted-foreground">Higher values prioritize speed over quality (0-4)</p>
          </div>

          {/* Stability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Stability ({tts.stability?.toFixed(2) || "0.50"})</label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={tts.stability || 0.5}
              onChange={(e) => onChange("conversation_config.tts.stability", Number.parseFloat(e.target.value))}
              className="w-full accent-[hsl(var(--primary))]"
            />
            <p className="text-xs text-muted-foreground">Consistency of voice characteristics (0.0-1.0)</p>
          </div>

          {/* Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Speed ({tts.speed?.toFixed(2) || "1.00"})</label>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.2"
              step="0.01"
              value={tts.speed || 1.0}
              onChange={(e) => onChange("conversation_config.tts.speed", Number.parseFloat(e.target.value))}
              className="w-full accent-[hsl(var(--primary))]"
            />
            <p className="text-xs text-muted-foreground">Speech rate (0.7-1.2, default 1.0)</p>
          </div>

          {/* Similarity Boost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Similarity Boost ({tts.similarity_boost?.toFixed(2) || "0.80"})
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={tts.similarity_boost || 0.8}
              onChange={(e) => onChange("conversation_config.tts.similarity_boost", Number.parseFloat(e.target.value))}
              className="w-full accent-[hsl(var(--primary))]"
            />
            <p className="text-xs text-muted-foreground">Enhances voice similarity to original (0.0-1.0)</p>
          </div>
        </div>
      )}
    </div>
  )
}
