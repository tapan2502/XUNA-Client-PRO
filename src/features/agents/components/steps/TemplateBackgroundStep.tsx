import { SelectItem } from "@heroui/react"
import { languages } from "@/lib/constants/languages"
import { PremiumInput } from "@/components/premium/PremiumInput"
import { PremiumSelect } from "@/components/premium/PremiumSelect"
import { PremiumTextarea } from "@/components/premium/PremiumTextarea"
import { PremiumFormSection, PremiumFormGrid } from "@/components/premium/PremiumFormComponents"
import { Bot, Languages, MessageSquare } from "lucide-react"

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
    <div className="space-y-8">
      <PremiumFormSection title="Identity" description="Define who your agent is and how they communicate.">
        <PremiumFormGrid>
          <PremiumInput
            label="Agent Name"
            placeholder="e.g., Lead Qualifier"
            value={formData.name}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, name: value }))
              if (value.trim()) setNameError("")
            }}
            isInvalid={!!nameError}
            errorMessage={nameError}
            isRequired
            icon={<Bot size={18} />}
          />

          <PremiumSelect
            label="Primary Language"
            placeholder="Select language"
            selectedKeys={[formData.language]}
            onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
            startContent={<Languages size={18} className="text-gray-400" />}
          >
            {languages.map((lang) => (
              <SelectItem key={lang.code}>{lang.name}</SelectItem>
            ))}
          </PremiumSelect>
        </PremiumFormGrid>
      </PremiumFormSection>

      <PremiumFormSection title="Persona & Behavior" description="Provide detailed instructions on how the agent should handle conversations.">
        <PremiumTextarea
          label="System Prompt"
          placeholder="You are a helpful assistant..."
          value={formData.prompt}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, prompt: value }))}
          minRows={12}
        />
      </PremiumFormSection>
    </div>
  )
}
