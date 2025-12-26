"use client"

import { Database, Plus, Trash2 } from "lucide-react"
import { Card, CardBody, Button, Input, Select, SelectItem } from "@heroui/react"

interface DataCollectionSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function DataCollectionSection({ agent, onChange }: DataCollectionSectionProps) {
  const dataCollection = agent.platform_settings?.data_collection || {}
  const variables = Object.entries(dataCollection).filter(([_, config]) => !!config)

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
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-default-700">Data Collection Variables</h3>
          </div>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={handleAddVariable}
            startContent={<Plus size={16} />}
          >
            Add Variable
          </Button>
        </div>

        {variables.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-default-200 rounded-lg">
            <Database className="w-12 h-12 mx-auto mb-2 text-default-300" />
            <p className="text-small text-default-500">No data collection variables configured</p>
          </div>
        ) : (
          <div className="space-y-3">
            {variables.map(([varName, varConfig]: [string, any]) => (
              <Card key={varName} shadow="sm" className="border border-default-200">
                <CardBody className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-small font-semibold">{varName}</span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteVariable(varName)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Type"
                      selectedKeys={[varConfig.type]}
                      onChange={(e) => onChange(`platform_settings.data_collection.${varName}.type`, e.target.value)}
                      variant="bordered"
                      size="sm"
                      labelPlacement="outside"
                    >
                      <SelectItem key="string">String</SelectItem>
                      <SelectItem key="number">Number</SelectItem>
                      <SelectItem key="boolean">Boolean</SelectItem>
                      <SelectItem key="integer">Integer</SelectItem>
                    </Select>

                    <Input
                      label="Description"
                      value={varConfig.description || ""}
                      onValueChange={(value) =>
                        onChange(`platform_settings.data_collection.${varName}.description`, value)
                      }
                      variant="bordered"
                      size="sm"
                      labelPlacement="outside"
                      placeholder="Variable description"
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
