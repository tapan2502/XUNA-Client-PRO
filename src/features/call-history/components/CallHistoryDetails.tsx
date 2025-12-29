"use client"

import type React from "react"

import { X, MessageSquare, Clock, Activity, BarChart, Volume2, Play, Pause, Download, Phone, User } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useState, useEffect } from "react"
import type { ConversationDetails } from "@/store/callHistorySlice"
import { Card, CardBody, Button, Chip } from "@heroui/react"
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
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <LoadingSpinner />
        </div>
      )}
      {details && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-background border-l border-divider shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-divider p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Call Details</h2>
                    <p className="text-sm text-default-400">View transcript and analytics</p>
                  </div>
                </div>
                <Button isIconOnly variant="light" onPress={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content - Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <Card shadow="sm" className="border border-default-200">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-tiny text-default-500">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {formatDuration(details.conversation.metadata.call_duration_secs)}
                    </p>
                  </CardBody>
                </Card>

                <Card shadow="sm" className="border border-default-200">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-tiny text-default-500">Messages</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{details.conversation.transcript.length}</p>
                  </CardBody>
                </Card>

                <Card shadow="sm" className="border border-default-200">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart className="w-4 h-4 text-primary" />
                      <span className="text-tiny text-default-500">Cost</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {details.conversation.metadata.cost !== undefined
                          ? `$${(details.conversation.metadata.cost / 100).toFixed(4)}`
                          : "N/A"}
                      </p>
                      {details.conversation.metadata.cost !== undefined &&
                        details.conversation.metadata.call_duration_secs > 0 && (
                          <p className="text-[10px] text-default-400 mt-1">
                            ${((details.conversation.metadata.cost / 100) / (details.conversation.metadata.call_duration_secs / 60)).toFixed(4)}/min
                          </p>
                        )}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Audio Controls */}
              {details.audio && (
                <Card shadow="sm" className="border border-default-200">
                  <CardBody className="p-0">
                    <div className="p-4 border-b border-divider bg-default-50">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-semibold">Call Recording</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          isIconOnly
                          color="primary"
                          variant="flat"
                          onPress={handlePlayAudio}
                          className="w-12 h-12 rounded-full"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>
                        <Button
                          isIconOnly
                          variant="flat"
                          onPress={handleDownloadAudio}
                          className="w-12 h-12 rounded-full"
                        >
                          <Download className="w-6 h-6" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-2 bg-default-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-sm text-default-500">
                          <span>{formatDuration(currentTime)}</span>
                          <span>{formatDuration(duration)}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Data Collection Results */}
              {(() => {
                const dataCollection = details?.conversation?.analysis?.data_collection_results
                const hasDataCollection =
                  dataCollection && typeof dataCollection === "object" && Object.keys(dataCollection).length > 0

                return hasDataCollection ? (
                  <DataCollectionSection dataCollection={dataCollection} />
                ) : (
                  <Card shadow="sm" className="border border-default-200">
                    <CardBody className="p-4">
                      <p className="text-sm text-default-500 italic">
                        No data collection results available for this conversation.
                      </p>
                    </CardBody>
                  </Card>
                )
              })()}

              {/* Summary */}
              <Card shadow="sm" className="border border-default-200">
                <CardBody className="p-0">
                  <div className="p-4 border-b border-divider bg-default-50">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold">Summary</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-default-600 leading-relaxed">
                      {details.conversation?.analysis?.transcript_summary}
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Transcript */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Transcript</h3>
                </div>

                {/* Transcript Messages */}
                <div className="space-y-4">
                  {details?.conversation?.transcript?.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="flex items-end gap-2 max-w-[80%]">
                        {message?.role !== "user" && (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 text-primary" />
                          </div>
                        )}

                        <div
                          className={`rounded-2xl p-4 ${
                            message?.role === "user" ? "bg-primary text-primary-foreground" : "bg-default-100"
                          }`}
                        >
                          {/* Message Header */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold opacity-80">
                              {message?.role === "user" ? "You" : "Agent"}
                            </span>
                            <div className="flex items-center gap-1 text-xs opacity-60">
                              <Clock className="w-3 h-3" />
                              <span>{formatDuration(message?.time_in_call_secs)}</span>
                            </div>
                          </div>

                          {/* Message Content */}
                          <p className="text-sm leading-relaxed font-medium break-words">{message?.message}</p>
                        </div>

                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
