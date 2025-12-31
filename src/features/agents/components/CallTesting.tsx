"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, Phone } from "lucide-react"
import { Conversation } from "@11labs/client"
import { cn } from "@/lib/utils"

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
    ? "bg-default-100 text-default-500"
    : isConnected
      ? isSpeaking
        ? "bg-primary/10 text-primary border border-primary/20"
        : "bg-danger/10 text-danger border border-danger/20"
      : "bg-default-100 text-default-500"

  const statusDotClasses = isLoading
    ? "bg-default-400"
    : isConnected
      ? isSpeaking
        ? "bg-primary"
        : "bg-danger"
      : "bg-default-400"

  const micButtonClasses = isLoading
    ? "bg-default-100"
    : isConnected
      ? isSpeaking
        ? "bg-primary shadow-lg shadow-primary/40 text-white"
        : "bg-danger text-white shadow-lg shadow-danger/40"
      : "bg-white dark:bg-black/20 text-default-500 hover:text-foreground hover:bg-default-50 shadow-sm border border-divider"

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
            className="px-6 py-4 bg-danger/10 border-b border-danger/20"
          >
            <div className="flex items-center space-x-3 text-danger">
              <MicOff className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Microphone Access Required</p>
                <p className="text-xs mt-0.5 text-danger/80 font-medium">
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
                          ? "bg-primary/30"
                          : "bg-danger/30"
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
                  className={cn(
                    "transition-colors duration-300",
                    isLoading
                      ? "text-default-400"
                      : isConnected
                        ? "text-white"
                        : "text-default-400 group-hover:text-foreground"
                  )}
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-4 border-default-200 border-t-primary rounded-full animate-spin" />
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
                className="mt-6 flex items-center space-x-2 px-4 py-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors border border-danger/20 font-bold text-[13px]"
              >
                <Phone className="w-4 h-4" />
                <span>End Call</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallTesting
