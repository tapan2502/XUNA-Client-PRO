"use client"

import { useState } from "react"
import { Plus, FileText, LinkIcon, Upload } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { createKnowledgeBaseDocument, fetchKnowledgeBase } from "@/store/agentsSlice"
import { 
  Button, 
  Input, 
  Checkbox, 
  Card, 
  CardBody,
  Tabs,
  Tab
} from "@heroui/react"

interface KnowledgeSourcesStepProps {
  selectedDocuments: string[]
  setSelectedDocuments: (docs: string[]) => void
}

export function KnowledgeSourcesStep({ selectedDocuments, setSelectedDocuments }: KnowledgeSourcesStepProps) {
  const dispatch = useAppDispatch()
  const { knowledgeBase } = useAppSelector((state) => state.agents)

  const [isCreating, setIsCreating] = useState(false)
  const [createType, setCreateType] = useState<"file" | "url">("file")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    setError("")
    if (createType === "url" && !url.trim()) {
      setError("Please enter a URL")
      return
    }
    if (createType === "file" && !file) {
      setError("Please select a file")
      return
    }

    try {
      setIsLoading(true)
      const result = await dispatch(
        createKnowledgeBaseDocument({
          type: createType,
          url: createType === "url" ? url : undefined,
          file: createType === "file" ? file : undefined,
        }),
      )

      if (createKnowledgeBaseDocument.fulfilled.match(result)) {
        setIsCreating(false)
        setUrl("")
        setFile(null)
        dispatch(fetchKnowledgeBase())
      }
    } catch (err) {
      setError("Failed to create document")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDocument = (docId: string) => {
    setSelectedDocuments(
      selectedDocuments.includes(docId)
        ? selectedDocuments.filter((id) => id !== docId)
        : [...selectedDocuments, docId],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-small font-medium text-default-700">Knowledge sources</label>
        <Button
          size="sm"
          color="primary"
          onPress={() => setIsCreating(true)}
          startContent={<Plus size={16} />}
        >
          Add Document
        </Button>
      </div>

      {isCreating && (
        <Card className="border border-default-200 shadow-none">
          <CardBody className="gap-4">
            <Tabs 
              selectedKey={createType} 
              onSelectionChange={(key) => setCreateType(key as "file" | "url")}
              variant="underlined"
              size="sm"
            >
              <Tab key="file" title="Upload File" />
              <Tab key="url" title="Add URL" />
            </Tabs>

            {createType === "url" ? (
              <Input
                label="Document URL"
                placeholder="https://example.com/document"
                value={url}
                onValueChange={setUrl}
                variant="bordered"
                labelPlacement="outside"
              />
            ) : (
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-default-300 rounded-lg cursor-pointer hover:bg-default-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-default-400" />
                    <p className="mb-2 text-sm text-default-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-default-400">
                      {file ? file.name : "PDF, TXT, DOCX up to 10MB"}
                    </p>
                  </div>
                </label>
              </div>
            )}

            {error && <p className="text-tiny text-danger">{error}</p>}

            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="light"
                onPress={() => {
                  setIsCreating(false)
                  setUrl("")
                  setFile(null)
                  setError("")
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleCreate}
                isLoading={isLoading}
              >
                Create
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {knowledgeBase.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-default-200 p-8 text-center">
          <p className="text-small text-default-500">
            No knowledge base documents yet. Add from your Knowledge page.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {knowledgeBase.map((doc) => (
            <Card 
              key={doc.id}
              isPressable
              onPress={() => toggleDocument(doc.id)}
              className={`border transition-colors ${
                selectedDocuments.includes(doc.id) 
                  ? "border-primary bg-primary-50 dark:bg-primary-900/20" 
                  : "border-default-200 bg-transparent hover:bg-default-50"
              }`}
              shadow="sm"
            >
              <CardBody className="p-3">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    isSelected={selectedDocuments.includes(doc.id)}
                    radius="full"
                    className="pointer-events-none" // Handled by Card onPress
                  />
                  <div className="p-2 rounded-lg bg-default-100">
                    {doc.type === "file" ? (
                      <FileText className="w-5 h-5 text-default-500" />
                    ) : (
                      <LinkIcon className="w-5 h-5 text-default-500" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-small font-semibold">{doc.name}</span>
                    <span className="text-tiny text-default-400 uppercase">{doc.type}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
