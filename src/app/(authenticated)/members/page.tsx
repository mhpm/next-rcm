"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RiAddLine, RiFilter3Line } from "react-icons/ri";
import { Breadcrumbs, DataTable, BackLink } from "@/components";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  TableColumn,
  TableAction,
  AddButtonConfig,
  MemberTableData,
} from "@/types";
import { useMembers } from "@/app/(authenticated)/members/hooks/useMembers";
import { useColumnVisibilityStore } from "@/components/ColumnVisibilityDropdown";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useDeleteMember } from "@/app/(authenticated)/members/hooks/useMembers";
import { useNotificationStore } from "@/store/NotificationStore";
import { transformMemberToTableData } from "./utils/membersUtils";
import MembersFilterModal from "./components/MembersFilterModal";
import { usePersistentFilters } from "@/hooks/usePersistentFilters";

export default function MembersPage() {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const {
    filters: activeFilters,
    setFilters: setActiveFilters,
    clearFilters,
  } = usePersistentFilters<Record<string, any>>("members-filters", {});

  // Usar Zustand store para manejar la visibilidad de columnas
  const {
    visibleColumns,
    toggleColumn,
    showAllColumns,
    hideAllColumns,
    initializeColumns,
  } = useColumnVisibilityStore();

  // Inicializar columnas por defecto
  useEffect(() => {
    const defaultColumns = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "role",
      "ministries",
      "birthDate",
      "baptismDate",
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
  const members = useMemo(
    () => (membersData ? membersData.map(transformMemberToTableData) : []),
    [membersData]
  );

  const filteredMembers = useMemo(() => {
    let result = members;

    // Apply filters
    if (Object.keys(activeFilters).length > 0) {
      result = result.filter((member) => {
        // Role
        if (activeFilters.role && member.role !== activeFilters.role)
          return false;

        // Ministry
        if (
          activeFilters.ministries &&
          !member.ministries
            .toLowerCase()
            .includes(activeFilters.ministries.toLowerCase())
        )
          return false;

        // Address
        if (
          activeFilters.address &&
          !member.address
            .toLowerCase()
            .includes(activeFilters.address.toLowerCase())
        )
          return false;

        // Email
        if (
          activeFilters.email &&
          !(member.email || "")
            .toLowerCase()
            .includes(activeFilters.email.toLowerCase())
        )
          return false;

        // Birth Date
        if (activeFilters.birthDate_from || activeFilters.birthDate_to) {
          if (!member.raw_birthDate) return false;
          const dateVal = new Date(member.raw_birthDate);
          dateVal.setHours(0, 0, 0, 0);

          if (activeFilters.birthDate_from) {
            const fromDate = new Date(activeFilters.birthDate_from);
            fromDate.setHours(0, 0, 0, 0);
            if (dateVal < fromDate) return false;
          }
          if (activeFilters.birthDate_to) {
            const toDate = new Date(activeFilters.birthDate_to);
            toDate.setHours(0, 0, 0, 0);
            if (dateVal > toDate) return false;
          }
        }

        // Baptism Date
        if (activeFilters.baptismDate_from || activeFilters.baptismDate_to) {
          if (!member.raw_baptismDate) return false;
          const dateVal = new Date(member.raw_baptismDate);
          dateVal.setHours(0, 0, 0, 0);

          if (activeFilters.baptismDate_from) {
            const fromDate = new Date(activeFilters.baptismDate_from);
            fromDate.setHours(0, 0, 0, 0);
            if (dateVal < fromDate) return false;
          }
          if (activeFilters.baptismDate_to) {
            const toDate = new Date(activeFilters.baptismDate_to);
            toDate.setHours(0, 0, 0, 0);
            if (dateVal > toDate) return false;
          }
        }

        return true;
      });
    }

    return result;
  }, [members, activeFilters]);

  // Configuración de todas las columnas disponibles
  const allColumns: TableColumn<MemberTableData>[] = [
    {
      key: "firstName",
      label: "Nombre",
      sortable: true,
    },
    {
      key: "lastName",
      label: "Apellidos",
      sortable: true,
    },
    {
      key: "phone",
      label: "Teléfono",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "address",
      label: "Dirección",
      sortable: true,
    },
    {
      key: "role",
      label: "Rol",
      sortable: true,
    },
    {
      key: "ministries",
      label: "Ministerios",
      sortable: true,
    },
    {
      key: "notes",
      label: "Notas",
      sortable: true,
    },
    {
      key: "birthDate",
      label: "Fecha de Nacimiento",
      sortable: true,
    },
    {
      key: "baptismDate",
      label: "Fecha de Bautismo",
      sortable: true,
    },
  ];

  // Filtrar columnas basándose en la visibilidad
  const visibleColumnsArray = allColumns.filter((column) =>
    visibleColumns.has(String(column.key))
  );

  // Estado y lógica para el modal de confirmación de eliminado
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberTableData | null>(
    null
  );
  const deleteMemberMutation = useDeleteMember();

  const openDeleteModal = (row: MemberTableData) => {
    setSelectedMember(row);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMember) return;

    deleteMemberMutation.mutate(selectedMember.id, {
      onSuccess: () => {
        showSuccess("Miembro eliminado exitosamente");
        closeDeleteModal();
        refetch();
      },
      onError: (error) => {
        showError("Error al eliminar miembro");
        console.error("Error al eliminar miembro:", error);
      },
    });
  };

  // Configuración de acciones para cada fila
  const actions: TableAction<MemberTableData>[] = [
    {
      label: "Editar",
      variant: "ghost",
      onClick: (row) => {
        router.push(`/members/edit/${row.id}`);
      },
    },
    {
      label: "Eliminar",
      variant: "ghost",
      onClick: (row) => {
        openDeleteModal(row);
      },
    },
  ];

  // Configuración del botón de agregar (enfoque actual)
  const addButtonConfig: AddButtonConfig = {
    text: "Agregar Miembro",
    onClick: () => router.push("/members/new"),
    variant: "default",
    icon: <RiAddLine className="w-4 h-4" />,
  };

  // Mostrar estado de error
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Error al cargar los datos
              </h3>
              <p className="text-sm text-muted-foreground">
                {error?.message || "Error desconocido"}
              </p>
              <div className="mt-4">
                <Button onClick={() => refetch()}>Reintentar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <DataTable<MemberTableData>
        selectable={true}
        title="Miembros"
        subTitle={`Total de miembros en la iglesia: ${filteredMembers.length}`}
        data={filteredMembers}
        columns={visibleColumnsArray}
        actions={actions}
        searchable
        pagination={true}
        itemsPerPage={10}
        addButton={addButtonConfig}
        // Props para visibilidad de columnas
        allColumns={allColumns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onShowAllColumns={showAllColumns}
        onHideAllColumns={hideAllColumns}
        showColumnVisibility={true}
        loading={loading}
        searchEndContent={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Button
                    type="button"
                    variant={
                      Object.keys(activeFilters).length > 0
                        ? "default"
                        : "ghost"
                    }
                    size="sm"
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    <RiFilter3Line className="w-5 h-5" />
                  </Button>
                  {Object.keys(activeFilters).length > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1 py-0 text-[10px] animate-pulse">
                      !
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>Filtros avanzados</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />

      <MembersFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setActiveFilters}
        onClear={clearFilters}
        activeFilters={activeFilters}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        entityName={
          selectedMember
            ? `${selectedMember.firstName} ${selectedMember.lastName}`
            : undefined
        }
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isPending={deleteMemberMutation.isPending}
      />
    </div>
  );
}
