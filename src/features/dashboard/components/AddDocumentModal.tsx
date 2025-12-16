import { useState, useRef } from "react"
import { useAppDispatch } from "@/app/hooks"
import { createKnowledgeBaseDocument, fetchKnowledgeBase } from "@/store/agentsSlice"
import { Upload, Link, Loader2 } from "lucide-react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Tabs, Tab } from "@heroui/react"

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">Add to Knowledge Base</h3>
          <p className="text-small text-default-400 font-normal">
            Upload a file or add a URL to your knowledge base
          </p>
        </ModalHeader>
        <ModalBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as "file" | "url")}
            variant="bordered"
            classNames={{
              tabList: "w-full",
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
                  className="border-2 border-dashed border-default-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-default-50 transition-colors"
                >
                  <Upload className="w-12 h-12 text-default-400 mb-3" />
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
                <Input
                  type="url"
                  label="URL"
                  value={url}
                  onValueChange={setUrl}
                  placeholder="https://example.com/document"
                  variant="bordered"
                  startContent={<Link size={18} className="text-default-400" />}
                />
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={(activeTab === "file" && !file) || (activeTab === "url" && !url)}
            startContent={!isLoading && <Upload size={18} />}
          >
            Add Document
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
