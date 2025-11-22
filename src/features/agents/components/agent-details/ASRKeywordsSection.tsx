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
    <div className="group surface-panel p-6 space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
          <Mic className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-base font-bold">ASR Keywords</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Enter keywords to improve speech recognition accuracy.
      </p>

      <input
        type="text"
        value={keywords.join(", ")}
        onChange={handleKeywordsChange}
        placeholder="Enter keywords, separated by commas"
        className="w-full px-4 py-3 bg-accent border-2 border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
      />
    </div>
    // </CHANGE>
  )
}
