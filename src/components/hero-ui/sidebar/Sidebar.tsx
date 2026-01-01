"use client";

import {
  Accordion,
  AccordionItem,
  type ListboxProps,
  type ListboxSectionProps,
  type Selection,
} from "@heroui/react";
import React from "react";
import {Listbox, Tooltip, ListboxItem, ListboxSection} from "@heroui/react";
import {Icon} from "@iconify/react";
import {cn} from "@heroui/react";

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

export type SidebarProps = Omit<ListboxProps<SidebarItem>, "children"> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps["classNames"];
  classNames?: ListboxProps["classNames"];
  defaultSelectedKey: string;
  onItemSelect?: (key: string) => void;
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      defaultSelectedKey,
      onItemSelect,
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
    const [selected, setSelected] = React.useState<React.Key>(defaultSelectedKey);

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
        "w-10 h-10 gap-0 p-0": isCompact,
      }),
    };

    const renderItem = React.useCallback(
      (item: SidebarItem): React.ReactElement => {
        const { items, type, icon, href, title, startContent, endContent, ...itemProps } = item;
        const isNestType =
          items && items?.length > 0 && type === SidebarItemType.Nest;

        if (isCompact) {
          return (
            <ListboxItem
              {...itemProps}
              key={item.key}
              endContent={null}
              startContent={null}
              textValue={title}
              title={null}
            >
              <Tooltip content={title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {icon ? (
                    <Icon
                      className={cn(
                        "text-default-500 group-data-[selected=true]:text-foreground",
                        iconClassName,
                      )}
                      icon={icon}
                      width={24}
                    />
                  ) : (
                    (startContent ?? null)
                  )}
                </div>
              </Tooltip>
            </ListboxItem>
          );
        }

        if (isNestType) {
          return (
            <ListboxItem
              {...(itemProps as any)}
              key={item.key}
              classNames={{
                base: "h-auto p-0",
              }}
              endContent={null}
              startContent={null}
              title={null}
            >
              <Accordion className="p-0">
                <AccordionItem
                  key={item.key}
                  aria-label={title}
                  classNames={{
                    heading: "pr-3",
                    trigger: "p-0",
                    content: "py-0 pl-4",
                  }}
                  title={
                    icon ? (
                      <div className="flex h-11 items-center gap-2 px-2 py-1.5">
                        <Icon
                          className={cn(
                            "text-default-500 group-data-[selected=true]:text-foreground",
                            iconClassName,
                          )}
                          icon={icon}
                          width={24}
                        />
                        <span className="text-small text-default-500 group-data-[selected=true]:text-foreground font-medium">
                          {title}
                        </span>
                      </div>
                    ) : (
                      (startContent ?? null)
                    )
                  }
                >
                  {items && items?.length > 0 ? (
                    <Listbox
                      className="mt-0.5"
                      classNames={{
                        list: "border-l border-default-200 pl-4",
                      }}
                      items={items}
                      variant="flat"
                    >
                      {items.map((subItem) => renderItem(subItem))}
                    </Listbox>
                  ) : null}
                </AccordionItem>
              </Accordion>
            </ListboxItem>
          );
        }

        return (
          <ListboxItem
            {...itemProps}
            key={item.key}
            endContent={hideEndContent ? null : (endContent ?? null)}
            startContent={
              icon ? (
                <Icon
                  className={cn(
                    "text-default-500 group-data-[selected=true]:text-foreground",
                    iconClassName,
                  )}
                  icon={icon}
                  width={24}
                />
              ) : (
                (startContent ?? null)
              )
            }
            textValue={title}
            title={title}
          />
        );
      },
      [isCompact, hideEndContent, iconClassName],
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
            "px-2 min-h-8 rounded-lg h-[32px] data-[selected=true]:bg-default-100",
            itemClasses?.base,
          ),
          title: cn(
            "text-small font-medium text-default-500 group-data-[selected=true]:text-foreground",
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
          onItemSelect?.(key as string);
        }}
        {...props}
      >
        {(item) => {
          return item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest ? (
            renderItem(item)
          ) : item.items && item.items?.length > 0 ? (
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
