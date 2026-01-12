'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  InputField,
  SelectField,
  NumberStepper,
  ChoiceGroup,
  SearchableSelectField,
  DateField,
  CycleWeekIndicator,
} from '@/components/FormControls';
import type { ReportFieldType, ReportScope } from '@/generated/prisma/client';
import {
  FriendRegistrationField,
  FriendRegistrationValue,
} from '@/app/[lang]/(authenticated)/reports/components/FriendRegistrationField';
import {
  submitPublicReportEntry,
  verifyCellAccess,
  getDraftReportEntry,
  getPublicReportEntityMembers,
} from '../../actions';
import { calculateCycleState } from '@/lib/cycleUtils';
import { useNotificationStore } from '@/store/NotificationStore';
import { FaLock, FaFloppyDisk, FaPaperPlane, FaKey } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Loader2, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  options?: string[];
  value?: any;
  visibilityRules?: VisibilityRule[];
  validation?: any;
};

type FormValues = {
  scope: ReportScope;
  cellId?: string;
  groupId?: string;
  sectorId?: string;
  accessCode?: string; // For cell verification
  values: Record<string, unknown>; // fieldId -> value
};

export default function PublicReportForm({
  token,
  title,
  description,
  scope,
  fields,
  groups,
  sectors,
  members,
  unlinkedMembers = [],
  churchName,
}: {
  token: string;
  title: string;
  description?: string | null;
  scope: ReportScope;
  fields: FieldDef[];
  groups: Option[];
  sectors: Option[];
  members: Option[];
  unlinkedMembers?: Option[];
  churchName: string;
}) {
  const { showSuccess, showError } = useNotificationStore();
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cellInfo, setCellInfo] = useState<{
    name: string;
    leader?: string;
    leaderId?: string | null;
    assistant?: string;
    assistantId?: string | null;
    host?: string;
    hostId?: string | null;
    sector?: string;
    subSector?: string;
  } | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormValues | null>(
    null
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [currentMembers, setCurrentMembers] = useState<Option[]>(members);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    control,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: { scope },
  });

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
        // First check if there is a value in the form (could be manually selected)
        const formValue = watchedValues[controlField.id];

        if (typeof formValue === 'string' && formValue.includes(': ')) {
          // Extract the verb from "Semana X: Verb"
          val = formValue.split(': ')[1] || '';
        } else {
          // Fallback to calculation if no form value yet
          const state = calculateCycleState(
            controlField.value,
            controlField.options
          );
          val = state.verb || '';
        }
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

  // Helper to group fields by section
  const [groupedFields] = useState(() => {
    // This is static, but we can memoize if fields change (they don't in this component)
    const groups: { section: FieldDef | null; fields: FieldDef[] }[] = [];
    (fields || []).forEach((f) => {
      const lastGroup = groups[groups.length - 1];
      if (f.type === 'SECTION') {
        if (f.value === 'SECTION_BREAK') {
          // Break section: start a new root group if not already there
          // Or if the last group is a section, we just ensure next items go to a root group
          if (!lastGroup || lastGroup.section) {
            groups.push({ section: null, fields: [] });
          }
          return;
        }
        groups.push({ section: f, fields: [] });
      } else {
        if (!lastGroup) {
          groups.push({ section: null, fields: [f] });
        } else {
          lastGroup.fields.push(f);
        }
      }
    });
    return groups;
  });

  const renderField = (f: FieldDef) => {
    const baseName = `values.${f.id}` as const;

    const content = (() => {
      if (f.type === 'CURRENCY') {
        return (
          <Controller
            key={f.id}
            name={baseName}
            control={control}
            rules={{
              validate: (v: any) => {
                if (!f.required) return true;
                if (typeof v === 'number' && !isNaN(v)) return true;
                if (v === undefined || v === null || v === '') {
                  return 'Requerido';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 mb-2">
                  <span className="text-2xl font-black">$</span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {f.label || f.key}
                  </span>
                </div>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-400 dark:text-slate-600 group-focus-within:text-primary transition-colors">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={(field.value as string | number) ?? ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? '' : Number(e.target.value)
                      )
                    }
                    placeholder="0.00"
                    className={cn(
                      'w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-5xl sm:text-6xl font-black tracking-tighter p-0 pl-14 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                      fieldState.error && 'text-destructive'
                    )}
                  />
                </div>
                {fieldState.error && (
                  <p className="text-base font-bold text-destructive px-1 mt-2">
                    {fieldState.error.message}
                  </p>
                )}
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full bg-primary transition-all duration-500',
                      field.value ? 'w-full' : 'w-0'
                    )}
                  />
                </div>
              </div>
            )}
          />
        );
      }
      if (f.type === 'NUMBER') {
        return (
          <Controller
            key={f.id}
            name={baseName}
            control={control}
            rules={{
              validate: (v: any) => {
                if (!f.required) return true;
                if (typeof v === 'number' && !isNaN(v)) return true;
                if (v === undefined || v === null || v === '') {
                  return 'Requerido';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <NumberStepper
                label={f.label || f.key}
                value={Number(field.value) || 0}
                onChange={field.onChange}
                error={fieldState.error?.message}
                className="w-full"
              />
            )}
          />
        );
      }
      if (f.type === 'BOOLEAN') {
        const booleanOptions = [
          { value: 'true', label: 'Sí' },
          { value: 'false', label: 'No' },
        ];
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
            render={({ field, fieldState }) => (
              <ChoiceGroup
                label={f.label || f.key}
                options={booleanOptions}
                value={field.value?.toString() ?? ''}
                onChange={(val) => field.onChange(val === 'true')}
                error={fieldState.error?.message}
                className="w-full"
              />
            )}
          />
        );
      }
      if (f.type === 'DATE') {
        return (
          <DateField<FormValues>
            name={baseName}
            label={f.label || f.key}
            control={control}
            rules={{
              validate: (v: any) => {
                if (f.required && (v === undefined || v === null || v === '')) {
                  return 'Requerido';
                }
                return true;
              },
            }}
            error={(errors.values as any)?.[f.id]?.message}
          />
        );
      }
      if (f.type === 'SELECT') {
        const selectOptions = (f.options || []).map((opt) => ({
          value: opt,
          label: opt,
        }));

        if (selectOptions.length <= 4) {
          return (
            <Controller
              key={f.id}
              name={baseName}
              control={control}
              rules={{
                validate: (v: any) => {
                  if (
                    f.required &&
                    (v === undefined || v === null || v === '')
                  ) {
                    return 'Requerido';
                  }
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <ChoiceGroup
                  label={f.label || f.key}
                  options={selectOptions}
                  value={field.value as string}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  className="w-full"
                />
              )}
            />
          );
        }

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
            render={({ field, fieldState }) => (
              <SearchableSelectField
                label={f.label || f.key}
                options={selectOptions}
                value={field.value as string}
                onChange={field.onChange}
                error={fieldState.error?.message}
                placeholder="Selecciona una opción..."
              />
            )}
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
              // Combine cell members and unlinked members
              const allAvailableMembers = [
                ...currentMembers,
                ...unlinkedMembers,
              ];

              const selectedMembers = allAvailableMembers
                .filter((m) => selectedIds.includes(m.value))
                .sort((a, b) => {
                  const getOrder = (id: string) => {
                    if (id === cellInfo?.leaderId) return 1;
                    if (id === cellInfo?.assistantId) return 2;
                    if (id === cellInfo?.hostId) return 3;
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
                <div className="space-y-4">
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
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest">
                          Miembros Seleccionados ({selectedMembers.length})
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedMembers.map((member) => {
                          const isSpecialRole =
                            member.value === cellInfo?.leaderId ||
                            member.value === cellInfo?.assistantId ||
                            member.value === cellInfo?.hostId;

                          return (
                            <div
                              key={member.value}
                              className={cn(
                                'flex items-center justify-between p-3 pl-4 rounded-2xl border transition-all duration-200 group',
                                isSpecialRole
                                  ? 'bg-primary/10 border-primary/30 shadow-sm'
                                  : 'bg-primary/5 border-primary/10 hover:border-primary/30'
                              )}
                            >
                              <span
                                className={cn(
                                  'font-bold',
                                  isSpecialRole
                                    ? 'text-primary'
                                    : 'text-foreground/90'
                                )}
                              >
                                {member.label}
                                {member.value === cellInfo?.leaderId && (
                                  <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-primary/20">
                                    Líder
                                  </span>
                                )}
                                {member.value === cellInfo?.assistantId && (
                                  <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-primary/20">
                                    Asistente
                                  </span>
                                )}
                                {member.value === cellInfo?.hostId && (
                                  <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-primary/20">
                                    Anfitrión
                                  </span>
                                )}
                              </span>
                              {member.value !== cellInfo?.leaderId &&
                                member.value !== cellInfo?.assistantId &&
                                member.value !== cellInfo?.hostId && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveMember(member.value)
                                    }
                                    className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                                  >
                                    <Trash2 className="h-5 w-5" />
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
        const canEdit = f.validation?.publicEditPermission;
        const watchedValue = watch(baseName as any);

        // Extract week number from watchedValue (e.g., "Semana 2: Anotar")
        const forcedWeek =
          typeof watchedValue === 'string' && watchedValue.startsWith('Semana ')
            ? parseInt(watchedValue.split(' ')[1])
            : undefined;

        if (canEdit) {
          const calculatedState = calculateCycleState(f.value, f.options);
          const defaultVal =
            calculatedState.status === 'active' && calculatedState.verb
              ? `Semana ${calculatedState.weekNumber}: ${calculatedState.verb}`
              : '';

          const weekOptions = (f.options || []).map(
            (verb: any, index: number) => {
              const verbStr = typeof verb === 'string' ? verb : verb.value;
              return {
                value: `Semana ${index + 1}: ${verbStr}`,
                label: `Semana ${index + 1}: ${verbStr}`,
              };
            }
          );

          return (
            <div key={f.id} className="space-y-6">
              <CycleWeekIndicator
                label={f.label || f.key}
                startDate={f.value}
                verbs={f.options}
                forcedWeek={forcedWeek}
              />
              <div className="pt-4 border-t border-dashed space-y-2">
                <Controller
                  name={baseName}
                  control={control}
                  defaultValue={defaultVal}
                  render={({ field }) => (
                    <SearchableSelectField
                      label="Modificar Semana (Opcional)"
                      placeholder="Seleccionar semana..."
                      options={weekOptions}
                      value={field.value as string}
                      onChange={field.onChange}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Puedes seleccionar manualmente la semana si la calculada no es
                  correcta.
                </p>
              </div>
            </div>
          );
        }

        return (
          <CycleWeekIndicator
            key={f.id}
            label={f.label || f.key}
            startDate={f.value}
            verbs={f.options}
            forcedWeek={forcedWeek}
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
                members={currentMembers}
              />
            )}
          />
        );
      }
      if (f.type === 'SECTION') return null;

      return (
        <InputField<FormValues>
          name={baseName}
          label={f.label || f.key}
          register={register}
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
    })();

    if (!content) return null;

    const isNumber = f.type === 'NUMBER' || f.type === 'CURRENCY';

    return (
      <div
        key={f.id}
        className={cn('transition-all duration-300', 'col-span-full')}
      >
        <div
          className={cn(
            'bg-card rounded-3xl border-2 border-border shadow-sm transition-all duration-200',
            !isNumber ? 'p-6 sm:p-8' : 'p-4 sm:p-6'
          )}
        >
          {content}
        </div>
      </div>
    );
  };

  const accessCode = watch('accessCode');

  const verifyAccess = async () => {
    const isValid = await trigger('accessCode');
    if (!isValid) return;

    if (!accessCode) {
      showError('Ingresa la clave de acceso');
      return;
    }

    setIsVerifying(true);
    try {
      const cell = await verifyCellAccess(accessCode);
      if (cell) {
        setIsAuthenticated(true);
        setCellInfo({
          name: cell.name,
          leader: cell.leader
            ? `${cell.leader.firstName} ${cell.leader.lastName}`
            : undefined,
          leaderId: cell.leader_id,
          assistant: cell.assistant
            ? `${cell.assistant.firstName} ${cell.assistant.lastName}`
            : undefined,
          assistantId: cell.assistant_id,
          host: cell.host
            ? `${cell.host.firstName} ${cell.host.lastName}`
            : undefined,
          hostId: cell.host_id,
          sector: cell.subSector?.sector?.name,
          subSector: cell.subSector?.name,
        });
        setValue('cellId', cell.id);

        // Fetch members for this cell
        try {
          const entityMembers = await getPublicReportEntityMembers(
            token,
            scope,
            cell.id
          );
          const memberOptions = entityMembers.map((m) => ({
            value: m.id,
            label: `${m.firstName} ${m.lastName}`,
          }));
          setCurrentMembers(memberOptions);

          // Initialize fields
          if (entityMembers.length > 0) {
            const allMemberIds = entityMembers.map((m) => m.id);

            fields.forEach((f) => {
              // Initialize numeric fields to 0 if they don't have a value
              if (f.type === 'NUMBER' || f.type === 'CURRENCY') {
                const currentVal = getValues(`values.${f.id}`);
                if (
                  currentVal === undefined ||
                  currentVal === null ||
                  currentVal === ''
                ) {
                  setValue(`values.${f.id}`, 0);
                }
              }

              // Default members for CELL scope (including leader)
              if (scope === 'CELL' && f.type === 'MEMBER_SELECT') {
                // For public form, we check if there's already a value
                // (could be from a draft)
                const currentVal =
                  (getValues(`values.${f.id}`) as string[]) || [];
                if (currentVal.length === 0) {
                  setValue(`values.${f.id}`, allMemberIds);
                }
              }
            });
          }
        } catch (error) {
          console.error('Error fetching members:', error);
        }

        showSuccess('Acceso correcto. Buscando borradores...');

        // Load draft if exists
        const draft = await getDraftReportEntry(token, scope, cell.id);
        if (draft) {
          setDraftId(draft.id);
          showSuccess('Borrador recuperado');
          // Populate form
          draft.values.forEach((v: any) => {
            if (v.field?.id) {
              const fieldDef = fields.find((f) => f.id === v.field.id);
              let val = v.value;

              // Parse numbers if needed
              if (
                fieldDef?.type === 'NUMBER' ||
                fieldDef?.type === 'CURRENCY'
              ) {
                val = Number(v.value);
              }

              // Parse Friend Registration if needed
              if (fieldDef?.type === 'FRIEND_REGISTRATION') {
                // Ensure it is an array. If it's a string, parse it.
                if (typeof v.value === 'string') {
                  try {
                    val = JSON.parse(v.value);
                  } catch (e) {
                    console.error(
                      'Error parsing friend registration value:',
                      e
                    );
                    val = [];
                  }
                }
                // If it's already an object/array (Prisma default behavior), use it.
                // If null/undefined, default to empty array
                if (!val || !Array.isArray(val)) {
                  val = [];
                }
              }

              setValue(`values.${v.field.id}`, val);
            }
          });
        }
      } else {
        showError('Clave incorrecta o célula no encontrada');
      }
    } catch (error) {
      console.error(error);
      showError('Error al verificar acceso');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFormSubmit = async (
    data: FormValues,
    isDraft: boolean
  ): Promise<boolean> => {
    if (scope === 'CELL' && !isAuthenticated && isDraft) {
      showError('Debes autenticarte primero para guardar borrador');
      return false;
    }

    if (scope === 'CELL' && !isAuthenticated) {
      showError('Debes autenticarte primero');
      return false;
    }

    if (isDraft) setIsSavingDraft(true);

    try {
      const values = fields
        .map((f) => {
          if (f.type === 'SECTION') return null;

          let val: unknown;

          if (f.type === 'CYCLE_WEEK_INDICATOR') {
            const userVal = data.values[f.id];
            if (userVal) {
              val = userVal;
            } else {
              const state = calculateCycleState(f.value, f.options);
              if (state.status === 'active' && state.verb) {
                val = `Semana ${state.weekNumber}: ${state.verb}`;
              } else {
                val = state.message || 'Estado desconocido';
              }
            }
          } else {
            val = data.values[f.id];

            // Default to 0 for numeric fields if undefined/null/empty
            if (f.type === 'NUMBER' || f.type === 'CURRENCY') {
              if (val === undefined || val === null || val === '') {
                val = 0;
              }
            }
          }

          return {
            fieldId: f.id,
            value: val,
          };
        })
        .filter(
          (v): v is { fieldId: string; value: unknown } =>
            v !== null && v.value !== undefined
        );

      const result = await submitPublicReportEntry({
        token,
        scope,
        cellId: scope === 'CELL' ? data.cellId : undefined,
        groupId: scope === 'GROUP' ? data.groupId : undefined,
        sectorId: scope === 'SECTOR' ? data.sectorId : undefined,
        values,
        entryId: draftId || undefined,
        isDraft,
      });

      if (isDraft) {
        showSuccess('Borrador guardado exitosamente');
        if (result?.id) setDraftId(result.id);
      } else {
        showSuccess('Reporte enviado exitosamente');
        setSubmitted(true);
        reset();
        setDraftId(null);
        setIsAuthenticated(false);
      }
      return true;
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      showError('Error al enviar el reporte');
      return false;
    } finally {
      if (isDraft) setIsSavingDraft(false);
    }
  };

  const onSaveDraft = (data: FormValues) => handleFormSubmit(data, true);

  const onPreSubmit = (data: FormValues) => {
    setFormDataToSubmit(data);
    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    if (formDataToSubmit) {
      setIsConfirming(true);
      const success = await handleFormSubmit(formDataToSubmit, false);
      setIsConfirming(false);

      // Only close modal if submission FAILED.
      // If success, the component will re-render to success view automatically.
      if (!success) {
        setIsConfirmOpen(false);
      } else {
        // If success, also close the modal so it's not there when user clicks "Enviar otro reporte"
        setIsConfirmOpen(false);
      }
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-5xl">✓</div>
          <h2 className="text-2xl font-bold">¡Reporte enviado!</h2>
          <p className="text-muted-foreground">
            Gracias por enviar tu reporte para {churchName}.
          </p>
          <Button className="mt-4" onClick={() => setSubmitted(false)}>
            Enviar otro reporte
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl">
              <FaLock /> Confirmar Envío
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg mt-4">
              ¿Estás seguro de que deseas enviar el reporte?
              <span className="font-bold text-red-500 dark:text-red-400 block mt-3 text-lg">
                Una vez enviado, no podrás volver a modificarlo.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel
              disabled={isConfirming}
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isConfirming}
              onClick={(e) => {
                e.preventDefault();
                confirmSubmit();
              }}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="animate-spin" />
                  Enviando...
                </>
              ) : (
                'Confirmar y Enviar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <form className="space-y-6" onSubmit={handleSubmit(onPreSubmit)}>
        <div className="flex flex-col gap-10">
          {/* Header Section Centered */}
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Auth Card Centered */}
          <div className="w-full max-w-md mx-auto">
            {scope === 'CELL' && (
              <Card className="border-2 transition-all duration-300 hover:shadow-lg bg-card">
                <div className="bg-primary/5 px-6 py-4 border-b">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary/70">
                    Seguridad y Acceso
                  </h3>
                </div>
                <CardContent className="p-6 space-y-5">
                  {!isAuthenticated && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-2">
                        <InputField
                          name="accessCode"
                          label="Código de Célula"
                          register={register}
                          rules={{
                            required: 'La clave de acceso es requerida',
                          }}
                          error={errors.accessCode?.message}
                          type="password"
                          placeholder="Introduce el código..."
                          startIcon={<FaKey className="text-primary/60" />}
                          className="text-lg"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              verifyAccess();
                            }
                          }}
                        />
                        <p className="text-xs text-muted-foreground px-1">
                          Ingresa la clave única de tu célula para continuar.
                        </p>
                      </div>
                      <Button
                        type="button"
                        className="w-full h-12 text-base font-bold rounded-xl shadow-md transition-all active:scale-95"
                        onClick={verifyAccess}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Verificando...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaLock className="w-4 h-4" />
                            <span>Acceder al Reporte</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  )}

                  {isAuthenticated && cellInfo && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <div className="rounded-2xl border-2 border-green-500/20 bg-green-500/5 p-4 text-sm flex flex-col sm:flex-row justify-between items-center gap-3 text-green-700 dark:text-green-400">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500 text-white p-1.5 rounded-full shadow-sm">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-base">
                            Identificado
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-green-500/30 hover:bg-green-500/10 h-8 px-4"
                          onClick={() => {
                            setIsAuthenticated(false);
                            setCellInfo(null);
                            setDraftId(null);
                            reset({ scope, cellId: '' });
                          }}
                        >
                          Salir
                        </Button>
                      </div>

                      <div className="bg-card p-8 rounded-3xl space-y-8 border-2 border-border transition-colors shadow-sm">
                        <div className="flex flex-col items-center text-center gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black border-2 border-primary/10 shadow-inner">
                            {cellInfo.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                              Célula Seleccionada
                            </span>
                            <span className="font-black text-3xl leading-tight block text-foreground tracking-tight">
                              {cellInfo.name}
                            </span>
                          </div>
                        </div>

                        {(cellInfo.leader ||
                          cellInfo.sector ||
                          cellInfo.subSector) && (
                          <div className="grid grid-cols-1 gap-6 pt-6 border-t-2 border-dashed border-border/60 text-center">
                            {cellInfo.leader && (
                              <div>
                                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                  Líder a Cargo
                                </span>
                                <span className="font-black text-xl text-foreground">
                                  {cellInfo.leader}
                                </span>
                              </div>
                            )}

                            {cellInfo.sector && (
                              <div>
                                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                  Sector / Zona
                                </span>
                                <span className="font-black text-lg text-foreground/90">
                                  {cellInfo.sector}
                                </span>
                              </div>
                            )}

                            {cellInfo.subSector && (
                              <div>
                                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                  Subsector
                                </span>
                                <span className="font-black text-lg text-foreground/90">
                                  {cellInfo.subSector}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {scope === 'GROUP' && (
              <div className="w-full max-w-md mx-auto">
                <SelectField
                  name="groupId"
                  label="Grupo"
                  control={control}
                  options={[
                    { value: '', label: 'Selecciona un grupo' },
                    ...groups,
                  ]}
                  rules={{
                    validate: (v: any) => {
                      if (!v) return 'Requerido';
                      return true;
                    },
                  }}
                />
              </div>
            )}
            {scope === 'SECTOR' && (
              <div className="w-full max-w-md mx-auto">
                <SelectField
                  name="sectorId"
                  label="Sector"
                  control={control}
                  options={[
                    { value: '', label: 'Selecciona un sector' },
                    ...sectors,
                  ]}
                  rules={{
                    validate: (v: any) => {
                      if (!v) return 'Requerido';
                      return true;
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Fields - Only show if authenticated (for CELL scope) or if other scope */}
        {(scope !== 'CELL' || isAuthenticated) && (
          <>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="space-y-8 max-w-3xl mx-auto">
                  {groupedFields.map((group, i) => {
                    if (group.section) {
                      if (!isFieldVisible(group.section)) return null;

                      const sectionKey = String(group.section.id || i);
                      const isOpen = openSections[sectionKey] ?? true;
                      return (
                        <Collapsible
                          key={sectionKey}
                          open={isOpen}
                          onOpenChange={(open) =>
                            setSectionOpen(sectionKey, open)
                          }
                          className="bg-muted/30 rounded-3xl border border-border shadow-sm transition-all duration-300"
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full justify-between px-6 py-8 hover:bg-accent/50 transition-colors h-auto whitespace-normal text-left flex items-center gap-4"
                            >
                              <span className="text-2xl font-extrabold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight break-words min-w-0 flex-1">
                                {group.section.label || 'Sección'}
                              </span>
                              <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border border-primary/30 shadow-sm text-primary shrink-0">
                                <ChevronDown
                                  className={cn(
                                    'h-5 w-5 transition-transform duration-300',
                                    isOpen ? 'rotate-180' : ''
                                  )}
                                />
                              </div>
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-6 pb-8 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-visible">
                            <div className="grid grid-cols-1 gap-8 pt-4">
                              {group.fields.map((f) => {
                                if (!isFieldVisible(f)) return null;
                                return renderField(f);
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    }
                    return (
                      <div
                        key={`group-${i}`}
                        className="grid grid-cols-1 gap-8"
                      >
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

            <div className="flex flex-col md:flex-row justify-end gap-4 sticky bottom-6 bg-background/80 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-xl z-20 mt-12 transition-all duration-300 max-w-3xl mx-auto w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto gap-3 h-14 px-8 rounded-2xl border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground font-semibold transition-all duration-200"
                onClick={() => onSaveDraft(getValues())}
                disabled={isSavingDraft || isSubmitting}
              >
                {isSavingDraft ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <FaFloppyDisk className="h-5 w-5" />
                )}
                Guardar Borrador
              </Button>
              <Button
                type="submit"
                className="w-full md:w-auto gap-3 h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-all duration-200"
                disabled={isSubmitting || isSavingDraft}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="h-5 w-5" />
                    Enviar Reporte
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
