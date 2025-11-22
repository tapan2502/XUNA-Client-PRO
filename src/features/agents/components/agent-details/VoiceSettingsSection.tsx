"use client"

import { Volume2, Thermometer, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { getAvailableModels } from "@/lib/constants/languages"

interface VoiceSettingsSectionProps {
  agent: any
  voices?: any[]
  onChange: (path: string, value: any) => void
}

export function VoiceSettingsSection({ agent, onChange }: VoiceSettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const tts = agent.conversation_config?.tts || {}
  const currentLang = agent.conversation_config?.agent?.language || "en"
  const availableModels = getAvailableModels(currentLang)
  const currentModelId = tts.model_id || "eleven_turbo_v2_5"

  return (
    <div className="space-y-5">
      <div className="group surface-panel p-6 space-y-5 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
            <Volume2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-base font-bold">Voice Model</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onChange("conversation_config.tts.model_id", model.id)
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                currentModelId === model.id
                  ? "border-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 shadow-lg ring-2 ring-primary/20"
                  : "border-border bg-accent hover:bg-accent/70 hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <p
                className={`font-bold text-sm mb-1 ${currentModelId === model.id ? "text-primary" : "text-foreground"}`}
              >
                {model.name}
              </p>
              <p
                className={`text-xs leading-relaxed ${currentModelId === model.id ? "text-foreground/70" : "text-muted-foreground"}`}
              >
                {model.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      {/* </CHANGE> */}

      <div className="group surface-panel p-6 space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
              <Thermometer className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold">Temperature</h3>
          </div>
          <span className="text-sm font-bold font-mono text-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 px-3 py-1.5 rounded-lg">
            {agent.conversation_config?.agent?.prompt?.temperature?.toFixed(1) || "0.7"}
          </span>
        </div>
        <div className="relative w-full h-3 flex items-center">
          <div className="absolute w-full h-2 bg-accent rounded-full" />
          <div
            className="absolute h-2 bg-gradient-to-r from-primary via-yellow-500 to-red-500 rounded-full pointer-events-none"
            style={{
              width: `${((agent.conversation_config?.agent?.prompt?.temperature || 0.7) / 1) * 100}%`,
            }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={agent.conversation_config?.agent?.prompt?.temperature || 0.7}
            onChange={(e) =>
              onChange("conversation_config.agent.prompt.temperature", Number.parseFloat(e.target.value))
            }
            className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
          />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Adjust creativity level: 0 for focused responses, 1 for more creative outputs
        </p>
      </div>
      {/* </CHANGE> */}

      <div className="surface-panel overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group/btn w-full px-6 py-5 flex items-center justify-between hover:bg-accent/50 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
              <Volume2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold">Advanced Voice Settings</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-300" />
          )}
        </button>

        {isExpanded && (
          <div className="p-6 space-y-6 border-t-2 border-border bg-accent/30">
            {/* Optimize Streaming Latency */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Optimize Streaming Latency</label>
                <span className="text-xs font-bold font-mono text-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 px-2.5 py-1 rounded-lg">
                  {tts.optimize_streaming_latency || 0}
                </span>
              </div>
              <div className="relative w-full h-3 flex items-center">
                <div className="absolute w-full h-2 bg-accent rounded-full" />
                <div
                  className="absolute h-2 bg-gradient-to-r from-primary via-yellow-500 to-red-500 rounded-full pointer-events-none"
                  style={{
                    width: `${((tts.optimize_streaming_latency || 0) / 4) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={tts.optimize_streaming_latency || 0}
                  onChange={(e) =>
                    onChange("conversation_config.tts.optimize_streaming_latency", Number.parseInt(e.target.value))
                  }
                  className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Higher values prioritize speed over quality (0-4)
              </p>
            </div>

            {/* Stability */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Stability</label>
                <span className="text-xs font-bold font-mono text-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 px-2.5 py-1 rounded-lg">
                  {tts.stability?.toFixed(2) || "0.50"}
                </span>
              </div>
              <div className="relative w-full h-3 flex items-center">
                <div className="absolute w-full h-2 bg-accent rounded-full" />
                <div
                  className="absolute h-2 bg-gradient-to-r from-primary via-yellow-500 to-red-500 rounded-full pointer-events-none"
                  style={{
                    width: `${((tts.stability || 0.5) / 1) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={tts.stability || 0.5}
                  onChange={(e) => onChange("conversation_config.tts.stability", Number.parseFloat(e.target.value))}
                  className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Consistency of voice characteristics (0.0-1.0)
              </p>
            </div>

            {/* Speed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Speed</label>
                <span className="text-xs font-bold font-mono text-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 px-2.5 py-1 rounded-lg">
                  {tts.speed?.toFixed(2) || "1.00"}
                </span>
              </div>
              <div className="relative w-full h-3 flex items-center">
                <div className="absolute w-full h-2 bg-accent rounded-full" />
                <div
                  className="absolute h-2 bg-gradient-to-r from-primary via-yellow-500 to-red-500 rounded-full pointer-events-none"
                  style={{
                    width: `${(((tts.speed || 1.0) - 0.7) / 0.5) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min="0.7"
                  max="1.2"
                  step="0.01"
                  value={tts.speed || 1.0}
                  onChange={(e) => onChange("conversation_config.tts.speed", Number.parseFloat(e.target.value))}
                  className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Speech rate (0.7-1.2, default 1.0)</p>
            </div>

            {/* Similarity Boost */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Similarity Boost</label>
                <span className="text-xs font-bold font-mono text-primary bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 px-2.5 py-1 rounded-lg">
                  {tts.similarity_boost?.toFixed(2) || "0.80"}
                </span>
              </div>
              <div className="relative w-full h-3 flex items-center">
                <div className="absolute w-full h-2 bg-accent rounded-full" />
                <div
                  className="absolute h-2 bg-gradient-to-r from-primary via-yellow-500 to-red-500 rounded-full pointer-events-none"
                  style={{
                    width: `${((tts.similarity_boost || 0.8) / 1) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={tts.similarity_boost || 0.8}
                  onChange={(e) =>
                    onChange("conversation_config.tts.similarity_boost", Number.parseFloat(e.target.value))
                  }
                  className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enhances voice similarity to original (0.0-1.0)
              </p>
            </div>
          </div>
        )}
      </div>
      {/* </CHANGE> */}
    </div>
  )
}
