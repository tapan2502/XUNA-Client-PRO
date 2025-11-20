import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import layoutReducer from "./layoutSlice"
import agentsReducer from "./agentsSlice"
import phoneNumbersReducer from "./phoneNumbersSlice"
import callHistoryReducer from "./callHistorySlice"
import settingsReducer from "./settingsSlice"
import campaignsReducer from "./campaignsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    agents: agentsReducer,
    phoneNumbers: phoneNumbersReducer,
    callHistory: callHistoryReducer,
    settings: settingsReducer,
    campaigns: campaignsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
