"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@heroui/react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

import HorizontalSteps from "@/components/hero-ui/HorizontalSteps"
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
    llm: "gpt-5",
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
      llm: "gpt-5",
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
            ...(kbDocs.length > 0 && { knowledge_base: kbDocs }),
            ...(toolIds.length > 0 && { tool_ids: toolIds }),
            ...(Object.keys(cleanedBuiltIns).length > 0 && { built_in_tools: cleanedBuiltIns }),
          },
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      classNames={{
        base: "bg-background",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-4 border-b border-divider pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">Create New Agent</h3>
              <p className="text-sm text-default-500 font-normal">{STEP_CONFIGS[currentStepIndex].title}</p>
            </div>
          </div>

          {/* Horizontal Steps */}
          <HorizontalSteps steps={STEP_CONFIGS} currentStep={currentStepIndex} onStepClick={handleStepClick} />
        </ModalHeader>

        <ModalBody className="py-6">
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
        </ModalBody>

        <ModalFooter className="border-t border-divider flex justify-between">
          <Button
            variant="flat"
            onPress={handlePrevious}
            isDisabled={currentStepIndex === 0}
            startContent={<ChevronLeft size={18} />}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="light" onPress={handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleNext}
              isLoading={createLoading}
              isDisabled={!isNextEnabled()}
              endContent={<ChevronRight size={18} />}
            >
              {currentStepIndex < STEPS.length - 1 ? "Next" : "Create Agent"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
