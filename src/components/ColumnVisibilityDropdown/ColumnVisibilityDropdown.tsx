'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RiSettings3Line } from 'react-icons/ri';
import { TableColumn } from '@/types';

interface ColumnVisibilityDropdownProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  visibleColumns: Set<string>;
  onToggleColumn: (columnKey: string) => void;
  onShowAllColumns?: (columnKeys: string[]) => void;
  onHideAllColumns?: (columnKeys: string[]) => void;
}

export function ColumnVisibilityDropdown<T = Record<string, unknown>>({
  columns,
  visibleColumns,
  onToggleColumn,
  onShowAllColumns,
  onHideAllColumns,
}: ColumnVisibilityDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleColumn = (columnKey: string) => {
    onToggleColumn(columnKey);
  };

  const visibleCount = visibleColumns.size;
  const totalCount = columns.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm gap-2"
        title="Configurar columnas"
      >
        <RiSettings3Line className="w-4 h-4" />
        <span className="hidden sm:inline">Columnas</span>
        <span className="badge badge-sm">
          {visibleCount}/{totalCount}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-base-300">
            <h3 className="font-semibold text-sm text-base-content">
              Mostrar/Ocultar Columnas
            </h3>
            <p className="text-xs text-base-content/70 mt-1">
              Selecciona las columnas que deseas mostrar
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {columns.map((column) => {
              const columnKey = String(column.key);
              const isVisible = visibleColumns.has(columnKey);

              return (
                <label
                  key={columnKey}
                  className="flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => handleToggleColumn(columnKey)}
                      className="checkbox checkbox-sm"
                    />
                  </div>
                  <span className="text-sm text-base-content flex-1">
                    {column.label}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="p-3 border-t border-base-300 bg-base-50">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (onShowAllColumns) {
                    const allColumnKeys = columns.map((col) => String(col.key));
                    onShowAllColumns(allColumnKeys);
                  } else {
                    columns.forEach((column) => {
                      const columnKey = String(column.key);
                      if (!visibleColumns.has(columnKey)) {
                        onToggleColumn(columnKey);
                      }
                    });
                  }
                }}
                className="btn btn-xs btn-ghost flex-1"
              >
                Mostrar todas
              </button>
              <button
                onClick={() => {
                  if (onHideAllColumns) {
                    const allColumnKeys = columns.map((col) => String(col.key));
                    onHideAllColumns(allColumnKeys);
                  } else {
                    // Mantener al menos una columna visible
                    if (visibleColumns.size > 1) {
                      columns.forEach((column) => {
                        const columnKey = String(column.key);
                        if (
                          visibleColumns.has(columnKey) &&
                          columnKey !== 'firstName'
                        ) {
                          onToggleColumn(columnKey);
                        }
                      });
                    }
                  }
                }}
                className="btn btn-xs btn-ghost flex-1"
              >
                Ocultar todas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
