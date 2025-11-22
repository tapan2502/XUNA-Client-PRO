"use client"

import { ArrowLeft, Bot } from "lucide-react"

interface AgentDetailsHeaderProps {
  agent: any
  onBack: () => void
}

export function AgentDetailsHeader({ agent, onBack }: AgentDetailsHeaderProps) {
  return (
    <div className="surface-panel p-6 flex items-center gap-6">
      <button
        onClick={onBack}
        className="group p-3 rounded-xl bg-accent hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30 hover:shadow-sm"
      >
        <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
      </button>

      <div className="flex items-center gap-5 flex-1">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-yellow-500 to-red-500 opacity-20 blur-xl rounded-full" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-r from-primary via-yellow-500 to-red-500 flex items-center justify-center shadow-lg">
            <Bot className="w-7 h-7 text-white" />
          </div>
        </div>
        {/* </CHANGE> */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{agent.name}</h1>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-accent border border-border px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground">
              {agent.agent_id}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
