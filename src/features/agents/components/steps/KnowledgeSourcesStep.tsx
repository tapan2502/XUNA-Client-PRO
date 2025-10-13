"use client"

import { useState } from "react"
import { Plus, FileText, LinkIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { createKnowledgeBaseDocument, fetchKnowledgeBase } from "@/store/agentsSlice"

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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Knowledge sources</label>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {isCreating && (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCreateType("file")}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                createType === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setCreateType("url")}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                createType === "url"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
              }`}
            >
              Add URL
            </button>
          </div>

          {createType === "url" ? (
            <input
              type="url"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="https://example.com/document"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          ) : (
            <input
              type="file"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setUrl("")
                setFile(null)
                setError("")
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {knowledgeBase.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No knowledge base documents yet. Add from your Knowledge page.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {knowledgeBase.map((doc) => (
            <label
              key={doc.id}
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <input
                type="checkbox"
                checked={selectedDocuments.includes(doc.id)}
                onChange={() => toggleDocument(doc.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center gap-3 flex-1">
                {doc.type === "file" ? (
                  <FileText className="w-5 h-5 text-gray-400" />
                ) : (
                  <LinkIcon className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{doc.type}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
