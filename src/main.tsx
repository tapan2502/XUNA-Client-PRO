// src/main.tsx
import "@/index.css";               // ⬅️ FIRST
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";
import { store } from "@/store";
import AppRoutes from "@/app/routes";
import { SnackbarProvider } from "@/components/ui/SnackbarProvider";
import { applyTheme } from "@/app/theme";

applyTheme(store.getState().settings.theme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
      </HeroUIProvider>
    </Provider>
  </React.StrictMode>
);
