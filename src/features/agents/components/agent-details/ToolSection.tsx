import { Wrench, Plus } from "lucide-react"

interface ToolsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function ToolsSection({ agent, onChange }: ToolsSectionProps) {
  const toolIds = agent.conversation_config?.agent?.prompt?.tool_ids || []
  const builtInTools = agent.conversation_config?.agent?.prompt?.built_in_tools || {}

  return (
    <div className="surface-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="font-medium">Tools</h3>
        </div>
        <button className="surface-badge flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg font-medium hover:bg-[hsl(var(--primary)_/_0.18)] transition-colors">
          <Plus className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      <div className="surface-subtle text-center py-8 border-dashed">
        <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No tools configured</p>
        <p className="text-xs text-muted-foreground mt-1">Add webhook tools or built-in system tools</p>
      </div>
    </div>
  )
}
