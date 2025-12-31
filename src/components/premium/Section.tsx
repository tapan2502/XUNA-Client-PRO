import { cn } from "@/lib/utils"

interface SectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function Section({ title, description, children, className, action }: SectionProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {title && (
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-[14px] font-bold text-foreground tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-[12px] text-default-500 font-medium">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  )
}
