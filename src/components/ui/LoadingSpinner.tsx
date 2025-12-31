import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | number
  text?: string
  className?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  size = "md",
  text,
  className,
  fullScreen = false 
}: LoadingSpinnerProps) {
  
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  }
  
  const pixelSize = typeof size === 'number' ? size : sizeMap[size as keyof typeof sizeMap] || 24

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 
        className="animate-spin text-primary" 
        size={pixelSize}
      />
      {text && (
        <p className="text-xs font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
        {content}
      </div>
    )
  }

  return content
}