"use client"

import { useState } from "react"
import { Volume2, Thermometer, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardBody, Slider, RadioGroup, Radio } from "@heroui/react"
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
    <div className="space-y-4">
      {/* Voice Model Selection */}
      <Card shadow="sm" className="border border-default-200">
        <CardBody className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-default-700">Voice Model</h3>
          </div>
          <RadioGroup
            value={currentModelId}
            onValueChange={(value) => onChange("conversation_config.tts.model_id", value)}
          >
            {availableModels.map((model) => (
              <Radio key={model.id} value={model.id} description={model.description}>
                {model.name}
              </Radio>
            ))}
          </RadioGroup>
        </CardBody>
      </Card>

      {/* Temperature */}
      <Card shadow="sm" className="border border-default-200">
        <CardBody className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-default-700">Temperature</h3>
            </div>
            <span className="text-sm font-mono text-primary">
              {agent.conversation_config?.agent?.prompt?.temperature?.toFixed(1) || "0.7"}
            </span>
          </div>
          <Slider
            step={0.1}
            maxValue={1}
            minValue={0}
            value={agent.conversation_config?.agent?.prompt?.temperature || 0.7}
            onChange={(value) => onChange("conversation_config.agent.prompt.temperature", value as number)}
            size="sm"
            marks={[
              { value: 0, label: "0" },
              { value: 0.5, label: "0.5" },
              { value: 1, label: "1" },
            ]}
            className="max-w-md"
          />
          <p className="text-tiny text-default-400">Adjust creativity: 0 for focused, 1 for creative</p>
        </CardBody>
      </Card>

      {/* Advanced Voice Settings */}
      <Card shadow="sm" className="border border-default-200">
        <CardBody className="p-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-default-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-default-700">Advanced Voice Settings</h3>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {isExpanded && (
            <div className="px-5 pb-5 pt-2 space-y-6 border-t border-default-200 bg-default-50/50">
              {/* Optimize Streaming Latency */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Optimize Streaming Latency ({tts.optimize_streaming_latency || 0})
                </label>
                <Slider
                  step={1}
                  maxValue={4}
                  minValue={0}
                  value={tts.optimize_streaming_latency || 0}
                  onChange={(value) => onChange("conversation_config.tts.optimize_streaming_latency", value as number)}
                  size="sm"
                  marks={[
                    { value: 0, label: "0" },
                    { value: 2, label: "2" },
                    { value: 4, label: "4" },
                  ]}
                />
                <p className="text-tiny text-default-400">Higher values prioritize speed over quality (0-4)</p>
              </div>

              {/* Stability */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Stability ({tts.stability?.toFixed(2) || "0.50"})</label>
                <Slider
                  step={0.01}
                  maxValue={1}
                  minValue={0}
                  value={tts.stability || 0.5}
                  onChange={(value) => onChange("conversation_config.tts.stability", value as number)}
                  size="sm"
                />
                <p className="text-tiny text-default-400">Consistency of voice characteristics (0.0-1.0)</p>
              </div>

              {/* Speed */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Speed ({tts.speed?.toFixed(2) || "1.00"})</label>
                <Slider
                  step={0.01}
                  maxValue={1.2}
                  minValue={0.7}
                  value={tts.speed || 1.0}
                  onChange={(value) => onChange("conversation_config.tts.speed", value as number)}
                  size="sm"
                />
                <p className="text-tiny text-default-400">Speech rate (0.7-1.2, default 1.0)</p>
              </div>

              {/* Similarity Boost */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Similarity Boost ({tts.similarity_boost?.toFixed(2) || "0.80"})
                </label>
                <Slider
                  step={0.01}
                  maxValue={1}
                  minValue={0}
                  value={tts.similarity_boost || 0.8}
                  onChange={(value) => onChange("conversation_config.tts.similarity_boost", value as number)}
                  size="sm"
                />
                <p className="text-tiny text-default-400">Enhances voice similarity to original (0.0-1.0)</p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
