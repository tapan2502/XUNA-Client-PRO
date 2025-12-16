"use client"

import { MessageSquare, Globe, Volume2 } from "lucide-react"
import type { Voice } from "@/store/agentsSlice"
import { llmOptions, languages } from "@/lib/constants/languages"
import { useState } from "react"
import { VoiceModal } from "../VoiceModal"
import { useAppDispatch } from "@/app/hooks"
import { fetchVoices } from "@/store/agentsSlice"
import { Card, CardBody, Button, Select, SelectItem } from "@heroui/react"

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
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">Model</h3>
            </div>
            <Select
              selectedKeys={[agent.conversation_config?.agent?.prompt?.llm || "gpt-4.1"]}
              onChange={(e) => onChange("conversation_config.agent.prompt.llm", e.target.value)}
              variant="bordered"
              size="sm"
              aria-label="Select Model"
            >
              {llmOptions.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>

        {/* Voice Card */}
        <Card shadow="sm" className="border border-default-200" isPressable onPress={() => setIsVoiceModalOpen(true)}>
          <CardBody className="p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10">
                <Volume2 className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">Voice</h3>
            </div>
            <div className="space-y-2">
              <p className="text-base font-bold text-primary">{currentVoice?.name || "Not Set"}</p>
              {currentVoice?.labels && (
                <div className="text-xs text-default-500 space-y-0.5">
                  {currentVoice.labels.accent && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-default-600">Accent:</span>
                      <span>{currentVoice.labels.accent}</span>
                    </p>
                  )}
                  {currentVoice.labels.age && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-default-600">Age:</span>
                      <span>{currentVoice.labels.age}</span>
                    </p>
                  )}
                  {currentVoice.labels.gender && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-default-600">Gender:</span>
                      <span>{currentVoice.labels.gender}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Language Card */}
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">Language</h3>
            </div>
            <Select
              selectedKeys={[agent.conversation_config?.agent?.language || "en"]}
              onChange={(e) => onChange("conversation_config.agent.language", e.target.value)}
              variant="bordered"
              size="sm"
              aria-label="Select Language"
            >
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>
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
