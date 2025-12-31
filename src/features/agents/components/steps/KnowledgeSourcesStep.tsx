import { useState } from "react"
import { Plus, FileText, LinkIcon, Upload, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { createKnowledgeBaseDocument, fetchKnowledgeBase } from "@/store/agentsSlice"
import { 
  Button, 
  Tabs,
  Tab
} from "@heroui/react"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"
import { PremiumInput } from "@/components/premium/PremiumInput"
import { SelectionCard } from "@/components/premium/SelectionCard"

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
    <div className="space-y-8">
      <PremiumFormSection 
        title="Knowledge Base" 
        description="Select documents or links that your agent should use for reference."
        action={
            <Button
                size="sm"
                color="primary"
                className="shadow-sm"
                onPress={() => setIsCreating(true)}
                startContent={<Plus size={16} />}
            >
                Add Source
            </Button>
        }
      >
        {isCreating && (
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 space-y-3 animate-in fade-in slide-in-from-top-2">
                <Tabs 
                    selectedKey={createType} 
                    onSelectionChange={(key) => setCreateType(key as "file" | "url")}
                    variant="underlined"
                    size="sm"
                    classNames={{
                        tabList: "p-0 gap-4 border-b border-gray-200 dark:border-gray-800 w-full",
                        cursor: "bg-primary w-full",
                        tab: "px-0 pb-2 h-auto text-gray-500 data-[selected=true]:text-primary font-medium",
                        tabContent: "group-data-[selected=true]:text-primary"
                    }}
                >
                    <Tab key="file" title="Upload File" />
                    <Tab key="url" title="Add URL" />
                </Tabs>

                {createType === "url" ? (
                    <PremiumInput
                        placeholder="https://example.com/document"
                        value={url}
                        onValueChange={setUrl}
                        icon={<LinkIcon size={18} />}
                    />
                ) : (
                    <div className="relative group">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <label 
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:border-primary/50 transition-all"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-primary transition-colors">
                                <Upload className="w-8 h-8 mb-3" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold text-gray-700 dark:text-gray-200">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-400">
                                    {file ? file.name : "PDF, TXT, DOCX up to 10MB"}
                                </p>
                            </div>
                        </label>
                    </div>
                )}

                {error && <p className="text-xs text-danger font-medium">{error}</p>}

                <div className="flex items-center gap-2 justify-end pt-2">
                    <Button
                        size="sm"
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
                        size="sm"
                        color="primary"
                        className="shadow-sm"
                        onPress={handleCreate}
                        isLoading={isLoading}
                    >
                        Add to Library
                    </Button>
                </div>
            </div>
        )}

      {knowledgeBase.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-8 text-center bg-gray-50/50 dark:bg-gray-900/20">
          <p className="text-sm text-gray-500">
            No documents in your library. Add one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {knowledgeBase.map((doc) => (
            <SelectionCard
                key={doc.id}
                title={doc.name}
                description={`${doc.type.toUpperCase()}`}
                icon={doc.type === "file" ? <FileText size={20} /> : <LinkIcon size={20} />}
                isSelected={selectedDocuments.includes(doc.id)}
                onClick={() => toggleDocument(doc.id)}
                className="py-3"
            />
          ))}
        </div>
      )}
      </PremiumFormSection>
    </div>
  )
}
