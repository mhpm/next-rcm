'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { InputField, SelectField } from '@/components/FormControls';
import type { ReportFieldType, ReportScope } from '@/generated/prisma/client';
import {
  createReportEntry,
  updateReportEntry,
  getReportEntityMembers,
  getReportEntityInfo,
} from '@/app/(authenticated)/reports/actions/reports.actions';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/NotificationStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Loader2 } from 'lucide-react';

type Option = { value: string; label: string };

type VisibilityRule = {
  fieldKey: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'gt' | 'lt';
  value: string;
};

type FieldDef = {
  id: string;
  key: string;
  label?: string | null;
  type: ReportFieldType;
  required?: boolean;
  options?: string[]; // Add options
  value?: any;
  visibilityRules?: VisibilityRule[];
};

type FormValues = {
  scope: ReportScope;
  cellId?: string;
  groupId?: string;
  sectorId?: string;
  values: Record<string, unknown>; // fieldId -> value
};

export default function SubmitReportForm({
  reportId,
  title,
  description,
  scope,
  fields,
  cells,
  groups,
  sectors,
  initialValues,
  entryId,
}: {
  reportId: string;
  title: string;
  description?: string | null;
  scope: ReportScope;
  fields: FieldDef[];
  cells: Option[];
  groups: Option[];
  sectors: Option[];
  initialValues?: FormValues;
  entryId?: string;
}) {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: initialValues || { scope },
  });

  const [members, setMembers] = React.useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  const [entityInfo, setEntityInfo] = React.useState<{
    sector: string;
    subSector: string;
    leader: string;
    assistant: string;
    host: string;
    membersCount: number;
  } | null>(null);

  const [isLoadingInfo, setIsLoadingInfo] = React.useState(false);

  const watchedCellId = watch('cellId');
  const watchedGroupId = watch('groupId');
  const watchedSectorId = watch('sectorId');

  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({});

  const getSectionOpen = (sectionId: string) => openSections[sectionId] ?? true;

  const setSectionOpen = (sectionId: string, open: boolean) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: open }));
  };

  const watchedValues = watch('values') || {};

  const isFieldVisible = (field: FieldDef) => {
    if (!field.visibilityRules || field.visibilityRules.length === 0)
      return true;

    return field.visibilityRules.every((rule) => {
      // Find the field that controls visibility by key (slug)
      const controlField = fields.find((f) => f.key === rule.fieldKey);
      // If we can't find the field, assume visible (or handle error)
      if (!controlField) return true;

      const fieldValue = watchedValues[controlField.id];
      const val =
        fieldValue === undefined || fieldValue === null
          ? ''
          : String(fieldValue);
      const target = rule.value;

      switch (rule.operator) {
        case 'equals':
          return val == target;
        case 'notEquals':
          return val != target;
        case 'contains':
          return val.toLowerCase().includes(target.toLowerCase());
        case 'gt':
          return Number(val) > Number(target);
        case 'lt':
          return Number(val) < Number(target);
        default:
          return true;
      }
    });
  };

  React.useEffect(() => {
    const fetchMembers = async () => {
      let entityId: string | undefined;
      if (scope === 'CELL') entityId = watchedCellId;
      if (scope === 'GROUP') entityId = watchedGroupId;
      if (scope === 'SECTOR') entityId = watchedSectorId;

      if (entityId) {
        setIsLoadingInfo(true);
        try {
          // Parallel fetch: members + info
          const [membersData, infoData] = await Promise.all([
            getReportEntityMembers(scope, entityId),
            getReportEntityInfo(scope, entityId),
          ]);

          setMembers(membersData);
          setEntityInfo(infoData);
        } catch (e) {
          console.error(e);
          setMembers([]);
          setEntityInfo(null);
        } finally {
          setIsLoadingInfo(false);
        }
      } else {
        setMembers([]);
        setEntityInfo(null);
        setIsLoadingInfo(false);
      }
    };
    fetchMembers();
  }, [watchedCellId, watchedGroupId, watchedSectorId, scope]);

  // Helper to group fields by section
  const groupedFields = React.useMemo(() => {
    const groups: { section: FieldDef | null; fields: FieldDef[] }[] = [];
    let currentGroup: { section: FieldDef | null; fields: FieldDef[] } = {
      section: null,
      fields: [],
    };

    fields.forEach((f) => {
      if (f.type === 'SECTION') {
        // Check for Section Break
        if (f.value === 'SECTION_BREAK') {
          // If we have a current group with content or a section header, push it
          if (currentGroup.section || currentGroup.fields.length > 0) {
            groups.push(currentGroup);
          }
          // Start a new group for root fields (section: null)
          currentGroup = { section: null, fields: [] };
          return;
        }

        if (currentGroup.section || currentGroup.fields.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = { section: f, fields: [] };
      } else {
        currentGroup.fields.push(f);
      }
    });

    if (currentGroup.section || currentGroup.fields.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [fields]);

  const renderField = (f: FieldDef) => {
    const baseName = `values.${f.id}` as const;
    if (f.type === 'NUMBER' || f.type === 'CURRENCY') {
      return (
        <InputField<FormValues>
          key={f.id}
          name={baseName}
          label={f.label || f.key}
          register={register}
          type="number"
          step={f.type === 'CURRENCY' ? '0.01' : '1'}
          placeholder={f.type === 'CURRENCY' ? '0.00' : '0'}
          rules={{
            ...(f.required ? { required: 'Requerido' } : {}),
            valueAsNumber: true,
          }}
          startIcon={
            f.type === 'CURRENCY' ? (
              <span className="text-gray-500 font-bold">$</span>
            ) : undefined
          }
        />
      );
    }
    if (f.type === 'BOOLEAN') {
      return (
        <SelectField<FormValues>
          key={f.id}
          name={baseName}
          label={f.label || f.key}
          control={control}
          options={[
            { value: '', label: 'Selecciona' },
            { value: 'true', label: 'Sí' },
            { value: 'false', label: 'No' },
          ]}
          rules={{
            ...(f.required ? { required: 'Requerido' } : {}),
            setValueAs: (v) =>
              v === 'true' ? true : v === 'false' ? false : undefined,
          }}
        />
      );
    }
    if (f.type === 'DATE') {
      return (
        <InputField<FormValues>
          key={f.id}
          name={baseName}
          label={f.label || f.key}
          register={register}
          type="date"
          rules={f.required ? { required: 'Requerido' } : undefined}
        />
      );
    }
    if (f.type === 'SELECT') {
      return (
        <SelectField<FormValues>
          key={f.id}
          name={baseName}
          label={f.label || f.key}
          control={control}
          options={[
            { value: '', label: 'Selecciona una opción' },
            ...(f.options || []).map((opt) => ({
              value: opt,
              label: opt,
            })),
          ]}
          rules={f.required ? { required: 'Requerido' } : undefined}
        />
      );
    }
    if (f.type === 'MEMBER_SELECT') {
      return (
        <SelectField<FormValues>
          key={f.id}
          name={baseName}
          label={f.label || f.key}
          control={control}
          options={[
            { value: '', label: 'Selecciona un miembro' },
            ...members.map((m) => ({
              value: m.id,
              label: `${m.firstName} ${m.lastName}`,
            })),
          ]}
          rules={f.required ? { required: 'Requerido' } : undefined}
        />
      );
    }
    if (f.type === 'SECTION') {
      // Should not happen inside renderField as we handle it in groups, but fallback just in case
      return null;
    }
    return (
      <InputField<FormValues>
        key={f.id}
        name={baseName}
        label={f.label || f.key}
        register={register}
        rules={f.required ? { required: 'Requerido' } : undefined}
      />
    );
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const values = Object.entries(data.values || {}).map(
        ([fieldId, value]) => ({
          fieldId,
          value,
        })
      );

      if (entryId) {
        await updateReportEntry({
          id: entryId,
          scope,
          cellId: scope === 'CELL' ? data.cellId : undefined,
          groupId: scope === 'GROUP' ? data.groupId : undefined,
          sectorId: scope === 'SECTOR' ? data.sectorId : undefined,
          values,
        });
        showSuccess('Entrada actualizada exitosamente');
        router.push(`/reports/${reportId}/entries`);
      } else {
        await createReportEntry({
          reportId,
          scope,
          cellId: scope === 'CELL' ? data.cellId : undefined,
          groupId: scope === 'GROUP' ? data.groupId : undefined,
          sectorId: scope === 'SECTOR' ? data.sectorId : undefined,
          values,
        });
        showSuccess('Reporte enviado exitosamente');
        reset(); // Limpiar el formulario para una nueva entrada
        router.refresh();
      }
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      showError('Error al enviar el reporte');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div className="md:col-span-1">
          {scope === 'CELL' && (
            <div className="space-y-4">
              <SelectField
                name="cellId"
                label="Célula"
                control={control}
                options={[
                  { value: '', label: 'Selecciona una célula' },
                  ...cells,
                ]}
                rules={{ required: 'Selecciona una célula' }}
              />

              {isLoadingInfo ? (
                <Card className="bg-muted/50 border-none shadow-none">
                  <CardContent className="p-8 flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-sm">Cargando información...</span>
                  </CardContent>
                </Card>
              ) : entityInfo ? (
                <Card className="bg-muted/50 border-none shadow-none">
                  <CardContent className="p-4 space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground block text-xs">
                          Sector
                        </span>
                        <span className="font-medium">{entityInfo.sector}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">
                          Sub-sector
                        </span>
                        <span className="font-medium">
                          {entityInfo.subSector}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">
                          Líder
                        </span>
                        <span className="font-medium">{entityInfo.leader}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">
                          Miembros
                        </span>
                        <span className="font-medium">
                          {entityInfo.membersCount}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-xs">
                          Anfitrión
                        </span>
                        <span className="font-medium">{entityInfo.host}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-xs">
                          Asistente
                        </span>
                        <span className="font-medium">
                          {entityInfo.assistant}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {scope === 'GROUP' && (
            <SelectField
              name="groupId"
              label="Grupo"
              control={control}
              options={[{ value: '', label: 'Selecciona un grupo' }, ...groups]}
              rules={{ required: 'Selecciona un grupo' }}
            />
          )}

          {scope === 'SECTOR' && (
            <SelectField
              name="sectorId"
              label="Sector"
              control={control}
              options={[
                { value: '', label: 'Selecciona un sector' },
                ...sectors,
              ]}
              rules={{ required: 'Selecciona un sector' }}
            />
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4 mt-4">
            {groupedFields.map((group, i) => {
              if (group.section) {
                // Check if the section itself is visible (if it has visibility rules)
                if (!isFieldVisible(group.section)) return null;

                const sectionId = group.section.id;
                const sectionLabel = group.section.label || 'Sección';
                const isOpen = getSectionOpen(sectionId);
                return (
                  <Collapsible
                    key={sectionId}
                    open={isOpen}
                    onOpenChange={(open) => setSectionOpen(sectionId, open)}
                    className="rounded-lg border"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-between px-4 py-3"
                      >
                        <span className="text-base font-semibold">
                          {sectionLabel}
                        </span>
                        <ChevronDown
                          className={`transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                      <div className="grid grid-cols-1 gap-4 pt-2">
                        {group.fields.map((f) => {
                          if (!isFieldVisible(f)) return null;
                          return renderField(f);
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
              // Default fields (no section)
              return (
                <div key={`group-${i}`} className="grid grid-cols-1 gap-4">
                  {group.fields.map((f) => {
                    if (!isFieldVisible(f)) return null;
                    return renderField(f);
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/reports')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar'
          )}
        </Button>
      </div>
    </form>
  );
}
