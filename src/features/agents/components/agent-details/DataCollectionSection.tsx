"use client"

import { Database, Plus, Trash2 } from "lucide-react"

interface DataCollectionSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function DataCollectionSection({ agent, onChange }: DataCollectionSectionProps) {
  const dataCollection = agent.platform_settings?.data_collection || {}
  const variables = Object.entries(dataCollection)

  const handleAddVariable = () => {
    const newVarName = `variable_${variables.length + 1}`
    onChange(`platform_settings.data_collection.${newVarName}`, {
      type: "string",
      description: "",
    })
  }

  const handleDeleteVariable = (varName: string) => {
    const newDataCollection = { ...dataCollection }
    delete newDataCollection[varName]
    onChange("platform_settings.data_collection", newDataCollection)
  }

  return (
    <div className="surface-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="font-medium">Data Collection Variables</h3>
        </div>
        <button
          onClick={handleAddVariable}
          className="surface-badge flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg font-medium hover:bg-[hsl(var(--primary)_/_0.18)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Variable
        </button>
      </div>

      {variables.length === 0 ? (
        <div className="surface-subtle text-center py-8 border-dashed">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No data collection variables configured</p>
        </div>
      ) : (
        <div className="space-y-3">
          {variables.map(([varName, varConfig]: [string, any]) => (
            <div key={varName} className="surface-subtle p-4 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={varName}
                  className="font-mono text-sm bg-transparent border-none focus:outline-none text-foreground"
                  readOnly
                />
                <button
                  onClick={() => handleDeleteVariable(varName)}
                  className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                  <select
                    value={varConfig.type}
                    onChange={(e) => onChange(`platform_settings.data_collection.${varName}.type`, e.target.value)}
                    className="w-full px-3 py-2 bg-[hsl(var(--accent))] border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)_/_0.3)] focus:border-[hsl(var(--primary)_/_0.4)] transition-all"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="integer">Integer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                  <input
                    type="text"
                    value={varConfig.description || ""}
                    onChange={(e) =>
                      onChange(`platform_settings.data_collection.${varName}.description`, e.target.value)
                    }
                    className="w-full px-3 py-2 bg-[hsl(var(--accent))] border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)_/_0.3)] focus:border-[hsl(var(--primary)_/_0.4)] transition-all"
                    placeholder="Variable description"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
