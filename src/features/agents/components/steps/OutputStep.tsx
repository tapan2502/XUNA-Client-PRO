import { getAvailableModels } from "@/lib/constants/languages"
import type { Voice } from "@/store/agentsSlice"
import { AudioPlayer } from "../AudioPlayer"
import { SelectionCard } from "@/components/premium/SelectionCard"
import { PremiumFormSection, PremiumFormGrid } from "@/components/premium/PremiumFormComponents"
import { Zap, Gauge, Volume2, PlayCircle } from "lucide-react"

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
    <div className="space-y-10">
      <PremiumFormSection title="Voice Latency Model" description="Select the underlying text-to-speech model optimize for speed or quality.">
          <PremiumFormGrid columns={2}>
            {availableModels.map((model) => {
                const Icon = getModelIcon(model.name)
                return (
                    <SelectionCard
                        key={model.id}
                        title={model.name}
                        description={model.description}
                        icon={<Icon size={20} />}
                        isSelected={formData.modelType === model.id}
                        onClick={() => setFormData((prev: any) => ({ ...prev, modelType: model.id }))}
                    />
                )
            })}
          </PremiumFormGrid>
      </PremiumFormSection>

      <PremiumFormSection title="Voice Selection" description="Choose the voice persona for your agent.">
        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {voices.map((voice) => {
                const labels = voice.labels || {}
                const labelParts = [labels.language?.toUpperCase(), labels.gender, labels.age, labels.accent].filter(Boolean)
                const isSelected = formData.voiceId === voice.voice_id
                
                return (
                    <SelectionCard
                        key={voice.voice_id}
                        title={voice.name}
                        description={labelParts.join(" · ")}
                        icon={<Volume2 size={20} />}
                        isSelected={isSelected}
                        onClick={() => setFormData((prev: any) => ({ ...prev, voiceId: voice.voice_id }))}
                        rightContent={
                            isSelected && voice.preview_url ? (
                                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg w-full max-w-[200px]" onClick={(e) => e.stopPropagation()}>
                                    <AudioPlayer audioUrl={voice.preview_url} />
                                </div>
                            ) : null
                        }
                    />
                )
            })}
        </div>
      </PremiumFormSection>
    </div>
  )
}
