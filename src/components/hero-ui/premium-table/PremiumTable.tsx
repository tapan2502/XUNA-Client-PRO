"use client";

import type {SortDescriptor} from "@heroui/react";
import type {Key} from "@react-types/shared";

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
  Pagination,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  Chip,
} from "@heroui/react";
import {SearchIcon} from "@heroui/shared-icons";
import React, {useMemo, useState} from "react";
import {Icon} from "@iconify/react";
import {cn} from "@heroui/react";

import {useMemoizedCallback} from "./use-memoized-callback";

import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "./icons";

export interface PremiumTableColumn {
  uid: string;
  name: React.ReactNode | string;
  sortable?: boolean;
  info?: string;
}

export interface PremiumTableProps<T> {
  columns: PremiumTableColumn[];
  data: T[];
  renderCell: (item: T, columnKey: Key) => React.ReactNode;
  initialVisibleColumns: string[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  topBarTitle: string;
  topBarCount?: number;
  topBarAction?: React.ReactNode;
  emptyContent?: string;
  filterContent?: React.ReactNode;
  onItemFilter?: (item: T) => boolean;
  onSortChange?: (descriptor: SortDescriptor) => void;
  sortDescriptor?: SortDescriptor;
  ariaLabel?: string;
}

export default function PremiumTable<T extends {id: string | number}>({
  columns,
  data,
  renderCell,
  initialVisibleColumns,
  searchPlaceholder = "Search",
  searchKeys = [],
  topBarTitle,
  topBarCount,
  topBarAction,
  emptyContent = "No items found",
  filterContent,
  onItemFilter,
  onSortChange: externalOnSortChange,
  sortDescriptor: externalSortDescriptor,
  ariaLabel = "Premium data table",
}: PremiumTableProps<T>) {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<any>(new Set(initialVisibleColumns));
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  
  const [internalSortDescriptor, setInternalSortDescriptor] = useState<SortDescriptor>({
    column: columns[0]?.uid,
    direction: "ascending",
  });

  const sortDescriptor = externalSortDescriptor || internalSortDescriptor;
  const setSortDescriptor = externalOnSortChange || setInternalSortDescriptor;

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
      .filter((column) => (visibleColumns as Set<string>).has(column.uid));
  }, [visibleColumns, sortDescriptor, columns]);

  const filteredItems = useMemo(() => {
    let filtered = [...data];

    if (filterValue && searchKeys.length > 0) {
      filtered = filtered.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        })
      );
    }

    if (onItemFilter) {
      filtered = filtered.filter(onItemFilter);
    }

    return filtered;
  }, [filterValue, data, searchKeys, onItemFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const sortedItems = useMemo(() => {
    const sortableData = [...filteredItems];
    return sortableData.sort((a, b) => {
      const col = sortDescriptor.column as keyof T;
      let first = a[col] as any;
      let second = b[col] as any;

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

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-2">
        <Input
          className="w-[320px]"
          endContent={<SearchIcon className="text-default-400" width={16} />}
          placeholder={searchPlaceholder}
          size="sm"
          variant="flat"
          value={filterValue}
          onValueChange={onSearchChange}
          classNames={{
            inputWrapper: "bg-white dark:bg-default-100 shadow-sm border border-default-200 h-10 rounded-xl transition-all hover:border-default-400 focus-within:!border-primary",
            input: "text-[14px]"
          }}
        />
        {filterContent && (
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                className="bg-white dark:bg-default-50 text-default-600 border border-default-200 shadow-sm font-medium h-10 px-3 rounded-xl text-[12px]"
                size="sm"
                startContent={
                  <Icon className="text-default-400 rotate-90" icon="solar:tuning-2-linear" width={16} />
                }
              >
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex w-full flex-col gap-6 px-2 py-4">
                {filterContent}
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="bg-white dark:bg-default-50 text-default-600 border border-default-200 shadow-sm font-medium h-10 px-3 rounded-xl text-[12px]"
              size="sm"
              startContent={
                <Icon className="text-default-400" icon="solar:sort-linear" width={16} />
              }
            >
              Sort
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Sort"
            items={headerColumns.filter((c) => c.uid !== "actions")}
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
              className="bg-white dark:bg-default-50 text-default-600 border border-default-200 shadow-sm font-medium h-10 px-3 rounded-xl text-[12px]"
              size="sm"
              startContent={
                <Icon
                  className="text-default-400"
                  icon="solar:sort-horizontal-linear"
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
            onSelectionChange={setVisibleColumns as any}
          >
            {(item) => <DropdownItem key={item.uid}>{item.name}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }, [
    filterValue,
    searchPlaceholder,
    filterContent,
    visibleColumns,
    headerColumns,
    sortDescriptor,
    onSearchChange,
    setVisibleColumns,
    setSortDescriptor,
    columns
  ]);

  const topBar = useMemo(() => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">{topBarTitle}</h1>
          {topBarCount !== undefined && (
            <Chip className="text-default-400 bg-default-100/50 min-w-[32px] font-medium" size="sm" variant="flat">
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
      <div className="flex items-center justify-between px-6 py-4 border-t border-divider bg-content1 rounded-b-2xl">
        <Pagination
          isCompact
          showControls
          showShadow={false}
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            cursor: "bg-primary text-white shadow-none",
            item: "bg-transparent text-default-500",
            prev: "bg-transparent",
            next: "bg-transparent"
          }}
        />
        <div className="flex items-center gap-2">
          <Button 
            className="bg-default-100 text-foreground font-medium px-4 h-8 min-w-[80px]"
            isDisabled={page === 1} 
            size="sm" 
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button 
            className="bg-default-100 text-foreground font-medium px-4 h-8 min-w-[80px]"
            isDisabled={page === pages} 
            size="sm" 
            onPress={onNextPage}
          >
            Next
           </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  return (
    <div className="h-full w-full flex flex-col gap-12 overflow-visible">
      <div className="px-1">{topBar}</div>
      <div className="px-1">{topContent}</div>
      
      <div className="flex-1 min-h-0 bg-content1 rounded-2xl shadow-sm border border-divider flex flex-col overflow-visible">
        <div className="flex-1 overflow-auto min-h-0">
          <Table
            isHeaderSticky
            aria-label={ariaLabel}
            removeWrapper
            selectionMode="none"
              classNames={{
                table: "min-w-full",
                th: "bg-default-100 text-[#71717A] font-bold text-[11px] uppercase tracking-wider px-6 border-b border-divider h-14",
                td: "px-6 py-4 border-none text-[13px] border-b border-default-50 group-last:border-none",
                thead: "[&>tr]:first:rounded-none",
                tr: "group",
                sortIcon: "hidden"
              }}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "end" : "start"}
                  allowsSorting={column.sortable}
                >
                  <div className="flex h-full items-center gap-1">
                    <span className="inline-block whitespace-nowrap">{column.name}</span>
                    {column.info && (
                      <Tooltip content={column.info}>
                        <Icon
                          className="text-default-300 pointer-events-auto"
                          height={14}
                          icon="solar:info-circle-linear"
                          width={14}
                        />
                      </Tooltip>
                    )}
                  </div>
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
        {bottomContent}
      </div>
    </div>
  );
}
