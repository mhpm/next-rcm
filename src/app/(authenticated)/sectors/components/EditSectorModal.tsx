'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputField, SelectField } from '@/components/FormControls';
import { MemberSearchField } from '@/components/FormControls/MemberSearchField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateSector, useUpdateSubSector } from '../hooks/useSectors';
import { sectorCreateSchema } from '../schema/sectors.schema';
import { z } from 'zod';
import { useNotificationStore } from '@/store/NotificationStore';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SectorNode } from '../types/sectors';
import { useQuery } from '@tanstack/react-query';
import { getAllSectors, getAllZones } from '../actions/sectors.actions';

// We reuse the create schema as it likely has the same validation rules
type FormValues = z.infer<typeof sectorCreateSchema>;

type EditSectorModalProps = {
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  node: SectorNode | null;
};

export default function EditSectorModal({
  open,
  onClose,
  onUpdated,
  node,
}: EditSectorModalProps) {
  // Hooks for updating. We call them unconditionally, but will use only one based on type.
  // Note: hooks like useUpdateSector(id) expect an ID. Since ID changes, we can't use the hook with a fixed ID at top level easily if the hook depends on it for query key invalidation only.
  // However, looking at useSectors.ts, useUpdateSector returns a mutation where the mutationFn takes the data.
  // But wait, the hook definition is: export const useUpdateSector = (id: string) => { ... mutationFn: (data) => updateSector(id, data) ... }
  // This means I need to pass the ID to the hook. This is problematic if ID is null initially.
  // I should probably refactor the hooks or use the mutation directly, or key the component.
  // Or simpler: The hooks seem to be designed for a specific ID.
  // Let's look at the hook again:
  // export const useUpdateSector = (id: string) => { ... }
  // This is slightly annoying for a modal that handles different IDs.
  // I will create a wrapper or just use a key on the modal content to reset hooks? No hooks rules.

  // A better approach for the modal is to NOT use the `useUpdateSector(id)` hook if it bakes the ID in.
  // Or I can use a generic mutation that takes ID as argument.
  // But since I can't easily change the hooks right now without affecting other things,
  // I will use a key on the component that renders the form, OR I will modify the hook usage.

  // Actually, I can just use the mutation function directly if I import the action, but I want to keep the cache invalidation logic.
  // Let's assume I can't change the hooks easily.
  // I'll render the form content only when `node` is present, and pass `node.id` to a child component that calls the hook?
  // Or simpler: Create a component `EditSectorForm` that takes the node and uses the hook.

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {node?.type === 'SUB_SECTOR' ? 'Editar Subsector' : 'Editar Sector'}
          </DialogTitle>
        </DialogHeader>
        {node && (
          <EditFormContent
            node={node}
            onClose={onClose}
            onUpdated={onUpdated}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditFormContent({
  node,
  onClose,
  onUpdated,
}: {
  node: SectorNode;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const isSubSector = node.type === 'SUB_SECTOR';

  // Conditionally use hooks. This is fine because `isSubSector` won't change for a given `node` instance in this component (since we unmount if node is null).
  // However, React warns if hooks order changes.
  // Better to have separate components or just instantiate both mutations if possible, but the hook requires ID.

  // Let's try to be safe and use two different mutations.
  // But the hook `useUpdateSector(id)` requires ID.
  // I'll use the hooks with the current node.id.

  const updateSectorMutation = useUpdateSector(node.id);
  const updateSubSectorMutation = useUpdateSubSector(node.id);

  const { showSuccess, showError } = useNotificationStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(sectorCreateSchema),
    defaultValues: {
      name: node.name,
      supervisorId: node.supervisorId || undefined,
      parentId: node.parentId || undefined,
      zoneId: node.zoneId || undefined,
    },
  });

  // Fetch all sectors for the parent selector (only if it's a subsector)
  const { data: sectorsData } = useQuery({
    queryKey: ['sectors', 'all'],
    queryFn: () => getAllSectors(),
    enabled: isSubSector,
  });

  // Fetch all zones (only if it's a sector)
  const { data: zonesData } = useQuery({
    queryKey: ['zones', 'all'],
    queryFn: () => getAllZones(),
    enabled: !isSubSector,
  });

  const parentOptions = (sectorsData?.sectors || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const zoneOptions = (zonesData || []).map((z) => ({
    value: z.id,
    label: z.name,
  }));

  const onSubmit = async (data: FormValues) => {
    try {
      if (isSubSector) {
        await updateSubSectorMutation.mutateAsync({
          name: data.name,
          supervisorId: data.supervisorId,
          sectorId: data.parentId!, // Required for subsector
        });
      } else {
        await updateSectorMutation.mutateAsync({
          name: data.name,
          supervisorId: data.supervisorId,
          zoneId: data.zoneId,
        });
      }

      showSuccess(
        `${isSubSector ? 'Subsector' : 'Sector'} actualizado correctamente`
      );
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      showError('Error al actualizar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <InputField
        name="name"
        label="Nombre"
        placeholder="Ej. Sector 1"
        register={register}
        error={errors.name?.message}
      />

      {isSubSector && (
        <SelectField
          name="parentId"
          label="Sector Padre"
          control={control}
          options={parentOptions}
          placeholder="Seleccionar sector..."
        />
      )}

      {!isSubSector && (
        <SelectField
          name="zoneId"
          label="Zona"
          control={control}
          options={zoneOptions}
          placeholder="Seleccionar zona..."
        />
      )}

      <div className="space-y-2">
        <MemberSearchField
          name="supervisorId"
          register={register}
          setValue={setValue}
          watch={watch}
          label="Supervisor"
          placeholder="Buscar miembro..."
        />
        {errors.supervisorId && (
          <p className="text-sm text-destructive">
            {errors.supervisorId.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
