"use client"

import type React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { Play, Search, Plus, Loader2 } from "lucide-react"
import { http } from "@/lib/http"
import { cn } from "@/lib/utils"
import { ModernDropdown } from "@/components/ui/ModernDropdown"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"

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
  preview_url?: string
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
  const handlePlay = (url: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!url) {
      return
    }
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
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === "my-voices" ? "Select Voice" : "Get Custom Voice"}
      
      headerContent={
         <div className="flex border-b border-divider pt-4">
            <button
            onClick={() => setActiveTab("my-voices")}
            className={cn(
                "flex-1 px-4 py-3 text-sm font-bold transition-colors -mb-px",
                activeTab === "my-voices"
                ? "text-primary border-b-2 border-primary"
                : "text-default-500 hover:text-foreground",
            )}
            >
            My Voices
            </button>
            <button
            onClick={() => setActiveTab("custom-voices")}
            className={cn(
                "flex-1 px-4 py-3 text-sm font-bold transition-colors -mb-px",
                activeTab === "custom-voices"
                ? "text-primary border-b-2 border-primary"
                : "text-default-500 hover:text-foreground",
            )}
            >
            Get Custom Voice
            </button>
        </div>
      }
      size="2xl"
    >
      <PremiumPanelContent>
              {/* Filters Row */}
              <div className="flex flex-col md:flex-row items-center gap-4 py-2">
                {/* Gender Filter */}
                <div className="w-full md:w-32">
                  <ModernDropdown
                    value={activeTab === "my-voices" ? genderFilter : customGenderFilter}
                    options={[
                      { value: "", label: "All Genders" },
                      ...(activeTab === "my-voices" 
                        ? [
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "non-binary", label: "Non-binary" }
                          ]
                        : customVoicesGenders.map(g => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }))
                      )
                    ]}
                    onChange={(value) => {
                      if (activeTab === "my-voices") {
                        setGenderFilter(value)
                      } else {
                        setCustomGenderFilter(value)
                      }
                    }}
                    placeholder="Gender"
                    className="w-full"
                  />
                </div>
                {/* Dynamic Accent Filter */}
                <div className="w-full md:w-40">
                  <ModernDropdown
                    value={activeTab === "my-voices" ? accentFilter : customAccentFilter}
                    options={[
                      { value: "", label: "All Accents" },
                      ...(activeTab === "my-voices" ? myVoicesAccents : customVoicesAccents).map(accent => ({
                        value: accent,
                        label: accent.charAt(0).toUpperCase() + accent.slice(1)
                      }))
                    ]}
                    onChange={(value) => {
                      if (activeTab === "my-voices") {
                        setAccentFilter(value)
                      } else {
                        setCustomAccentFilter(value)
                      }
                    }}
                    placeholder="Accent"
                    className="w-full"
                  />
                </div>
                {/* Search */}
                <div className="flex items-center ml-auto border border-border rounded-md px-2 py-1.5 bg-background w-full md:w-auto">
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
                    className="text-sm focus:outline-none bg-transparent w-full md:w-32"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-muted-foreground border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="py-3 px-4 w-12"></th>
                      <th className="py-3 px-4">Voice</th>
                      <th className="py-3 px-4">Voice ID</th>
                      {activeTab === "custom-voices" && <th className="py-3 px-4 w-20 text-center">Add</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
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
                                "transition-colors",
                                activeTab === "my-voices" && "cursor-pointer hover:bg-muted/50",
                                isSelected && "bg-primary/5",
                              )}
                            >
                              <td className="py-3 px-4 align-middle text-center">
                                <button
                                  onClick={(e) => handlePlay(voice.preview_url, e)}
                                  className="text-muted-foreground hover:text-primary p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              </td>
                              <td className="py-3 px-4 font-medium align-middle">{voice.name}</td>

                              <td className="py-3 px-4 align-middle text-muted-foreground font-mono text-xs">{voice.voice_id}</td>
                              {activeTab === "custom-voices" && (
                                <td className="py-3 px-4 align-middle text-center">
                                  <button
                                    onClick={() => handleAddCustomVoice(voice.voice_id)}
                                    disabled={isAdding}
                                    className="p-1.5 text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
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
                              className="py-8 text-center text-muted-foreground"
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
      </PremiumPanelContent>
    </PremiumSidePanel>
  )
}
