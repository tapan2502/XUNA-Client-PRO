import React from "react"
import { cn } from "@/lib/utils"

interface PremiumFormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

/**
 * A standardized section wrapper that mimics the Hero UI Data Table aesthetic.
 * It features a card-like container with a header and structured content.
 */
export function PremiumFormSection({ title, description, children, className, action }: PremiumFormSectionProps) {
  return (
    <div className={cn("w-full bg-white dark:bg-black/20 rounded-2xl border border-divider shadow-sm overflow-hidden", className)}>
      {(title || description || action) && (
        <div className="px-6 py-4 flex items-center justify-between border-b border-divider bg-default-50/50">
          <div className="flex flex-col gap-0.5">
            {title && (
              <h3 className="text-[14px] font-bold text-foreground">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[12px] text-default-500 font-medium">
                {description}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6 flex flex-col gap-6">
        {children}
      </div>
    </div>
  )
}

interface PremiumFormGridProps {
  children: React.ReactNode
  className?: string
  columns?: 2 | 3 | 4
}

/**
 * A standardized grid wrapper for side-by-side inputs.
 */
export function PremiumFormGrid({ children, className, columns = 2 }: PremiumFormGridProps) {
  return (
    <div className={cn(
      "grid gap-5", 
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
      className
    )}>
      {children}
    </div>
  )
}

interface PremiumFormRowProps {
  children: React.ReactNode
  className?: string
}

/**
 * A standarized row wrapper for vertical spacing.
 */
export function PremiumFormRow({ children, className }: PremiumFormRowProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {children}
    </div>
  )
}
