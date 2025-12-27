'use client';

import React from 'react';
import { RiSettings3Line } from 'react-icons/ri';
import { TableColumn } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

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
  const visibleCount = visibleColumns.size;
  const totalCount = columns.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <RiSettings3Line className="w-4 h-4" />
          <span className="hidden sm:inline">Columnas</span>
          <Badge variant="outline" className="text-xs px-1">
            {visibleCount}/{totalCount}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-2">
          <div className="text-sm font-semibold">Mostrar/Ocultar Columnas</div>
          <div className="text-xs text-muted-foreground">
            Selecciona las columnas que deseas mostrar
          </div>
        </div>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          const columnKey = String(column.key);
          const isVisible = visibleColumns.has(columnKey);
          return (
            <DropdownMenuCheckboxItem
              key={columnKey}
              checked={isVisible}
              onCheckedChange={() => onToggleColumn(columnKey)}
              onSelect={(e) => e.preventDefault()}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
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
        >
          Mostrar todas
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            if (onHideAllColumns) {
              const allColumnKeys = columns.map((col) => String(col.key));
              onHideAllColumns(allColumnKeys);
            } else {
              if (visibleColumns.size > 1) {
                columns.forEach((column) => {
                  const columnKey = String(column.key);
                  if (visibleColumns.has(columnKey) && columnKey !== 'firstName') {
                    onToggleColumn(columnKey);
                  }
                });
              }
            }
          }}
        >
          Ocultar todas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
