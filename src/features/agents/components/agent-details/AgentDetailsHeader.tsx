"use client"

import { ArrowLeft, Bot } from "lucide-react"

interface AgentDetailsHeaderProps {
  agent: any
  onBack: () => void
}

export function AgentDetailsHeader({ agent, onBack }: AgentDetailsHeaderProps) {
  return (
    <div className="surface-panel p-6 flex items-center gap-5">
      <button
        onClick={onBack}
        className="p-3 rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--primary)_/_0.15)] transition-colors text-foreground"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4 flex-1">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--primary)_/_0.15)] dark:bg-[hsl(var(--primary)_/_0.25)] flex items-center justify-center shadow-inner">
          <Bot className="w-7 h-7 text-[hsl(var(--primary))]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{agent.name}</h1>
          <p className="text-sm text-muted-foreground">Agent ID: {agent.agent_id}</p>
        </div>
      </div>
    </div>
  )
}
