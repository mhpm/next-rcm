'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  InputField,
  SelectField,
  CycleWeekIndicator,
  DateField,
  SearchableSelectField,
} from '@/components/FormControls';
import type { ReportFieldType, ReportScope } from '@/generated/prisma/client';
import {
  FriendRegistrationField,
  FriendRegistrationValue,
} from './FriendRegistrationField';
import {
  createReportEntry,
  updateReportEntry,
  getReportEntityInfo,
  getUnlinkedMembers,
  getReportEntityMembers,
} from '@/app/[lang]/(authenticated)/reports/actions/reports.actions';
import { calculateCycleState } from '@/lib/cycleUtils';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/NotificationStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  Loader2,
  MapPin,
  Users,
  User,
  Home,
  UserCheck,
  Layers,
  Hash,
  Trash2,
} from 'lucide-react';

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
  createdAt?: string;
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
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      scope,
      createdAt: new Date().toISOString().split('T')[0],
      ...initialValues,
    },
  });

  const [unlinkedMembers, setUnlinkedMembers] = React.useState<
    { value: string; label: string }[]
  >([]);

  const [cellMembers, setCellMembers] = React.useState<
    { value: string; label: string }[]
  >([]);

  const [entityInfo, setEntityInfo] = React.useState<{
    sector: string;
    subSector: string;
    leader: string;
    leaderId?: string | null;
    assistant: string;
    host: string;
    membersCount: number;
  } | null>(null);

  const [isLoadingInfo, setIsLoadingInfo] = React.useState(false);
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);

  const watchedCellId = watch('cellId');
  const watchedGroupId = watch('groupId');
  const watchedSectorId = watch('sectorId');
  const watchedCreatedAt = watch('createdAt');

  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({});

  const [cycleStartDates, setCycleStartDates] = React.useState<
    Record<string, string>
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

      let val = '';

      if (controlField.type === 'CYCLE_WEEK_INDICATOR') {
        // For cycle indicators, we use the current verb as the value to compare
        // We use the watchedCreatedAt to ensure visibility rules update if the report date changes
        const state = calculateCycleState(
          controlField.value,
          controlField.options,
          watchedCreatedAt
        );
        val = state.verb || '';
      } else {
        const fieldValue = watchedValues[controlField.id];
        val =
          fieldValue === undefined || fieldValue === null
            ? ''
            : String(fieldValue);
      }

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
          // Parallel fetch: info + unlinked members + entity members
          const [infoData, unlinkedData, entityMembers] = await Promise.all([
            getReportEntityInfo(scope, entityId),
            getUnlinkedMembers(),
            getReportEntityMembers(scope, entityId),
          ]);

          setEntityInfo(infoData);
          setUnlinkedMembers(
            unlinkedData.map((m) => ({
              value: m.id,
              label: `${m.firstName} ${m.lastName}`,
            }))
          );
          setCellMembers(
            entityMembers.map((m) => ({
              value: m.id,
              label: `${m.firstName} ${m.lastName}`,
            }))
          );

          // Default members for CELL scope
          if (scope === 'CELL' && infoData && entityMembers.length > 0) {
            const filteredMemberIds = entityMembers
              .filter((m) => m.id !== infoData.leaderId)
              .map((m) => m.id);

            // Only set defaults if we're not editing an existing entry,
            // OR if the current values are empty
            fields.forEach((f) => {
              if (f.type === 'MEMBER_SELECT') {
                const currentVal = getValues(`values.${f.id}`);
                if (
                  !currentVal ||
                  (Array.isArray(currentVal) && currentVal.length === 0)
                ) {
                  setValue(`values.${f.id}`, filteredMemberIds);
                }
              }
            });
          }
        } catch (e) {
          console.error(e);
          setEntityInfo(null);
          setUnlinkedMembers([]);
        } finally {
          setIsLoadingInfo(false);
        }
      } else {
        setEntityInfo(null);
        setUnlinkedMembers([]);
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
        <DateField<FormValues>
          key={f.id}
          name={baseName}
          label={f.label || f.key}
          control={control}
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
        <Controller
          key={f.id}
          name={baseName}
          control={control}
          rules={
            f.required
              ? {
                  validate: (val: unknown) =>
                    (Array.isArray(val) && val.length > 0) ||
                    'Selecciona al menos un miembro',
                }
              : undefined
          }
          render={({ field, fieldState }) => {
            const selectedIds = (field.value as string[]) || [];
            // Combine both sources for available options
            const allAvailableMembers = [...cellMembers, ...unlinkedMembers];

            const selectedMembers = allAvailableMembers.filter((m) =>
              selectedIds.includes(m.value)
            );

            const handleAddMember = (id: string) => {
              if (id && !selectedIds.includes(id)) {
                field.onChange([...selectedIds, id]);
              }
            };

            const handleRemoveMember = (id: string) => {
              field.onChange(selectedIds.filter((i) => i !== id));
            };

            return (
              <div className="space-y-3">
                <SearchableSelectField
                  label={f.label || f.key}
                  options={allAvailableMembers.filter(
                    (m) => !selectedIds.includes(m.value)
                  )}
                  value=""
                  onChange={handleAddMember}
                  error={fieldState.error?.message}
                  placeholder="Busca y selecciona miembros..."
                />

                {selectedMembers.length > 0 && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                      Seleccionados ({selectedMembers.length})
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.value}
                          className="flex items-center justify-between p-2 pl-3 rounded-lg bg-muted/30 border border-border group"
                        >
                          <span className="text-sm font-medium">
                            {member.label}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.value)}
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
      );
    }
    if (f.type === 'CYCLE_WEEK_INDICATOR') {
      return (
        <CycleWeekIndicator
          key={f.id}
          label={f.label || f.key}
          startDate={cycleStartDates[f.id] || f.value}
          verbs={f.options}
          reportDate={watchedCreatedAt}
          onStartDateChange={(date) =>
            setCycleStartDates((prev) => ({ ...prev, [f.id]: date }))
          }
        />
      );
    }
    if (f.type === 'FRIEND_REGISTRATION') {
      return (
        <Controller
          key={f.id}
          name={baseName}
          control={control}
          rules={f.required ? { required: 'Requerido' } : undefined}
          render={({ field }) => (
            <FriendRegistrationField
              value={(field.value as FriendRegistrationValue[]) || []}
              onChange={field.onChange}
              label={f.label || f.key}
              variant="filled"
            />
          )}
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

  const handleFormSubmit = async (
    data: FormValues,
    isDraft: boolean = false
  ) => {
    try {
      if (isDraft) setIsSavingDraft(true);

      // Calculate cycle values to include in submission
      const cycleValues: Record<string, unknown> = {};
      fields.forEach((f) => {
        if (f.type === 'CYCLE_WEEK_INDICATOR') {
          const startDate = cycleStartDates[f.id] || f.value;
          const state = calculateCycleState(
            startDate,
            f.options,
            data.createdAt
          );

          if (state.status === 'active' && state.verb) {
            cycleValues[f.id] = `Semana ${state.weekNumber}: ${state.verb}`;
          } else {
            cycleValues[f.id] = state.message || 'Estado desconocido';
          }
        }
      });

      const values = Object.entries({ ...data.values, ...cycleValues }).map(
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
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
          status: isDraft ? 'DRAFT' : 'SUBMITTED',
        });
        showSuccess(
          isDraft
            ? 'Borrador guardado exitosamente'
            : 'Entrada actualizada exitosamente'
        );
        if (!isDraft) router.push(`/reports/${reportId}/entries`);
      } else {
        await createReportEntry({
          reportId: reportId,
          scope,
          cellId: scope === 'CELL' ? data.cellId : undefined,
          groupId: scope === 'GROUP' ? data.groupId : undefined,
          sectorId: scope === 'SECTOR' ? data.sectorId : undefined,
          values,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
          status: isDraft ? 'DRAFT' : 'SUBMITTED',
        });
        showSuccess(
          isDraft
            ? 'Borrador guardado exitosamente'
            : 'Entrada creada exitosamente'
        );
        if (!isDraft) router.push(`/reports/${reportId}/entries`);
      }
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      showError('Error al enviar el reporte');
    } finally {
      if (isDraft) setIsSavingDraft(false);
    }
  };

  const onSubmit = (data: FormValues) => handleFormSubmit(data, false);
  const onSaveDraft = (data: FormValues) => handleFormSubmit(data, true);

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div>
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
                variant="filled"
              />

              {isLoadingInfo ? (
                <Card className="bg-muted/50 border-none shadow-none">
                  <CardContent className="p-8 flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-sm">Cargando información...</span>
                  </CardContent>
                </Card>
              ) : entityInfo ? (
                <Card className="bg-card border-border shadow-sm">
                  <div className="bg-muted/40 px-4 py-3 border-b flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">
                      Detalles de la Célula
                    </span>
                  </div>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 divide-x">
                      <div className="p-4 space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <Layers className="h-3 w-3" />
                            Sector
                          </div>
                          <p className="font-semibold text-sm pl-4.5">
                            {entityInfo.sector}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <MapPin className="h-3 w-3" />
                            Sub-sector
                          </div>
                          <p className="font-semibold text-sm pl-4.5">
                            {entityInfo.subSector}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <Users className="h-3 w-3" />
                            Miembros
                          </div>
                          <div className="pl-4.5">
                            <Badge variant="secondary" className="font-bold">
                              {entityInfo.membersCount}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-4 bg-muted/10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <User className="h-3 w-3" />
                            Líder
                          </div>
                          <p
                            className="font-medium text-sm pl-4.5 line-clamp-2"
                            title={entityInfo.leader}
                          >
                            {entityInfo.leader}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <Home className="h-3 w-3" />
                            Anfitrión
                          </div>
                          <p
                            className="font-medium text-sm pl-4.5 text-muted-foreground line-clamp-2"
                            title={entityInfo.host}
                          >
                            {entityInfo.host || 'N/A'}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <UserCheck className="h-3 w-3" />
                            Asistente
                          </div>
                          <p
                            className="font-medium text-sm pl-4.5 text-muted-foreground line-clamp-2"
                            title={entityInfo.assistant}
                          >
                            {entityInfo.assistant || 'N/A'}
                          </p>
                        </div>
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

          {/* Created At Field */}
          <div className="mt-4">
            <DateField
              name="createdAt"
              label="Fecha del Reporte"
              control={control}
              rules={{ required: 'La fecha es requerida' }}
            />
          </div>
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
                    <CollapsibleContent className="px-4 pb-4 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-visible">
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
          variant="ghost"
          onClick={() => router.push(`/reports/${reportId}/entries`)}
          disabled={isSubmitting || isSavingDraft}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSaveDraft(getValues())}
          disabled={isSubmitting || isSavingDraft}
        >
          {isSavingDraft ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Borrador'
          )}
        </Button>
        <Button type="submit" disabled={isSubmitting || isSavingDraft}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
