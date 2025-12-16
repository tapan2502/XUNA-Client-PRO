"use client"

import type React from "react"
import { llmOptions } from "@/lib/constants/languages"
import { Select, SelectItem, Card, CardBody } from "@heroui/react"
import { Sparkles, Zap, Brain } from "lucide-react"

interface LanguageModelStepProps {
  formData: {
    llm: string
    temperature: number
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export function LanguageModelStep({ formData, setFormData }: LanguageModelStepProps) {
  const temperatureLabels = [
    { value: 0, label: "Focused", icon: Brain, color: "text-blue-500" },
    { value: 0.5, label: "Balanced", icon: Zap, color: "text-purple-500" },
    { value: 1, label: "Creative", icon: Sparkles, color: "text-pink-500" },
  ]

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0.3) return "from-blue-500 to-cyan-500"
    if (temp <= 0.7) return "from-purple-500 to-indigo-500"
    return "from-pink-500 to-rose-500"
  }

  const getCurrentLabel = () => {
    if (formData.temperature <= 0.3) return temperatureLabels[0]
    if (formData.temperature <= 0.7) return temperatureLabels[1]
    return temperatureLabels[2]
  }

  const currentLabel = getCurrentLabel()

  return (
    <div className="space-y-8">
      {/* Language Model Selection */}
      <div>
        <label className="block text-sm font-semibold text-default-700 mb-3">
          Language Model
        </label>
        <Select
          selectedKeys={[formData.llm]}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, llm: e.target.value }))}
          variant="bordered"
          size="lg"
          classNames={{
            trigger: "border-2 hover:border-primary",
          }}
        >
          {llmOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Temperature Slider - Premium Design */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-default-700">
            Temperature
          </label>
          <div className="flex items-center gap-2">
            <currentLabel.icon className={`w-5 h-5 ${currentLabel.color}`} />
            <span className="text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent ${getTemperatureColor(formData.temperature)}">
              {formData.temperature.toFixed(1)}
            </span>
          </div>
        </div>

        <Card className="border-2 border-default-200 shadow-lg">
          <CardBody className="p-6">
            {/* Custom Slider */}
            <div className="space-y-6">
              <div className="relative">
                {/* Track */}
                <div className="h-3 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 rounded-full overflow-hidden">
                  {/* Filled portion */}
                  <div
                    className={`h-full bg-gradient-to-r ${getTemperatureColor(formData.temperature)} transition-all duration-300 rounded-full`}
                    style={{ width: `${formData.temperature * 100}%` }}
                  />
                </div>

                {/* Actual Input */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer z-10"
                />

                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-900 border-4 rounded-full shadow-lg transition-all duration-300 pointer-events-none"
                  style={{
                    left: `calc(${formData.temperature * 100}% - 12px)`,
                    borderColor: `hsl(var(--heroui-${currentLabel.color.split('-')[1]}-500))`,
                  }}
                />
              </div>

              {/* Labels */}
              <div className="flex justify-between pt-2">
                {temperatureLabels.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFormData((prev: any) => ({ ...prev, temperature: item.value }))}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      Math.abs(formData.temperature - item.value) < 0.15
                        ? `${item.color} scale-110`
                        : "text-default-400 hover:text-default-600"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="text-tiny opacity-70">({item.value})</span>
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="bg-default-100 dark:bg-default-50/5 rounded-lg p-4">
                <p className="text-sm text-default-600 leading-relaxed">
                  <span className="font-semibold text-default-700">{currentLabel.label} mode:</span>{" "}
                  {formData.temperature <= 0.3 && "Produces consistent, deterministic responses. Best for factual tasks."}
                  {formData.temperature > 0.3 && formData.temperature <= 0.7 && "Balances creativity and consistency. Ideal for most conversations."}
                  {formData.temperature > 0.7 && "Maximizes creativity and variety. Great for brainstorming and creative tasks."}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
