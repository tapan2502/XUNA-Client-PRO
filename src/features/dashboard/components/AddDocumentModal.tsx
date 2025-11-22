import { useState, useRef } from "react"
import { useAppDispatch } from "@/app/hooks"
import { createKnowledgeBaseDocument } from "@/store/agentsSlice"
import { X, Upload, Link, FileText, Loader2 } from "lucide-react"

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

  if (!isOpen) return null

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
      await dispatch(createKnowledgeBaseDocument({
        type: activeTab,
        url: activeTab === "url" ? url : undefined,
        file: activeTab === "file" ? file! : undefined
      })).unwrap()
      
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <div className="p-1.5 bg-brand-gradient rounded-lg">
              <div className="w-4 h-4 border-2 border-white rounded-full" />
            </div>
            <h2 className="font-semibold text-lg">Add to Knowledge Base</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("file")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
                activeTab === "file"
                  ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-600 text-gray-900 dark:text-gray-100"
                  : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Upload size={18} />
              <span className="font-medium">Upload File</span>
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
                activeTab === "url"
                  ? "border-[#3b82f6] bg-blue-50 dark:bg-blue-900/20 text-[#3b82f6] ring-1 ring-[#3b82f6]"
                  : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Link size={18} />
              <span className="font-medium">Add URL</span>
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {activeTab === "file" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">File</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
                    Choose file
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {file ? file.name : "No file chosen"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Supported formats: PDF, DOC, DOCX, TXT</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/document"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || (activeTab === "file" && !file) || (activeTab === "url" && !url)}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-gradient rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Add Document
          </button>
        </div>
      </div>
    </div>
  )
}
