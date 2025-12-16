import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { http } from "@/lib/http"

export interface KnowledgeBaseDocument {
  id: string
  name: string
  type: "file" | "url"
  source?: string
}

export interface BuiltInTool {
  name: string
  description: string
  response_timeout_secs: number
  type: "system"
  assignments: any[]
  disable_interruptions: boolean
  force_pre_tool_speech: boolean
  params: Record<string, any>
}

export interface AgentPrompt {
  prompt: string
  llm: string
  temperature: number
  knowledge_base?: KnowledgeBaseDocument[]
  tool_ids?: string[]
  built_in_tools?: Record<string, BuiltInTool>
}

export interface Agent {
  agent_id: string
  name: string
  created_at_unix_secs: number
  last_call_time_unix_secs?: number
  access_level: string
  conversation_config?: {
    agent?: {
      prompt?: AgentPrompt
      language?: string
      first_message?: string
      dynamic_variables?: {
        dynamic_variable_placeholders?: Record<string, string>
      }
    }
    tts?: {
      voice_id: string
      model_id: string
      optimize_streaming_latency?: number
      stability?: number
      speed?: number
      similarity_boost?: number
    }
    turn?: {
      turn_timeout?: number
      silence_end_call_timeout?: number
      mode?: "silence" | "turn"
    }
    asr?: {
      keywords?: string[]
    }
  }
  platform_settings?: {
    data_collection?: Record<
      string,
      {
        type: "boolean" | "string" | "number" | "integer"
        description?: string
        dynamic_variable?: string
        constant_value?: string
      }
    >
    workspace_overrides?: {
      conversation_initiation_client_data_webhook?: {
        url: string
        request_headers: { "Content-Type": string }
      }
    }
    privacy?: {
      record_voice?: boolean
      retention_days?: number
      delete_transcript_and_pii?: boolean
      delete_audio?: boolean
      apply_to_existing_conversations?: boolean
      zero_retention_mode?: boolean
    }
  }
}

export interface CreateAgentPayload {
  name: string
  conversation_config: {
    tts: {
      voice_id: string
      model_id: string
    }
    turn: Record<string, never>
    agent: {
      prompt: {
        prompt: string
        llm: string
        temperature: number
        knowledge_base?: KnowledgeBaseDocument[]
        tool_ids?: string[]
        built_in_tools?: Record<string, BuiltInTool>
      }
      language: string
    }
  }
}

export interface Voice {
  voice_id: string
  name: string
  preview_url?: string
  labels?: Record<string, string>
}

export interface ToolDetails {
  id?: string
  name: string
  description?: string
  type: "webhook" | string
  response_timeout_secs?: number
  api_schema?: {
    url?: string
    method?: string
    request_body_schema?: any
  }
}

interface AgentsState {
  agents: Agent[]
  voices: Voice[]
  knowledgeBase: KnowledgeBaseDocument[]
  loading: boolean
  error: string | null
  createLoading: boolean
  createError: string | null
  fetchingAgentDetails: boolean
  fetchingVoices: boolean
  fetchingKnowledgeBase: boolean
}

const initialState: AgentsState = {
  agents: [],
  voices: [],
  knowledgeBase: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  fetchingAgentDetails: false,
  fetchingVoices: false,
  fetchingKnowledgeBase: false,
}

export const fetchAgents = createAsyncThunk("agents/fetchAgents", async (_, { rejectWithValue }) => {
  try {
    const response = await http.get("/agents")
    return response.data.agents || []
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch agents")
  }
})

export const fetchVoices = createAsyncThunk("agents/fetchVoices", async (_, { rejectWithValue }) => {
  try {
    const response = await http.get("/voices/list-voices")
    return response.data.voices || []
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch voices")
  }
})

export const fetchKnowledgeBase = createAsyncThunk("agents/fetchKnowledgeBase", async (_, { rejectWithValue }) => {
  try {
    const response = await http.get("/knowledge-base")
    return response.data.documents || []
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch knowledge base")
  }
})

export const createAgent = createAsyncThunk(
  "agents/createAgent",
  async (payload: CreateAgentPayload, { rejectWithValue }) => {
    try {
      const response = await http.post("/agents/create?use_tool_ids=true", payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create agent")
    }
  },
)

export const deleteAgent = createAsyncThunk("agents/deleteAgent", async (agentId: string, { rejectWithValue }) => {
  try {
    await http.delete(`/agents/${agentId}`)
    return agentId
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete agent")
  }
})

export const createKnowledgeBaseDocument = createAsyncThunk(
  "agents/createKnowledgeBaseDocument",
  async (data: { type: "url" | "file"; url?: string; file?: File }, { rejectWithValue }) => {
    try {
      if (data.type === "url") {
        const response = await http.post("/knowledge-base/create", { url: data.url })
        return response.data
      } else {
        const formData = new FormData()
        if (data.file) formData.append("file", data.file)
        const response = await http.post("/knowledge-base/create", formData)
        return response.data
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create knowledge base document")
    }
  },
)

export const fetchAgentById = createAsyncThunk(
  "agents/fetchAgentById",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const response = await http.get(`/agents/${agentId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agent details")
    }
  },
)

export const updateAgent = createAsyncThunk(
  "agents/updateAgent",
  async ({ agentId, payload }: { agentId: string; payload: any }, { rejectWithValue }) => {
    try {
      const response = await http.patch(`/agents/${agentId}`, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update agent")
    }
  },
)

export const fetchKnowledgeBaseDocumentById = createAsyncThunk(
  "agents/fetchKnowledgeBaseDocumentById",
  async (documentId: string, { rejectWithValue }) => {
    try {
      const response = await http.get(`/knowledge-base/${documentId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch document details")
    }
  },
)

export const deleteKnowledgeBaseDocument = createAsyncThunk(
  "agents/deleteKnowledgeBaseDocument",
  async (documentId: string, { rejectWithValue }) => {
    try {
      await http.delete(`/knowledge-base/${documentId}`)
      return documentId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete document")
    }
  },
)

const agentsSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    clearCreateError(state) {
      state.createError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch agents
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false
        state.agents = action.payload
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch voices
      .addCase(fetchVoices.pending, (state) => {
        state.fetchingVoices = true
      })
      .addCase(fetchVoices.fulfilled, (state, action) => {
        state.fetchingVoices = false
        state.voices = action.payload
      })
      .addCase(fetchVoices.rejected, (state) => {
        state.fetchingVoices = false
      })
      // Fetch knowledge base
      .addCase(fetchKnowledgeBase.pending, (state) => {
        state.fetchingKnowledgeBase = true
      })
      .addCase(fetchKnowledgeBase.fulfilled, (state, action) => {
        state.fetchingKnowledgeBase = false
        state.knowledgeBase = action.payload
      })
      .addCase(fetchKnowledgeBase.rejected, (state) => {
        state.fetchingKnowledgeBase = false
      })
      // Create agent
      .addCase(createAgent.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createAgent.fulfilled, (state, action) => {
        state.createLoading = false
        state.agents.push(action.payload)
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload as string
      })
      // Delete agent
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.agents = state.agents.filter((a) => a.agent_id !== action.payload)
      })
      // Create KB document
      .addCase(createKnowledgeBaseDocument.fulfilled, (state, action) => {
        if (action.payload.document) {
          state.knowledgeBase.push(action.payload.document)
        }
      })
      // Delete KB document
      .addCase(deleteKnowledgeBaseDocument.fulfilled, (state, action) => {
        state.knowledgeBase = state.knowledgeBase.filter((doc) => doc.id !== action.payload)
      })
      // Fetch agent by ID
      .addCase(fetchAgentById.pending, (state) => {
        state.fetchingAgentDetails = true
        state.error = null
      })
      .addCase(fetchAgentById.fulfilled, (state, action) => {
        state.fetchingAgentDetails = false
        // Update or add the agent in the list
        const index = state.agents.findIndex((a) => a.agent_id === action.payload.agent_id)
        if (index !== -1) {
          state.agents[index] = action.payload
        } else {
          state.agents.push(action.payload)
        }
      })
      .addCase(fetchAgentById.rejected, (state, action) => {
        state.fetchingAgentDetails = false
        state.error = action.payload as string
      })
      // Update agent
      .addCase(updateAgent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.agents.findIndex((a) => a.agent_id === action.payload.agent_id)
        if (index !== -1) {
          state.agents[index] = action.payload
        }
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCreateError } = agentsSlice.actions
export default agentsSlice.reducer
