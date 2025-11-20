import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchKnowledgeBase, deleteKnowledgeBaseDocument } from "@/store/agentsSlice"
import { useNavigate } from "react-router-dom"
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  FileText, 
  ExternalLink, 
  Trash2,
  Loader2,
  Eye
} from "lucide-react"
import AddDocumentModal from "../components/AddDocumentModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import { useSnackbar } from "@/components/ui/SnackbarProvider"

export default function KnowledgeBase() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { knowledgeBase, loading } = useAppSelector((state) => state.agents)
  const { showSnackbar } = useSnackbar()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    dispatch(fetchKnowledgeBase())
  }, [dispatch])

  const filteredDocs = knowledgeBase.filter(doc => 
    doc.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedDocId(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedDocId) return

    setIsDeleting(true)
    try {
      await dispatch(deleteKnowledgeBaseDocument(selectedDocId)).unwrap()
      showSnackbar({
        title: "Success",
        message: "Document deleted successfully",
        variant: "success",
      })
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Failed to delete document:", error)
      showSnackbar({
        title: "Error",
        message: "Failed to delete document",
        variant: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full p-6 max-w-7xl mx-auto w-full text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your documents and URLs for AI training</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#65a30d] hover:bg-[#4d7c0f] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Document</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 items-center bg-card p-1 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent focus:bg-accent/50 rounded-lg outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="h-8 w-[1px] bg-border mx-1" />
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors mr-1">
          <Filter size={16} />
          <span>All Types</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>
      </div>

      {/* Documents List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#65a30d]" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl border-dashed">
            <p>No documents found. Add one to get started.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => navigate(`/dashboard/knowledge-base/${doc.id}`)}
              className="group bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  doc.type === 'url' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'bg-[#ecfccb] text-[#65a30d] dark:bg-[#365314] dark:text-[#ecfccb]'
                }`}>
                  {doc.type === 'url' ? <ExternalLink size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{doc.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type:</span>
                    <span className="px-1.5 py-0.5 rounded bg-muted text-xs font-medium capitalize text-foreground">
                      {doc.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/dashboard/knowledge-base/${doc.id}`)
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={(e) => handleDeleteClick(e, doc.id)}
                  className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Document"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddDocumentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  )
}
