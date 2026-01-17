import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import layoutReducer from "./layoutSlice";
import phoneNumbersReducer from "./phoneNumbersSlice";
import agentsReducer from "./agentsSlice";
import callHistoryReducer from "./callHistorySlice";
import campaignsReducer from "./campaignsSlice";
import settingsReducer from "./settingsSlice";
import billingReducer from "./billingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    phoneNumbers: phoneNumbersReducer,
    agents: agentsReducer,
    callHistory: callHistoryReducer,
    campaigns: campaignsReducer,
    settings: settingsReducer,
    billing: billingReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
