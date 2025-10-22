import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { http } from "@/lib/http"

export interface Conversation {
  agent_id: string
  agent_name: string
  conversation_id: string
  start_time_unix_secs: number
  call_duration_secs: number
  message_count: number
  status: string
  call_successful: string
}

export interface TranscriptMessage {
  role: string
  message: string
  time_in_call_secs: number
}

export interface ConversationDetails {
  conversation: {
    agent_id: string
    conversation_id: string
    status: string
    transcript: TranscriptMessage[]
    metadata: {
      start_time_unix_secs: number
      call_duration_secs: number
      cost?: number
    }
    analysis: {
      call_successful: string
      transcript_summary: string
      data_collection_results?: Record<string, any>
    }
  }
  audio: string
}

interface CallHistoryState {
  conversations: Conversation[]
  selectedConversation: ConversationDetails | null
  loading: boolean
  detailsLoading: boolean
  error: string | null
}

const initialState: CallHistoryState = {
  conversations: [],
  selectedConversation: null,
  loading: false,
  detailsLoading: false,
  error: null,
}

export const fetchConversations = createAsyncThunk("callHistory/fetchConversations", async (_, { rejectWithValue }) => {
  try {
    const response = await http.get("/list-conversations")
    return response.data.conversations || []
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch conversations")
  }
})

export const fetchConversationDetails = createAsyncThunk(
  "callHistory/fetchConversationDetails",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await http.get(`/get-conversation/${conversationId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch conversation details")
    }
  },
)

const callHistorySlice = createSlice({
  name: "callHistory",
  initialState,
  reducers: {
    clearSelectedConversation(state) {
      state.selectedConversation = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        state.conversations = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch conversation details
      .addCase(fetchConversationDetails.pending, (state) => {
        state.detailsLoading = true
        state.error = null
      })
      .addCase(fetchConversationDetails.fulfilled, (state, action) => {
        state.detailsLoading = false
        state.selectedConversation = action.payload
      })
      .addCase(fetchConversationDetails.rejected, (state, action) => {
        state.detailsLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSelectedConversation } = callHistorySlice.actions
export default callHistorySlice.reducer
