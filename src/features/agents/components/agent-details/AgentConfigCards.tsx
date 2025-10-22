"use client"

import { MessageSquare, Volume2, Globe, Thermometer } from "lucide-react"
import type { Voice } from "@/store/agentsSlice"
import { useState } from "react"
import { VoiceModal } from "../VoiceModal"
import { fetchVoices } from "@/store/agentsSlice"
import { useAppDispatch } from "@/app/hooks"
import { llmOptions, languages, getAvailableModels } from "@/lib/constants/languages"

interface AgentConfigCardsProps {
  agent: any
  voices: Voice[]
  onChange: (path: string, value: any) => void
}

export function AgentConfigCards({ agent, voices, onChange }: AgentConfigCardsProps) {
  const dispatch = useAppDispatch()
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  const currentVoice = voices.find((v) => v.voice_id === agent.conversation_config?.tts?.voice_id)
  const currentLanguage = languages.find((l) => l.code === agent.conversation_config?.agent?.language) || languages[0]

  const currentLang = agent.conversation_config?.agent?.language || "en"
  const availableModels = getAvailableModels(currentLang)

  const currentModelId = agent.conversation_config?.tts?.model_id || "eleven_turbo_v2_5"

  const handleVoiceChange = (voiceId: string) => {
    onChange("conversation_config.tts.voice_id", voiceId)
    setIsVoiceModalOpen(false)
  }

  const handleVoicesUpdate = () => {
    dispatch(fetchVoices())
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Model Card */}
        <div className="surface-panel p-6 space-y-4 transition-shadow hover:shadow-[0_18px_42px_hsl(var(--primary)/0.18)]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[hsl(var(--primary))]" />
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Model</h3>
          </div>
          <select
            value={agent.conversation_config?.agent?.prompt?.llm || "gpt-4.1"}
            onChange={(e) => onChange("conversation_config.agent.prompt.llm", e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[hsl(var(--accent))] border border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)_/_0.35)] focus:border-[hsl(var(--primary)_/_0.4)] transition"
          >
            {llmOptions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Card */}
        <div className="surface-panel p-6 space-y-3 cursor-pointer transition-all hover:shadow-[0_18px_42px_hsl(var(--primary)/0.18)]">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[hsl(var(--primary))]" />
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Voice</h3>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-full text-left rounded-xl bg-[hsl(var(--primary)_/_0.12)] dark:bg-[hsl(var(--primary)_/_0.18)] px-4 py-3 transition hover:bg-[hsl(var(--primary)_/_0.18)] dark:hover:bg-[hsl(var(--primary)_/_0.24)]"
          >
            <p className="text-2xl font-semibold text-[hsl(var(--primary))] mb-2">{currentVoice?.name || "Not Set"}</p>
            {currentVoice?.labels && (
              <div className="text-xs text-muted-foreground space-y-1">
                {currentVoice.labels.accent && (
                  <p>
                    <strong>Accent:</strong> {currentVoice.labels.accent}
                  </p>
                )}
                {currentVoice.labels.age && (
                  <p>
                    <strong>Age:</strong> {currentVoice.labels.age}
                  </p>
                )}
                {currentVoice.labels.gender && (
                  <p>
                    <strong>Gender:</strong> {currentVoice.labels.gender}
                  </p>
                )}
                {currentVoice.labels.use_case && (
                  <p>
                    <strong>Use Case:</strong> {currentVoice.labels.use_case}
                  </p>
                )}
              </div>
            )}
          </button>
        </div>

        {/* Language Card */}
        <div className="surface-panel p-6 space-y-4 transition-shadow hover:shadow-[0_18px_42px_hsl(var(--primary)/0.18)]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[hsl(var(--primary))]" />
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Language</h3>
          </div>
          <select
            value={agent.conversation_config?.agent?.language || "en"}
            onChange={(e) => onChange("conversation_config.agent.language", e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[hsl(var(--accent))] border border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)_/_0.35)] focus:border-[hsl(var(--primary)_/_0.4)] transition"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Voice Model Selection */}
      <div className="surface-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="text-base font-semibold">Voice Model</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {availableModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onChange("conversation_config.tts.model_id", model.id)
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all backdrop-blur ${
                currentModelId === model.id
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)_/_0.12)] text-[hsl(var(--primary))]"
                  : "border-transparent bg-[hsl(var(--accent))] hover:border-[hsl(var(--primary)_/_0.4)] hover:bg-[hsl(var(--accent)_/_0.8)]"
              }`}
            >
              <p className="font-medium text-sm mb-1">{model.name}</p>
              <p className="text-xs text-muted-foreground">{model.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="surface-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="text-base font-semibold">
            Temperature ({agent.conversation_config?.agent?.prompt?.temperature?.toFixed(1) || "0.7"})
          </h3>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={agent.conversation_config?.agent?.prompt?.temperature || 0.7}
          onChange={(e) => onChange("conversation_config.agent.prompt.temperature", Number.parseFloat(e.target.value))}
          className="w-full accent-[hsl(var(--primary))]"
        />
        <p className="text-sm text-muted-foreground">
          Adjust creativity level: 0 for focused responses, 1 for more creative outputs
        </p>
      </div>

      {/* Voice Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voices={voices}
        selectedVoiceId={agent.conversation_config?.tts?.voice_id || ""}
        onVoiceChange={handleVoiceChange}
        onVoicesUpdate={handleVoicesUpdate}
      />
    </>
  )
}
