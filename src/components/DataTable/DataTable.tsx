'use client';

import React, { useState, useMemo } from 'react';
import {
  RiSearchLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiEdit2Fill,
  RiAddLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiSkipBackLine,
  RiSkipForwardLine,
} from 'react-icons/ri';
import { DataTableProps, PaginationInfo } from '@/types';
import { ColumnVisibilityDropdown } from '../ColumnVisibilityDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

function DataTable<T extends Record<string, unknown>>({
  data,
  title = '',
  subTitle = '',
  columns,
  actions = [],
  searchable = true,
  searchPlaceholder = 'Buscar...',
  selectable = false,
  pagination = true,
  itemsPerPage = 10,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onSelectionChange,
  addButton,
  // Props para visibilidad de columnas
  allColumns,
  visibleColumns,
  onToggleColumn,
  onShowAllColumns,
  onHideAllColumns,
  showColumnVisibility = false,
  searchEndContent,
  selectedRows: selectedRowsProp,
  onSelectRow: onSelectRowProp,
  onSelectAll: onSelectAllProp,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSelectedRows, setInternalSelectedRows] = useState<Set<string>>(
    new Set()
  );
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  const selectedRows = selectedRowsProp || internalSelectedRows;

  // Filter columns based on visibility
  const visibleColumnsFiltered = useMemo(() => {
    if (!visibleColumns || visibleColumns.size === 0) {
      return columns;
    }
    return columns.filter((column) => visibleColumns.has(String(column.key)));
  }, [columns, visibleColumns]);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });

  // Handle sorting
  const handleSort = (columnKey: keyof T) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig((prevConfig) => {
      if (prevConfig.key === columnKey) {
        return {
          key: columnKey,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        return {
          key: columnKey,
          direction: 'asc',
        };
      }
    });

    // Reset to first page when sorting
    setCurrentPage(1);
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        const comparison = aValue.getTime() - bValue.getTime();
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Convert to string for comparison as fallback
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Filter data based on search term (now using sorted data)
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter((item) => {
      return columns.some((column) => {
        const value = item[column.key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [sortedData, searchTerm, columns]);

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Get sort icon for column
  const getSortIcon = (columnKey: keyof T) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return null;

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? (
        <RiArrowUpSLine className="w-4 h-4 text-primary" />
      ) : (
        <RiArrowDownSLine className="w-4 h-4 text-primary" />
      );
    }

    return (
      <div className="flex flex-col opacity-50 group-hover:opacity-100 transition-opacity">
        <RiArrowUpSLine className="w-3 h-3 -mb-1" />
        <RiArrowDownSLine className="w-3 h-3" />
      </div>
    );
  };

  // Pagination logic
  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPageState);
    const startItem = (currentPage - 1) * itemsPerPageState + 1;
    const endItem = Math.min(currentPage * itemsPerPageState, totalItems);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: itemsPerPageState,
      startItem,
      endItem,
    };
  }, [filteredData.length, currentPage, itemsPerPageState]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = (currentPage - 1) * itemsPerPageState;
    const endIndex = startIndex + itemsPerPageState;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPageState, pagination]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (onSelectAllProp) {
      onSelectAllProp(checked);
    } else {
      if (checked) {
        const allIds = paginatedData.map((item) => String(item.id || item.ID));
        setInternalSelectedRows(new Set(allIds));
      } else {
        setInternalSelectedRows(new Set());
      }
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (onSelectRowProp) {
      onSelectRowProp(id, checked);
    } else {
      const newSelected = new Set(internalSelectedRows);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      setInternalSelectedRows(newSelected);
    }
  };

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedData = data.filter((item) =>
        selectedRows.has(String(item.id || item.ID))
      );
      onSelectionChange(selectedData);
    }
  }, [selectedRows, data, onSelectionChange]);

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedRows.has(String(item.id || item.ID)));

  // Custom cell renderer
  const renderCell = (
    column: { render?: (value: T[keyof T], row: T) => React.ReactNode },
    value: T[keyof T],
    row: T
  ) => {
    if (column.render) {
      return column.render(value, row);
    }

    return String(value || '');
  };

  // Handle action clicks
  const handleAction = (action: (typeof actions)[0], row: T) => {
    if (action.onClick) {
      action.onClick(row);
    } else {
      console.log(`Acción "${action.label}" ejecutada para:`, row);
    }
  };

  // Get action icon
  const getActionIcon = (action: (typeof actions)[0]) => {
    if (action.icon) {
      return action.icon;
    }

    // Fallback icons based on label
    switch (action.label) {
      case 'Ver':
        return <RiEyeLine className="w-4 h-4" />;
      case 'Editar':
        return <RiEdit2Fill className="w-4 h-4" />;
      case 'Eliminar':
        return <RiDeleteBinLine className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-3 h-64 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p>Cargando datos</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5 w-full grid grid-cols-1 overflow-hidden min-w-0',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-muted/20">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{subTitle}</p>
            </div>

            <div className="flex items-center gap-2">
              {addButton &&
                (typeof addButton === 'function' ? (
                  addButton()
                ) : (
                  <Button
                    size="sm"
                    className={addButton.className || ''}
                    variant={
                      addButton.variant === 'secondary'
                        ? 'secondary'
                        : addButton.variant === 'ghost'
                        ? 'ghost'
                        : addButton.variant === 'error' ||
                          addButton.variant === 'destructive'
                        ? 'destructive'
                        : addButton.variant === 'outline'
                        ? 'outline'
                        : addButton.variant === 'link'
                        ? 'link'
                        : 'default'
                    }
                    onClick={addButton.onClick}
                  >
                    {addButton.icon || <RiAddLine className="w-4 h-4" />}
                    <span className="hidden sm:inline">{addButton.text}</span>
                  </Button>
                ))}

              {showColumnVisibility &&
                allColumns &&
                visibleColumns &&
                onToggleColumn && (
                  <ColumnVisibilityDropdown
                    columns={allColumns}
                    visibleColumns={visibleColumns}
                    onToggleColumn={onToggleColumn}
                    onShowAllColumns={onShowAllColumns}
                    onHideAllColumns={onHideAllColumns}
                  />
                )}
            </div>
          </div>

          {searchable && (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <div className="relative w-full sm:w-64">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 w-5 h-5 pointer-events-none" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="w-full sm:w-auto">{searchEndContent}</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden">
        {paginatedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground px-4">
            {emptyMessage}
          </div>
        ) : (
          <div className="p-2 sm:p-4 space-y-4">
            {paginatedData.map((row, index) => {
              const rowId = String(row.id || row.ID || index);
              const isSelected = selectedRows.has(rowId);

              return (
                <div
                  key={rowId}
                  className={cn(
                    'border rounded-xl bg-linear-to-br from-card/50 to-card transition-all duration-200 shadow-md',
                    selectable ? 'cursor-pointer' : '',
                    isSelected
                      ? 'ring-2 ring-primary border-primary/50'
                      : 'hover:border-accent'
                  )}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    // Evitar toggle si se hace click en acciones interactivas
                    if (
                      target.closest('button') ||
                      target.closest('a') ||
                      target.closest('[role="checkbox"]') ||
                      target.closest('[role="menuitem"]')
                    ) {
                      return;
                    }
                    if (selectable) {
                      handleSelectRow(rowId, !isSelected);
                    }
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-muted/30">
                      <div className="flex items-center gap-3">
                        {selectable && (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRow(rowId, checked as boolean)
                            }
                            className="h-5 w-5"
                          />
                        )}
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Registro #
                          {index + 1 + (currentPage - 1) * itemsPerPageState}
                        </span>
                      </div>

                      {actions.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-full hover:bg-accent/50"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl shadow-xl border-border/50 bg-popover/95 backdrop-blur-sm"
                          >
                            {actions.map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => handleAction(action, row)}
                                className={cn(
                                  'cursor-pointer py-2.5 px-3 rounded-lg focus:bg-accent focus:text-accent-foreground my-0.5 font-medium text-sm gap-2',
                                  action.variant === 'error' ||
                                    action.variant === 'destructive'
                                    ? 'text-destructive focus:text-destructive focus:bg-destructive/10'
                                    : ''
                                )}
                              >
                                {getActionIcon(action)}
                                <span className="ml-2">{action.label}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-y-3">
                      {visibleColumnsFiltered.map((column) => (
                        <div
                          key={String(column.key)}
                          className="flex flex-col gap-1 border-b border-muted/10 last:border-0 pb-2 last:pb-0"
                        >
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                            {column.label}
                          </span>
                          <div className="text-sm font-medium text-foreground leading-relaxed wrap-break-word">
                            {renderCell(column, row[column.key], row)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-muted/20">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked as boolean)
                    }
                  />
                </TableHead>
              )}
              {visibleColumnsFiltered.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    'whitespace-nowrap',
                    column.className || '',
                    column.sortable
                      ? 'cursor-pointer select-none group hover:text-foreground transition-colors'
                      : ''
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors">
                        {getSortIcon(column.key)}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="text-right whitespace-nowrap sticky right-0 z-20 bg-muted/90 backdrop-blur-sm border-l border-muted/20 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                  Acciones
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    visibleColumnsFiltered.length +
                    (selectable ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-muted/50 p-4 rounded-full">
                      <RiSearchLine className="w-6 h-6 opacity-50" />
                    </div>
                    <p className="font-medium">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = String(row.id || row.ID || index);
                const isSelected = selectedRows.has(rowId);

                return (
                  <TableRow
                    key={rowId}
                    data-state={isSelected ? 'selected' : undefined}
                    className={cn(
                      'group transition-all hover:bg-muted/30 border-b border-muted/10 last:border-0',
                      selectable ? 'cursor-pointer' : ''
                    )}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      // Evitar toggle si se hace click en acciones interactivas
                      if (
                        target.closest('button') ||
                        target.closest('a') ||
                        target.closest('[role="checkbox"]') ||
                        target.closest('[role="menuitem"]')
                      ) {
                        return;
                      }
                      if (selectable) {
                        handleSelectRow(rowId, !isSelected);
                      }
                    }}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectRow(rowId, checked as boolean)
                          }
                        />
                      </TableCell>
                    )}
                    {visibleColumnsFiltered.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={cn(
                          'whitespace-nowrap text-sm font-medium text-foreground',
                          column.className || ''
                        )}
                      >
                        {renderCell(column, row[column.key], row)}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell
                        className={cn(
                          'text-right sticky right-0 z-10 backdrop-blur-sm border-l border-muted/10 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.02)]',
                          isSelected
                            ? 'bg-muted/95'
                            : 'bg-card/95 group-hover:bg-muted/50'
                        )}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl shadow-xl border-border/50 bg-popover/95 backdrop-blur-sm"
                          >
                            {actions.map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => handleAction(action, row)}
                                className={cn(
                                  'cursor-pointer py-2.5 px-3 rounded-lg focus:bg-accent focus:text-accent-foreground my-0.5 font-medium text-sm gap-2',
                                  action.variant === 'error' ||
                                    action.variant === 'destructive'
                                    ? 'text-destructive focus:text-destructive focus:bg-destructive/10'
                                    : ''
                                )}
                              >
                                {getActionIcon(action)}
                                <span className="ml-2">{action.label}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && paginationInfo.totalPages > 1 && (
        <div className="p-4 border-t rounded-b-lg">
          {/* Mobile Pagination */}
          <div className="block md:hidden">
            <div className="flex flex-col gap-4">
              {/* Items info and per page selector */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  {paginationInfo.startItem}-{paginationInfo.endItem} de{' '}
                  {paginationInfo.totalItems}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Por página:
                  </span>
                  <Select
                    value={String(itemsPerPageState)}
                    onValueChange={(v) => {
                      setItemsPerPageState(Number(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-24 text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    variant="ghost"
                    size="sm"
                    title="Primera página"
                  >
                    <RiSkipBackLine className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    variant="ghost"
                    size="sm"
                    title="Anterior"
                  >
                    <RiArrowLeftSLine className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    {currentPage} / {paginationInfo.totalPages}
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, paginationInfo.totalPages)
                      )
                    }
                    disabled={currentPage === paginationInfo.totalPages}
                    variant="ghost"
                    size="sm"
                    title="Siguiente"
                  >
                    <RiArrowRightSLine className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(paginationInfo.totalPages)}
                    disabled={currentPage === paginationInfo.totalPages}
                    variant="ghost"
                    size="sm"
                    title="Última página"
                  >
                    <RiSkipForwardLine className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Items per page
                </span>
                <Select
                  value={String(itemsPerPageState)}
                  onValueChange={(v) => {
                    setItemsPerPageState(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-28 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {paginationInfo.startItem}-{paginationInfo.endItem} out
                of {paginationInfo.totalItems}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                variant="ghost"
                size="sm"
                title="First Page"
              >
                <RiSkipBackLine className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="ghost"
                size="sm"
              >
                <RiArrowLeftSLine className="w-4 h-4" />
                Prev
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, paginationInfo.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (paginationInfo.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= paginationInfo.totalPages - 2) {
                      pageNum = paginationInfo.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        size="sm"
                        variant={pageNum === currentPage ? 'default' : 'ghost'}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginationInfo.totalPages)
                  )
                }
                disabled={currentPage === paginationInfo.totalPages}
                variant="ghost"
                size="sm"
              >
                Next
                <RiArrowRightSLine className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setCurrentPage(paginationInfo.totalPages)}
                disabled={currentPage === paginationInfo.totalPages}
                variant="ghost"
                size="sm"
                title="Last Page"
              >
                <RiSkipForwardLine className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
