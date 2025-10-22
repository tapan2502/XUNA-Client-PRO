import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import settingsReducer from "./settingsSlice"
import layoutReducer from "./layoutSlice"
import agentsReducer from "./agentsSlice"
import callHistoryReducer from "./callHistorySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    layout: layoutReducer,
    agents: agentsReducer,
    callHistory: callHistoryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
