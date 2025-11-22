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
    <div className="group surface-panel p-6 space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-yellow-500/20 to-red-500/20">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-base font-bold">Data Collection Variables</h3>
        </div>
        <button
          onClick={handleAddVariable}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 text-primary hover:from-primary/20 hover:via-yellow-500/20 hover:to-red-500/20 transition-all shadow-sm border border-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Variable
        </button>
      </div>

      {variables.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-accent/50">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-r from-primary/10 via-yellow-500/10 to-red-500/10 flex items-center justify-center">
            <Database className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No data collection variables configured</p>
        </div>
      ) : (
        <div className="space-y-3">
          {variables.map(([varName, varConfig]: [string, any]) => (
            <div
              key={varName}
              className="p-4 space-y-3 border-2 border-border rounded-xl bg-accent/50 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={varName}
                  className="font-mono text-sm bg-transparent border-none focus:outline-none text-foreground font-medium"
                  readOnly
                />
                <button
                  onClick={() => handleDeleteVariable(varName)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Type</label>
                  <select
                    value={varConfig.type}
                    onChange={(e) => onChange(`platform_settings.data_collection.${varName}.type`, e.target.value)}
                    className="w-full px-3 py-2.5 bg-background border-2 border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="integer">Integer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Description</label>
                  <input
                    type="text"
                    value={varConfig.description || ""}
                    onChange={(e) =>
                      onChange(`platform_settings.data_collection.${varName}.description`, e.target.value)
                    }
                    className="w-full px-3 py-2.5 bg-background border-2 border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Variable description"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    // </CHANGE>
  )
}
