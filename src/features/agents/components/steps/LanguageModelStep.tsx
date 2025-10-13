"use client"

import type React from "react"
import { llmOptions } from "@/lib/constants/languages"

interface LanguageModelStepProps {
  formData: {
    llm: string
    temperature: number
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export function LanguageModelStep({ formData, setFormData }: LanguageModelStepProps) {
  return (
    <div className="space-y-6">
      {/* Language Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language model</label>
        <select
          value={formData.llm}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, llm: e.target.value }))}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {llmOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Temperature Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Temperature ({formData.temperature.toFixed(1)})
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={formData.temperature}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, temperature: Number.parseFloat(e.target.value) }))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">0 = focused, 1 = more creative.</p>
      </div>
    </div>
  )
}
