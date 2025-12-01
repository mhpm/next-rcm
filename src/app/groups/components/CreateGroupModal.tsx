'use client';

import { Modal } from '@/components/Modal/Modal';
import { InputField } from '@/components/FormControls';
import MemberSearchField from '@/components/FormControls/MemberSearchField';
import AutocompleteField from '@/components/FormControls/AutocompleteField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupCreateSchema } from '../schema/groups.schema';
import type { GroupCreateSchema } from '../schema/groups.schema';
import { useCreateGroup } from '../hooks/useGroups';
import { useNotificationStore } from '@/store/NotificationStore';
import { searchGroups, getGroupById } from '../actions/groups.actions';

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialParentId?: string;
};

export default function CreateGroupModal({
  open,
  onClose,
  onCreated,
  initialParentId,
}: CreateGroupModalProps) {
  const createMutation = useCreateGroup();
  const { showSuccess, showError } = useNotificationStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GroupCreateSchema>({
    resolver: zodResolver(groupCreateSchema),
    defaultValues: { name: '', leaderId: '', parentId: initialParentId || '' },
    mode: 'onChange',
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset({ name: '', leaderId: '', parentId: initialParentId || '' });
      }}
      title="Nuevo Grupo"
    >
      <form
        suppressHydrationWarning
        onSubmit={handleSubmit(async (form) => {
          try {
            await createMutation.mutateAsync({
              name: form.name,
              leaderId: form.leaderId || undefined,
              parentId: form.parentId || undefined,
            });
            showSuccess('Grupo creado exitosamente');
            onClose();
            reset({ name: '', leaderId: '', parentId: initialParentId || '' });
            onCreated?.();
          } catch (e) {
            const message =
              e instanceof Error ? e.message : 'Error al crear el grupo';
            showError(message);
          }
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <InputField<GroupCreateSchema>
            name="name"
            label="Nombre del Grupo"
            register={register}
            rules={{ required: 'El nombre es requerido' }}
            error={errors.name?.message}
          />

          <MemberSearchField<GroupCreateSchema>
            name="leaderId"
            label="Líder (opcional)"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.leaderId?.message as string}
          />

          <AutocompleteField<GroupCreateSchema, { id: string; name: string }>
            name="parentId"
            label="Grupo padre (opcional)"
            placeholder="Buscar grupos por nombre..."
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.parentId?.message}
            minChars={2}
            search={async (term) => searchGroups(term)}
            resolveById={async (id) => {
              const g = await getGroupById(id);
              return g ? { id: g.id, name: g.name } : null;
            }}
            getItemId={(g) => g.id}
            getItemLabel={(g) => g.name}
          />
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              onClose();
              reset({
                name: '',
                leaderId: '',
                parentId: initialParentId || '',
              });
            }}
            disabled={createMutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Crear'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
