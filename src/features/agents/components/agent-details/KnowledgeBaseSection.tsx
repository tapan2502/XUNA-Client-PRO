"use client"

import { BookOpen, Plus, X, Search } from "lucide-react"
import type { KnowledgeBaseDocument } from "@/store/agentsSlice"
import { useState } from "react"

interface KnowledgeBaseSectionProps {
  agent: any
  knowledgeBase: KnowledgeBaseDocument[]
  onChange: (path: string, value: any) => void
}

export function KnowledgeBaseSection({ agent, knowledgeBase, onChange }: KnowledgeBaseSectionProps) {
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const linkedDocs = agent.conversation_config?.agent?.prompt?.knowledge_base || []

  const filteredDocs = knowledgeBase.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddDocuments = () => {
    const newDocs = [...new Set([...linkedDocs, ...selectedDocs])]
    onChange("conversation_config.agent.prompt.knowledge_base", newDocs)
    setShowModal(false)
    setSelectedDocs([])
    setSearchQuery("")
  }

  const handleRemoveDocument = (docId: string) => {
    const newDocs = linkedDocs.filter((id: string) => id !== docId)
    onChange("conversation_config.agent.prompt.knowledge_base", newDocs)
  }

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }


  return (
    <>
      <div className="group surface-panel p-6 space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gradient/5 hover:border-brand-gradient/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-gradient/10 group-hover:bg-brand-gradient/20 transition-colors">
              <BookOpen className="w-5 h-5 text-transparent bg-clip-text bg-brand-gradient" />
            </div>
            <h3 className="font-bold tracking-tight text-foreground">Knowledge Base Documents</h3>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-gradient text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-brand-gradient/20 hover:shadow-brand-gradient/30"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        </div>

        {linkedDocs.length === 0 ? (
          <div className="surface-subtle text-center py-12 border-dashed border-2 border-border/50 rounded-xl">
            <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No knowledge base documents found.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-[#ff6b6b] hover:underline mt-2 font-medium"
            >
              Add documents to knowledge base
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {linkedDocs.map((docId: string) => {
              const doc = knowledgeBase.find((d) => d.id === docId)
              return (
                <div
                  key={docId}
                  className="surface-subtle p-4 flex items-center justify-between hover:border-brand-gradient/30 transition-all duration-300 rounded-xl group/item"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-gradient/5 group-hover/item:bg-brand-gradient/10 flex items-center justify-center transition-colors">
                      <BookOpen className="w-5 h-5 text-transparent bg-clip-text bg-brand-gradient" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc?.name || docId}</p>
                      <p className="text-xs text-muted-foreground">{doc?.type || "Document"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDocument(docId)}
                    className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowModal(false)
            setSelectedDocs([])
            setSearchQuery("")
          }}
        >
          <div
            className="surface-panel rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh] border-brand-gradient/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">Add Knowledge Base Documents</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select documents to add to your agent's knowledge base
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedDocs([])
                  setSearchQuery("")
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2.5 bg-accent/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gradient/20 focus:border-brand-gradient/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">
                      {searchQuery ? "No documents found" : "No documents available"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchQuery ? "Try a different search term" : "Upload documents to get started"}
                    </p>
                  </div>
                ) : (
                  filteredDocs.map((doc) => {
                    const isLinked = linkedDocs.includes(doc.id)
                    const isSelected = selectedDocs.includes(doc.id)
                    const stateClasses = isLinked
                      ? "surface-subtle opacity-60 cursor-not-allowed"
                      : isSelected
                        ? "border-2 border-[#ff6b6b] bg-brand-gradient/5"
                        : "surface-subtle border-2 border-transparent hover:border-brand-gradient/30 hover:bg-accent/70"

                    return (
                      <button
                        key={doc.id}
                        onClick={() => !isLinked && toggleDocSelection(doc.id)}
                        disabled={isLinked}
                        className={`w-full p-4 rounded-lg flex items-center justify-between text-left transition-all duration-200 ${stateClasses}`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-brand-gradient text-white shadow-lg shadow-brand-gradient/20"
                                : "bg-accent text-muted-foreground"
                            }`}
                          >
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>

                        {isLinked && (
                          <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded">
                            Already Added
                          </span>
                        )}

                        {isSelected && !isLinked && (
                          <div className="w-5 h-5 rounded-full bg-brand-gradient flex items-center justify-center shadow-sm">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-accent/20 flex items-center justify-between rounded-b-xl">
              <p className="text-sm text-muted-foreground">
                {selectedDocs.length > 0 ? `${selectedDocs.length} document(s) selected` : "No documents selected"}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedDocs([])
                    setSearchQuery("")
                  }}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDocuments}
                  disabled={selectedDocs.length === 0}
                  className="px-6 py-2 text-sm font-medium bg-brand-gradient text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-gradient/20"
                >
                  Add {selectedDocs.length > 0 && `(${selectedDocs.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
