import { Wrench, Plus } from "lucide-react"

interface ToolsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function ToolsSection({ agent, onChange }: ToolsSectionProps) {
  const toolIds = agent.conversation_config?.agent?.prompt?.tool_ids || []
  const builtInTools = agent.conversation_config?.agent?.prompt?.built_in_tools || {}

  return (
    <div className="group surface-panel p-6 space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
            <Wrench className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-base font-bold">Tools</h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 text-primary hover:from-primary/20 hover:via-yellow-500/20 hover:to-red-500/20 transition-all shadow-sm border border-primary/20">
          <Plus className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-accent/50">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 flex items-center justify-center">
          <Wrench className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No tools configured</p>
        <p className="text-xs text-muted-foreground">Add webhook tools or built-in system tools</p>
      </div>
    </div>
    // </CHANGE>
  )
}
