import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import settingsReducer from "./settingsSlice"
import layoutReducer from "./layoutSlice"
import agentsReducer from "./agentsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    layout: layoutReducer,
    agents: agentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
