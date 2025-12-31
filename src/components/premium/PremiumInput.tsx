import { Input, type InputProps } from "@heroui/react"
import { cn } from "@/lib/utils"

interface PremiumInputProps extends InputProps {
  icon?: React.ReactNode
}

export function PremiumInput({ icon, classNames, ...props }: PremiumInputProps) {
  return (
    <Input
      variant="bordered"
      labelPlacement="outside"
      classNames={{
        ...classNames,
        inputWrapper: cn(
          "h-10 bg-white dark:bg-black/20",
          "border border-divider shadow-sm",
          "group-data-[focus=true]:border-primary group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-primary/10",
          "group-data-[hover=true]:border-default-400",
          "transition-all duration-200 rounded-xl",
          classNames?.inputWrapper
        ),
        label: cn("text-foreground font-semibold text-[13px] mb-1.5", classNames?.label),
        input: cn("text-foreground placeholder:text-default-400 text-sm", classNames?.input),
      }}
      startContent={
        icon ? (
          <div className="text-gray-400 group-data-[focus=true]:text-primary transition-colors pr-2 border-r border-gray-100 dark:border-gray-800 mr-2 py-1">
            {icon}
          </div>
        ) : undefined
      }
      {...props}
    />
  )
}
