"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare, Clock, Activity, BarChart, Volume2, Play, Pause, Download, Phone, User } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useState, useEffect } from "react"
import type { ConversationDetails } from "@/store/callHistorySlice"
import DataCollectionSection from "./DataCollectionSection"

interface CallHistoryDetailsProps {
  details: ConversationDetails | null
  onClose: () => void
  loading: boolean
}

export default function CallHistoryDetails({ details, onClose, loading }: CallHistoryDetailsProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (details?.audio) {
      const audioElement = new Audio(`data:audio/wav;base64,${details.audio}`)
      audioElement.addEventListener("loadedmetadata", () => {
        setDuration(audioElement.duration)
      })
      audioElement.addEventListener("timeupdate", () => {
        setCurrentTime(audioElement.currentTime)
      })
      audioElement.addEventListener("ended", () => {
        setIsPlaying(false)
        setCurrentTime(0)
        audioElement.currentTime = 0
      })
      setAudio(audioElement)

      return () => {
        audioElement.pause()
        audioElement.src = ""
      }
    }
  }, [details])

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause()
        audio.src = ""
      }
    }
  }, [audio])

  const handlePlayAudio = () => {
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return
    const time = Number(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const handleDownloadAudio = () => {
    if (!details?.audio) return
    const link = document.createElement("a")
    link.href = `data:audio/wav;base64,${details.audio}`
    link.download = `conversation-${details.conversation.conversation_id}.wav`
    link.click()
  }

  if (!details && !loading) return null

  return (
    <>
      {loading && <LoadingSpinner fullScreen />}
      {details && (
        <AnimatePresence>
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-white dark:bg-gray-900 border-l border-border shadow-2xl flex flex-col z-50"
            >
          {/* Header */}
          <div className="flex-shrink-0 border-b border-border bg-white dark:bg-gray-900">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Call History Details</h2>
                  <p className="text-sm text-muted-foreground">View transcript and analytics</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl border border-border bg-accent/50 shadow-sm"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                      <span className="text-xs font-medium text-muted-foreground">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-[hsl(var(--primary))]">
                      {formatDuration(details.conversation.metadata.call_duration_secs)}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl border border-border bg-accent/50 shadow-sm"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-[hsl(var(--primary))]" />
                      <span className="text-xs font-medium text-muted-foreground">Messages</span>
                    </div>
                    <p className="text-2xl font-bold text-[hsl(var(--primary))]">
                      {details.conversation.transcript.length}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl border border-border bg-accent/50 shadow-sm"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart className="w-4 h-4 text-[hsl(var(--primary))]" />
                      <span className="text-xs font-medium text-muted-foreground">Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-[hsl(var(--primary))]">
                      {details.conversation.metadata.cost !== undefined
                        ? `$${(details.conversation.metadata.cost / 100).toFixed(4)}`
                        : "N/A"}
                    </p>
                  </motion.div>
                </div>

                {/* Audio Controls */}
                {details.audio && (
                  <div className="surface-panel overflow-hidden">
                    <div className="p-4 border-b border-border bg-accent/40">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-[hsl(var(--primary))]" />
                        <h3 className="text-sm font-medium text-foreground">Call Recording</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4 bg-[hsl(var(--card))]">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handlePlayAudio}
                          className="w-12 h-12 rounded-full bg-primary/10 shadow-sm flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleDownloadAudio}
                          className="w-12 h-12 rounded-full bg-accent shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Download className="w-6 h-6" />
                        </motion.button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-2 bg-accent/60 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatDuration(currentTime)}</span>
                          <span>{formatDuration(duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Collection Results */}
                {(() => {
                  const dataCollection = details?.conversation?.analysis?.data_collection_results
                  const hasDataCollection =
                    dataCollection && typeof dataCollection === "object" && Object.keys(dataCollection).length > 0

                  return hasDataCollection ? (
                    <DataCollectionSection dataCollection={dataCollection} />
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium text-muted-foreground">Data Collection Results</h3>
                      </div>
                      <div className="surface-subtle p-4">
                        <p className="text-sm text-muted-foreground italic">
                          No data collection results available for this conversation.
                        </p>
                      </div>
                    </div>
                  )
                })()}

                {/* Summary */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-[hsl(var(--primary))]" />
                    <h3 className="text-sm font-medium text-foreground">Summary</h3>
                  </div>
                  <div className="surface-subtle p-4 bg-accent/50">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {details.conversation?.analysis?.transcript_summary}
                    </p>
                  </div>
                </div>

                {/* Transcript */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-[hsl(var(--primary))]" />
                      <h3 className="text-sm font-medium text-foreground">Transcript</h3>
                    </div>
                  </div>

                  {/* Transcript Messages */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 pb-8">
                    {details?.conversation?.transcript?.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex items-end space-x-2 max-w-[80%]">
                          {message?.role !== "user" && (
                            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-4 h-4 text-[hsl(var(--primary))]" />
                            </div>
                          )}

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`relative group rounded-2xl p-4 ${
                              message?.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-foreground"
                            }`}
                          >
                            {/* Message Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold opacity-80">
                                  {message?.role === "user" ? "You" : "Agent"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs opacity-60">
                                <Clock className="w-3 h-3" />
                                <span>{formatDuration(message?.time_in_call_secs)}</span>
                              </div>
                            </div>

                            {/* Message Content */}
                            <p className="text-sm leading-relaxed font-medium break-words">{message?.message}</p>
                          </motion.div>

                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-[hsl(var(--primary))]" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
          </div>
            </motion.div>
          </>
        </AnimatePresence>
      )}
    </>
  )
}
