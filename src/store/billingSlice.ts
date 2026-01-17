import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "@/lib/http";

export interface Invoice {
    id: string;
    invoiceStatus: string;
    paidAt?: string;
    totalCost: number;
    description?: string;
    stripeUrl?: string;
    type?: string;
}

export interface BalanceDetails {
    currentBalance: number;
    totalUsage: number;
    balance: number;
}

interface BillingState {
    customerId: string;
    hasPaymentMethod: boolean;
    balanceDetails: BalanceDetails;
    invoices: {
        paid: Invoice[];
        unpaid: Invoice[];
    };
    loading: boolean;
    isProcessing: boolean;
    error: string | null;
}

const initialState: BillingState = {
    customerId: "",
    hasPaymentMethod: false,
    balanceDetails: { currentBalance: 0, totalUsage: 0, balance: 0 },
    invoices: { paid: [], unpaid: [] },
    loading: true,
    isProcessing: false,
    error: null,
};

export const checkPaymentMethodSetup = createAsyncThunk(
    "billing/checkPaymentMethodSetup",
    async (customerId: string, { rejectWithValue }) => {
        try {
            const response = await http.get(`/payment/check-payment-method-setup?customerId=${customerId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to check payment method");
        }
    }
);

export const setupPaymentMethod = createAsyncThunk(
    "billing/setupPaymentMethod",
    async ({ userId, email, customerId }: { userId: string; email: string; customerId: string }, { rejectWithValue }) => {
        try {
            const response = await http.post("/payment/setup-subscription-payment-method", {
                userId,
                email,
                customerId,
                return_url: window.location.origin + "/billing",
            });
            const data = response.data;
            if (data.sessionUrl) {
                window.location.href = data.sessionUrl;
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to setup payment method");
        }
    }
);

export const setupOneTimeTopUp = createAsyncThunk(
    "billing/setupOneTimeTopUp",
    async ({ userId, amount, customerId, email }: { userId: string; amount: number; customerId: string; email: string }, { rejectWithValue }) => {
        try {
            const response = await http.post("/payment/create-topup-session", {
                userId,
                amount,
                customerId,
                email,
                return_url: `${window.location.origin}/billing`,
            });
            const data = response.data;
            if (data.sessionUrl) {
                window.location.href = data.sessionUrl;
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create top-up session");
        }
    }
);

const billingSlice = createSlice({
    name: "billing",
    initialState,
    reducers: {
        setCustomerId(state, action: PayloadAction<string>) {
            state.customerId = action.payload;
        },
        setBalanceDetails(state, action: PayloadAction<BalanceDetails>) {
            state.balanceDetails = action.payload;
            state.loading = false;
        },
        setInvoices(state, action: PayloadAction<{ paid: Invoice[]; unpaid: Invoice[] }>) {
            state.invoices = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // checkPaymentMethodSetup
            .addCase(checkPaymentMethodSetup.fulfilled, (state, action) => {
                state.hasPaymentMethod = action.payload.hasValidPaymentMethod || false;
            })
            // setupPaymentMethod
            .addCase(setupPaymentMethod.pending, (state) => {
                state.isProcessing = true;
            })
            .addCase(setupPaymentMethod.fulfilled, (state) => {
                state.isProcessing = false;
            })
            .addCase(setupPaymentMethod.rejected, (state, action) => {
                state.isProcessing = false;
                state.error = action.payload as string;
            })
            // setupOneTimeTopUp
            .addCase(setupOneTimeTopUp.pending, (state) => {
                state.isProcessing = true;
            })
            .addCase(setupOneTimeTopUp.fulfilled, (state) => {
                state.isProcessing = false;
            })
            .addCase(setupOneTimeTopUp.rejected, (state, action) => {
                state.isProcessing = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCustomerId, setBalanceDetails, setInvoices, setLoading, setError } = billingSlice.actions;
export default billingSlice.reducer;
