"use client"

import type React from "react"
import { getAvailableModels } from "@/lib/constants/languages"
import type { Voice } from "@/store/agentsSlice"
import { AudioPlayer } from "../AudioPlayer"

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

  return (
    <div className="space-y-6">
      {/* Voice Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Voice model</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableModels.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setFormData((prev: any) => ({ ...prev, modelType: model.id }))}
              className={`p-4 text-left rounded-xl border-2 transition-all ${
                formData.modelType === model.id
                  ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10"
                  : "border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-600"
              }`}
            >
              <div className="font-semibold text-gray-900 dark:text-white">{model.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{model.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Choice */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Voice choice</label>
        <select
          value={formData.voiceId}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, voiceId: e.target.value }))}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a voice</option>
          {voices.map((voice) => {
            const labels = voice.labels || {}
            const labelParts = [labels.language?.toUpperCase(), labels.gender, labels.age, labels.accent].filter(
              Boolean,
            )
            const labelText = labelParts.join(" · ")

            return (
              <option key={voice.voice_id} value={voice.voice_id}>
                {voice.name} {labelText ? `— ${labelText}` : ""}
              </option>
            )
          })}
        </select>

        {/* Audio Player */}
        {selectedVoice?.preview_url && (
          <div className="mt-4">
            <AudioPlayer audioUrl={selectedVoice.preview_url} />
          </div>
        )}
      </div>
    </div>
  )
}
