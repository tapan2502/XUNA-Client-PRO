"use client"

import { Sparkles } from "lucide-react"

interface PromptSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function PromptSection({ agent, onChange }: PromptSectionProps) {
  const prompt = agent.conversation_config?.agent?.prompt?.prompt || ""

  return (
    <div className="group surface-panel p-6 space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold">Prompt</h3>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => onChange("conversation_config.agent.prompt.prompt", e.target.value)}
        rows={10}
        className="w-full px-5 py-4 bg-accent border-2 border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 text-sm leading-relaxed placeholder:text-muted-foreground/60 shadow-sm"
        placeholder="Enter the agent's behavior and instructions..."
      />

      <p className="text-xs text-muted-foreground leading-relaxed">
        You can use dynamic variables like {`{{variable_name}}`} in your prompt. These will be replaced with actual
        values during conversations.
      </p>
    </div>
  )
}
