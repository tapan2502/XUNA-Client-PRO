"use client"

import type React from "react"
import { Input, Select, SelectItem, Textarea } from "@heroui/react"
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
        <Input
          label="Agent name"
          placeholder="e.g., Lead Qualifier"
          value={formData.name}
          onValueChange={(value) => {
            setFormData((prev) => ({ ...prev, name: value }))
            if (value.trim()) setNameError("")
          }}
          isInvalid={!!nameError}
          errorMessage={nameError}
          isRequired
          variant="bordered"
          labelPlacement="outside"
        />

        <Select
          label="Agent language"
          placeholder="Select language"
          selectedKeys={[formData.language]}
          onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
          variant="bordered"
          labelPlacement="outside"
        >
          {languages.map((lang) => (
            <SelectItem key={lang.code}>{lang.name}</SelectItem>
          ))}
        </Select>
      </div>

      <Textarea
        label="Prompt"
        placeholder="Describe how the agent should behave..."
        value={formData.prompt}
        onValueChange={(value) => setFormData((prev) => ({ ...prev, prompt: value }))}
        variant="bordered"
        labelPlacement="outside"
        minRows={10}
      />
    </div>
  )
}
