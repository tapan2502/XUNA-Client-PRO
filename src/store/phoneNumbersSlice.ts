import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "@/lib/http";

export interface PhoneNumber {
    phone_number_id: string;
    phone_number: string;
    provider: string;
    label: string;
    sid?: string;
    token?: string;
    created_at_unix_secs?: number;
    assigned_agent?: {
        agent_id: string;
        agent_name: string;
    };
}

interface PhoneNumbersState {
    phoneNumbers: PhoneNumber[];
    loading: boolean;
    error: string | null;
}

const initialState: PhoneNumbersState = {
    phoneNumbers: [],
    loading: false,
    error: null,
};

export const fetchPhoneNumbers = createAsyncThunk(
    "phoneNumbers/fetchPhoneNumbers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get("/phone-numbers");
            return response.data || [];
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch phone numbers"
            );
        }
    }
);

export const createPhoneNumber = createAsyncThunk(
    "phoneNumbers/createPhoneNumber",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await http.post("/phone-numbers/create", payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || "Failed to create phone number"
            );
        }
    }
);

export const updatePhoneNumber = createAsyncThunk(
    "phoneNumbers/updatePhoneNumber",
    async ({ phone_number_id, ...payload }: { phone_number_id: string;[key: string]: any }, { rejectWithValue }) => {
        try {
            const response = await http.patch(`/phone-numbers/${phone_number_id}`, payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || "Failed to update phone number"
            );
        }
    }
);

export const deletePhoneNumber = createAsyncThunk(
    "phoneNumbers/deletePhoneNumber",
    async (phone_number_id: string, { rejectWithValue }) => {
        try {
            await http.delete(`/phone-numbers/${phone_number_id}`);
            return phone_number_id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || "Failed to delete phone number"
            );
        }
    }
);

const phoneNumbersSlice = createSlice({
    name: "phoneNumbers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPhoneNumbers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPhoneNumbers.fulfilled, (state, action) => {
                state.loading = false;
                state.phoneNumbers = action.payload;
            })
            .addCase(fetchPhoneNumbers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createPhoneNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPhoneNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.phoneNumbers.push(action.payload);
            })
            .addCase(createPhoneNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePhoneNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePhoneNumber.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.phoneNumbers.findIndex(
                    (pn) => pn.phone_number_id === action.payload.phone_number_id
                );
                if (index !== -1) {
                    state.phoneNumbers[index] = {
                        ...state.phoneNumbers[index],
                        ...action.payload,
                    };
                }
            })
            .addCase(updatePhoneNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deletePhoneNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePhoneNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.phoneNumbers = state.phoneNumbers.filter(
                    (pn) => pn.phone_number_id !== action.payload
                );
            })
            .addCase(deletePhoneNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default phoneNumbersSlice.reducer;
