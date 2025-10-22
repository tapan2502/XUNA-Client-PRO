"use client"

import {
  createContext,
  memo,
  type ComponentType,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Info, XCircle } from "lucide-react"

type SnackbarVariant = "success" | "error" | "info"

interface SnackbarMessage {
  id: string
  title?: string
  message: string
  variant: SnackbarVariant
  duration?: number
}

interface SnackbarContextValue {
  showSnackbar: (message: Omit<SnackbarMessage, "id">) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)

const VARIANT_STYLES: Record<
  SnackbarVariant,
  { icon: ComponentType<{ className?: string }>; accent: string; bar: string }
> = {
  success: { icon: CheckCircle2, accent: "text-emerald-500", bar: "bg-emerald-500/80" },
  error: { icon: XCircle, accent: "text-red-500", bar: "bg-red-500/80" },
  info: { icon: Info, accent: "text-sky-500", bar: "bg-sky-500/80" },
}

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showSnackbar = useCallback(
    ({ duration = 4500, ...message }: Omit<SnackbarMessage, "id">) => {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)
      setMessages((prev) => [...prev, { ...message, id }])

      timers.current[id] = setTimeout(() => removeMessage(id), duration)
    },
    [removeMessage],
  )

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[9998] flex flex-col items-end gap-3 px-6 py-6">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_20px_60px_hsl(var(--foreground)/0.18)]"
                >
                  <SnackbarItem message={message} onDismiss={removeMessage} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </SnackbarContext.Provider>
  )
}

interface SnackbarItemProps {
  message: SnackbarMessage
  onDismiss: (id: string) => void
}

const SnackbarItem = memo(({ message, onDismiss }: SnackbarItemProps) => {
  const variantStyles = VARIANT_STYLES[message.variant]

  return (
    <div className="relative isolate">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--accent))_0%,_transparent_70%)] opacity-70" />
      <div className="flex items-start gap-3 px-5 py-4">
        <variantStyles.icon className={`mt-1 h-5 w-5 ${variantStyles.accent}`} />
        <div className="flex-1 space-y-1 text-left">
          {message.title && <h4 className="text-sm font-semibold text-foreground">{message.title}</h4>}
          <p className="text-sm text-muted-foreground">{message.message}</p>
        </div>
        <button
          onClick={() => onDismiss(message.id)}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-[hsl(var(--accent))] hover:text-foreground"
          aria-label="Dismiss notification"
        >
          <span className="sr-only">Dismiss</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 w-full ${variantStyles.bar}`}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (message.duration ?? 4500) / 1000, ease: "linear" }}
      />
    </div>
  )
})
SnackbarItem.displayName = "SnackbarItem"

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider")
  }
  return context
}
