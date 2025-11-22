"use client"

import { MessageSquare, Globe, Volume2 } from "lucide-react"
import type { Voice } from "@/store/agentsSlice"
import { llmOptions, languages } from "@/lib/constants/languages"
import { ModernDropdown } from "@/components/ui/ModernDropdown"
import { useState } from "react"
import { VoiceModal } from "../VoiceModal"
import { useAppDispatch } from "@/app/hooks"
import { fetchVoices } from "@/store/agentsSlice"

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
        <div className="group surface-panel p-5 space-y-3 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20 text-primary">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Model</h3>
          </div>
          <ModernDropdown
            value={agent.conversation_config?.agent?.prompt?.llm || "gpt-4.1"}
            options={llmOptions.map((model) => ({ value: model, label: model }))}
            onChange={(value) => onChange("conversation_config.agent.prompt.llm", value)}
            placeholder="Select Model"
          />
        </div>

        {/* Voice Card */}
        <div className="group surface-panel p-5 space-y-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20 text-primary">
              <Volume2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Voice</h3>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-full text-left rounded-lg bg-accent hover:bg-primary/5 transition-all duration-300 p-3 border border-border hover:border-primary/30 hover:shadow-sm"
          >
            <p className="text-base font-bold text-primary mb-1">{currentVoice?.name || "Not Set"}</p>
            {currentVoice?.labels && (
              <div className="text-xs text-muted-foreground space-y-0.5">
                {currentVoice.labels.accent && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-foreground/60">Accent:</span>
                    <span>{currentVoice.labels.accent}</span>
                  </p>
                )}
                {currentVoice.labels.age && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-foreground/60">Age:</span>
                    <span>{currentVoice.labels.age}</span>
                  </p>
                )}
                {currentVoice.labels.gender && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-foreground/60">Gender:</span>
                    <span>{currentVoice.labels.gender}</span>
                  </p>
                )}
              </div>
            )}
          </button>
        </div>

        {/* Language Card */}
        <div className="group surface-panel p-5 space-y-3 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20 text-primary">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Language</h3>
          </div>
          <ModernDropdown
            value={agent.conversation_config?.agent?.language || "en"}
            options={languages.map((lang) => ({ value: lang.code, label: lang.name }))}
            onChange={(value) => onChange("conversation_config.agent.language", value)}
            placeholder="Select Language"
          />
        </div>
      </div>
      {/* </CHANGE> */}

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
