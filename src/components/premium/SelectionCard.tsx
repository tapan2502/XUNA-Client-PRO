import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectionCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  rightContent?: React.ReactNode
}

export function SelectionCard({
  title,
  description,
  icon,
  isSelected,
  onClick,
  disabled,
  className,
  rightContent
}: SelectionCardProps) {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.01, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "relative flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-all duration-200",
        "bg-white dark:bg-black/20 shadow-sm",
        isSelected
          ? "border-primary ring-1 ring-primary bg-primary/5 shadow-md shadow-primary/5"
          : "border-divider hover:border-default-400",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
            {icon && (
                <div
                className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                    isSelected
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-divider bg-default-50 text-default-500"
                )}
                >
                {icon}
                </div>
            )}
            <div className="flex flex-col gap-1">
                <h3 className={cn("text-[14px] font-bold leading-none tracking-tight", isSelected ? "text-primary" : "text-foreground")}>
                {title}
                </h3>
                {description && (
                <p className="text-[12px] text-default-500 font-medium leading-relaxed">
                    {description}
                </p>
                )}
            </div>
        </div>
        
        {rightContent}

        {isSelected && !rightContent && (
            <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                <Check size={14} strokeWidth={3} />
            </div>
        )}
      </div>
    </motion.div>
  )
}
