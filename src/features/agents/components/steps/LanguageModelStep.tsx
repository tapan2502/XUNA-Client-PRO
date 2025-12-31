import { SelectionCard } from "@/components/premium/SelectionCard"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"
import { llmOptions } from "@/lib/constants/languages"
import { Sparkles, Zap, Brain, Gauge } from "lucide-react"

interface LanguageModelStepProps {
  formData: {
    llm: string
    temperature: number
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export function LanguageModelStep({ formData, setFormData }: LanguageModelStepProps) {
  const temperatureLabels = [
    { value: 0, label: "Precise", description: "Factual & Deterministic", icon: Brain, color: "text-blue-500", bg: "bg-blue-500" },
    { value: 0.5, label: "Balanced", description: "Standard Interaction", icon: Zap, color: "text-purple-500", bg: "bg-purple-500" },
    { value: 1, label: "Creative", description: "Varied & Expressive", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-500" },
  ]

  const getModelIcon = (name: string) => {
    if (name.includes("4o")) return Sparkles
    if (name.includes("Turbo") || name.includes("Mini")) return Zap
    if (name.includes("Sonnet")) return Brain
    return Gauge
  }

  const getModelDescription = (name: string) => {
    if (name.includes("Mini") || name.includes("Haiku")) return "Fastest response times, lower cost."
    if (name.includes("4o") || name.includes("Sonnet")) return "High intelligence, best for complex reasoning."
    return "Balanced performance for general tasks."
  }

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0.3) return "from-blue-500 to-cyan-500"
    if (temp <= 0.7) return "from-purple-500 to-indigo-500"
    return "from-pink-500 to-rose-500"
  }

  const currentLabel = 
    formData.temperature <= 0.3 ? temperatureLabels[0] :
    formData.temperature <= 0.7 ? temperatureLabels[1] : 
    temperatureLabels[2]

  return (
    <div className="space-y-10">
      <PremiumFormSection title="Model Selection" description="Choose the intelligence engine for your agent.">
        <div className="grid grid-cols-1 gap-3">
          {llmOptions.map((model) => {
             const Icon = getModelIcon(model)
             return (
               <SelectionCard
                 key={model}
                 title={model}
                 description={getModelDescription(model)}
                 icon={<Icon size={20} />}
                 isSelected={formData.llm === model}
                 onClick={() => setFormData((prev: any) => ({ ...prev, llm: model }))}
               />
             )
          })}
        </div>
      </PremiumFormSection>

      <PremiumFormSection 
        title="Creativity & Temperature" 
        description="Control how consistent or unpredictable the responses should be."
        action={
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border dark:border-gray-700`}>
                <currentLabel.icon className={`w-4 h-4 ${currentLabel.color}`} />
                <span className="text-sm font-semibold">{formData.temperature.toFixed(1)}</span>
            </div>
        }
      >
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            {/* Slider */}
            <div className="relative h-12 flex items-center mb-8">
                <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                   <div 
                     className={`h-full bg-gradient-to-r ${getTemperatureColor(formData.temperature)} transition-all duration-300`}
                     style={{ width: `${formData.temperature * 100}%` }} 
                   />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, temperature: Number.parseFloat(e.target.value) }))}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="absolute w-6 h-6 bg-white dark:bg-black border-4 border-white dark:border-gray-900 shadow-lg rounded-full pointer-events-none transition-all duration-300"
                    style={{ 
                        left: `${formData.temperature * 100}%`,
                        transform: 'translateX(-50%)',
                        boxShadow: `0 0 0 2px ${formData.temperature <= 0.3 ? '#3b82f6' : formData.temperature <= 0.7 ? '#a855f7' : '#ec4899'}`
                    }}
                />
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-4">
                {temperatureLabels.map((label) => (
                    <button
                        key={label.value}
                        onClick={() => setFormData((prev: any) => ({ ...prev, temperature: label.value }))}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all border ${
                            Math.abs(formData.temperature - label.value) < 0.2
                            ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm scale-105"
                            : "border-transparent hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-400"
                        }`}
                    >
                        <div className={`p-2 rounded-lg ${label.bg} bg-opacity-10 text-opacity-100 ${label.color}`}>
                            <label.icon size={18} />
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label.label}</div>
                            <div className="text-xs text-gray-500">{label.description}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </PremiumFormSection>
    </div>
  )
}
