import { useState, useRef } from "react"
import { useAppDispatch } from "@/app/hooks"
import { createKnowledgeBaseDocument, fetchKnowledgeBase } from "@/store/agentsSlice"
import { Upload, Link } from "lucide-react"
import { Button, Input, Tabs, Tab } from "@heroui/react"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumInput } from "@/components/premium/PremiumInput"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"

interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddDocumentModal({ isOpen, onClose }: AddDocumentModalProps) {
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<"file" | "url">("file")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (activeTab === "file" && !file) return
    if (activeTab === "url" && !url) return

    setIsLoading(true)
    try {
      await dispatch(
        createKnowledgeBaseDocument({
          type: activeTab,
          url: activeTab === "url" ? url : undefined,
          file: activeTab === "file" ? file! : undefined,
        })
      ).unwrap()

      // Refresh the list
      dispatch(fetchKnowledgeBase())

      onClose()
      setFile(null)
      setUrl("")
    } catch (error) {
      console.error("Failed to add document:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <Button variant="light" onPress={onClose} className="font-medium">
        Cancel
      </Button>
      <Button
        color="primary"
        className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
        onPress={handleSubmit}
        isLoading={isLoading}
        isDisabled={(activeTab === "file" && !file) || (activeTab === "url" && !url)}
      >
        Add Document
      </Button>
    </div>
  )

  return (
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Knowledge Base"
      subtitle="Upload a file or add a URL to your knowledge base"
      size="lg"
      footer={footer}
    >
      <PremiumPanelContent>
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as "file" | "url")}
          variant="underlined"
          color="primary"
          classNames={{
            tabList: "w-full border-b border-gray-200 dark:border-gray-700",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-4 h-10",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          <Tab
            key="file"
            title={
              <div className="flex items-center gap-2">
                <Upload size={18} />
                <span>Upload File</span>
              </div>
            }
          >
            <div className="space-y-4 pt-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-default-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-default-50 transition-colors bg-default-50/50"
              >
                <div className="p-4 bg-default-100 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-default-500" />
                </div>
                <p className="text-sm font-medium text-default-700 mb-1">
                  {file ? file.name : "Choose a file or drag and drop"}
                </p>
                <p className="text-tiny text-default-400">
                  Supported formats: PDF, DOC, DOCX, TXT
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </div>
            </div>
          </Tab>
          <Tab
            key="url"
            title={
              <div className="flex items-center gap-2">
                <Link size={18} />
                <span>Add URL</span>
              </div>
            }
          >
            <div className="space-y-4 pt-4">
              <PremiumInput
                type="url"
                label="Document URL"
                labelPlacement="outside"
                placeholder="https://example.com/document"
                value={url}
                onValueChange={setUrl}
                startContent={<Link size={18} />}
                description="Enter the full URL of the document you want to add."
              />
            </div>
          </Tab>
        </Tabs>
      </PremiumPanelContent>
    </PremiumSidePanel>
  )
}

