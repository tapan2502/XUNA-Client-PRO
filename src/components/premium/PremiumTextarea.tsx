import { Textarea, type TextAreaProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export function PremiumTextarea({ classNames, ...props }: TextAreaProps) {
  return (
    <Textarea
      variant="bordered"
      labelPlacement="outside"
      classNames={{
        ...classNames,
        inputWrapper: cn(
          "bg-white dark:bg-black/20",
          "border border-divider shadow-sm",
          "group-data-[focus=true]:border-primary group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-primary/10",
          "group-data-[hover=true]:border-default-400",
          "transition-all duration-200 rounded-xl",
          classNames?.inputWrapper
        ),
        label: cn("text-foreground font-semibold text-[13px] mb-1.5", classNames?.label),
        input: cn("text-foreground placeholder:text-default-400 text-sm", classNames?.input),
      }}
      {...props}
    />
  )
}
