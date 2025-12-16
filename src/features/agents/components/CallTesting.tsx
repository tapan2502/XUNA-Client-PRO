"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, Phone } from "lucide-react"
import { Conversation } from "@11labs/client"

interface CallTestingProps {
  agentId: string
  dynamicVariables?: { [key: string]: string | number | boolean }
}

const CallTesting: React.FC<CallTestingProps> = ({ agentId, dynamicVariables = {} }) => {
  const [conversation, setConversation] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      return true
    } catch (error) {
      console.error("Microphone permission denied:", error)
      setHasPermission(false)
      return false
    }
  }

  const toggleConversation = async () => {
    if (isConnected) {
      if (conversation) {
        await conversation.endSession()
        setConversation(null)
      }
    } else {
      setIsLoading(true)
      try {
        const permission = await requestMicrophonePermission()
        if (!permission) {
          alert("Microphone permission is required for the conversation.")
          setIsLoading(false)
          return
        }

        const conv = await Conversation.startSession({
          agentId,
          connectionType: "webrtc",
          dynamicVariables: Object.keys(dynamicVariables).length > 0 ? dynamicVariables : undefined,
          onConnect: () => {
            setIsConnected(true)
            setIsLoading(false)
          },
          onDisconnect: () => {
            setIsConnected(false)
            setIsSpeaking(false)
          },
          onError: (message, context) => {
            console.error("Conversation error:", message, context)
            setIsConnected(false)
            setIsLoading(false)
            alert(`Conversation error: ${message || "Unknown error"}`)
          },
          onModeChange: (mode) => {
            setIsSpeaking(mode.mode === "speaking")
          },
        })

        setConversation(conv)
      } catch (error: any) {
        console.error("Error starting conversation:", error)
        setIsLoading(false)
        alert(`Failed to start conversation: ${error.message || "Please try again."}`)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (conversation) {
        conversation.endSession()
      }
    }
  }, [conversation])

  const statusClasses = isLoading
    ? "bg-[hsl(var(--accent))] text-muted-foreground"
    : isConnected
      ? isSpeaking
        ? "bg-[hsl(var(--primary)_/_0.2)] text-[hsl(var(--primary))]"
        : "bg-[hsl(var(--destructive)_/_0.15)] text-[hsl(var(--destructive))]"
      : "bg-[hsl(var(--accent))] text-muted-foreground"

  const statusDotClasses = isLoading
    ? "bg-[hsl(var(--muted-foreground)_/_0.7)]"
    : isConnected
      ? isSpeaking
        ? "bg-[hsl(var(--primary))]"
        : "bg-[hsl(var(--destructive))]"
      : "bg-[hsl(var(--muted-foreground)_/_0.7)]"

  const micButtonClasses = isLoading
    ? "bg-[hsl(var(--accent))]"
    : isConnected
      ? isSpeaking
        ? "bg-[hsl(var(--primary))] shadow-[0_16px_35px_hsl(var(--primary)/0.35)] text-white"
        : "bg-[hsl(var(--destructive))] text-white shadow-[0_16px_35px_hsl(var(--destructive)/0.35)]"
      : "bg-[hsl(var(--accent))] text-muted-foreground hover:bg-[hsl(var(--accent)_/_0.8)] shadow-[0_12px_28px_hsl(var(--foreground)/0.06)]"

  return (
    <div className="sticky top-8">
      <div className="bg-background border border-divider rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-divider bg-default-50">
          <h2 className="text-lg font-bold">Test Your Agent</h2>
          <p className="text-sm text-default-500 mt-1">Click the microphone to start a conversation</p>
        </div>

        {hasPermission === false && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-4 bg-[hsl(var(--destructive)_/_0.12)] border-b border-[hsl(var(--destructive)_/_0.3)]"
          >
            <div className="flex items-center space-x-3 text-[hsl(var(--destructive))]">
              <MicOff className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Microphone Access Required</p>
                <p className="text-xs mt-0.5 text-[hsl(var(--destructive)_/_0.7)]">
                  Please allow microphone access to test the voice agent
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="p-6 bg-[hsl(var(--card))]">
          <div className="flex flex-col items-center">
            {/* Status indicator */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <motion.div
                animate={{ opacity: [0.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur ${statusClasses}`}
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className={`w-2 h-2 rounded-full mr-2 ${statusDotClasses}`}
                />
                {isLoading
                  ? "Initializing..."
                  : isConnected
                    ? isSpeaking
                      ? "Agent Speaking"
                      : "Listening..."
                    : "Ready"}
              </motion.div>
            </motion.div>

            {/* Main microphone button */}
            <motion.button
              onClick={toggleConversation}
              disabled={isLoading}
              className="relative outline-none group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Ripple effect */}
              <AnimatePresence>
                {isConnected && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2],
                        opacity: [0.3, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeOut",
                      }}
                      className={`absolute inset-0 rounded-full ${
                        isSpeaking
                          ? "bg-[hsl(var(--primary)_/_0.25)]"
                          : "bg-[hsl(var(--destructive)_/_0.25)]"
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main button background */}
              <motion.div
                animate={{
                  scale: isSpeaking ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  scale: {
                    duration: 1,
                    repeat: isSpeaking ? Number.POSITIVE_INFINITY : 0,
                    ease: "easeInOut",
                  },
                }}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${micButtonClasses}`}
              >
                {/* Icon container */}
                <motion.div
                  animate={{
                    scale: isConnected ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: isConnected ? Number.POSITIVE_INFINITY : 0,
                    ease: "easeInOut",
                  }}
                  className={`transition-colors duration-300 ${
                    isLoading
                      ? "text-muted-foreground"
                      : isConnected
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-4 border-muted border-t-[hsl(var(--primary))] rounded-full animate-spin" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </motion.div>
              </motion.div>
            </motion.button>

            {/* End Call Button */}
            {isConnected && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={toggleConversation}
                className="mt-6 flex items-center space-x-2 px-4 py-2 rounded-lg bg-[hsl(var(--destructive)_/_0.18)] text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)_/_0.24)] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">End Call</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallTesting
