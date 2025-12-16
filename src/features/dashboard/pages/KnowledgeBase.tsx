import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchKnowledgeBase, deleteKnowledgeBaseDocument } from "@/store/agentsSlice"
import { useNavigate } from "react-router-dom"
import { FileText, ExternalLink, Trash2, Eye, Plus } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import DataTable from "@/components/hero-ui/DataTable"
import { Button, Chip } from "@heroui/react"
import AddDocumentModal from "../components/AddDocumentModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import { useSnackbar } from "@/components/ui/SnackbarProvider"

interface Column {
  uid: string
  name: string
  sortable?: boolean
}

export default function KnowledgeBase() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { knowledgeBase, loading } = useAppSelector((state) => state.agents)
  const { showSnackbar } = useSnackbar()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    dispatch(fetchKnowledgeBase())
  }, [dispatch])

  const handleDeleteClick = (id: string) => {
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

  const columns: Column[] = [
    { uid: "name", name: "Name", sortable: true },
    { uid: "type", name: "Type", sortable: true },
    { uid: "actions", name: "Actions" },
  ]

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {item.type === "url" ? (
                <ExternalLink className="w-5 h-5 text-primary" />
              ) : (
                <FileText className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <span className="font-medium text-default-foreground">{item.name}</span>
              {item.dependent_agents && item.dependent_agents.length > 0 && (
                <p className="text-tiny text-default-400">
                  {item.dependent_agents.length} agent{item.dependent_agents.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        )
      case "type":
        return (
          <Chip variant="flat" size="sm" className="capitalize">
            {item.type}
          </Chip>
        )
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => navigate(`/dashboard/knowledge-base/${item.id}`)}
            >
              <Eye size={18} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => handleDeleteClick(item.id)}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const topBarAction = (
    <Button color="primary" onPress={() => setIsAddModalOpen(true)} startContent={<Plus size={18} />}>
      Add Document
    </Button>
  )

  // Map data to ensure id property exists for DataTable
  const tableData = knowledgeBase.map(doc => ({
    ...doc,
    id: doc.id // DataTable requires id property
  }))

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <LoadingSpinner />
        </div>
      )}

      <div className="h-full p-4 w-full max-w-[95rem] mx-auto flex flex-col gap-4">
        <DataTable
          columns={columns}
          data={tableData}
          renderCell={renderCell}
          initialVisibleColumns={["name", "type", "actions"]}
          searchKeys={["name", "type"]}
          searchPlaceholder="Search documents..."
          topBarTitle="Knowledge Base"
          topBarCount={knowledgeBase.length}
          topBarAction={topBarAction}
          emptyContent="No documents found. Add one to get started."
        />

        <AddDocumentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

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
    </>
  )
}
