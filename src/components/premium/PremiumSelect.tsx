import { Select, SelectItem, type SelectProps } from "@heroui/react"
import { cn } from "@/lib/utils"

interface PremiumSelectProps<T extends object = object> extends Omit<SelectProps<T>, "children"> {
  children?: React.ReactNode
  items?: T[]
}

export function PremiumSelect<T extends object = object>({ classNames, children, items, ...props }: PremiumSelectProps<T>) {
  return (
    <Select
      variant="bordered"
      labelPlacement="outside"
      classNames={{
        ...classNames,
        trigger: cn(
          "h-10 bg-white dark:bg-black/20",
          "border border-divider shadow-sm",
          "data-[open=true]:border-primary data-[focus=true]:ring-2 data-[focus=true]:ring-primary/10",
          "data-[hover=true]:border-default-400",
          "transition-all duration-200 rounded-xl",
          classNames?.trigger
        ),
        label: cn("text-foreground font-semibold text-[13px] mb-1.5", classNames?.label),
        value: cn("text-foreground text-sm", classNames?.value),
        popoverContent: cn("bg-white dark:bg-[#18181b] border border-divider shadow-xl rounded-xl", classNames?.popoverContent)
      }}
      items={items}
      {...props}
    >
      {(children as any) || ((item: T) => <SelectItem key={(item as any).key || (item as any).id}>{(item as any).label || (item as any).name}</SelectItem> as any)}
    </Select>
  )
}
