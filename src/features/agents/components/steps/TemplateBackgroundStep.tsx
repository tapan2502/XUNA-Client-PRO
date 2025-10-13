"use client"

import type React from "react"

import { languages } from "@/lib/constants/languages"

interface FormData {
  name: string
  prompt: string
  language: string
  [key: string]: any
}

interface TemplateBackgroundStepProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  nameError: string
  setNameError: (error: string) => void
}

export function TemplateBackgroundStep({
  formData,
  setFormData,
  nameError,
  setNameError,
}: TemplateBackgroundStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Agent name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              nameError ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="e.g., Lead Qualifier"
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }))
              if (e.target.value.trim()) setNameError("")
            }}
          />
          {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agent language</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.language}
            onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prompt</label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={10}
          placeholder="Describe how the agent should behave..."
          value={formData.prompt}
          onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
        />
      </div>
    </div>
  )
}
