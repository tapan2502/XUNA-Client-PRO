"use client"

import { AnimatePresence, motion } from "framer-motion"

interface FullscreenLoaderProps {
  show: boolean
  label?: string
}

export function FullscreenLoader({ show, label = "Loading" }: FullscreenLoaderProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(var(--background)_/_0.6)] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-8 py-6 shadow-lg shadow-[hsl(var(--foreground)/0.12)]"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="h-10 w-10 rounded-full border-2 border-[hsl(var(--primary))]/40 border-t-[hsl(var(--primary))]"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">Hold on a moment…</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
