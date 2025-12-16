"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgentById, updateAgent, fetchVoices, fetchKnowledgeBase } from "@/store/agentsSlice"
import { Save, X, ArrowLeft } from "lucide-react"
import { Button } from "@heroui/react"
import { AgentDetailsHeader } from "../components/agent-details/AgentDetailsHeader"
import { AgentConfigCards } from "../components/agent-details/AgentConfigCards"
import { VoiceSettingsSection } from "../components/agent-details/VoiceSettingsSection"
import { ConversationSettingsSection } from "../components/agent-details/ConversationSettingsSection"
import { PromptSection } from "../components/agent-details/PromptSection"
import { DataCollectionSection } from "../components/agent-details/DataCollectionSection"
import { WebhookSection } from "../components/agent-details/WebhookSection"
import { KnowledgeBaseSection } from "../components/agent-details/KnowledgeBaseSection"
import { PrivacySettingsSection } from "../components/agent-details/PrivacySettingsSection"
import { ASRKeywordsSection } from "../components/agent-details/ASRKeywordsSection"
import { ToolsSection } from "../components/agent-details/ToolSection"
import CallTesting from "../components/CallTesting"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useSnackbar } from "@/components/ui/SnackbarProvider"

export default function AgentDetails() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showSnackbar } = useSnackbar()

  const { agents, fetchingAgentDetails, error, voices, knowledgeBase } = useAppSelector((state) => state.agents)
  const agent = agents.find((a) => a.agent_id === agentId)

  const [editedAgent, setEditedAgent] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    if (agentId) {
      console.log("[v0] AgentDetails mounted, fetching data for agent:", agentId)
      dispatch(fetchAgentById(agentId))
      dispatch(fetchVoices())
      dispatch(fetchKnowledgeBase())
    }
  }, [agentId, dispatch])

  useEffect(() => {
    if (agent) {
      console.log("[v0] Agent data loaded, setting editedAgent:", agent.agent_id)
      setEditedAgent(JSON.parse(JSON.stringify(agent)))
    }
  }, [agent])

  const handleChange = (path: string, value: any) => {
    setEditedAgent((prev: any) => {
      const newAgent = { ...prev }
      const keys = path.split(".")
      let current = newAgent

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newAgent
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!agentId || !editedAgent) return

    setSaving(true)
    setSaveError("")

    try {
      const webhookUrl =
        editedAgent.platform_settings?.workspace_overrides?.conversation_initiation_client_data_webhook?.url?.trim()

      let workspaceOverrides = {}

      if (webhookUrl) {
        try {
          new URL(webhookUrl)
          workspaceOverrides = {
            conversation_initiation_client_data_webhook: {
              url: webhookUrl,
              request_headers: {
                "Content-Type": "application/json",
              },
            },
          }
        } catch (urlError) {
          const invalidMessage = "Invalid webhook URL. Please enter a valid URL (e.g., https://example.com/webhook)"
          setSaveError(invalidMessage)
          showSnackbar({
            variant: "error",
            title: "Validation Error",
            message: invalidMessage,
          })
          setSaving(false)
          return
        }
      }

      const payload: any = {
        name: editedAgent.name,
        conversation_config: {
          agent: {
            prompt: {
              prompt: editedAgent.conversation_config?.agent?.prompt?.prompt || "",
              llm: editedAgent.conversation_config?.agent?.prompt?.llm || "gpt-4.1",
              temperature: editedAgent.conversation_config?.agent?.prompt?.temperature || 0.7,
              knowledge_base: editedAgent.conversation_config?.agent?.prompt?.knowledge_base || [],
              tool_ids: editedAgent.conversation_config?.agent?.prompt?.tool_ids || [],
              built_in_tools: editedAgent.conversation_config?.agent?.prompt?.built_in_tools || {},
            },
            first_message: editedAgent.conversation_config?.agent?.first_message || "",
            language: editedAgent.conversation_config?.agent?.language || "en",
          },
          tts: {
            voice_id: editedAgent.conversation_config?.tts?.voice_id || "",
            model_id: editedAgent.conversation_config?.tts?.model_id || "eleven_turbo_v2_5",
            optimize_streaming_latency: editedAgent.conversation_config?.tts?.optimize_streaming_latency || 0,
            stability: editedAgent.conversation_config?.tts?.stability || 0.5,
            speed: editedAgent.conversation_config?.tts?.speed || 1.0,
            similarity_boost: editedAgent.conversation_config?.tts?.similarity_boost || 0.8,
          },
          turn: {
            turn_timeout: editedAgent.conversation_config?.turn?.turn_timeout || 7,
            silence_end_call_timeout: editedAgent.conversation_config?.turn?.silence_end_call_timeout || -1,
            mode: editedAgent.conversation_config?.turn?.mode || "silence",
          },
          asr: {
            keywords: editedAgent.conversation_config?.asr?.keywords || [],
          },
        },
        platform_settings: {
          data_collection: editedAgent.platform_settings?.data_collection || {},
          workspace_overrides: workspaceOverrides,
          privacy: editedAgent.platform_settings?.privacy || {
            record_voice: true,
            retention_days: -1,
            delete_transcript_and_pii: false,
            delete_audio: false,
            apply_to_existing_conversations: false,
            zero_retention_mode: false,
          },
        },
      }

      await dispatch(updateAgent({ agentId, payload })).unwrap()
      setHasChanges(false)
      setSaveError("")
      showSnackbar({
        variant: "success",
        title: "Agent Updated",
        message: "Agent settings saved successfully.",
      })
    } catch (err: any) {
      console.error("Failed to save agent:", err)
      const message = err.message || "Failed to update agent. Please try again."
      setSaveError(message)
      showSnackbar({
        variant: "error",
        title: "Update Failed",
        message,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (agent) {
      setEditedAgent(JSON.parse(JSON.stringify(agent)))
      setHasChanges(false)
      setSaveError("")
    }
  }

  if (fetchingAgentDetails && !agent) {
    console.log("[v0] Loading agent details...")
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  // Error state: API returned error and no agent data
  if (error && !agent) {
    console.log("[v0] Error loading agent:", error)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 min-h-[400px]">
        <p className="text-lg text-danger">{error}</p>
        <Button onPress={() => navigate("/dashboard/assistants")} startContent={<ArrowLeft size={18} />}>
          Back to Agents
        </Button>
      </div>
    )
  }

  if (!editedAgent) {
    console.log("[v0] Waiting for editedAgent to be initialized...")
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  console.log("[v0] Rendering AgentDetails for:", editedAgent.name)

  const dynamicVariables = editedAgent?.platform_settings?.data_collection || {}

  return (
    <>
      <div className="flex overflow-hidden bg-background h-full">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 space-y-8">
            <AgentDetailsHeader agent={editedAgent} onBack={() => navigate("/dashboard/assistants")} />

            {(error || saveError) && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                {saveError || error}
              </div>
            )}

            <div className="space-y-8 pb-20">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground/90">General Configuration</h2>
                </div>
                <AgentConfigCards agent={editedAgent} voices={voices} onChange={handleChange} />
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground/90">Voice Settings</h2>
                </div>
                <VoiceSettingsSection agent={editedAgent} voices={voices} onChange={handleChange} />
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground/90">Conversation Flow</h2>
                </div>
                <ConversationSettingsSection agent={editedAgent} onChange={handleChange} />
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground/90">Behavior & Knowledge</h2>
                </div>
                <div className="grid gap-6">
                  <PromptSection agent={editedAgent} onChange={handleChange} />
                  <ToolsSection agent={editedAgent} onChange={handleChange} />
                  <KnowledgeBaseSection agent={editedAgent} knowledgeBase={knowledgeBase} onChange={handleChange} />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground/90">Advanced Settings</h2>
                </div>
                <div className="grid gap-6">
                  <PrivacySettingsSection agent={editedAgent} onChange={handleChange} />
                  <WebhookSection agent={editedAgent} onChange={handleChange} />
                  <ASRKeywordsSection agent={editedAgent} onChange={handleChange} />
                  <DataCollectionSection agent={editedAgent} onChange={handleChange} />
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Test Agent Panel */}
        <div className="w-96 border-l border-border bg-background p-6 shrink-0 overflow-y-auto">
          <CallTesting agentId={agentId!} dynamicVariables={dynamicVariables} />
        </div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-6 right-[26rem] z-50">
          <div className="flex items-center gap-3 rounded-2xl border border-default-200 bg-content1 px-4 py-3 shadow-lg backdrop-blur-md">
            <Button onClick={handleCancel} variant="bordered" startContent={<X className="w-4 h-4" />}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              isLoading={saving}
              color="primary"
              startContent={!saving && <Save className="w-4 h-4" />}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
