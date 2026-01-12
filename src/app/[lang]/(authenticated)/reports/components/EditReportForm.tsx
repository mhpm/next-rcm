'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ReportScope } from '@/generated/prisma/client';
import { updateReportWithFields } from '../actions/reports.actions';
import { useRouter } from 'next/navigation';
import { ReportFormValues, FieldItem, ReportBuilder } from './form-builder';
import { useNotificationStore } from '@/store/NotificationStore';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { BackLink, Breadcrumbs } from '@/components';

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
            id: f.fieldId,
            key: key,
            label: f.label ?? null,
            type: f.type,
            required: f.required ?? false,
            // value is optional in schema, send if present
            ...(f.value !== undefined ? { value: f.value } : {}),
            options: f.options,
            visibilityRules: f.visibilityRules,
            validation: f.validation,
            width: 12, // Default width
            order: index, // Send order just in case we add it later
          };
        }),
      });
      showSuccess('Formulario actualizado correctamente');
      router.refresh();
    } catch (error) {
      console.error(error);
      showError('Error al actualizar el formulario');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackLink fallbackHref="/reports" />
        <Breadcrumbs />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Editar Formulario</h1>
          <p className="text-muted-foreground">
            Modifica la estructura de tu formulario.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="edit-report-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </div>

      <form
        id="edit-report-form"
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ReportBuilder
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
        />

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Volver
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
