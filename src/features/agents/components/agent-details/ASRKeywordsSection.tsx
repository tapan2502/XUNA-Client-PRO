"use client"

import type React from "react"

import { Mic } from "lucide-react"

interface ASRKeywordsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function ASRKeywordsSection({ agent, onChange }: ASRKeywordsSectionProps) {
  const keywords = agent.conversation_config?.asr?.keywords || []

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const keywordsArray = value
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
    onChange("conversation_config.asr.keywords", keywordsArray)
  }

  return (
    <div className="surface-panel p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Mic className="w-5 h-5 text-[hsl(var(--primary))]" />
        <h3 className="font-medium">ASR Keywords</h3>
      </div>

      <p className="text-sm text-muted-foreground">Enter keywords to improve speech recognition accuracy.</p>

      <input
        type="text"
        value={keywords.join(", ")}
        onChange={handleKeywordsChange}
        placeholder="Enter keywords, separated by commas"
        className="w-full px-4 py-3 bg-[hsl(var(--accent))] border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)_/_0.3)] focus:border-[hsl(var(--primary)_/_0.4)] transition-all"
      />
    </div>
  )
}
