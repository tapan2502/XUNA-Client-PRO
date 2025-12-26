"use client"

import { useState } from "react"
import { BookOpen, Plus, X, Search } from "lucide-react"
import { Card, CardBody, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip } from "@heroui/react"
import type { KnowledgeBaseDocument } from "@/store/agentsSlice"

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

  const filteredDocs = (knowledgeBase || []).filter((doc) => (doc?.name || "").toLowerCase().includes(searchQuery.toLowerCase()))

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
      <Card shadow="sm" className="border border-default-200">
        <CardBody className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-default-700">Knowledge Base Documents</h3>
            </div>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={() => setShowModal(true)}
              startContent={<Plus size={16} />}
            >
              Add Document
            </Button>
          </div>

          {linkedDocs.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-default-200 rounded-lg">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-default-300" />
              <p className="text-small text-default-500 mb-2">No knowledge base documents found</p>
              <Button size="sm" variant="light" color="primary" onPress={() => setShowModal(true)}>
                Add documents to knowledge base
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {linkedDocs.map((docId: string) => {
                const doc = knowledgeBase.find((d) => d.id === docId)
                return (
                  <Card key={docId} shadow="sm" className="border border-default-200">
                    <CardBody className="p-3 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{doc?.name || docId}</p>
                          <p className="text-tiny text-default-400">{doc?.type || "Document"}</p>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleRemoveDocument(docId)}
                      >
                        <X size={16} />
                      </Button>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-bold">Add Knowledge Base Documents</h3>
            <p className="text-small text-default-400 font-normal">
              Select documents to add to your agent's knowledge base
            </p>
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Search size={16} />}
              variant="bordered"
              className="mb-4"
            />

            <div className="space-y-2">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-default-300 mx-auto mb-3" />
                  <p className="text-small font-medium">
                    {searchQuery ? "No documents found" : "No documents available"}
                  </p>
                  <p className="text-tiny text-default-400 mt-1">
                    {searchQuery ? "Try a different search term" : "Upload documents to get started"}
                  </p>
                </div>
              ) : (
                filteredDocs.map((doc) => {
                  const isLinked = linkedDocs.includes(doc.id)
                  const isSelected = selectedDocs.includes(doc.id)

                  return (
                    <Card
                      key={doc.id}
                      isPressable={!isLinked}
                      isDisabled={isLinked}
                      onPress={() => !isLinked && toggleDocSelection(doc.id)}
                      className={
                        isLinked
                          ? "opacity-60"
                          : isSelected
                            ? "border-2 border-primary"
                            : "border border-default-200"
                      }
                    >
                      <CardBody className="p-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? "bg-primary text-white" : "bg-default-100"
                            }`}
                          >
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-tiny text-default-400">{doc.type}</p>
                          </div>
                        </div>

                        {isLinked && (
                          <Chip size="sm" variant="flat">
                            Already Added
                          </Chip>
                        )}

                        {isSelected && !isLinked && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  )
                })
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <p className="text-small text-default-400 mr-auto">
              {selectedDocs.length > 0 ? `${selectedDocs.length} document(s) selected` : "No documents selected"}
            </p>
            <Button variant="light" onPress={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddDocuments} isDisabled={selectedDocs.length === 0}>
              Add {selectedDocs.length > 0 && `(${selectedDocs.length})`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
