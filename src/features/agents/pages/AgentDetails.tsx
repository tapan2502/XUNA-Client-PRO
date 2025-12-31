"use client"

import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgentById, updateAgent, fetchVoices, fetchKnowledgeBase, fetchAgents } from "@/store/agentsSlice"
import { getModelId, llmOptions } from "@/lib/constants/languages"
import { Save, X, ArrowLeft } from "lucide-react"
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
  const agent = (agents || []).find((a) => a && a.agent_id === agentId)

  const [editedAgent, setEditedAgent] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  const dynamicVariables = React.useMemo(() => 
    editedAgent?.platform_settings?.data_collection || {}, 
    [editedAgent?.platform_settings?.data_collection]
  )

  useEffect(() => {
    if (!fetchingAgentDetails) {
        console.log("[DEBUG] AgentDetails state check:", {
          agentId,
          hasAgent: !!agent,
          hasEditedAgent: !!editedAgent,
          agentsCount: agents?.length,
          error
        });
    }
  }, [agentId, fetchingAgentDetails, agent, editedAgent, error, agents?.length])

  useEffect(() => {
    console.log("[v0] Fetching agent data for:", agentId)
    if (agentId) {
      dispatch(fetchAgentById(agentId))
      dispatch(fetchVoices())
      dispatch(fetchKnowledgeBase())
      dispatch(fetchAgents())
    }
  }, [agentId, dispatch])

  useEffect(() => {
    if (agent && !editedAgent) {
      console.log("[DEBUG] Initializing editedAgent from agent data", agent.agent_id)
      setEditedAgent(JSON.parse(JSON.stringify(agent)))
    }
  }, [agent, editedAgent])

  // Reset editedAgent when agentId changes to ensure we don't show old data
  useEffect(() => {
    console.log("[DEBUG] agentId changed, resetting editor state:", agentId)
    setEditedAgent(null)
  }, [agentId])

  const handleChange = (path: string, value: any) => {
    setEditedAgent((prev: any) => {
      // Deep clone to safely update nested properties
      const newAgent = JSON.parse(JSON.stringify(prev))
      const keys = path.split(".")
      let current = newAgent

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value

      // Automatically switch model if language changes to one that doesn't support the current model
      if (path === "conversation_config.agent.language") {
        const currentModel = newAgent.conversation_config?.tts?.model_id
        const compatibleModel = getModelId(currentModel, value)
        
        if (!newAgent.conversation_config) newAgent.conversation_config = {}
        if (!newAgent.conversation_config.tts) newAgent.conversation_config.tts = {}
        newAgent.conversation_config.tts.model_id = compatibleModel
        
        console.log(`[DEBUG] Language changed to ${value}. Auto-switched model to ${compatibleModel}`);
      }

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

      const payload = {
        name: editedAgent.name,
        conversation_config: {
          agent: {
            prompt: {
              prompt: editedAgent.conversation_config?.agent?.prompt?.prompt || "",
              llm: (() => {
                const current = editedAgent.conversation_config?.agent?.prompt?.llm;
                return llmOptions.includes(current) ? current : "gpt-4o";
              })(),
              temperature: editedAgent.conversation_config?.agent?.prompt?.temperature || 0.7,
              knowledge_base: editedAgent.conversation_config?.agent?.prompt?.knowledge_base || [],
              tool_ids: editedAgent.conversation_config?.agent?.tool_ids || [],
              built_in_tools: (() => {
                const builtInRecord = editedAgent.conversation_config?.agent?.built_in_tools || {};
                const cleaned: any = {};
                Object.entries(builtInRecord).forEach(([key, tool]: [string, any]) => {
                  if (tool && tool.type === "system") {
                     cleaned[key] = {
                       tool_type: tool.name,
                       ...tool.params
                     };
                  }
                });
                return Object.keys(cleaned).length > 0 ? cleaned : undefined;
              })(),
            },
            first_message: editedAgent.conversation_config?.agent?.first_message || "",
            language: editedAgent.conversation_config?.agent?.language || "en",
            ...(Array.isArray(editedAgent.conversation_config?.agent?.additional_languages) && 
                editedAgent.conversation_config.agent.additional_languages.length > 0
              ? { additional_languages: editedAgent.conversation_config.agent.additional_languages }
              : {}),
          },
          tts: {
            voice_id: editedAgent.conversation_config?.tts?.voice_id || voices[0]?.voice_id || "21m00Tcm4TlvDq8ikWAM",
            model_id: getModelId(
              editedAgent.conversation_config?.tts?.model_id || "eleven_turbo_v2_5",
              editedAgent.conversation_config?.agent?.language || "en"
            ),
            optimize_streaming_latency: editedAgent.conversation_config?.tts?.optimize_streaming_latency ?? 0,
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

  // Debug logging for initial mount
  useEffect(() => {
    console.log("[DEBUG] AgentDetails Mounted. Params agentId:", agentId);
    
    const errorHandler = (event: ErrorEvent) => {
      console.error("[CRITICAL] Global error caught in AgentDetails session:", event.error);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, [agentId]);

  console.log("[DEBUG] Render Cycle Start - Current State:", { 
    agentId, 
    fetchingAgentDetails, 
    agentFound: !!agent, 
    editedAgentInitialized: !!editedAgent,
    agentsCount: agents?.length || 0
  });

  if (fetchingAgentDetails && !agent) {
    console.log("[DEBUG] Rendering: FETCHING_SPINNER");
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <LoadingSpinner />
        <p className="text-default-500">Fetching assistant details...</p>
      </div>
    )
  }

  if (error && !agent) {
    console.log("[DEBUG] Rendering: ERROR_STATE", error);
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 min-h-[400px]">
        <p className="text-lg text-red-500">{error}</p>
        <button
          onClick={() => navigate("/dashboard/assistants")}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Agents
        </button>
      </div>
    )
  }

  if (!editedAgent) {
    console.log("[DEBUG] Rendering: INITIALIZING_SPINNER");
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <LoadingSpinner />
        <p className="text-default-500">Initializing editor...</p>
      </div>
    )
  }

  console.log("[DEBUG] Rendering: MAIN_PAGE");



  return (
    <>
      <div className="flex bg-background">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 space-y-8">
            <AgentDetailsHeader agent={editedAgent} onBack={() => navigate("/dashboard/assistants")} />

            {(error || saveError) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{saveError || error}</div>
            )}

            <div className="space-y-8 pb-20">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">General Configuration</h2>
                </div>
                <AgentConfigCards agent={editedAgent} voices={voices} onChange={handleChange} />
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Voice Settings</h2>
                </div>
                <VoiceSettingsSection agent={editedAgent} voices={voices} onChange={handleChange} />
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Conversation Flow</h2>
                </div>
                <ConversationSettingsSection agent={editedAgent} onChange={handleChange} />
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Behavior & Knowledge</h2>
                </div>
                <div className="grid gap-6">
                  <PromptSection agent={editedAgent} onChange={handleChange} />
                  <ToolsSection agent={editedAgent} onChange={handleChange} agents={agents} />
                  <KnowledgeBaseSection agent={editedAgent} knowledgeBase={knowledgeBase} onChange={handleChange} />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Advanced Settings</h2>
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
        <div className="w-96 border-l border-gray-200 bg-white p-6 shrink-0 overflow-y-auto">
          <CallTesting agentId={agentId!} dynamicVariables={dynamicVariables} />
        </div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-6 right-[26rem] z-50">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-lg backdrop-blur-md">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!saving && <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
