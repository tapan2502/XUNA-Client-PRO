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
      size="lg"
      backdrop="transparent"
      hideCloseButton
      classNames={{
        base: "max-w-[650px] border-l border-default-200 shadow-2xl",
        header: "border-b border-default-100 px-6 py-4",
        body: "px-6 py-6 overflow-y-auto",
        footer: "border-t border-default-100 px-6 py-4"
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            {editingTool ? <Settings size={20} /> : <Plus size={20} />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-default-900">
              {editingTool ? "Edit Tool" : "Add Tool"}
            </h3>
            <p className="text-sm text-default-500">
              {editingTool ? "Edit the selected tool configuration" : "Add a tool to your agent"}
            </p>
          </div>
          <Button 
            isIconOnly 
            variant="light" 
            size="sm" 
            onPress={onClose}
            className="text-default-400 hover:text-default-600"
          >
            <X size={20} />
          </Button>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Tool Name"
                  placeholder="e.g. get_weather"
                  value={name}
                  onValueChange={setName}
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                  classNames={{
                    label: "text-sm font-semibold text-default-900 mb-1.5",
                    input: "text-sm"
                  }}
                />
                <Input
                  label="Timeout (sec)"
                  type="number"
                  value={timeout.toString()}
                  onValueChange={(v) => setTimeout(parseInt(v) || 20)}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    label: "text-sm font-semibold text-default-900 mb-1.5",
                    input: "text-sm"
                  }}
                />
              </div>

              <div className="pt-3">
                <Textarea
                  label="Description"
                  placeholder="Describe what this tool does in detail..."
                  value={description}
                  onValueChange={setDescription}
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                  minRows={2}
                  classNames={{
                    label: "text-sm font-semibold text-default-900 mb-1.5",
                    input: "text-sm"
                  }}
                />
              </div>

              <div className="pt-3">
                <Input
                  label="Webhook URL"
                  placeholder="https://api.example.com/webhook"
                  value={url}
                  onValueChange={setUrl}
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                  classNames={{
                    label: "text-sm font-semibold text-default-900 mb-1.5",
                    input: "text-sm"
                  }}
                />
              </div>

              <div className="space-y-2.5 pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-default-900">Request Body Schema</label>
                  <Button 
                    variant="flat" 
                    size="sm" 
                    color="primary" 
                    className="h-7 text-xs font-semibold px-3"
                    onPress={onSampleModalOpen}
                  >
                    Load Sample
                  </Button>
                </div>
                <div className="border border-default-200 rounded-xl overflow-hidden">
                    <Textarea
                    value={requestBody}
                    onValueChange={setRequestBody}
                    variant="flat"
                    minRows={8}
                    classNames={{
                        input: "font-mono text-xs bg-default-50/50 p-3",
                        inputWrapper: "shadow-none bg-transparent"
                    }}
                    />
                </div>
                <p className="text-xs text-default-400">Define the JSON schema for the request body.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                    <Textarea
                    label="Description"
                    placeholder="Describe the purpose of this transfer..."
                    value={description}
                    onValueChange={setDescription}
                    variant="bordered"
                    labelPlacement="outside"
                    minRows={2}
                    classNames={{
                        label: "text-sm font-semibold text-default-900 mb-1.5",
                        input: "text-sm"
                    }}
                    />
                 </div>
              </div>

              <div className="border border-default-200 rounded-xl p-5 bg-default-50/30 space-y-5">
                <div className="flex items-center justify-between border-b border-default-200 pb-3">
                  <span className="text-sm font-bold text-default-900 flex items-center gap-2">
                    <PhoneForwarded size={16} className="text-primary" />
                    Transfer Configuration
                  </span>
                  <div className="w-32">
                     <Input
                        label="Timeout (sec)"
                        type="number"
                        size="sm"
                        value={timeout.toString()}
                        onValueChange={(v) => setTimeout(parseInt(v) || 20)}
                        variant="bordered"
                        labelPlacement="outside-left"
                        classNames={{
                            label: "text-xs font-medium text-default-600 pr-2",
                            input: "text-xs"
                        }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <Select
                        label="Target Agent"
                        placeholder="Select destination agent"
                        selectedKeys={targetAgentId ? [targetAgentId] : []}
                        onSelectionChange={(keys) => setTargetAgentId(Array.from(keys)[0] as string)}
                        variant="bordered"
                        labelPlacement="outside"
                        isRequired
                        classNames={{
                        label: "text-sm font-semibold text-default-900 mb-1.5"
                        }}
                    >
                        {agents.map((a: any) => (
                        <SelectItem key={a.agent_id} textValue={a.name}>
                            {a.name}
                        </SelectItem>
                        ))}
                    </Select>

                    <Input
                        label="Transfer Condition"
                        placeholder="e.g. User asks to speak with a human agent"
                        value={transferCondition}
                        onValueChange={setTransferCondition}
                        variant="bordered"
                        labelPlacement="outside"
                        isRequired
                        classNames={{
                        label: "text-sm font-semibold text-default-900 mb-1.5",
                        input: "text-sm"
                        }}
                    />

                    <div className="grid grid-cols-2 gap-4 items-start">
                        <Input
                            label="Pre-transfer Delay (ms)"
                            type="number"
                            value={delay.toString()}
                            onValueChange={(v) => setDelay(parseInt(v) || 0)}
                            variant="bordered"
                            labelPlacement="outside"
                            classNames={{
                                label: "text-sm font-semibold text-default-900 mb-1.5",
                                input: "text-sm"
                            }}
                        />
                         <div className="pt-7">
                            <Checkbox 
                                isSelected={enableFirstMessage}
                                onValueChange={setEnableFirstMessage}
                                classNames={{ label: "text-sm text-default-700" }}
                            >
                                Enable first message
                            </Checkbox>
                        </div>
                    </div>
                    
                    <Textarea
                        label="Transfer Message (Optional)"
                        placeholder="e.g. Connecting you to a specialist now..."
                        value={transferMessage}
                        onValueChange={setTransferMessage}
                        variant="bordered"
                        labelPlacement="outside"
                        minRows={2}
                        classNames={{
                        label: "text-sm font-semibold text-default-900 mb-1.5",
                        input: "text-sm"
                        }}
                    />
                </div>
              </div>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter className="px-6 py-4 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-divider">
          <Button variant="light" onPress={onClose} className="font-medium">
            Cancel
          </Button>
          <Button 
            className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
            color="primary"
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
