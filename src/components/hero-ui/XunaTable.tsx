"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import type { Key } from "@react-types/shared";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Pagination,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useRef, useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

// Utility hook for memoized callbacks (safe version)
export function useMemoizedCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}

export interface XunaTableColumn {
  uid: string;
  name: React.ReactNode;
  sortable?: boolean;
  sortDirection?: "ascending" | "descending";
  info?: string;
}

export interface XunaTableProps<T> {
  columns: XunaTableColumn[];
  data: T[];
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
  initialVisibleColumns: string[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  topBarTitle: string;
  topBarCount?: number;
  topBarAction?: React.ReactNode;
  emptyContent?: string;
  filterContent?: React.ReactNode;
  selectedActionsContent?: React.ReactElement | React.ReactElement[];
  onItemFilter?: (item: T) => boolean;
  sortableColumnKey?: string;
  onMemberInfoClick?: () => void;
  ariaLabel?: string;
  rowsPerPage?: number;
  justifyEndColumns?: boolean;
}

export default function XunaTable<T extends { id: string | number }>({
  columns,
  data,
  renderCell,
  initialVisibleColumns,
  searchPlaceholder = "Search",
  searchKeys = [],
  topBarTitle,
  topBarCount,
  topBarAction,
  emptyContent = "No data found",
  filterContent,
  onItemFilter,
  sortableColumnKey,
  ariaLabel = "Data table with custom cells, pagination and sorting",
  rowsPerPage = 7,
  justifyEndColumns = true,
}: XunaTableProps<T>) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialVisibleColumns));
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column:
      sortableColumnKey ||
      columns.find((column) => column.sortable)?.uid ||
      columns[0]?.uid,
    direction: "ascending",
  });

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns
      .map((item) => {
        if (item.uid === sortDescriptor.column) {
          return {
            ...item,
            sortDirection: sortDescriptor.direction,
          };
        }

        return item;
      })
      .filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, sortDescriptor, columns]);

  const firstContentColumnUid = useMemo(() => {
    if (!justifyEndColumns) return undefined;
    const firstColumn = headerColumns.find((column) => column.uid !== "statusDot");
    return firstColumn?.uid;
  }, [headerColumns, justifyEndColumns]);

  const filteredItems = useMemo(() => {
    let filtered = [...data];

    // Text search
    if (filterValue && searchKeys.length > 0) {
      filtered = filtered.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        }),
      );
    }

    // Custom filter
    if (onItemFilter) {
      filtered = filtered.filter(onItemFilter);
    }

    return filtered;
  }, [filterValue, data, searchKeys, onItemFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  // Reset page when filtering or data changes
  React.useEffect(() => {
    setPage(1);
  }, [filterValue, data.length, onItemFilter]);

  // Ensure current page is within bounds if pages count decreases
  React.useEffect(() => {
    if (page > pages) {
      setPage(pages);
    }
  }, [pages, page]);

  const sortedItems = useMemo(() => {
    const col = sortDescriptor.column as string | undefined;

    if (!col) return [...filteredItems];

    return [...filteredItems].sort((a: T, b: T) => {
      let first: any;
      let second: any;

      // Handle special column mappings or nested objects
      if (col === "timestamp" || col === "created_at") {
        first = (a as any).start_time_unix_secs || (a as any).created_at_unix_secs || 0;
        second = (b as any).start_time_unix_secs || (b as any).created_at_unix_secs || 0;
      } else if (col === "agent" || col === "name") {
        first = (a as any).agent_name || (a as any).name || "";
        second = (b as any).agent_name || (b as any).name || "";
      } else if (col === "duration") {
        first = (a as any).call_duration_secs || 0;
        second = (b as any).call_duration_secs || 0;
      } else if (col === "messages") {
        first = (a as any).message_count || 0;
        second = (b as any).message_count || 0;
      } else if (col === "language" || col === "usageLang") {
        first = (a as any).language?.name || "";
        second = (b as any).language?.name || "";
      } else if (col === "services") {
        first = (a as any).services || "Voice";
        second = (b as any).services || "Voice";
      } else if (col === "usage") {
        first = (a as any).usage || 0;
        second = (b as any).usage || 0;
      } else {
        first = a[col as keyof T];
        second = b[col as keyof T];
      }

      if (typeof first === "string" && typeof second === "string") {
        const cmp = first.localeCompare(second);
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const filterSelectedKeys = useMemo(() => {
    if (selectedKeys === "all") return selectedKeys;
    let resultKeys = new Set<Key>();

    if (filterValue) {
      filteredItems.forEach((item) => {
        const stringId = String(item.id);

        if ((selectedKeys as Set<string>).has(stringId)) {
          resultKeys.add(stringId);
        }
      });
    } else {
      resultKeys = selectedKeys;
    }

    return resultKeys;
  }, [selectedKeys, filteredItems, filterValue]);

  const onNextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, pages));
  }, [pages]);

  const onPreviousPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const onSearchChange = useMemoizedCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  });

  const onSelectionChange = useMemoizedCallback((keys: Selection) => {
    if (keys === "all") {
      if (filterValue) {
        const resultKeys = new Set(filteredItems.map((item) => String(item.id)));
        setSelectedKeys(resultKeys);
      } else {
        setSelectedKeys(keys);
      }
    } else if (keys.size === 0) {
      setSelectedKeys(new Set());
    } else {
      const resultKeys = new Set<Key>();

      keys.forEach((v) => {
        resultKeys.add(v);
      });
      const selectedValue =
        selectedKeys === "all"
          ? new Set(filteredItems.map((item) => String(item.id)))
          : selectedKeys;

      selectedValue.forEach((v) => {
        if (items.some((item) => String(item.id) === v)) {
          return;
        }
        resultKeys.add(v);
      });
      setSelectedKeys(new Set(resultKeys));
    }
  });

  const topBar = useMemo(() => {
    return (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[226px] items-center gap-2">
          <h1 className="text-2xl leading-[32px] font-bold">{topBarTitle}</h1>
          {typeof topBarCount !== "undefined" && (
            <Chip className="text-default-500 hidden items-center sm:flex" size="sm" variant="flat">
              {topBarCount}
            </Chip>
          )}
        </div>
        {topBarAction}
      </div>
    );
  }, [topBarTitle, topBarCount, topBarAction]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-3 overflow-auto py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Input
            className="min-w-[200px]"
            endContent={<SearchIcon className="text-default-500 text-md" width={16} />}
            placeholder={searchPlaceholder}
            size="sm"
            classNames={{
              base: "text-sm",
              inputWrapper: 'px-3'
            }}
            value={filterValue}
            onValueChange={onSearchChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {filterContent ? (
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button
                  className="dark:bg-[#141414] text-default-800 text-sm"
                  size="sm"
                  startContent={
                    <Icon className="text-default-900" icon="solar:tuning-2-linear" width={16} />
                  }
                >
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-60">{filterContent}</PopoverContent>
            </Popover>
          ) : (
            <Button
              className="dark:bg-[#141414] text-default-800 text-sm"
              size="sm"
              startContent={
                <Icon className="text-default-900" icon="solar:tuning-2-linear" width={16} />
              }
            >
              Filter
            </Button>
          )}

          <Dropdown>
            <DropdownTrigger>
              <Button
                className="dark:bg-[#141414] text-default-800 text-sm"
                size="sm"
                startContent={<Icon className="text-default-900" icon="solar:sort-linear" width={16} />}
              >
                Sort
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort Columns"
              onAction={(key) => {
                const column = columns.find((c) => c.uid === key);
                if (column?.sortable) {
                  setSortDescriptor({
                    column: key as string,
                    direction:
                      sortDescriptor.column === key && sortDescriptor.direction === "ascending"
                        ? "descending"
                        : "ascending",
                  });
                }
              }}
            >
              {columns
                .filter((column) => column.sortable)
                .map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
              <Button
                size="sm"
                className="dark:bg-[#141414] text-default-800 text-sm"
                startContent={
                  <Icon className="text-default-900" icon="solar:sort-horizontal-linear" width={16} />
                }
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    visibleColumns,
    columns,
    searchPlaceholder,
    setVisibleColumns,
    filterContent,
    sortDescriptor,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-3">
            <Button isDisabled={page === 1} size="sm" variant="flat" onPress={onPreviousPage}>
              Previous
            </Button>
            <Button isDisabled={page === pages} size="sm" variant="flat" onPress={onNextPage}>
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  return (
    <div className="h-full w-full p-6">
      {topBar}
      <Table
        isHeaderSticky
        aria-label={ariaLabel}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        className="cursor-default"
        classNames={{
          wrapper: "p-0 shadow-none dark:bg-[#141414] border-1 border-[#ECECEC]/10",
          thead: "before:bg-transparent before:shadow-none [&>tr]:first:shadow-none",
          th: "bg-transparent border-b-0 data-[hover=true]:bg-transparent text-sm dark:text-white py-6",
          tbody: "[&>tr]:border-b-0 [&>tr]:border-divider [&>tr]:hover:bg-default-100 dark:[&>tr]:hover:bg-white/5",
          td: "before:bg-transparent py-4 justify-center align-center items-center",
          tr: "border-t-1",
        }}
        selectedKeys={filterSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSelectionChange={onSelectionChange}
        onSortChange={setSortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={
                justifyEndColumns
                  ? column.uid === "statusDot" || column.uid === firstContentColumnUid
                    ? "start"
                    : "end"
                  : column.uid === "actions"
                    ? "end"
                    : column.uid === "statusDot"
                      ? "center"
                      : "start"
              }
              allowsSorting={column.sortable}
              className={cn([
                justifyEndColumns && column.uid === firstContentColumnUid
                  ? "w-full min-w-[200px]"
                  : "",
                column.uid === "actions" ? "flex items-center justify-end" : "",
                column.uid === "statusDot" ? "w-8" : "",
                column.uid === "usage" ? "w-22" : "",
              ])}
            >
              {column.uid === "assistantId" ? (
                <div className="inline-flex items-center gap-4">
                  {column.name}
                  {column.info && (
                    <Tooltip className="ml-0" content={column.info}>
                      <Icon
                        className="text-default-300"
                        height={16}
                        icon="solar:info-circle-linear"
                        width={16}
                      />
                    </Tooltip>
                  )}
                </div>
              ) : (
                <>
                  {column.uid === "actions" ? "" : column.name}
                  {column.info && (
                    <Tooltip className="ml-5" content={column.info}>
                      <Icon
                        className="text-default-300"
                        height={16}
                        icon="solar:info-circle-linear"
                        width={16}
                      />
                    </Tooltip>
                  )}
                </>
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={emptyContent} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell
                  className={cn([
                    columnKey === "statusDot" ? "text-center" : "",
                    justifyEndColumns
                      ? columnKey === firstContentColumnUid
                        ? "text-left w-full"
                        : "text-right"
                      : "",
                  ])}
                >
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
