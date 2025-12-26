"use client"
import { useState, useEffect } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react"
import { Plus, Settings, X, Globe, PhoneForwarded } from "lucide-react"

interface ToolConfigDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (tool: any) => void
  editingTool?: any
  agents: any[]
}

export function ToolConfigDialog({ isOpen, onClose, onSave, editingTool, agents }: ToolConfigDialogProps) {
  const [toolType, setToolType] = useState<"webhook" | "system">("webhook")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [timeout, setTimeout] = useState(20)
  
  // Webhook specific
  const [url, setUrl] = useState("")
  const [requestBody, setRequestBody] = useState('{\n  "type": "object",\n  "properties": {},\n  "required": []\n}')
  
  // System specific (transfer_to_agent)
  const [systemToolType, setSystemToolType] = useState("transfer_to_agent")
  const [targetAgentId, setTargetAgentId] = useState("")
  const [transferCondition, setTransferCondition] = useState("")
  const [delay, setDelay] = useState(0)
  const [transferMessage, setTransferMessage] = useState("")
  const [enableFirstMessage, setEnableFirstMessage] = useState(false)

  useEffect(() => {
    if (editingTool) {
      setName(editingTool.name || "")
      setDescription(editingTool.description || "")
      setTimeout(editingTool.response_timeout_secs || 20)
      
      if (editingTool.type === "system") {
        setToolType("system")
        const params = editingTool.params || {}
        setSystemToolType(params.system_tool_type || "transfer_to_agent")
        if (params.transfers?.[0]) {
          const t = params.transfers[0]
          setTargetAgentId(t.agent_id || "")
          setTransferCondition(t.condition || "")
          setDelay(t.delay_ms || 0)
          setTransferMessage(t.transfer_message || "")
          setEnableFirstMessage(t.enable_transferred_agent_first_message || false)
        }
      } else {
        setToolType("webhook")
        setUrl(editingTool.api_schema?.url || "")
        setRequestBody(JSON.stringify(editingTool.api_schema?.request_body_schema || { type: "object", properties: {}, required: [] }, null, 2))
      }
    } else {
      resetForm()
    }
  }, [editingTool, isOpen])

  const resetForm = () => {
    setName("")
    setDescription("")
    setTimeout(20)
    setUrl("")
    setRequestBody('{\n  "type": "object",\n  "properties": {},\n  "required": []\n}')
    setTargetAgentId("")
    setTransferCondition("")
    setDelay(0)
    setTransferMessage("")
    setEnableFirstMessage(false)
    setToolType("webhook")
  }

  const { 
    isOpen: isSampleModalOpen, 
    onOpen: onSampleModalOpen, 
    onOpenChange: onSampleModalOpenChange 
  } = useDisclosure()

  const sampleSchema = {
    type: "object",
    properties: {
      new_time: {
        type: "string",
        description: "The new time"
      },
      Laptop: {
        type: "object",
        properties: {
          Screen_size: {
            type: "string",
            description: "Size of the screen"
          },
          operating_system: {
            type: "string",
            description: "Version of the OS"
          }
        }
      },
      new_date: {
        type: "string",
        description: "The new booking date"
      },
      country_user: {
        type: "array",
        items: {
          type: "string",
          description: "Interests"
        },
        description: "User's interests"
      }
    },
    required: ["new_time", "Laptop", "new_date", "country_user"],
    description: "Type of parameters from the transcript"
  }

  const handleUseSchema = () => {
    setRequestBody(JSON.stringify(sampleSchema, null, 2))
    onSampleModalOpenChange()
  }

  const handleSave = () => {
    let toolPayload: any = {
      name: toolType === "system" ? "transfer_to_agent" : name,
      description,
      response_timeout_secs: timeout,
      type: toolType,
    }

    if (toolType === "system") {
      toolPayload.params = {
        system_tool_type: systemToolType,
        transfers: [
          {
            agent_id: targetAgentId,
            condition: transferCondition,
            delay_ms: delay,
            transfer_message: transferMessage,
            enable_transferred_agent_first_message: enableFirstMessage,
          }
        ]
      }
    } else {
      toolPayload.api_schema = {
        url,
        method: "POST",
        request_body_schema: JSON.parse(requestBody || "{}")
      }
    }

    onSave(toolPayload)
    onClose()
  }

  return (
    <>
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose}
      placement="right"
      size="md"
      backdrop="transparent"
      classNames={{
        base: "max-w-[500px] border-l border-default-200 shadow-2xl",
        header: "border-b-0 pb-0",
        body: "py-6",
        footer: "border-t border-default-100"
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-4 px-6 pt-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editingTool ? "bg-blue-50 text-blue-600" : "bg-blue-50 text-blue-600"}`}>
            {editingTool ? <Settings size={20} /> : <Plus size={20} />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-default-900 leading-tight">
              {editingTool ? "Edit Tool" : "Add Tool"}
            </h3>
            <p className="text-tiny text-default-500 font-normal">
              {editingTool ? "Edit the selected tool configuration" : "Add a tool to your agent"}
            </p>
          </div>
          <Button isIconOnly variant="light" size="sm" onPress={onClose} className="rounded-full">
            <X size={20} className="text-default-400" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-6 space-y-7">
          {/* Tool Type Selection */}
          <div className="space-y-2">
            <label className="text-small font-bold text-default-900">Tool Type</label>
            <Select
              selectedKeys={[toolType]}
              onSelectionChange={(keys) => setToolType(Array.from(keys)[0] as any)}
              variant="bordered"
              className="w-full"
              disallowEmptySelection
              isDisabled={!!editingTool}
            >
              <SelectItem key="webhook" startContent={<Plus size={16} />} textValue="Add New Tool">
                Add New Tool
              </SelectItem>
              <SelectItem key="system" startContent={<Settings size={16} />} textValue="Transfer To Agent">
                Transfer To Agent
              </SelectItem>
            </Select>

            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
              <p className="text-tiny text-blue-600 dark:text-blue-400">
                {toolType === "webhook" 
                  ? "Create a new custom tool with your own configuration." 
                  : "This is a built-in system tool with predefined functionality."}
              </p>
            </div>
          </div>

          {toolType === "webhook" ? (
            <div className="space-y-6">
              <Input
                label="Tool Name"
                placeholder="Enter tool name (letters, numbers, hyphens, underscores only)"
                value={name}
                onValueChange={setName}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                description="Format: letters, numbers, hyphens, and underscores only (1-64 characters)"
              />

              <Textarea
                label="Description"
                placeholder="Describe what this tool does"
                value={description}
                onValueChange={setDescription}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                minRows={3}
              />

              <Input
                label="Webhook URL"
                placeholder="https://your-webhook-url.com"
                value={url}
                onValueChange={setUrl}
                variant="bordered"
                labelPlacement="outside"
                isRequired
              />

              <Input
                label="Response Timeout (seconds)"
                type="number"
                value={timeout.toString()}
                onValueChange={(v) => setTimeout(parseInt(v) || 20)}
                variant="bordered"
                labelPlacement="outside"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-small font-bold text-default-900">Request Body Schema</label>
                  <Button 
                    variant="light" 
                    size="sm" 
                    color="primary" 
                    className="p-0 h-auto font-bold text-tiny"
                    onPress={onSampleModalOpen}
                  >
                    View Sample Schema
                  </Button>
                </div>
                <p className="text-tiny text-default-400">Define the structure of the request body in JSON format</p>
                <Textarea
                  value={requestBody}
                  onValueChange={setRequestBody}
                  variant="bordered"
                  rows={8}
                  classNames={{
                    input: "font-mono text-xs p-4 bg-default-50/50"
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Textarea
                label="Description"
                placeholder="Describe what this tool does"
                value={description}
                onValueChange={setDescription}
                variant="bordered"
                labelPlacement="outside"
                minRows={3}
              />

              <Input
                label="Response Timeout (seconds)"
                type="number"
                value={timeout.toString()}
                onValueChange={(v) => setTimeout(parseInt(v) || 20)}
                variant="bordered"
                labelPlacement="outside"
              />

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-small font-bold text-default-900">Transfer Configuration</span>
                </div>

                <Select
                  label="Target Agent"
                  placeholder="Select an agent"
                  selectedKeys={targetAgentId ? [targetAgentId] : []}
                  onSelectionChange={(keys) => setTargetAgentId(Array.from(keys)[0] as string)}
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                >
                  {agents.map((a: any) => (
                    <SelectItem key={a.agent_id} textValue={a.name}>
                      {a.name} ({a.agent_id})
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Transfer Condition"
                  placeholder="e.g. When user asks for technical support"
                  value={transferCondition}
                  onValueChange={setTransferCondition}
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                />

                <Input
                  label="Delay (milliseconds)"
                  type="number"
                  value={delay.toString()}
                  onValueChange={(v) => setDelay(parseInt(v) || 0)}
                  variant="bordered"
                  labelPlacement="outside"
                />

                <Textarea
                  label="Transfer Message"
                  placeholder="Optional message to play before transfer"
                  value={transferMessage}
                  onValueChange={setTransferMessage}
                  variant="bordered"
                  labelPlacement="outside"
                  minRows={2}
                />

                <Checkbox 
                  isSelected={enableFirstMessage}
                  onValueChange={setEnableFirstMessage}
                  classNames={{ label: "text-small font-bold" }}
                >
                  Enable transferred agent first message
                </Checkbox>
              </div>

              {editingTool && (
                <div className="space-y-4 pt-4">
                  <p className="text-tiny text-default-400 italic">The following fields are system-defined and cannot be modified:</p>
                  <Input
                    label="Name"
                    value="transfer_to_agent"
                    variant="bordered"
                    labelPlacement="outside"
                    isDisabled
                  />
                  <Input
                    label="Type"
                    value="system"
                    variant="bordered"
                    labelPlacement="outside"
                    isDisabled
                  />
                  <Input
                    label="System Tool Type"
                    value="transfer_to_agent"
                    variant="bordered"
                    labelPlacement="outside"
                    isDisabled
                  />
                </div>
              )}
            </div>
          )}
        </DrawerBody>

        <DrawerFooter className="px-6 py-4">
          <Button variant="light" onPress={onClose} className="font-bold">
            Cancel
          </Button>
          <Button 
            className="bg-blue-600 text-white font-bold"
            onPress={handleSave}
            isDisabled={toolType === "webhook" ? (!name || !url) : !targetAgentId}
          >
            {editingTool ? "Save Changes" : "Add Tool"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
      </Drawer>

      <Modal 
        isOpen={isSampleModalOpen} 
        onOpenChange={onSampleModalOpenChange}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[80vh]",
          header: "border-b border-default-100",
          footer: "border-t border-default-100"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">Sample Schema</h3>
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="bg-default-50 rounded-xl p-6 border border-default-100">
                  <pre className="font-mono text-sm overflow-auto max-h-[400px]">
                    {JSON.stringify(sampleSchema, null, 2)}
                  </pre>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="font-bold">
                  Close
                </Button>
                <Button 
                  className="bg-blue-600 text-white font-bold" 
                  onPress={handleUseSchema}
                >
                  Use This Schema
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
