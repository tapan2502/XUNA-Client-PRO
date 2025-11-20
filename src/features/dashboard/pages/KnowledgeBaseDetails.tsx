import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { fetchKnowledgeBaseDocumentById } from "@/store/agentsSlice"
import { ArrowLeft, FileText, ExternalLink, Code, Bot, Loader2 } from "lucide-react"

export default function KnowledgeBaseDetails() {
  const { documentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showRawHtml, setShowRawHtml] = useState(false)

  useEffect(() => {
    if (documentId) {
      dispatch(fetchKnowledgeBaseDocumentById(documentId))
        .unwrap()
        .then((data) => {
          setDocument(data)
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [documentId, dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#65a30d]" />
      </div>
    )
  }

  if (!document) {
    return <div className="p-8 text-center">Document not found</div>
  }

  return (
    <div className="flex flex-col h-full p-6 max-w-7xl mx-auto w-full text-foreground gap-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/dashboard/knowledge-base")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        <span>Back to Knowledge Base</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          {/* Header Card */}
          <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              document.type === 'url' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'bg-[#ecfccb] text-[#65a30d] dark:bg-[#365314] dark:text-[#ecfccb]'
            }`}>
              {document.type === 'url' ? <ExternalLink size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{document.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type:</span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-xs font-medium capitalize text-foreground">
                  {document.type}
                </span>
              </div>
            </div>
          </div>

          {/* Content Viewer */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-medium text-sm">Document Content</h3>
              <button 
                onClick={() => setShowRawHtml(!showRawHtml)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Code size={14} />
                <span>{showRawHtml ? "Show Preview" : "Show Raw HTML"}</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-950/50">
              {showRawHtml ? (
                <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                  {document.extracted_inner_html}
                </pre>
              ) : (
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: document.extracted_inner_html }} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Connected Agents */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-medium text-sm">Connected Agents</h3>
              <span className="px-2 py-0.5 bg-[#65a30d]/10 text-[#65a30d] text-[10px] font-bold rounded uppercase">
                0 Total
              </span>
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Bot size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">No agents connected</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                  This document is not being used by any agents yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
