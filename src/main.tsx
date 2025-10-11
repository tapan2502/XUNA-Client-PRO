import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { HeroUIProvider } from "@heroui/react"
import "@/index.css"
import { store } from "@/store"
import AppRoutes from "@/app/routes"
import { applyTheme } from "@/app/theme"

const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
applyTheme(savedTheme)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <AppRoutes />
      </HeroUIProvider>
    </Provider>
  </React.StrictMode>,
)
