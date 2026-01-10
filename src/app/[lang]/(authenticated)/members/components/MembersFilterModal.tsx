'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { RiFilter3Line } from 'react-icons/ri';
import { MemberRole } from '@/generated/prisma/enums';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputField, SelectField, DateField } from '@/components/FormControls';
import { useMinistries } from '@/app/[lang]/(authenticated)/ministries/hooks/useMinistries';
import { getNetworks } from '../actions/networks.actions';
import {
  getAllZones,
  getSectorHierarchy,
} from '@/app/[lang]/(authenticated)/sectors/actions/sectors.actions';
import { useQuery } from '@tanstack/react-query';
// ScrollArea no está disponible; usamos un contenedor con overflow

type MembersFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  activeFilters: Record<string, any>;
};

export default function MembersFilterModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  activeFilters,
}: MembersFilterModalProps) {
  const { handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: activeFilters,
  });

  const watchZone = watch('zoneName');
  const watchSector = watch('sectorName');
  const watchSubSector = watch('subSectorName');

  const { data: ministriesData, isLoading: isLoadingMinistries } =
    useMinistries({
      limit: 100, // Cargar suficientes ministerios
    });

  const { data: networksData, isLoading: isLoadingNetworks } = useQuery({
    queryKey: ['networks'],
    queryFn: () => getNetworks(),
  });

  const { data: zonesData, isLoading: isLoadingZones } = useQuery({
    queryKey: ['zones'],
    queryFn: () => getAllZones(),
  });

  const { data: hierarchyData, isLoading: isLoadingHierarchy } = useQuery({
    queryKey: ['sectors-hierarchy'],
    queryFn: () => getSectorHierarchy(),
  });

  const zoneOptions = React.useMemo(() => {
    if (!zonesData) return [{ value: '', label: 'Todas' }];
    return [
      { value: '', label: 'Todas' },
      ...zonesData.map((zone) => ({
        value: zone.name,
        label: zone.name,
      })),
    ];
  }, [zonesData]);

  const sectorOptions = React.useMemo(() => {
    if (!hierarchyData) return [{ value: '', label: 'Todos' }];

    // Si hay una zona seleccionada, filtrar sectores por esa zona
    let filteredSectors = hierarchyData;
    if (watchZone) {
      filteredSectors = hierarchyData.filter((s) => s.zone?.name === watchZone);
    }

    return [
      { value: '', label: 'Todos' },
      ...filteredSectors.map((sector) => ({
        value: sector.name,
        label: sector.name,
      })),
    ];
  }, [hierarchyData, watchZone]);

  const subSectorOptions = React.useMemo(() => {
    if (!hierarchyData || !watchSector) return [{ value: '', label: 'Todos' }];

    const selectedSector = hierarchyData.find((s) => s.name === watchSector);
    if (!selectedSector) return [{ value: '', label: 'Todos' }];

    return [
      { value: '', label: 'Todos' },
      ...selectedSector.subSectors.map((ss) => ({
        value: ss.name,
        label: ss.name,
      })),
    ];
  }, [hierarchyData, watchSector]);

  const cellOptions = React.useMemo(() => {
    if (!hierarchyData || !watchSector || !watchSubSector)
      return [{ value: '', label: 'Todas' }];

    const selectedSector = hierarchyData.find((s) => s.name === watchSector);
    if (!selectedSector) return [{ value: '', label: 'Todas' }];

    const selectedSubSector = selectedSector.subSectors.find(
      (ss) => ss.name === watchSubSector
    );
    if (!selectedSubSector) return [{ value: '', label: 'Todas' }];

    return [
      { value: '', label: 'Todas' },
      ...selectedSubSector.cells.map((cell) => ({
        value: cell.name,
        label: cell.name,
      })),
    ];
  }, [hierarchyData, watchSector, watchSubSector]);

  // Reset dependent fields when parent changes
  React.useEffect(() => {
    if (isOpen) {
      // Si cambia la zona y el sector actual no pertenece a esa zona, resetear sector
      if (watchZone && hierarchyData) {
        const sector = hierarchyData.find((s) => s.name === watchSector);
        if (sector && sector.zone?.name !== watchZone) {
          setValue('sectorName', '');
        }
      }
    }
  }, [watchZone, setValue, isOpen, hierarchyData, watchSector]);

  React.useEffect(() => {
    if (isOpen) {
      setValue('subSectorName', '');
      setValue('cellName', '');
    }
  }, [watchSector, setValue, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setValue('cellName', '');
    }
  }, [watchSubSector, setValue, isOpen]);

  const ministryOptions = React.useMemo(() => {
    if (!ministriesData?.ministries) return [{ value: '', label: 'Todos' }];
    return [
      { value: '', label: 'Todos' },
      ...ministriesData.ministries.map((ministry) => ({
        value: ministry.name, // Usamos el nombre para filtrar por nombre como estaba antes, o ID si el filtro lo requiere
        label: ministry.name,
      })),
    ];
  }, [ministriesData]);

  const networkOptions = React.useMemo(() => {
    if (!networksData) return [{ value: '', label: 'Todas' }];
    return [
      { value: '', label: 'Todas' },
      ...networksData.map((network) => ({
        value: network.name,
        label: network.name,
      })),
    ];
  }, [networksData]);

  // Update form when activeFilters change (e.g. when opening)
  React.useEffect(() => {
    reset(activeFilters);
  }, [activeFilters, reset, isOpen]);

  const onSubmit = (data: Record<string, any>) => {
    const formattedData = { ...data };

    // Helper to format date safely to YYYY-MM-DD
    const formatDateToYMD = (val: string) => {
      if (!val) return val;
      // Si ya está en formato YYYY-MM-DD, no hacemos nada
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        // Usamos los métodos locales para asegurar que el día no cambie
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return val;
      }
    };

    // Format date fields
    [
      'birthDate_from',
      'birthDate_to',
      'baptismDate_from',
      'baptismDate_to',
    ].forEach((key) => {
      if (formattedData[key]) {
        formattedData[key] = formatDateToYMD(formattedData[key]);
      }
    });

    // Filter out empty values
    const cleanData = Object.entries(formattedData).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    onApply(cleanData);
    onClose();
  };

  const handleClear = () => {
    reset({});
    onClear();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiFilter3Line className="text-primary" />
            Filtros Avanzados de Miembros
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-h-[60vh] pr-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {/* Rol */}
              <SelectField
                name="role"
                label="Rol"
                control={control}
                options={[
                  { value: '', label: 'Todos' },
                  ...Object.values(MemberRole).map((role) => ({
                    value: role,
                    label: role,
                  })),
                ]}
              />

              {/* Ministerios */}
              <SelectField
                name="ministries"
                label="Ministerio"
                control={control}
                options={ministryOptions}
                placeholder="Seleccionar ministerio..."
                disabled={isLoadingMinistries}
              />

              {/* Red */}
              <SelectField
                name="network"
                label="Red"
                control={control}
                options={networkOptions}
                placeholder="Seleccionar red..."
                disabled={isLoadingNetworks}
              />

              {/* Zona */}
              <SelectField
                name="zoneName"
                label="Zona"
                control={control}
                options={zoneOptions}
                placeholder="Seleccionar zona..."
                disabled={isLoadingZones}
              />

              {/* Sector */}
              <SelectField
                name="sectorName"
                label="Sector"
                control={control}
                options={sectorOptions}
                placeholder="Seleccionar sector..."
                disabled={isLoadingHierarchy}
              />

              {/* Sub-Sector */}
              <SelectField
                name="subSectorName"
                label="Sub-Sector"
                control={control}
                options={subSectorOptions}
                placeholder="Seleccionar sub-sector..."
                disabled={!watchSector || isLoadingHierarchy}
              />

              {/* Célula */}
              <SelectField
                name="cellName"
                label="Célula"
                control={control}
                options={cellOptions}
                placeholder="Seleccionar célula..."
                disabled={!watchSubSector || isLoadingHierarchy}
              />

              {/* Dirección */}
              <InputField
                name="address"
                label="Dirección"
                control={control}
                placeholder="Ciudad, calle, etc..."
              />

              {/* Email */}
              <InputField
                name="email"
                label="Email"
                control={control}
                placeholder="Contiene..."
              />

              {/* Fecha Nacimiento */}
              <DateField
                name="birthDate_from"
                label="Fecha Nacimiento (Desde)"
                control={control}
              />
              <DateField
                name="birthDate_to"
                label="Fecha Nacimiento (Hasta)"
                control={control}
              />

              {/* Fecha Bautismo */}
              <DateField
                name="baptismDate_from"
                label="Fecha Bautismo (Desde)"
                control={control}
              />
              <DateField
                name="baptismDate_to"
                label="Fecha Bautismo (Hasta)"
                control={control}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center w-full sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="text-destructive hover:text-destructive/90"
            >
              Limpiar Filtros
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Aplicar Filtros</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
