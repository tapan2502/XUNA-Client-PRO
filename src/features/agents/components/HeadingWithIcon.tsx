import type { LucideIcon } from "lucide-react"

interface HeadingWithIconProps {
  icon: LucideIcon
  title: string
  className?: string
}

export function HeadingWithIcon({ icon: Icon, title, className = "" }: HeadingWithIconProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
    </div>
  )
}
