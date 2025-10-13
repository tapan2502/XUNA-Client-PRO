"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"

import { StepIndicator } from "./StepIndicator"
import { TemplateBackgroundStep } from "./steps/TemplateBackgroundStep"
import { KnowledgeSourcesStep } from "./steps/KnowledgeSourcesStep"
import { BuiltInTool, clearCreateError, createAgent, CreateAgentPayload, fetchKnowledgeBase, fetchVoices } from "@/store/agentsSlice"
import { getAvailableModels, getModelId } from "@/lib/constants/languages"
import { OutputStep } from "./steps/OutputStep"
import { LanguageModelStep } from "./steps/LanguageModelStep"
import { ToolsStep } from "./steps/ToolsStep"


type StepKey = "TemplateBackground" | "Knowledge" | "Output" | "LanguageModel" | "Tools"

const STEPS: StepKey[] = ["TemplateBackground", "Knowledge", "Output", "LanguageModel", "Tools"]

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

  const currIndex = STEPS.indexOf(step)
  const canNext = step === "TemplateBackground" ? formData.name.trim().length > 0 : true

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Agent</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Steps sidebar */}
          <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
            <StepIndicator steps={STEPS} currentStep={step} onStepClick={setStep} />
          </aside>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {createError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-300">
                {createError}
              </div>
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
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step {currIndex + 1} of {STEPS.length}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              {currIndex > 0 && (
                <button
                  onClick={() => setStep(STEPS[currIndex - 1])}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  Back
                </button>
              )}
              {currIndex < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(STEPS[currIndex + 1])}
                  disabled={!canNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleCreateAgent}
                  disabled={createLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Agent
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
