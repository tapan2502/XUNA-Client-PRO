"use client"

import { Check } from "lucide-react"

type StepKey = "TemplateBackground" | "Knowledge" | "Output" | "LanguageModel" | "Tools"

const STEP_LABELS: Record<StepKey, string> = {
  TemplateBackground: "Template & Background",
  Knowledge: "Knowledge sources",
  Output: "Output",
  LanguageModel: "Language model",
  Tools: "Tools",
}

interface StepIndicatorProps {
  steps: StepKey[]
  currentStep: StepKey
  onStepClick: (step: StepKey) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  const currentIndex = steps.indexOf(currentStep)

  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const isActive = step === currentStep
        const isDone = index < currentIndex

        return (
          <button
            key={step}
            onClick={() => onStepClick(step)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              isActive
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                : isDone
                  ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                isActive
                  ? "bg-brand-gradient text-white"
                  : isDone
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {isDone ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className="text-sm font-medium">{STEP_LABELS[step]}</span>
          </button>
        )
      })}
    </div>
  )
}
