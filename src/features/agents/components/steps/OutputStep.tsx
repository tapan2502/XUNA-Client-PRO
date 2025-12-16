"use client"

import type React from "react"
import { getAvailableModels } from "@/lib/constants/languages"
import type { Voice } from "@/store/agentsSlice"
import { AudioPlayer } from "../AudioPlayer"
import { Select, SelectItem, Card, CardBody } from "@heroui/react"
import { Zap, Gauge, Volume2 } from "lucide-react"

interface OutputStepProps {
  formData: {
    language: string
    modelType: string
    voiceId: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  voices: Voice[]
}

export function OutputStep({ formData, setFormData, voices }: OutputStepProps) {
  const availableModels = getAvailableModels(formData.language)
  const selectedVoice = voices.find((v) => v.voice_id === formData.voiceId)

  const getModelIcon = (name: string) => {
    if (name.includes("Turbo")) return Zap
    if (name.includes("Flash")) return Gauge
    return Volume2
  }

  return (
    <div className="space-y-8">
      {/* Voice Model Selection */}
      <div>
        <label className="block text-sm font-semibold text-default-700 mb-4">Voice Model</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableModels.map((model) => {
            const Icon = getModelIcon(model.name)
            const isSelected = formData.modelType === model.id

            return (
              <Card
                key={model.id}
                isPressable
                onPress={() => setFormData((prev: any) => ({ ...prev, modelType: model.id }))}
                className={`transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-primary shadow-lg shadow-primary/20 scale-105"
                    : "border-2 border-transparent hover:border-primary/30 hover:shadow-md"
                }`}
                shadow="sm"
              >
                <CardBody className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-gradient-to-br from-primary to-secondary text-white"
                          : "bg-default-100 text-default-600"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold ${isSelected ? "text-primary" : "text-default-foreground"}`}>
                        {model.name}
                      </div>
                      <div className="text-sm text-default-500 mt-1">{model.description}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Voice Choice */}
      <div>
        <label className="block text-sm font-semibold text-default-700 mb-3">Voice Selection</label>
        <Select
          placeholder="Select a voice"
          selectedKeys={formData.voiceId ? [formData.voiceId] : []}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, voiceId: e.target.value }))}
          variant="bordered"
          size="lg"
          classNames={{
            trigger: "border-2 hover:border-primary",
          }}
          startContent={<Volume2 className="w-5 h-5 text-default-400" />}
        >
          {voices.map((voice) => {
            const labels = voice.labels || {}
            const labelParts = [labels.language?.toUpperCase(), labels.gender, labels.age, labels.accent].filter(
              Boolean,
            )
            const labelText = labelParts.join(" · ")

            return (
              <SelectItem key={voice.voice_id} textValue={`${voice.name} ${labelText ? `— ${labelText}` : ""}`}>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{voice.name}</span>
                  {labelText && <span className="text-tiny text-default-400">{labelText}</span>}
                </div>
              </SelectItem>
            )
          })}
        </Select>

        {/* Audio Player */}
        {selectedVoice?.preview_url && (
          <Card className="mt-4 border-2 border-default-200" shadow="sm">
            <CardBody className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Voice Preview</p>
                  <p className="text-tiny text-default-400">Listen to a sample</p>
                </div>
              </div>
              <AudioPlayer audioUrl={selectedVoice.preview_url} />
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
