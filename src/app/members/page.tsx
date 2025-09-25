'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiAddLine, RiSettings3Line } from 'react-icons/ri';
import { DataTable, LoadingSkeleton } from '@/components';
import { TableColumn, TableAction, AddButtonConfig } from '@/types';
import { useMembers } from '@/app/members/hooks/useMembers';
import { Member } from '@/types';
import { useColumnVisibilityStore } from '@/components/ColumnVisibilityDropdown';

// Tipo para los datos transformados de la tabla
type MemberTableData = Omit<
  Member,
  | 'gender'
  | 'birthDate'
  | 'baptismDate'
  | 'createdAt'
  | 'updatedAt'
  | 'passwordHash'
  | 'pictureUrl'
  | 'age'
  | 'street'
  | 'city'
  | 'state'
  | 'zip'
  | 'country'
> & {
  birthDate: string;
  baptismDate: string;
  address: string;
};

// Función para transformar Member a formato de tabla
const transformMemberToTableData = (member: Member): MemberTableData => ({
  id: member.id,
  firstName: member.firstName,
  lastName: member.lastName,
  email: member.email,
  phone: member.phone || 'N/A',
  role: member.role,
  notes: member.notes || 'N/A',
  skills: member.skills || 'N/A',
  address: `${member.street || ''}, ${member.city || ''}, ${
    member.state || ''
  }, ${member.country || ''}`,
  ministerio: member.ministerio,
  birthDate: member.birthDate
    ? new Date(member.birthDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A',
  baptismDate: member.baptismDate
    ? new Date(member.baptismDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A',
});

export default function MembersPage() {
  const router = useRouter();

  // Usar Zustand store para manejar la visibilidad de columnas
  const {
    visibleColumns,
    toggleColumn,
    showAllColumns,
    hideAllColumns,
    initializeColumns
  } = useColumnVisibilityStore();

  // Inicializar columnas por defecto
  useEffect(() => {
    const defaultColumns = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'role',
      'ministerio',
      'birthDate',
      'baptismDate',
    ];
    initializeColumns(defaultColumns);
  }, [initializeColumns]);

  const {
    data: membersData,
    isLoading: loading,
    error,
    refetch,
  } = useMembers();

  // Transformar los datos de Member a formato de tabla
  const members = membersData
    ? membersData.map(transformMemberToTableData)
    : [];

  // Configuración de todas las columnas disponibles
  const allColumns: TableColumn<MemberTableData>[] = [
    {
      key: 'firstName',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'lastName',
      label: 'Apellidos',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Teléfono',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Dirección',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
    },
    {
      key: 'ministerio',
      label: 'Ministerio',
      sortable: true,
    },
    {
      key: 'notes',
      label: 'Notas',
      sortable: true,
    },
    {
      key: 'skills',
      label: 'Habilidades',
      sortable: true,
    },
    {
      key: 'birthDate',
      label: 'Fecha de Nacimiento',
      sortable: true,
    },
    {
      key: 'baptismDate',
      label: 'Fecha de Bautismo',
      sortable: true,
    },
  ];

  // Filtrar columnas basándose en la visibilidad
  const visibleColumnsArray = allColumns.filter((column) =>
    visibleColumns.has(String(column.key))
  );

  // Configuración de acciones para cada fila
  const actions: TableAction<MemberTableData>[] = [
    {
      label: 'Ver',
      variant: 'info',
      onClick: (row) => {
        router.push(`/members/${row.id}`);
      },
    },
    {
      label: 'Editar',
      variant: 'primary',
      onClick: (row) => {
        router.push(`/members/${row.id}/edit`);
      },
    },
    {
      label: 'Eliminar',
      variant: 'error',
      onClick: (row) => {
        if (
          confirm(
            `¿Estás seguro de que quieres eliminar a ${row.firstName} ${row.lastName}?`
          )
        ) {
          // Aquí iría la lógica para eliminar el miembro
          console.log('Eliminando miembro:', row.id);
        }
      },
    },
  ];

  // Configuración del botón de agregar (enfoque actual)
  const addButtonConfig: AddButtonConfig = {
    text: 'Agregar Miembro',
    onClick: () => router.push('/members/new'),
    variant: 'primary',
    icon: <RiAddLine className="w-4 h-4" />,
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="skeleton h-8 w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Mostrar estado de error
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="alert alert-error max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Error al cargar los datos</h3>
                <div className="text-xs">
                  {error?.message || 'Error desconocido'}
                </div>
              </div>
            </div>
            <button className="btn btn-primary mt-4" onClick={() => refetch()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <DataTable<MemberTableData>
        title="Miembros"
        subTitle="Lista de miembros de la iglesia"
        data={members}
        columns={visibleColumnsArray}
        actions={actions}
        searchable
        selectable
        pagination={true}
        itemsPerPage={10}
        className="bg-base-100 rounded-lg shadow-sm"
        addButton={addButtonConfig}
        // Props para visibilidad de columnas
        allColumns={allColumns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onShowAllColumns={showAllColumns}
         onHideAllColumns={hideAllColumns}
        showColumnVisibility={true}
      />
    </div>
  );
}
