'use client';

import React, { useState, useMemo } from 'react';
import {
  RiSearchLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiEdit2Fill,
} from 'react-icons/ri';
import { DataTableProps, PaginationInfo } from '@/types';

function DataTable<T extends Record<string, unknown>>({
  data,
  title = '',
  subTitle = '',
  columns,
  actions = [],
  searchable = true,
  searchPlaceholder = 'Search by all fields',
  selectable = true,
  pagination = true,
  itemsPerPage = 10,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onSelectionChange,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
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
  }, [data, searchTerm, columns]);

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

    return String(value || '');
  };

  // Handle action clicks
  const handleAction = (actionLabel: string, row: T) => {
    switch (actionLabel) {
      case 'Ver':
        console.log('Ver miembro:', row.id);
        break;
      case 'Editar':
        window.location.href = `/members/${row.id}/edit`;
        break;
      case 'Eliminar':
        if (
          confirm(
            `¿Estás seguro de eliminar a ${row.firstName} ${row.lastName}?`
          )
        ) {
          console.log('Eliminar miembro:', row.id);
        }
        break;
      default:
        console.log('Acción no reconocida:', actionLabel);
    }
  };

  // Get action icon
  const getActionIcon = (actionLabel: string) => {
    switch (actionLabel) {
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

  const isIndeterminate =
    paginatedData.some((item) =>
      selectedRows.has(String(item.id || item.ID))
    ) && !isAllSelected;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className={`bg-base-100 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-base-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-base-content">{title}</h3>
            <p className="text-sm text-base-content/70 mt-1">{subTitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {searchable && (
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered pl-10 w-64"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/70">Select a row</span>
              <button className="btn btn-ghost btn-sm">
                <RiArrowLeftSLine className="w-4 h-4" />
              </button>
              <span className="text-sm text-base-content/70">Columns</span>
              <button className="btn btn-ghost btn-sm">⋮</button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="border-b border-base-300">
              {selectable && (
                <th className="w-12">
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
              {columns.map((column) => (
                <th key={String(column.key)} className={column.className}>
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
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
                  <tr key={rowId} className={isSelected ? 'bg-primary/10' : ''}>
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
                    {columns.map((column) => (
                      <td key={String(column.key)} className={column.className}>
                        {renderCell(column, row[column.key], row)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => handleAction(action.label, row)}
                              className={`btn btn-sm ${
                                action.variant === 'error'
                                  ? 'btn-error'
                                  : action.variant === 'primary'
                                  ? 'btn-primary'
                                  : action.variant === 'secondary'
                                  ? 'btn-secondary'
                                  : action.variant === 'success'
                                  ? 'btn-success'
                                  : action.variant === 'warning'
                                  ? 'btn-warning'
                                  : action.variant === 'info'
                                  ? 'btn-info'
                                  : 'btn-ghost'
                              } ${action.className || ''}`}
                              title={action.label}
                            >
                              {getActionIcon(action.label)}
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/70">Items per page</span>
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
                          pageNum === currentPage ? 'btn-primary' : 'btn-ghost'
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
