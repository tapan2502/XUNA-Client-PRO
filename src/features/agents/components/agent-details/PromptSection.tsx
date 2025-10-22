"use client"

import { Sparkles } from "lucide-react"

interface PromptSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function PromptSection({ agent, onChange }: PromptSectionProps) {
  const prompt = agent.conversation_config?.agent?.prompt?.prompt || ""

  return (
    <div className="surface-panel p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[hsl(var(--primary))]" />
        <h3 className="font-medium">Prompt</h3>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => onChange("conversation_config.agent.prompt.prompt", e.target.value)}
        rows={8}
        className="w-full px-4 py-3 bg-[hsl(var(--accent))] border border-transparent rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)_/_0.3)] focus:border-[hsl(var(--primary)_/_0.4)] transition-all text-sm leading-relaxed"
        placeholder="Enter the agent's behavior and instructions..."
      />

      <p className="text-xs text-muted-foreground">
        You can use dynamic variables like {`{{variable_name}}`} in your prompt. These will be replaced with actual
        values during conversations.
      </p>
    </div>
  )
}
