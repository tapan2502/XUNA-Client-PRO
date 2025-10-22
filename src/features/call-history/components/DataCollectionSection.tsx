"use client"

import { useState } from "react"
import { Database, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DataCollectionSectionProps {
  dataCollection: Record<string, any>
}

export default function DataCollectionSection({ dataCollection }: DataCollectionSectionProps) {
  const [showFullDetails, setShowFullDetails] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Database className="w-4 h-4 text-[hsl(var(--primary))]" />
        <h3 className="text-sm font-medium text-foreground">Data Collection Results</h3>
      </div>
      <div className="space-y-3">
        {Object.entries(dataCollection).map(([key, value]: [string, any]) => (
          <div key={key} className="surface-subtle p-4">
            <div className="space-y-3">
              {/* Default view */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {value.data_collection_id && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Collection ID
                    </span>
                    <p className="text-sm text-foreground font-mono">{value.data_collection_id}</p>
                  </div>
                )}
                {value.value !== undefined && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</span>
                    <p className="text-sm text-foreground">
                      {typeof value.value === "object" ? JSON.stringify(value.value, null, 2) : String(value.value)}
                    </p>
                  </div>
                )}
              </div>

              {/* Show/Hide Full Details Button */}
              <button
                onClick={() => setShowFullDetails(showFullDetails === key ? null : key)}
                className="flex items-center space-x-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)_/_0.8)] transition-colors text-sm font-medium"
              >
                {showFullDetails === key ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Hide Details</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Show Full Details</span>
                  </>
                )}
              </button>

              {/* Full Details - Collapsible */}
              <AnimatePresence>
                {showFullDetails === key && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-border">
                      <pre className="text-xs bg-[hsl(var(--accent))] p-3 rounded-lg overflow-x-auto text-muted-foreground whitespace-pre-wrap">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
