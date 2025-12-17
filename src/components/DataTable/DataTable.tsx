"use client";

import React, { useState, useMemo } from "react";
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
} from "react-icons/ri";
import { DataTableProps, PaginationInfo } from "@/types";
import { ColumnVisibilityDropdown } from "../ColumnVisibilityDropdown";

function DataTable<T extends Record<string, unknown>>({
  data,
  title = "",
  subTitle = "",
  columns,
  actions = [],
  searchable = true,
  searchPlaceholder = "Buscar...",
  selectable = false,
  pagination = true,
  itemsPerPage = 10,
  loading = false,
  emptyMessage = "No data available",
  className = "",
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
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

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
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  // Handle sorting
  const handleSort = (columnKey: keyof T) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig((prevConfig) => {
      if (prevConfig.key === columnKey) {
        return {
          key: columnKey,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          key: columnKey,
          direction: "asc",
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
      if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
      if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        const comparison = aValue.getTime() - bValue.getTime();
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      // Convert to string for comparison as fallback
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Filter data based on search term (now using sorted data)
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter((item) => {
      return columns.some((column) => {
        const value = item[column.key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === "object" && value !== null) {
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
      return sortConfig.direction === "asc" ? (
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
    if (checked) {
      const allIds = paginatedData.map((item) => String(item.id || item.ID));
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
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

    return String(value || "");
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
      case "Ver":
        return <RiEyeLine className="w-4 h-4" />;
      case "Editar":
        return <RiEdit2Fill className="w-4 h-4" />;
      case "Eliminar":
        return <RiDeleteBinLine className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isIndeterminate =
    paginatedData.some((item) =>
      selectedRows.has(String(item.id || item.ID))
    ) && !isAllSelected;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-6 h-64">
        <p className="text-base-content/70">Cargando datos</p>
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div
      className={`bg-base-100 rounded-lg overflow-hidden shadow-md ${className}`}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-base-300">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-base-content">
                {title}
              </h3>
              <p className="text-sm text-base-content/70 mt-1">{subTitle}</p>
            </div>

            <div className="flex items-center gap-2">
              {addButton &&
                (typeof addButton === "function" ? (
                  addButton()
                ) : (
                  <button
                    onClick={addButton.onClick}
                    className={`btn ${
                      addButton.variant === "primary"
                        ? "btn-primary"
                        : addButton.variant === "secondary"
                        ? "btn-secondary"
                        : addButton.variant === "success"
                        ? "btn-success"
                        : addButton.variant === "warning"
                        ? "btn-warning"
                        : addButton.variant === "info"
                        ? "btn-info"
                        : addButton.variant === "error"
                        ? "btn-error"
                        : addButton.variant === "ghost"
                        ? "btn-ghost"
                        : "btn-primary"
                    } btn-sm ${addButton.className || ""}`}
                  >
                    {addButton.icon || <RiAddLine className="w-4 h-4" />}
                    <span className="hidden sm:inline">{addButton.text}</span>
                  </button>
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

          {/* Search - Mobile First */}
          {searchable && (
            <div className="flex flex-row gap-2 w-full sm:w-auto md:max-w-md">
              <div className="relative w-full md:w-64">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70 z-10 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered pl-10 w-full md:w-64"
                />
              </div>
              {searchEndContent}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden">
        {paginatedData.length === 0 ? (
          <div className="text-center py-8 text-base-content px-4">
            {emptyMessage}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {paginatedData.map((row, index) => {
              const rowId = String(row.id || row.ID || index);
              const isSelected = selectedRows.has(rowId);

              return (
                <div
                  key={rowId}
                  className={`card bg-base-200 shadow-sm border ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-base-300"
                  }`}
                >
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between mb-3">
                      {selectable && (
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm mt-1"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectRow(rowId, e.target.checked)
                          }
                        />
                      )}
                      {actions.length > 0 && (
                        <div className="flex gap-1">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => handleAction(action, row)}
                              className={`btn btn-xs ${
                                action.variant === "error"
                                  ? "btn-error"
                                  : action.variant === "primary"
                                  ? "btn-primary"
                                  : action.variant === "secondary"
                                  ? "btn-secondary"
                                  : action.variant === "success"
                                  ? "btn-success"
                                  : action.variant === "warning"
                                  ? "btn-warning"
                                  : action.variant === "info"
                                  ? "btn-info"
                                  : "btn-ghost"
                              } ${action.className || ""}`}
                              title={action.label}
                            >
                              {getActionIcon(action)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {visibleColumnsFiltered.map((column) => (
                        <div
                          key={String(column.key)}
                          className="flex flex-col sm:flex-row sm:justify-between"
                        >
                          <span className="text-sm font-semibold text-base-content mb-1 sm:mb-0">
                            {column.label}:
                          </span>
                          <span className="text-sm text-base-content/80 break-words">
                            {renderCell(column, row[column.key], row)}
                          </span>
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
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50">
              {selectable && (
                <th className="w-12 font-semibold text-base-content">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {visibleColumnsFiltered.map((column) => (
                <th
                  key={String(column.key)}
                  className={`font-semibold text-base-content ${
                    column.className || ""
                  } ${
                    column.sortable
                      ? "cursor-pointer select-none group hover:bg-base-300/50 transition-colors"
                      : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="ml-2 flex-shrink-0">
                        {getSortIcon(column.key)}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-right font-semibold text-base-content">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumnsFiltered.length +
                    (selectable ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="text-center py-8 text-base-content/70"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = String(row.id || row.ID || index);
                const isSelected = selectedRows.has(rowId);

                return (
                  <tr key={rowId} className={isSelected ? "bg-primary/10" : ""}>
                    {selectable && (
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectRow(rowId, e.target.checked)
                          }
                        />
                      </td>
                    )}
                    {visibleColumnsFiltered.map((column) => (
                      <td key={String(column.key)} className={column.className}>
                        {renderCell(column, row[column.key], row)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="flex justify-end px-4 py-3">
                        <div className="flex gap-2">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => handleAction(action, row)}
                              className={`btn btn-sm ${
                                action.variant === "error"
                                  ? "btn-error"
                                  : action.variant === "primary"
                                  ? "btn-primary"
                                  : action.variant === "secondary"
                                  ? "btn-secondary"
                                  : action.variant === "success"
                                  ? "btn-success"
                                  : action.variant === "warning"
                                  ? "btn-warning"
                                  : action.variant === "info"
                                  ? "btn-info"
                                  : "btn-ghost"
                              } ${action.className || ""}`}
                              title={action.label}
                            >
                              {getActionIcon(action)}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && paginationInfo.totalPages > 1 && (
        <div className="p-4 border-t border-base-300">
          {/* Mobile Pagination */}
          <div className="block md:hidden">
            <div className="flex flex-col gap-4">
              {/* Items info and per page selector */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-base-content/70 text-center sm:text-left">
                  {paginationInfo.startItem}-{paginationInfo.endItem} de{" "}
                  {paginationInfo.totalItems}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-base-content/70">
                    Por página:
                  </span>
                  <select
                    value={itemsPerPageState}
                    onChange={(e) => {
                      setItemsPerPageState(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="select select-bordered select-sm w-20"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="btn btn-ghost btn-sm px-2"
                    title="Primera página"
                  >
                    <RiSkipBackLine className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="btn btn-ghost btn-sm px-2"
                    title="Anterior"
                  >
                    <RiArrowLeftSLine className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-sm text-base-content/70">
                    {currentPage} / {paginationInfo.totalPages}
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, paginationInfo.totalPages)
                      )
                    }
                    disabled={currentPage === paginationInfo.totalPages}
                    className="btn btn-ghost btn-sm px-2"
                    title="Siguiente"
                  >
                    <RiArrowRightSLine className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(paginationInfo.totalPages)}
                    disabled={currentPage === paginationInfo.totalPages}
                    className="btn btn-ghost btn-sm px-2"
                    title="Última página"
                  >
                    <RiSkipForwardLine className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/70">
                  Items per page
                </span>
                <select
                  value={itemsPerPageState}
                  onChange={(e) => {
                    setItemsPerPageState(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="select select-bordered select-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="text-sm text-base-content/70">
                Showing {paginationInfo.startItem}-{paginationInfo.endItem} out
                of {paginationInfo.totalItems}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm px-2"
                title="First Page"
              >
                <RiSkipBackLine className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm"
              >
                <RiArrowLeftSLine className="w-4 h-4" />
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, paginationInfo.totalPages) },
                  (_, i) => {
                    let pageNum;
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
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`btn btn-sm ${
                          pageNum === currentPage ? "btn-primary" : "btn-ghost"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginationInfo.totalPages)
                  )
                }
                disabled={currentPage === paginationInfo.totalPages}
                className="btn btn-ghost btn-sm"
              >
                Next
                <RiArrowRightSLine className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage(paginationInfo.totalPages)}
                disabled={currentPage === paginationInfo.totalPages}
                className="btn btn-ghost btn-sm px-2"
                title="Last Page"
              >
                <RiSkipForwardLine className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
