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
import { format } from 'date-fns';
import { useMinistries } from '@/app/[lang]/(authenticated)/ministries/hooks/useMinistries';
import { getNetworks } from '../actions/networks.actions';
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
  const { handleSubmit, reset, control } = useForm({
    defaultValues: activeFilters,
  });

  const { data: ministriesData, isLoading: isLoadingMinistries } =
    useMinistries({
      limit: 100, // Cargar suficientes ministerios
    });

  const { data: networksData, isLoading: isLoadingNetworks } = useQuery({
    queryKey: ['networks'],
    queryFn: () => getNetworks(),
  });

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

    // Helper to format ISO to YYYY-MM-DD
    const formatDate = (val: string) => {
      if (!val) return val;
      try {
        return format(new Date(val), 'yyyy-MM-dd');
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
        formattedData[key] = formatDate(formattedData[key]);
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
