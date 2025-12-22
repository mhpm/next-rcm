'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ReportScope } from '@/generated/prisma/client';
import { updateReportWithFields } from '../actions/reports.actions';
import { useRouter } from 'next/navigation';
import { ReportFormValues, FieldItem, ReportBuilder } from './form-builder';
import { useNotificationStore } from '@/store/NotificationStore';

export default function EditReportForm({
  initial,
}: {
  initial: {
    id: string;
    title: string;
    description?: string | null;
    scope: ReportScope;
    fields: FieldItem[];
    color?: string | null;
  };
}) {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ReportFormValues>({
    defaultValues: {
      title: initial.title,
      description: initial.description ?? undefined,
      scope: initial.scope,
      fields: initial.fields,
      color: initial.color || '#3b82f6',
    },
  });

  // Force reset when initial data changes (e.g., navigating back/forward)
  useEffect(() => {
    reset({
      title: initial.title,
      description: initial.description ?? undefined,
      scope: initial.scope,
      fields: initial.fields,
      color: initial.color || '#3b82f6',
    });
  }, [initial, reset]);

  const onSubmit = async (data: ReportFormValues) => {
    try {
      await updateReportWithFields({
        id: initial.id,
        title: data.title,
        description: data.description,
        scope: data.scope,
        color: data.color || '#3b82f6',
        fields: (data.fields || []).map((f, index) => {
          let key = f.key;
          if (f.type === 'SECTION' && !key) {
            key = `section_${index}_${Math.random().toString(36).substr(2, 9)}`;
          }
          return {
            id: f.fieldId, // This is the ID of existing field in DB
            key: key,
            label: f.label ?? null,
            type: f.type,
            required: f.required ?? false,
            // value is optional in schema, send if present
            ...(f.value !== undefined ? { value: f.value } : {}),
            options: f.options?.map((o) => o.value),
            width: 12, // Default width
            order: index, // Send order just in case we add it later
          };
        }),
      });
      showSuccess('Reporte actualizado correctamente');
    } catch (error) {
      console.error(error);
      showError('Error al actualizar el reporte');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="prose max-w-none">
          <h1 className="text-2xl font-bold">Editar Reporte</h1>
          <p className="text-base-content/70">
            Modifica la estructura de tu reporte.
          </p>
        </div>
        <button
          onClick={() => {
            if (
              confirm('¿Estás seguro? Se perderán los cambios no guardados.')
            ) {
              router.push('/reports');
            }
          }}
          className="btn btn-ghost"
        >
          Cancelar
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <ReportBuilder
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
        />

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            className="btn"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Volver
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
