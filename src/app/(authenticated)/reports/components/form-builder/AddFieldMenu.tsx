'use client';

import React from 'react';
import type { ReportFieldType } from '@/generated/prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus } from 'lucide-react';

interface AddFieldMenuProps {
  onAdd: (type: ReportFieldType) => void;
  className?: string;
  trigger?: React.ReactElement;
}

export function AddFieldMenu({ onAdd, className = '', trigger }: AddFieldMenuProps) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger ?? (
            <Button type="button" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Añadir
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={() => onAdd('TEXT')}>Texto</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onAdd('NUMBER')}>Número</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onAdd('CURRENCY')}>Moneda</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onAdd('BOOLEAN')}>Sí/No</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onAdd('DATE')}>Fecha</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onAdd('SELECT')}>
            Opción Múltiple
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onAdd('SECTION')}>Sección</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onAdd('MEMBER_SELECT')}>
            Selección de Miembro
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
