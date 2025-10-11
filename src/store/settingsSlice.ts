import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface SettingsState {
  theme: ThemeMode;
  primaryColor: string;
  companyName: string;
  logoDataUrl?: string | null;
}

const initialState: SettingsState = {
  theme: "system",
  primaryColor: "#6366f1",
  companyName: "",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setPrimaryColor(state, action: PayloadAction<string>) {
      state.primaryColor = action.payload;
    },
    setCompanyName(state, action: PayloadAction<string>) {
      state.companyName = action.payload;
    },
    setLogo(state, action: PayloadAction<string | null | undefined>) {
      state.logoDataUrl = action.payload ?? null;
    },
  },
});

export const { setTheme, setPrimaryColor, setCompanyName, setLogo } = settingsSlice.actions;
export default settingsSlice.reducer;
