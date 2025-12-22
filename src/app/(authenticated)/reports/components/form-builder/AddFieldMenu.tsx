'use client';

import React from 'react';
import type { ReportFieldType } from '@/generated/prisma/client';

interface AddFieldMenuProps {
  onAdd: (type: ReportFieldType) => void;
  className?: string;
  trigger?: React.ReactNode;
}

export function AddFieldMenu({ onAdd, className = '', trigger }: AddFieldMenuProps) {
  const isTop = className.includes('dropdown-top');

  return (
    <div className={`dropdown dropdown-end ${className}`}>
      {trigger ? (
        <div tabIndex={0} role="button" className="w-full">
          {trigger}
        </div>
      ) : (
        <div tabIndex={0} role="button" className="btn btn-primary btn-sm gap-2">
          <span>+ Añadir</span>
          <span className="text-xs">{isTop ? '▲' : '▼'}</span>
        </div>
      )}
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <button type="button" onClick={() => onAdd('TEXT')}>
            Texto
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onAdd('NUMBER')}>
            Número
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onAdd('CURRENCY')}>
            Moneda
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onAdd('BOOLEAN')}>
            Sí/No
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onAdd('DATE')}>
            Fecha
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onAdd('SELECT')}>
            Opción Múltiple
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onAdd('SECTION')}>
            Sección
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onAdd('MEMBER_SELECT')}>
            Selección de Miembro
          </button>
        </li>
      </ul>
    </div>
  );
}
