'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
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
import { getAllZones } from '@/app/[lang]/(authenticated)/sectors/actions/sectors.actions';
import { useSectorHierarchy } from '@/app/[lang]/(authenticated)/sectors/hooks/useSectors';
import { calculateCycleState } from '@/lib/cycleUtils';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/NotificationStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

const naturalSort = (a: string, b: string) => {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
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
    reset,
    formState: { isSubmitting, errors },
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
    sectorId?: string;
    subSector: string;
    subSectorId?: string;
    zoneId?: string;
    leader: string;
    leaderId?: string | null;
    assistant: string;
    assistantId?: string | null;
    host: string;
    hostId?: string | null;
    membersCount: number;
  } | null>(null);

  const [isLoadingInfo, setIsLoadingInfo] = React.useState(false);
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [formKey, setFormKey] = React.useState(0);

  // --- Hierarchy Filters State ---
  const [selectedZone, setSelectedZone] = React.useState<string | undefined>();
  const [selectedSector, setSelectedSector] = React.useState<
    string | undefined
  >();
  const [selectedSubSector, setSelectedSubSector] = React.useState<
    string | undefined
  >();

  const handleResetForm = () => {
    // Save current values we want to preserve
    const currentCreatedAt = getValues('createdAt');

    // Reset local states first
    setSelectedZone(undefined);
    setSelectedSector(undefined);
    setSelectedSubSector(undefined);
    setEntityInfo(null);
    setCellMembers([]);
    setUnlinkedMembers([]);

    // Use reset() with the preserved date
    reset({
      scope,
      createdAt: currentCreatedAt,
      values: {},
      cellId: undefined,
      groupId: undefined,
      sectorId: undefined,
    });

    // Force re-mount of the form components by changing the key
    setFormKey((prev) => prev + 1);

    // Scroll to top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch all zones
  const { data: zonesData } = useQuery({
    queryKey: ['zones', 'all'],
    queryFn: async () => {
      const zones = await getAllZones();
      return [...zones].sort((a, b) => naturalSort(a.name, b.name));
    },
    enabled: scope === 'CELL',
  });

  // Fetch hierarchy
  const { data: sectorHierarchy } = useSectorHierarchy();

  // Filtered options
  const filteredSectors = React.useMemo(() => {
    if (!sectorHierarchy) return [];
    const hasZones = zonesData && zonesData.length > 0;
    const baseSectors = !hasZones
      ? sectorHierarchy
      : selectedZone
      ? sectorHierarchy.filter((s) => s.zone_id === selectedZone)
      : [];

    return [...baseSectors].sort((a, b) => naturalSort(a.name, b.name));
  }, [sectorHierarchy, selectedZone, zonesData]);

  const filteredSubSectors = React.useMemo(() => {
    if (!filteredSectors || !selectedSector) return [];
    const sector = filteredSectors.find((s) => s.id === selectedSector);
    return [...(sector?.subSectors || [])].sort((a, b) =>
      naturalSort(a.name, b.name)
    );
  }, [filteredSectors, selectedSector]);

  const filteredCells = React.useMemo(() => {
    if (!filteredSubSectors || !selectedSubSector) return [];
    const subSector = filteredSubSectors.find(
      (ss) => ss.id === selectedSubSector
    );
    return (subSector?.cells || [])
      .map((c) => ({
        value: c.id,
        label: c.name,
      }))
      .sort((a, b) => naturalSort(a.label, b.label));
  }, [filteredSubSectors, selectedSubSector]);

  // Memoized sorted props for fallbacks
  const sortedCells = React.useMemo(
    () => [...cells].sort((a, b) => naturalSort(a.label, b.label)),
    [cells]
  );
  const sortedGroups = React.useMemo(
    () => [...groups].sort((a, b) => naturalSort(a.label, b.label)),
    [groups]
  );
  const sortedSectors = React.useMemo(
    () => [...sectors].sort((a, b) => naturalSort(a.label, b.label)),
    [sectors]
  );

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

          // Pre-fill hierarchy filters if we're editing or a cell was just selected
          if (infoData && scope === 'CELL') {
            if (infoData.zoneId) setSelectedZone(infoData.zoneId);
            if (infoData.sectorId) setSelectedSector(infoData.sectorId);
            if (infoData.subSectorId)
              setSelectedSubSector(infoData.subSectorId);
          }

          // Initialize numeric fields to 0 and pre-fill members
          const currentValues = getValues('values') || {};
          let hasChanges = false;
          const newValues = { ...currentValues };

          fields.forEach((f) => {
            // Initialize numeric fields with 0 if undefined, null or empty
            if (
              (f.type === 'NUMBER' || f.type === 'CURRENCY') &&
              (newValues[f.id] === undefined ||
                newValues[f.id] === null ||
                newValues[f.id] === '')
            ) {
              newValues[f.id] = 0;
              hasChanges = true;
            }

            // Pre-fill members for CELL scope
            if (
              scope === 'CELL' &&
              infoData &&
              entityMembers.length > 0 &&
              f.type === 'MEMBER_SELECT'
            ) {
              const allMemberIds = entityMembers.map((m) => m.id);
              if (
                !newValues[f.id] ||
                (Array.isArray(newValues[f.id]) &&
                  (newValues[f.id] as any).length === 0)
              ) {
                newValues[f.id] = allMemberIds;
                hasChanges = true;
              }
            }
          });

          if (hasChanges) {
            setValue('values', newValues);
          }

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
            const allMemberIds = entityMembers.map((m) => m.id);

            // Only set defaults if we're not editing an existing entry,
            // OR if the current values are empty
            fields.forEach((f) => {
              if (f.type === 'MEMBER_SELECT') {
                const currentVal = getValues(`values.${f.id}`);
                if (
                  !currentVal ||
                  (Array.isArray(currentVal) && currentVal.length === 0)
                ) {
                  setValue(`values.${f.id}`, allMemberIds);
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
          error={(errors.values as any)?.[f.id]?.message}
          rules={{
            validate: (v: any) => {
              if (!f.required) return true;
              if (typeof v === 'number' && !isNaN(v)) return true;
              if (v === undefined || v === null || v === '') {
                return 'Requerido';
              }
              return true;
            },
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
          error={(errors.values as any)?.[f.id]?.message}
          options={[
            { value: '', label: 'Selecciona' },
            { value: 'true', label: 'Sí' },
            { value: 'false', label: 'No' },
          ]}
          rules={{
            validate: (v: any) => {
              if (f.required && (v === undefined || v === null || v === '')) {
                return 'Requerido';
              }
              return true;
            },
            setValueAs: (v) =>
              v === 'true' ? true : v === 'false' ? false : undefined,
          }}
          variant="filled"
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
          error={(errors.values as any)?.[f.id]?.message}
          rules={{
            validate: (v: any) => {
              if (f.required && (v === undefined || v === null || v === '')) {
                return 'Requerido';
              }
              return true;
            },
          }}
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
          error={(errors.values as any)?.[f.id]?.message}
          options={[
            { value: '', label: 'Selecciona una opción' },
            ...(f.options || []).map((opt) => ({
              value: opt,
              label: opt,
            })),
          ]}
          rules={{
            validate: (v: any) => {
              if (f.required && (v === undefined || v === null || v === '')) {
                return 'Requerido';
              }
              return true;
            },
          }}
          variant="filled"
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

            const selectedMembers = allAvailableMembers
              .filter((m) => selectedIds.includes(m.value))
              .sort((a, b) => {
                const getOrder = (id: string) => {
                  if (id === entityInfo?.leaderId) return 1;
                  if (id === entityInfo?.assistantId) return 2;
                  if (id === entityInfo?.hostId) return 3;
                  return 4;
                };
                const orderA = getOrder(a.value);
                const orderB = getOrder(b.value);
                if (orderA !== orderB) return orderA - orderB;
                return a.label.localeCompare(b.label);
              });

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
                      {selectedMembers.map((member) => {
                        const isSpecialRole =
                          member.value === entityInfo?.leaderId ||
                          member.value === entityInfo?.assistantId ||
                          member.value === entityInfo?.hostId;

                        return (
                          <div
                            key={member.value}
                            className={cn(
                              'flex items-center justify-between p-2 pl-3 rounded-lg border transition-all duration-200 group',
                              isSpecialRole
                                ? 'bg-primary/10 border-primary/30 shadow-sm'
                                : 'bg-muted/30 border-border'
                            )}
                          >
                            <span
                              className={cn(
                                'text-sm font-medium',
                                isSpecialRole && 'text-primary'
                              )}
                            >
                              {member.label}
                              {member.value === entityInfo?.leaderId && (
                                <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter border border-primary/20">
                                  Líder
                                </span>
                              )}
                              {member.value === entityInfo?.assistantId && (
                                <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter border border-primary/20">
                                  Asistente
                                </span>
                              )}
                              {member.value === entityInfo?.hostId && (
                                <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter border border-primary/20">
                                  Anfitrión
                                </span>
                              )}
                            </span>
                            {member.value !== entityInfo?.leaderId &&
                              member.value !== entityInfo?.assistantId &&
                              member.value !== entityInfo?.hostId && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveMember(member.value)
                                  }
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                          </div>
                        );
                      })}
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
          rules={{
            validate: (v: any) => {
              if (f.required && (v === undefined || v === null || v === '')) {
                return 'Requerido';
              }
              return true;
            },
          }}
          render={({ field }) => (
            <FriendRegistrationField
              value={(field.value as FriendRegistrationValue[]) || []}
              onChange={field.onChange}
              label={f.label || f.key}
              variant="filled"
              members={[...cellMembers, ...unlinkedMembers]}
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
        error={(errors.values as any)?.[f.id]?.message}
        rules={{
          validate: (v: any) => {
            if (f.required && (v === undefined || v === null || v === '')) {
              return 'Requerido';
            }
            return true;
          },
        }}
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
            cycleValues[f.id] = {
              week: state.weekNumber,
              verb: state.verb,
            };
          } else {
            cycleValues[f.id] = {
              week: null,
              verb: state.message || 'Estado desconocido',
            };
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
        if (!isDraft) {
          setShowConfirmation(true);
        }
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
        if (!isDraft) {
          setShowConfirmation(true);
        }
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
    <form key={formKey} className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              <div
                className={cn(
                  'grid grid-cols-1 gap-4',
                  zonesData && zonesData.length > 0
                    ? 'md:grid-cols-3'
                    : 'md:grid-cols-2'
                )}
              >
                {zonesData && zonesData.length > 0 && (
                  <SearchableSelectField
                    label="Zona"
                    options={
                      zonesData?.map((z) => ({ value: z.id, label: z.name })) ||
                      []
                    }
                    value={selectedZone}
                    onChange={(val) => {
                      setSelectedZone(val);
                      setSelectedSector('');
                      setSelectedSubSector('');
                      setValue('cellId', '');
                    }}
                    placeholder="Busca y selecciona una zona"
                    variant="filled"
                  />
                )}

                <SearchableSelectField
                  label="Sector"
                  options={filteredSectors.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  value={selectedSector}
                  onChange={(val) => {
                    setSelectedSector(val);
                    setSelectedSubSector('');
                    setValue('cellId', '');
                  }}
                  disabled={zonesData && zonesData.length > 0 && !selectedZone}
                  placeholder={
                    zonesData && zonesData.length > 0 && !selectedZone
                      ? 'Selecciona primero una zona'
                      : 'Selecciona un sector'
                  }
                  variant="filled"
                />

                <SearchableSelectField
                  label="Subsector"
                  options={filteredSubSectors.map((ss) => ({
                    value: ss.id,
                    label: ss.name,
                  }))}
                  value={selectedSubSector}
                  onChange={(val) => {
                    setSelectedSubSector(val);
                    setValue('cellId', '');
                  }}
                  disabled={
                    filteredSectors &&
                    filteredSectors.length > 0 &&
                    !selectedSector
                  }
                  placeholder={
                    filteredSectors &&
                    filteredSectors.length > 0 &&
                    !selectedSector
                      ? 'Selecciona primero un sector'
                      : 'Selecciona un subsector'
                  }
                  variant="filled"
                />
              </div>

              <Controller
                name="cellId"
                control={control}
                rules={{ required: 'Selecciona una célula' }}
                render={({ field, fieldState }) => (
                  <SearchableSelectField
                    label="Célula"
                    options={selectedSubSector ? filteredCells : sortedCells}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    placeholder={
                      !selectedSubSector
                        ? 'O busca directamente una célula'
                        : 'Selecciona una célula'
                    }
                    variant="filled"
                  />
                )}
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
                            className="font-bold text-sm pl-4.5 text-primary line-clamp-2"
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
            <Controller
              name="groupId"
              control={control}
              rules={{ required: 'Selecciona un grupo' }}
              render={({ field, fieldState }) => (
                <SearchableSelectField
                  label="Grupo"
                  options={sortedGroups}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="Busca y selecciona un grupo"
                />
              )}
            />
          )}

          {scope === 'SECTOR' && (
            <Controller
              name="sectorId"
              control={control}
              rules={{ required: 'Selecciona un sector' }}
              render={({ field, fieldState }) => (
                <SearchableSelectField
                  label="Sector"
                  options={sortedSectors}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="Busca y selecciona un sector"
                />
              )}
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
                        className="w-full justify-between px-4 py-3 h-auto whitespace-normal text-left flex items-center gap-2"
                      >
                        <span className="text-base font-semibold leading-tight break-words min-w-0 flex-1">
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

      <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isSubmitting || isSavingDraft}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit(onSaveDraft)}
          disabled={isSubmitting || isSavingDraft}
          className="border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
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
        <Button
          type="submit"
          disabled={isSubmitting || isSavingDraft}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 min-w-[120px]"
        >
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

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reporte enviado con éxito</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Quieres enviar otro reporte para una célula diferente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => router.push(`/reports/${reportId}/entries`)}
            >
              Ir a la lista
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleResetForm();
                setShowConfirmation(false);
              }}
            >
              Enviar otro reporte
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
