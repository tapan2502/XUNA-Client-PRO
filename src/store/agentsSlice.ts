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
  access_level: string
  conversation_config?: {
    agent?: {
      prompt?: AgentPrompt
      language?: string
    }
    tts?: {
      voice_id: string
      model_id: string
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
}

const initialState: AgentsState = {
  agents: [],
  voices: [],
  knowledgeBase: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
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
      .addCase(fetchVoices.fulfilled, (state, action) => {
        state.voices = action.payload
      })
      // Fetch knowledge base
      .addCase(fetchKnowledgeBase.fulfilled, (state, action) => {
        state.knowledgeBase = action.payload
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
  },
})

export const { clearCreateError } = agentsSlice.actions
export default agentsSlice.reducer
