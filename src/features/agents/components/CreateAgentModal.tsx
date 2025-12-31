import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Button, Chip } from "@heroui/react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

import HorizontalSteps from "@/components/hero-ui/HorizontalSteps"
import { cn } from "@/lib/utils"
import { TemplateBackgroundStep } from "./steps/TemplateBackgroundStep"
import { KnowledgeSourcesStep } from "./steps/KnowledgeSourcesStep"
import {
  type BuiltInTool,
  clearCreateError,
  createAgent,
  type CreateAgentPayload,
  fetchKnowledgeBase,
  fetchVoices,
} from "@/store/agentsSlice"
import { getAvailableModels, getModelId } from "@/lib/constants/languages"
import { OutputStep } from "./steps/OutputStep"
import { LanguageModelStep } from "./steps/LanguageModelStep"
import { ToolsStep } from "./steps/ToolsStep"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"
import { PremiumPanelFooter } from "@/components/premium/PremiumPanelFooter"

type StepKey = "TemplateBackground" | "Knowledge" | "Output" | "LanguageModel" | "Tools"

const STEPS: StepKey[] = ["TemplateBackground", "Knowledge", "Output", "LanguageModel", "Tools"]

const STEP_CONFIGS = [
  { title: "Template & Background" },
  { title: "Knowledge Sources" },
  { title: "Output Settings" },
  { title: "Language Model" },
  { title: "Tools & Functions" },
]

interface FormData {
  name: string
  prompt: string
  llm: string
  temperature: number
  voiceId: string
  language: string
  modelType: string
}

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreateAgentModal({ isOpen, onClose, onSuccess }: CreateAgentModalProps) {
  const dispatch = useAppDispatch()
  const { voices, knowledgeBase, createLoading, createError } = useAppSelector((state) => state.agents)

  const [step, setStep] = useState<StepKey>("TemplateBackground")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    prompt: "",
    llm: "gpt-4o-mini",
    temperature: 0.7,
    voiceId: "",
    language: "en",
    modelType: "turbo",
  })

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [toolIds, setToolIds] = useState<string[]>([])
  const [builtInTools, setBuiltInTools] = useState<Record<string, BuiltInTool | null>>({})
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchVoices())
      dispatch(fetchKnowledgeBase())
    }
  }, [isOpen, dispatch])

  useEffect(() => {
    if (voices.length > 0 && !formData.voiceId) {
      setFormData((prev) => ({ ...prev, voiceId: voices[0].voice_id }))
    }
  }, [voices, formData.voiceId])

  useEffect(() => {
    const availableModels = getAvailableModels(formData.language)
    const isCurrentModelAvailable = availableModels.some((m) => m.id === formData.modelType)
    if (!isCurrentModelAvailable && availableModels.length > 0) {
      setFormData((prev) => ({ ...prev, modelType: availableModels[0].id }))
    }
  }, [formData.language, formData.modelType])

  const handleClose = () => {
    setStep("TemplateBackground")
    setFormData({
      name: "",
      prompt: "",
      llm: "gpt-4o-mini",
      temperature: 0.7,
      voiceId: voices[0]?.voice_id || "",
      language: "en",
      modelType: "turbo",
    })
    setSelectedDocuments([])
    setToolIds([])
    setBuiltInTools({})
    setNameError("")
    dispatch(clearCreateError())
    onClose()
  }

  const handleCreateAgent = async () => {
    if (!formData.name.trim()) {
      setNameError("Agent name is required")
      setStep("TemplateBackground")
      return
    }

    const kbDocs = selectedDocuments
      .map((docId) => knowledgeBase.find((kb) => kb.id === docId))
      .filter(Boolean)
      .map((doc) => ({
        id: doc!.id,
        name: doc!.name,
        type: doc!.type,
      }))

    const cleanedBuiltIns = Object.fromEntries(Object.entries(builtInTools).filter(([, v]) => v !== null)) as Record<
      string,
      BuiltInTool
    >

    const payload: CreateAgentPayload = {
      name: formData.name,
      conversation_config: {
        tts: {
          voice_id: formData.voiceId,
          model_id: getModelId(formData.modelType, formData.language),
        },
        turn: {},
        agent: {
          prompt: {
            prompt: formData.prompt,
            llm: formData.llm,
            temperature: formData.temperature,
            knowledge_base: kbDocs.length > 0 ? kbDocs : undefined,
          },
          tool_ids: toolIds.length > 0 ? toolIds : undefined,
          ...(() => {
            const builtInToolsList: any[] = []
            const customToolsList: any[] = []

            Object.values(cleanedBuiltIns).forEach((tool: any) => {
              if (tool.type === "system") {
                builtInToolsList.push({
                  tool_type: tool.name,
                  ...tool.params,
                })
              } else if (tool.type === "webhook") {
                customToolsList.push({
                  type: "webhook",
                  name: tool.name,
                  description: tool.description,
                  api_schema: tool.api_schema,
                  response_timeout_secs: tool.response_timeout_secs,
                })
              }
            })

            return {
              built_in_tools: builtInToolsList.length > 0 ? builtInToolsList : undefined,
              tools: customToolsList.length > 0 ? customToolsList : undefined,
            }
          })(),
          language: formData.language,
        },
      },
    }

    const result = await dispatch(createAgent(payload))
    if (createAgent.fulfilled.match(result)) {
      handleClose()
      onSuccess?.()
    }
  }

  const currentStepIndex = STEPS.indexOf(step)

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setStep(STEPS[currentStepIndex + 1])
    } else {
      handleCreateAgent()
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setStep(STEPS[currentStepIndex - 1])
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStepIndex || (step === "TemplateBackground" && formData.name.trim().length > 0)) {
      setStep(STEPS[stepIndex])
    }
  }

  const isNextEnabled = () => {
    if (step === "TemplateBackground") {
      return formData.name.trim().length > 0
    }
    return true
  }

  const footer = (
    <PremiumPanelFooter className="justify-between">
      <Button
        variant="light"
        onPress={handlePrevious}
        isDisabled={currentStepIndex === 0}
        className={cn("font-medium", currentStepIndex === 0 ? "invisible" : "")}
      >
        Back
      </Button>
      <div className="flex gap-2">
        <Button variant="light" onPress={handleClose} className="font-medium">
            Cancel
        </Button>
        <Button
            color="primary"
            className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
            onPress={handleNext}
            isDisabled={!isNextEnabled()}
            isLoading={createLoading}
        >
            {currentStepIndex === STEPS.length - 1 ? "Create Agent" : "Next"}
        </Button>
      </div>
    </PremiumPanelFooter>
  )

  const headerContent = (
    <HorizontalSteps steps={STEP_CONFIGS} currentStep={currentStepIndex} onStepClick={handleStepClick} />
  )

  return (
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Agent"
      subtitle={STEP_CONFIGS[currentStepIndex].title}
      size="xl"
      footer={footer}
      headerContent={headerContent}
    >
      <PremiumPanelContent>
            {createError && (
            <Chip color="danger" variant="flat" className="mb-4">
                {createError}
            </Chip>
            )}

            {step === "TemplateBackground" && (
            <TemplateBackgroundStep
                formData={formData}
                setFormData={setFormData}
                nameError={nameError}
                setNameError={setNameError}
            />
            )}
            {step === "Knowledge" && (
            <KnowledgeSourcesStep selectedDocuments={selectedDocuments} setSelectedDocuments={setSelectedDocuments} />
            )}
            {step === "Output" && <OutputStep formData={formData} setFormData={setFormData} voices={voices} />}
            {step === "LanguageModel" && <LanguageModelStep formData={formData} setFormData={setFormData} />}
            {step === "Tools" && (
            <ToolsStep
                toolIds={toolIds}
                setToolIds={setToolIds}
                builtInTools={builtInTools}
                setBuiltInTools={setBuiltInTools}
            />
            )}
      </PremiumPanelContent>
    </PremiumSidePanel>
  )
}

