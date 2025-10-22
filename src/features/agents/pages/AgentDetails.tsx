"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgentById, updateAgent, fetchVoices, fetchKnowledgeBase } from "@/store/agentsSlice"
import { ArrowLeft, Save, X } from "lucide-react"
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

export default function AgentDetails() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { agents, loading, error, voices, knowledgeBase } = useAppSelector((state) => state.agents)
  const agent = agents.find((a) => a.agent_id === agentId)

  const [editedAgent, setEditedAgent] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    if (agentId) {
      dispatch(fetchAgentById(agentId))
      dispatch(fetchVoices())
      dispatch(fetchKnowledgeBase())
    }
  }, [agentId, dispatch])

  useEffect(() => {
    if (agent) {
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
          setSaveError("Invalid webhook URL. Please enter a valid URL (e.g., https://example.com/webhook)")
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
    } catch (err: any) {
      console.error("[v0] Failed to save agent:", err)
      setSaveError(err.message || "Failed to update agent. Please try again.")
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

  const dynamicVariables = editedAgent?.platform_settings?.data_collection || {}

  if (loading && !agent) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading agent details...</p>
        </div>
      </div>
    )
  }

  if (!agent || !editedAgent) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Agent not found</h2>
          <p className="text-muted-foreground mb-4">The agent you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <AgentDetailsHeader agent={editedAgent} onBack={() => navigate("/dashboard")} />

          {(error || saveError) && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              {saveError || error}
            </div>
          )}

          <AgentConfigCards agent={editedAgent} voices={voices} onChange={handleChange} />

          <VoiceSettingsSection agent={editedAgent} onChange={handleChange} />

          <ConversationSettingsSection agent={editedAgent} onChange={handleChange} />

          <ASRKeywordsSection agent={editedAgent} onChange={handleChange} />

          <PrivacySettingsSection agent={editedAgent} onChange={handleChange} />

          <PromptSection agent={editedAgent} onChange={handleChange} />

          <DataCollectionSection agent={editedAgent} onChange={handleChange} />

          <ToolsSection agent={editedAgent} onChange={handleChange} />

          <WebhookSection agent={editedAgent} onChange={handleChange} />

          <KnowledgeBaseSection agent={editedAgent} knowledgeBase={knowledgeBase} onChange={handleChange} />

          <div className="h-20" />
        </div>

        {hasChanges && (
          <div className="fixed bottom-6 right-[25rem] z-50 flex gap-3">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Test Agent Panel */}
      <div className="w-96 border-l border-border bg-background p-6">
        <CallTesting agentId={agentId!} dynamicVariables={dynamicVariables} />
      </div>
    </div>
  )
}
