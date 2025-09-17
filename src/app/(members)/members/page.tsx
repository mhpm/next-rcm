'use client';
import { useRouter } from 'next/navigation';
import { RiAddLine } from 'react-icons/ri';
import { DataTable } from '@/components';
import { TableColumn, TableAction, Member, AddButtonConfig } from '@/types';
import { useState, useEffect } from 'react';

// Función para transformar Member a formato de tabla
const transformMemberToTableData = (member: Member) => ({
  id: member.id,
  firstName: member.firstName,
  lastName: member.lastName,
  email: member.email,
  phone: member.phone,
  role: member.role,
  gender: member.gender,
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
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch de datos de la API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/members');

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          // Transformar los datos de Member a formato de tabla
          const transformedData = result.data.map(transformMemberToTableData);
          setMembers(transformedData);
        } else {
          throw new Error(result.error || 'Error desconocido');
        }
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(
          err instanceof Error ? err.message : 'Error al cargar los miembros'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Configuración de columnas para la tabla
  const columns: TableColumn<Member>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{String(value)}</span>
      ),
    },
    {
      key: 'firstName',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'lastName',
      label: 'Apellido',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Teléfono',
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

  // Configuración de acciones para cada fila
  const actions: TableAction<Member>[] = [
    {
      label: 'Ver',
      variant: 'ghost',
    },
    {
      label: 'Editar',
      variant: 'primary',
    },
    {
      label: 'Eliminar',
      variant: 'error',
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="text-gray-600">Cargando miembros...</p>
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
                <div className="text-xs">{error}</div>
              </div>
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <DataTable<Member>
        title="Miembros"
        subTitle="Lista de miembros de la iglesia"
        data={members}
        columns={columns}
        actions={actions}
        searchable
        selectable
        pagination={true}
        itemsPerPage={5}
        className="bg-base-100 rounded-lg shadow-sm"
        addButton={addButtonConfig}
      />
    </div>
  );
}
