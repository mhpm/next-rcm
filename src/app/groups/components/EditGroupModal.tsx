'use client';

import { Modal } from '@/components/Modal/Modal';
import { InputField } from '@/components/FormControls';
import MemberSearchField from '@/components/FormControls/MemberSearchField';
import { SelectField } from '@/components/FormControls/SelectField';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateGroup, useGroupsList } from '../hooks/useGroups';
import { useNotificationStore } from '@/store/NotificationStore';
import { searchGroups, getGroupById } from '../actions/groups.actions';

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  leaderId: z.string().optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

type EditGroupModalProps = {
  open: boolean;
  onClose: () => void;
  group: {
    id: string;
    name: string;
    leaderId?: string | null;
    parentId?: string | null;
  } | null;
  onUpdated?: () => void;
};

export default function EditGroupModal({
  open,
  onClose,
  group,
  onUpdated,
}: EditGroupModalProps) {
  const updateMutation = useUpdateGroup();
  const { showSuccess, showError } = useNotificationStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: group?.name || '',
      leaderId: group?.leaderId || '',
      parentId: group?.parentId || '',
    },
    mode: 'onChange',
    values: {
      name: group?.name || '',
      leaderId: group?.leaderId || '',
      parentId: group?.parentId || '',
    },
  });

  const { data: groupsList } = useGroupsList(group?.id);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset({
          name: group?.name || '',
          leaderId: group?.leaderId || '',
          parentId: group?.parentId || '',
        });
      }}
      title="Editar Grupo"
    >
      <form
        suppressHydrationWarning
        onSubmit={handleSubmit(async (form) => {
          if (!group) return;
          try {
            await updateMutation.mutateAsync({
              id: group.id,
              data: {
                name: form.name,
                leaderId: form.leaderId || undefined,
                parentId: form.parentId || undefined,
              },
            });
            showSuccess('Grupo actualizado');
            onClose();
            onUpdated?.();
          } catch (e) {
            const message =
              e instanceof Error ? e.message : 'Error al actualizar el grupo';
            showError(message);
          }
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <InputField<FormValues>
            name="name"
            label="Nombre del Grupo"
            register={register}
            rules={{ required: 'El nombre es requerido' }}
            error={errors.name?.message}
          />

          <MemberSearchField<FormValues>
            name="leaderId"
            label="Líder"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.leaderId?.message as string}
          />

          <SelectField<FormValues>
            name="parentId"
            label="Grupo padre"
            register={register}
            defaultValue={group?.parentId || ''}
            error={errors.parentId?.message}
            options={[
              { value: '', label: 'Sin grupo padre' },
              ...(groupsList || []).map((g) => ({
                value: g.id,
                label: g.name,
              })),
            ]}
          />
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onClose()}
            disabled={updateMutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
