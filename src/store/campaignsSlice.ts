import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { http } from "@/lib/http"

export interface BatchCallDetails {
    id: string
    agent_id: string
    agent_name: string
    call_name: string
    status: string
    created_at: string
    recipients: {
        phone_number: string
        status: string
        updated_at: string
    }[]
    calls_dispatched: number
    provider: string
}

export interface CreateBatchCallPayload {
    agent_id: string
    agent_phone_number_id: string
    recipients: {
        phone_number: string
        name?: string
        [key: string]: any
    }[]
    call_name: string
    scheduled_time_unix?: number
}

interface CampaignsState {
    selectedCampaign: BatchCallDetails | null
    loading: boolean
    error: string | null
    createLoading: boolean
    createError: string | null
}

const initialState: CampaignsState = {
    selectedCampaign: null,
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
}

export const createBatchCall = createAsyncThunk(
    "campaigns/createBatchCall",
    async (payload: CreateBatchCallPayload, { rejectWithValue }) => {
        try {
            const response = await http.post("/batch-call", payload)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create batch call")
        }
    },
)

export const fetchBatchCallDetails = createAsyncThunk(
    "campaigns/fetchBatchCallDetails",
    async (batchCallId: string, { rejectWithValue }) => {
        try {
            const response = await http.get(`/batch-call/${batchCallId}`)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch batch call details")
        }
    },
)

const campaignsSlice = createSlice({
    name: "campaigns",
    initialState,
    reducers: {
        clearCreateError(state) {
            state.createError = null
        },
        clearSelectedCampaign(state) {
            state.selectedCampaign = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Create batch call
            .addCase(createBatchCall.pending, (state) => {
                state.createLoading = true
                state.createError = null
            })
            .addCase(createBatchCall.fulfilled, (state) => {
                state.createLoading = false
            })
            .addCase(createBatchCall.rejected, (state, action) => {
                state.createLoading = false
                state.createError = action.payload as string
            })
            // Fetch batch call details
            .addCase(fetchBatchCallDetails.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBatchCallDetails.fulfilled, (state, action) => {
                state.loading = false
                state.selectedCampaign = action.payload
            })
            .addCase(fetchBatchCallDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearCreateError, clearSelectedCampaign } = campaignsSlice.actions
export default campaignsSlice.reducer
