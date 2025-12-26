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
import { cn } from "@heroui/react";

// Utility hook for memoized callbacks (from Hero UI Pro)
export function useMemoizedCallback<T extends (...args: any[]) => any>(callback: T): T {
  return useCallback(callback, []) as T;
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
  const [rowsPerPage] = useState(5);
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

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: T, b: T) => {
      const col = sortDescriptor.column as keyof T;
      let first = a[col];
      let second = b[col];

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

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

  const onNextPage = useMemoizedCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  });

  const onPreviousPage = useMemoizedCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  });

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

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between gap-4 px-1 py-2">
        {/* Left: Search Bar */}
        <Input
          className="max-w-[320px]"
          classNames={{
            inputWrapper: "h-9 bg-default-100 dark:bg-default-50 border-none",
          }}
          placeholder={searchPlaceholder}
          size="sm"
          startContent={<Icon className="text-default-400" icon="solar:magnifier-linear" width={16} />}
          value={filterValue}
          onValueChange={onSearchChange}
        />

        {/* Right: Filter, Sort, Columns, Selection info, Actions */}
        <div className="flex items-center gap-2">
          {filterContent && (
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button
                  className="bg-transparent border-none text-default-600 hover:text-default-900"
                  size="sm"
                  variant="light"
                  startContent={
                    <Icon className="text-default-400" icon="solar:filter-linear" width={16} />
                  }
                >
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex w-full flex-col gap-4 p-4">
                  {filterContent}
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="bg-transparent border-none text-default-600 hover:text-default-900"
                size="sm"
                variant="light"
                startContent={
                  <Icon className="text-default-400" icon="solar:sort-linear" width={16} />
                }
              >
                Sort
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort"
              items={headerColumns.filter((c) => !["actions"].includes(c.uid))}
            >
              {(item) => (
                <DropdownItem
                  key={item.uid}
                  onPress={() => {
                    setSortDescriptor({
                      column: item.uid,
                      direction:
                        sortDescriptor.direction === "ascending" ? "descending" : "ascending",
                    });
                  }}
                >
                  {item.name}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          
          <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
              <Button
                className="bg-transparent border-none text-default-600 hover:text-default-900"
                size="sm"
                variant="light"
                startContent={
                  <Icon
                    className="text-default-400"
                    icon="solar:menu-dots-linear"
                    width={16}
                  />
                }
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Columns"
              items={columns.filter((c) => !["actions"].includes(c.uid))}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {(item) => <DropdownItem key={item.uid}>{item.name}</DropdownItem>}
            </DropdownMenu>
          </Dropdown>

          <div className="text-default-500 text-sm whitespace-nowrap">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : filterSelectedKeys.size > 0
              ? `${filterSelectedKeys.size} Selected`
              : ""}
          </div>

          {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && selectedActionsContent && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-transparent border-none text-default-600 hover:text-default-900"
                  endContent={
                    <Icon className="text-default-400" icon="solar:alt-arrow-down-linear" width={14} />
                  }
                  size="sm"
                  variant="light"
                >
                  Selected Actions
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Selected Actions">
                {selectedActionsContent}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    filterSelectedKeys,
    headerColumns,
    sortDescriptor,
    searchPlaceholder,
    filterContent,
    selectedActionsContent,
    columns,
    onSearchChange,
  ]);

  const topBar = useMemo(() => {
    return (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[226px] items-center gap-2">
          <h1 className="text-2xl leading-[32px] font-bold">{topBarTitle}</h1>
          {topBarCount !== undefined && (
            <Chip className="text-default-500 hidden items-center sm:flex" size="sm" variant="flat">
              {topBarCount}
            </Chip>
          )}
        </div>
        {topBarAction}
      </div>
    );
  }, [topBarTitle, topBarCount, topBarAction]);

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
          <span className="text-small text-default-400">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} of ${filteredItems.length} selected`}
          </span>
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
  }, [filterSelectedKeys, page, pages, filteredItems.length, onPreviousPage, onNextPage]);

  // Arrow icons for sorting
  const ArrowUpIcon = ({ className }: { className?: string }) => (
    <Icon className={className} icon="solar:alt-arrow-up-linear" width={16} />
  );

  const ArrowDownIcon = ({ className }: { className?: string }) => (
    <Icon className={className} icon="solar:alt-arrow-down-linear" width={16} />
  );

  return (
    <div className="h-full w-full p-6">
      {topBar}
      <Table
        isHeaderSticky
        aria-label={ariaLabel}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          td: "before:bg-transparent",
        }}
        selectedKeys={filterSelectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={onSelectionChange}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              className={cn([
                column.uid === "actions" ? "flex items-center justify-end px-[20px]" : "",
              ])}
            >
              {column.uid === sortableColumnKey ? (
                <div
                  {...getMemberInfoProps()}
                  className="flex w-full cursor-pointer items-center justify-between"
                >
                  {column.name}
                  {column.sortDirection === "ascending" ? (
                    <ArrowUpIcon className="text-default-400" />
                  ) : (
                    <ArrowDownIcon className="text-default-400" />
                  )}
                </div>
              ) : column.info ? (
                <div className="flex min-w-[108px] items-center justify-between">
                  {column.name}
                  <Tooltip content={column.info}>
                    <Icon
                      className="text-default-300"
                      height={16}
                      icon="solar:info-circle-linear"
                      width={16}
                    />
                  </Tooltip>
                </div>
              ) : (
                column.name
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={emptyContent} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
