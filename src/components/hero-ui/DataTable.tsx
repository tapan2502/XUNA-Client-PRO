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
  RadioGroup,
  Radio,
  Chip,
  Pagination,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useButton,
  Tooltip,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useRef, useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { Search, Filter, SortAsc, LayoutGrid, ChevronDown, ChevronUp, Info, MoreHorizontal } from "lucide-react";
import { cn } from "@heroui/react";

// Utility hook for memoized callbacks (safe version)
export function useMemoizedCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}

// Types
export interface DataTableColumn {
  uid: string;
  name: string;
  sortable?: boolean;
  sortDirection?: "ascending" | "descending";
  info?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn[];
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
}

export default function DataTable<T extends { id: string | number }>({
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
  selectedActionsContent,
  onItemFilter,
  sortableColumnKey,
  onMemberInfoClick,
  ariaLabel = "Data table with custom cells, pagination and sorting",
}: DataTableProps<T>) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialVisibleColumns));
  const [rowsPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: sortableColumnKey || columns[0]?.uid,
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

  const filteredItems = useMemo(() => {
    let filtered = [...data];

    // Text search
    if (filterValue && searchKeys.length > 0) {
      filtered = filtered.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        })
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
    let sortableData = [...filteredItems];
    
    return sortableData.sort((a: T, b: T) => {
      const col = sortDescriptor.column as string;
      
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
      } else if (col === "language") {
        first = (a as any).language?.name || "";
        second = (b as any).language?.name || "";
      } else {
        first = a[col as keyof T];
        second = b[col as keyof T];
      }

      if (typeof first === 'string' && typeof second === 'string') {
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

  const eyesRef = useRef<HTMLButtonElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const deleteRef = useRef<HTMLButtonElement | null>(null);
  const { getButtonProps: getEyesProps } = useButton({ ref: eyesRef });
  const { getButtonProps: getEditProps } = useButton({ ref: editRef });
  const { getButtonProps: getDeleteProps } = useButton({ ref: deleteRef });

  const getMemberInfoProps = useMemoizedCallback(() => ({
    onClick: onMemberInfoClick || (() => {}),
  }));

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
      <div className="flex flex-col gap-3 mb-3">
        {/* Row 1: Title and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl leading-[28px] font-bold text-foreground">{topBarTitle}</h1>
            {topBarCount !== undefined && (
              <Chip className="text-default-500 bg-default-100" size="sm" variant="flat">
                {topBarCount}
              </Chip>
            )}
          </div>
          {topBarAction}
        </div>

        {/* Row 2: Search and Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              className="w-full"
              placeholder={searchPlaceholder}
              endContent={<Search className="text-default-500" size={18} />}
              value={filterValue}
              onValueChange={onSearchChange}
              size="sm"
              variant="flat"
              classNames={{
                inputWrapper: "bg-white dark:bg-default-100 border border-default-200 shadow-sm transition-all hover:border-default-400 focus-within:!border-primary h-9 rounded-xl",
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            {filterContent && (
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button 
                    variant="flat" 
                    size="sm" 
                    className="bg-white dark:bg-default-50 border border-default-200 text-default-600 font-medium h-9 px-3 min-w-0 shadow-sm text-[12px]"
                    startContent={<Filter size={16} />}
                  >
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4 w-60">
                  {filterContent}
                </PopoverContent>
              </Popover>
            )}
            {!filterContent && (
              <Button 
                variant="flat" 
                size="sm" 
                className="bg-white dark:bg-default-50 border border-default-200 text-default-600 font-medium h-9 px-3 min-w-0 shadow-sm text-[12px]"
                startContent={<Filter size={16} />}
              >
                Filter
              </Button>
            )}

            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="flat" 
                  size="sm" 
                  className="bg-white dark:bg-default-50 border border-default-200 text-default-600 font-medium h-9 px-3 min-w-0 shadow-sm text-[12px]"
                  startContent={<SortAsc size={16} />}
                  endContent={<ChevronDown size={14} />}
                >
                  Sort
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Sort Columns"
                onAction={(key) => {
                  const column = columns.find(c => c.uid === key);
                  if (column?.sortable) {
                    setSortDescriptor({
                      column: key as string,
                      direction: sortDescriptor.column === key && sortDescriptor.direction === "ascending" ? "descending" : "ascending",
                    });
                  }
                }}
              >
                {columns.filter(c => c.sortable).map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">{column.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown closeOnSelect={false}>
              <DropdownTrigger>
                <Button 
                  variant="flat" 
                  size="sm" 
                  className="bg-white dark:bg-default-50 border border-default-200 text-default-600 font-medium h-9 px-3 min-w-0 shadow-sm text-[12px]"
                  startContent={<LayoutGrid size={16} />}
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
                  <DropdownItem key={column.uid} className="capitalize">{column.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <div className="h-5 w-px bg-default-200 mx-0.5" />

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-default-400 font-medium px-1.5">
                {filterSelectedKeys === "all" ? items.length : filterSelectedKeys.size} Selected
              </span>
              {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && selectedActionsContent && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="flat" 
                      size="sm" 
                      className="bg-white dark:bg-default-50 border border-default-200 text-default-600 font-medium h-9 px-3 shadow-sm text-[12px]"
                      endContent={<ChevronDown size={14} />}
                    >
                      Actions
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Selected actions">
                    {selectedActionsContent}
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    topBarTitle,
    topBarCount,
    topBarAction,
    filterValue,
    onSearchChange,
    visibleColumns,
    columns,
    filterSelectedKeys,
    items.length,
    searchPlaceholder,
    selectedActionsContent,
    setVisibleColumns
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between gap-1 px-1 py-2">
        <div className="flex-1 flex items-center">
            <Pagination
              isCompact={false}
              showControls={false}
              showShadow={false}
              page={page}
              total={pages}
              onChange={setPage}
              classNames={{
                wrapper: "gap-2 shadow-none",
                item: "bg-white dark:bg-default-50 border border-default-200 text-default-600 font-medium w-8 h-8 rounded-lg shadow-sm hover:border-default-400 transition-all text-[12px]",
                cursor: "bg-primary text-white font-bold",
              }}
            />
        </div>
        <div className="flex items-center justify-end gap-4 flex-1">
          <span className="text-[12px] text-default-400 font-medium">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} of ${filteredItems.length} selected`}
          </span>
          <div className="flex items-center gap-2">
            <Button 
              isDisabled={page === 1} 
              size="sm" 
              variant="flat" 
              className="bg-white dark:bg-default-50 border border-default-200 text-default-600 font-medium h-9 px-4 rounded-lg shadow-sm hover:border-default-400 transition-all text-[12px]"
              onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button 
              isDisabled={page === pages} 
              size="sm" 
              variant="flat" 
              className="bg-white dark:bg-default-50 border border-default-200 text-default-600 font-medium h-9 px-4 rounded-lg shadow-sm hover:border-default-400 transition-all text-[12px]"
              onPress={onNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterSelectedKeys, page, pages, filteredItems.length, onPreviousPage, onNextPage]);

  // Arrow icons for sorting
  const ArrowUpIcon = ({ className }: { className?: string }) => (
    <ChevronUp className={className} size={16} />
  );

  const ArrowDownIcon = ({ className }: { className?: string }) => (
    <ChevronDown className={className} size={16} />
  );

  return (
    <div className="h-full w-full flex flex-col">
      {topBar}
      <div className="flex-1 min-h-0 flex flex-col mt-3">
        <Table
          isHeaderSticky
          aria-label={ariaLabel}
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "shadow-none border border-divider rounded-2xl bg-white dark:bg-black/20 p-0 max-h-full",
            th: "bg-default-50/50 text-default-500 font-semibold text-[11px] capitalize tracking-wide h-8 border-b border-divider/50 px-2 first:pl-4 last:pr-4",
            td: "px-2 first:pl-4 last:pr-4 py-1.5 border-b border-divider/10 group-last:border-none text-[13px] text-default-600",
            table: "border-collapse",
          }}
          selectedKeys={filterSelectedKeys}
          selectionMode="none"
          sortDescriptor={sortDescriptor}
          onSelectionChange={onSelectionChange}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "end" : "start"}
                allowsSorting={column.sortable}
                className={cn([
                  column.uid === "actions" ? "flex items-center justify-end px-[20px]" : "",
                ])}
              >
                {column.info ? (
                  <div className="flex min-w-[108px] items-center justify-between pointer-events-none">
                     {column.name}
                      <Tooltip content={column.info}>
                        <Info
                          className="text-default-400 pointer-events-auto"
                          size={16}
                        />
                      </Tooltip>
                  </div>
                ) : (
                  column.name
                )}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={emptyContent} items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
