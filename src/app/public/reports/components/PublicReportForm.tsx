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
} from '@/components/FormControls';
import type { ReportFieldType, ReportScope } from '@/generated/prisma/client';
import {
  FriendRegistrationField,
  FriendRegistrationValue,
} from '@/app/(authenticated)/reports/components/FriendRegistrationField';
import {
  submitPublicReportEntry,
  verifyCellAccess,
  getDraftReportEntry,
  getPublicReportEntityMembers,
} from '../../actions';
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
import { ChevronDown, Loader2, Check } from 'lucide-react';
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
  churchName: string;
}) {
  const { showSuccess, showError } = useNotificationStore();
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cellInfo, setCellInfo] = useState<{
    name: string;
    leader?: string;
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
              ...(f.required ? { required: 'Requerido' } : {}),
            }}
            render={({ field, fieldState }) => (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 mb-2">
                  <span className="text-2xl font-black">$</span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {f.label || f.key}
                  </span>
                </div>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-300 dark:text-slate-700 group-focus-within:text-primary transition-colors">
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
                      'w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-5xl sm:text-6xl font-black tracking-tighter p-0 pl-14 placeholder:text-slate-100 dark:placeholder:text-slate-800 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
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
              ...(f.required ? { required: 'Requerido' } : {}),
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
              ...(f.required ? { required: 'Requerido' } : {}),
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
            rules={f.required ? { required: 'Requerido' } : undefined}
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
              rules={f.required ? { required: 'Requerido' } : undefined}
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
            rules={f.required ? { required: 'Requerido' } : undefined}
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
            rules={f.required ? { required: 'Requerido' } : undefined}
            render={({ field, fieldState }) => (
              <SearchableSelectField
                label={f.label || f.key}
                options={currentMembers}
                value={field.value as string}
                onChange={field.onChange}
                error={fieldState.error?.message}
                placeholder="Selecciona un miembro..."
              />
            )}
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
          rules={f.required ? { required: 'Requerido' } : undefined}
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
            'bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200',
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
            // Handle different value types if necessary
            if (v.field?.id) {
              setValue(`values.${v.field.id}`, v.value);
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
      const values = Object.entries(data.values || {}).map(
        ([fieldId, value]) => ({
          fieldId,
          value,
        })
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
            <AlertDialogTitle className="flex items-center gap-2">
              <FaLock /> Confirmar Envío
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas enviar el reporte?
              <span className="font-semibold text-destructive block mt-2">
                Una vez enviado, no podrás volver a modificarlo.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
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
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Auth Card Centered */}
          <div className="w-full max-w-md mx-auto">
            {scope === 'CELL' && (
              <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-lg dark:bg-slate-900/50">
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

                      <div className="bg-muted/40 p-5 rounded-2xl space-y-6 border-2 border-transparent hover:border-primary/10 transition-colors">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/5">
                            {cellInfo.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                              Célula Seleccionada
                            </span>
                            <span className="font-bold text-xl leading-tight block">
                              {cellInfo.name}
                            </span>
                          </div>
                        </div>

                        {(cellInfo.leader ||
                          cellInfo.sector ||
                          cellInfo.subSector) && (
                          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border/50 text-center">
                            {cellInfo.leader && (
                              <div>
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                                  Líder a Cargo
                                </span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 text-lg">
                                  {cellInfo.leader}
                                </span>
                              </div>
                            )}

                            {cellInfo.sector && (
                              <div>
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                                  Sector / Zona
                                </span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {cellInfo.sector}
                                </span>
                              </div>
                            )}

                            {cellInfo.subSector && (
                              <div>
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                                  Subsector
                                </span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
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
                  rules={{ required: 'Requerido' }}
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
                  rules={{ required: 'Requerido' }}
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
                          className="bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300"
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full justify-between px-6 py-8 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                {group.section.label || 'Sección'}
                              </span>
                              <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                                <ChevronDown
                                  className={cn(
                                    'h-5 w-5 transition-transform duration-300 text-slate-500',
                                    isOpen ? 'rotate-180' : ''
                                  )}
                                />
                              </div>
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-6 pb-8 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
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

            <div className="flex flex-col md:flex-row justify-end gap-4 sticky bottom-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl z-20 mt-12 transition-all duration-300 max-w-3xl mx-auto w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto gap-3 h-14 px-8 rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold transition-all duration-200"
                onClick={handleSubmit(onSaveDraft)}
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
                className="w-full md:w-auto gap-3 h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all duration-200"
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
