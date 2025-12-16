"use client";

import React from "react";
import type { ListboxProps, ListboxSectionProps, Selection } from "@heroui/react";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

export enum SidebarItemType {
  Nest = "nest",
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, "children" | "onSelect"> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps["classNames"];
  classNames?: ListboxProps["classNames"];
  defaultSelectedKey?: string;
  onSelect?: (key: string) => void;
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      defaultSelectedKey,
      onSelect,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      iconClassName,
      classNames,
      className,
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = React.useState<React.Key>(defaultSelectedKey || items[0]?.key || "");

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, "w-full", {
        "p-0 max-w-[44px]": isCompact,
      }),
      group: cn(sectionClassesProp?.group, {
        "flex flex-col gap-1": isCompact,
      }),
      heading: cn(sectionClassesProp?.heading, {
        hidden: isCompact,
      }),
    };

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp?.base, {
        "w-11 h-11 gap-0 p-0": isCompact,
      }),
    };

    const renderItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType = item.type === SidebarItemType.Nest;
        // Destructure href out to prevent ListboxItem from rendering as an anchor tag
        // active behavior is handled via key selection and onSelect prop
        const { href, ...itemProps } = item;

        if (isNestType) {
          // @ts-ignore
          delete itemProps.endContent;
        }

        return (
          <ListboxItem
            {...itemProps}
            key={item.key}
            classNames={{
              base: cn(
                {
                  "h-auto p-0": !isCompact && isNestType,
                },
                {
                  "inline-block w-11": isCompact && isNestType,
                },
              ),
            }}
            endContent={isCompact || hideEndContent || isNestType ? null : (item.endContent ?? null)}
            startContent={
              isCompact || isNestType ? null : item.icon ? (
                <Icon
                  className={cn(
                    "text-default-500 group-data-[selected=true]:text-foreground",
                    iconClassName,
                  )}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                (item.startContent ?? null)
              )
            }
            textValue={item.title}
            title={isCompact || isNestType ? null : item.title}
          >
            {isCompact ? (
              <div className="flex w-full items-center justify-center">
                {item.icon ? (
                  <Icon
                    className={cn(
                      "text-default-500 group-data-[selected=true]:text-foreground",
                      iconClassName,
                    )}
                    icon={item.icon}
                    width={24}
                  />
                ) : (
                  (item.startContent ?? null)
                )}
              </div>
            ) : null}
            {!isCompact && isNestType && item.items ? <Sidebar items={item.items} {...props} /> : null}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName, items, itemClasses?.base],
    );

    return (
      <Listbox
        key={isCompact ? "compact" : "default"}
        ref={ref}
        hideSelectedIcon
        as="nav"
        className={cn("list-none", className)}
        classNames={{
          ...classNames,
          list: cn("items-center", classNames?.list),
        }}
        color="default"
        itemClasses={{
          ...itemClasses,
          base: cn(
            "px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100",
            itemClasses?.base,
          ),
          title: cn(
            "text-sm font-medium text-default-700 group-data-[selected=true]:text-default-foreground",
            itemClasses?.title,
          ),
        }}
        items={items}
        selectedKeys={[selected] as unknown as Selection}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];

          setSelected(key as React.Key);
          onSelect?.(String(key));
        }}
        {...props}
      >
        {(item) => {
          return item.items && item.items?.length > 0 ? (
            <ListboxSection
              key={item.key}
              classNames={sectionClasses}
              showDivider={isCompact}
              title={item.title}
            >
              {item.items.map(renderItem)}
            </ListboxSection>
          ) : (
            renderItem(item)
          );
        }}
      </Listbox>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
