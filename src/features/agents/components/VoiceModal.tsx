"use client"

import type React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Search, Plus, Loader2 } from "lucide-react"
import { http } from "@/lib/http"
import { cn } from "@heroui/theme"

interface VoiceLabels {
  accent?: string
  age?: string
  gender?: string
  description?: string
  use_case?: string
  [key: string]: string | undefined
}

interface Voice {
  voice_id: string
  name: string
  preview_url: string
  labels?: VoiceLabels
}

interface SharedVoice {
  voice_id: string
  name: string
  preview_url: string
  labels?: VoiceLabels
  owner_email?: string
  created_at?: string
  public_owner_id?: string
  accent?: string
  gender?: string
}

interface VoiceModalProps {
  isOpen: boolean
  onClose: () => void
  voices: Voice[]
  selectedVoiceId: string
  onVoiceChange: (voiceId: string) => void
  onVoicesUpdate?: () => void
}

export const VoiceModal = ({
  isOpen,
  onClose,
  voices,
  selectedVoiceId,
  onVoiceChange,
  onVoicesUpdate,
}: VoiceModalProps) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<"my-voices" | "custom-voices">("my-voices")

  // Basic filters for My Voices
  const [genderFilter, setGenderFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [accentFilter, setAccentFilter] = useState("")

  // Separate filters for Custom Voices
  const [customGenderFilter, setCustomGenderFilter] = useState("")
  const [customSearchTerm, setCustomSearchTerm] = useState("")
  const [customAccentFilter, setCustomAccentFilter] = useState("")

  // Custom voices state
  const [sharedVoices, setSharedVoices] = useState<SharedVoice[]>([])
  const [loadingSharedVoices, setLoadingSharedVoices] = useState(false)
  const [addingVoices, setAddingVoices] = useState<Set<string>>(new Set())

  // Ref to keep track of the currently playing audio
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Fetch shared voices when custom voices tab is opened or filters change
  useEffect(() => {
    if (activeTab === "custom-voices" && isOpen) {
      fetchSharedVoices()
    }
  }, [activeTab, isOpen, customGenderFilter, customAccentFilter, customSearchTerm])

  const fetchSharedVoices = async () => {
    setLoadingSharedVoices(true)
    try {
      // Build query parameters
      const params = new URLSearchParams({ page: "0" })
      if (customGenderFilter) params.append("gender", customGenderFilter)
      if (customAccentFilter) params.append("accent", customAccentFilter)
      if (customSearchTerm) params.append("search", customSearchTerm)

      const response = await http.get(`/voices/shared-voices?${params.toString()}`)
      setSharedVoices(response.data.voices || [])
    } catch (error) {
      console.error("Error fetching shared voices:", error)
    } finally {
      setLoadingSharedVoices(false)
    }
  }

  // Add voice to user's collection
  const handleAddCustomVoice = async (voiceId: string) => {
    // Find the voice to get its name and public_owner_id
    const voice = sharedVoices.find((v) => v.voice_id === voiceId)
    if (!voice) return

    setAddingVoices((prev) => new Set([...prev, voiceId]))

    try {
      await http.post("/voices/add-custom-voice", {
        voice_id: voiceId,
        name: voice.name,
        public_owner_id: voice.public_owner_id,
      })

      // Optionally refresh the user's voices
      if (onVoicesUpdate) {
        onVoicesUpdate()
      }
    } catch (error) {
      console.error("Error adding custom voice:", error)
    } finally {
      setAddingVoices((prev) => {
        const newSet = new Set(prev)
        newSet.delete(voiceId)
        return newSet
      })
    }
  }

  // Dynamically gather all unique accents for My Voices
  const myVoicesAccents = useMemo(() => {
    const accentSet = new Set<string>()
    voices.forEach((v) => {
      const rawAccent = v.labels?.accent || ""
      const normalized = rawAccent.toLowerCase().replace(/^en-/, "")
      if (normalized) accentSet.add(normalized)
    })
    return Array.from(accentSet)
  }, [voices])

  // Dynamically gather all unique accents for Custom Voices
  const customVoicesAccents = useMemo(() => {
    const accentSet = new Set<string>()
    sharedVoices.forEach((v) => {
      const rawAccent = v.accent || v.labels?.accent || ""
      const normalized = rawAccent.toLowerCase().replace(/^en-/, "")
      if (normalized) accentSet.add(normalized)
    })
    return Array.from(accentSet)
  }, [sharedVoices])

  // Dynamically gather all unique genders for Custom Voices
  const customVoicesGenders = useMemo(() => {
    const genderSet = new Set<string>()
    sharedVoices.forEach((v) => {
      const gender = (v.gender || v.labels?.gender || "").toLowerCase()
      if (gender) genderSet.add(gender)
    })
    return Array.from(genderSet)
  }, [sharedVoices])

  // Helper to play audio preview ensuring only one plays at a time
  const handlePlay = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Pause and reset any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
    }
    // Create and play new audio, then store it in the ref
    const audio = new Audio(url)
    currentAudioRef.current = audio
    audio.play()
  }

  // Filter + search logic
  const filteredVoices = useMemo(() => {
    let currentVoices = activeTab === "my-voices" ? voices : sharedVoices

    // If on custom voices tab, filter out voices that are already in user's collection
    if (activeTab === "custom-voices") {
      const userVoiceIds = new Set(voices.map((v) => v.voice_id))
      currentVoices = sharedVoices.filter((v) => !userVoiceIds.has(v.voice_id))
    }

    // Use appropriate filters based on active tab
    const currentGenderFilter = activeTab === "my-voices" ? genderFilter : customGenderFilter
    const currentAccentFilter = activeTab === "my-voices" ? accentFilter : customAccentFilter
    const currentSearchTerm = activeTab === "my-voices" ? searchTerm : customSearchTerm

    return currentVoices.filter((v) => {
      // Handle both shared voice structure (direct properties) and regular voice structure (labels)
      const isSharedVoice = activeTab === "custom-voices"
      const rawAccent = isSharedVoice ? (v as SharedVoice).accent || "" : v.labels?.accent || ""
      const accent = rawAccent.toLowerCase().replace(/^en-/, "")
      const gender = isSharedVoice
        ? ((v as SharedVoice).gender || "").toLowerCase()
        : (v.labels?.gender || "").toLowerCase()

      if (currentGenderFilter && gender !== currentGenderFilter.toLowerCase()) return false
      if (currentAccentFilter && accent !== currentAccentFilter.toLowerCase()) return false

      // Only apply client-side search for my voices (custom voices search is handled by API)
      if (currentSearchTerm && activeTab === "my-voices") {
        const st = currentSearchTerm.toLowerCase()
        const nameMatch = v.name.toLowerCase().includes(st)
        const idMatch = v.voice_id.toLowerCase().includes(st)
        const accentMatch = accent.includes(st)
        const descMatch = (v.labels?.description || "").toLowerCase().includes(st)
        if (!nameMatch && !idMatch && !accentMatch && !descMatch) return false
      }
      return true
    })
  }, [
    voices,
    sharedVoices,
    activeTab,
    genderFilter,
    accentFilter,
    searchTerm,
    customGenderFilter,
    customAccentFilter,
    customSearchTerm,
  ])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Flex container to center the modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal box */}
            <motion.div
              className="w-full max-w-2xl rounded-xl bg-card shadow-xl border border-border"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-border">
                <div className="flex items-center justify-between p-4">
                  <h2 className="text-lg font-semibold">
                    {activeTab === "my-voices" ? "Select Voice" : "Get Custom Voice"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-t border-border">
                  <button
                    onClick={() => setActiveTab("my-voices")}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === "my-voices"
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    My Voices
                  </button>
                  <button
                    onClick={() => setActiveTab("custom-voices")}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === "custom-voices"
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Get Custom Voice
                  </button>
                </div>
              </div>
              {/* Filters Row */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                {/* Gender Filter */}
                <div className="relative">
                  <select
                    value={activeTab === "my-voices" ? genderFilter : customGenderFilter}
                    onChange={(e) => {
                      if (activeTab === "my-voices") {
                        setGenderFilter(e.target.value)
                      } else {
                        setCustomGenderFilter(e.target.value)
                      }
                    }}
                    className="text-sm border border-border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Gender</option>
                    {activeTab === "my-voices" ? (
                      <>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                      </>
                    ) : (
                      customVoicesGenders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {/* Dynamic Accent Filter */}
                <div className="relative">
                  <select
                    value={activeTab === "my-voices" ? accentFilter : customAccentFilter}
                    onChange={(e) => {
                      if (activeTab === "my-voices") {
                        setAccentFilter(e.target.value)
                      } else {
                        setCustomAccentFilter(e.target.value)
                      }
                    }}
                    className="text-sm border border-border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Accent</option>
                    {(activeTab === "my-voices" ? myVoicesAccents : customVoicesAccents).map((accent) => (
                      <option key={accent} value={accent}>
                        {accent.charAt(0).toUpperCase() + accent.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Search */}
                <div className="flex items-center ml-auto border border-border rounded-md px-2 py-1.5 bg-background">
                  <Search className="w-4 h-4 text-muted-foreground mr-1" />
                  <input
                    type="text"
                    value={activeTab === "my-voices" ? searchTerm : customSearchTerm}
                    onChange={(e) => {
                      if (activeTab === "my-voices") {
                        setSearchTerm(e.target.value)
                      } else {
                        setCustomSearchTerm(e.target.value)
                      }
                    }}
                    placeholder="Search..."
                    className="text-sm focus:outline-none bg-transparent w-32"
                  />
                </div>
              </div>
              {/* Scrollable table container */}
              <div className="overflow-auto px-4 max-h-80">
                <table className="w-full text-sm text-left mt-2 border-separate border-spacing-y-1">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="py-2 w-8"></th>
                      <th className="py-2">Voice</th>
                      <th className="py-2">Voice ID</th>
                      {activeTab === "custom-voices" && <th className="py-2 w-16">Add</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSharedVoices && activeTab === "custom-voices" ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center">
                          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading shared voices...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {filteredVoices.map((voice) => {
                          const isSelected = voice.voice_id === selectedVoiceId
                          const isAdding = addingVoices.has(voice.voice_id)

                          return (
                            <tr
                              key={voice.voice_id}
                              onClick={activeTab === "my-voices" ? () => onVoiceChange(voice.voice_id) : undefined}
                              className={cn(
                                activeTab === "my-voices" && "cursor-pointer hover:bg-muted/50",
                                isSelected && "bg-primary/5",
                              )}
                            >
                              <td className="py-2 w-8 align-middle text-center">
                                <button
                                  onClick={(e) => handlePlay(voice.preview_url, e)}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              </td>
                              <td className="py-2 font-medium align-middle">{voice.name}</td>

                              <td className="py-2 align-middle text-muted-foreground">{voice.voice_id}</td>
                              {activeTab === "custom-voices" && (
                                <td className="py-2 w-16 align-middle text-center">
                                  <button
                                    onClick={() => handleAddCustomVoice(voice.voice_id)}
                                    disabled={isAdding}
                                    className="p-1 text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isAdding ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Plus className="w-4 h-4" />
                                    )}
                                  </button>
                                </td>
                              )}
                            </tr>
                          )
                        })}
                        {filteredVoices.length === 0 && !loadingSharedVoices && (
                          <tr>
                            <td
                              colSpan={activeTab === "custom-voices" ? 5 : 4}
                              className="py-4 text-center text-muted-foreground"
                            >
                              No voices found.
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Footer */}
              <div className="flex justify-end gap-2 p-4 border-t border-border">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-foreground bg-muted rounded hover:bg-muted/80"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
