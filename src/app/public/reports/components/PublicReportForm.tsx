'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputField, SelectField } from '@/components/FormControls';
import type { ReportFieldType, ReportScope } from '@/generated/prisma/client';
import {
  submitPublicReportEntry,
  verifyCellAccess,
  getDraftReportEntry,
} from '../../actions';
import { useNotificationStore } from '@/store/NotificationStore';
import { FaLock, FaFloppyDisk, FaPaperPlane, FaKey } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      if (f.type === 'NUMBER' || f.type === 'CURRENCY') {
        return (
          <InputField<FormValues>
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
            name={baseName}
            label={f.label || f.key}
            control={control}
            options={[
              { value: '', label: 'Selecciona un miembro' },
              ...members,
            ]}
            rules={f.required ? { required: 'Requerido' } : undefined}
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

    return (
      <div key={f.id} className="w-[80%] mx-auto">
        {content}
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
        <CardContent className="p-8 text-center space-y-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          <div className="md:col-span-1 space-y-4">
            {scope === 'CELL' && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg uppercase text-muted-foreground">
                    Autenticación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isAuthenticated && (
                    <>
                      <InputField
                        name="accessCode"
                        label="Clave de Acceso"
                        register={register}
                        rules={{ required: 'La clave de acceso es requerida' }}
                        error={errors.accessCode?.message}
                        type="password"
                        placeholder="Clave de Acceso"
                        startIcon={<FaKey className="text-muted-foreground" />}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            verifyAccess();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="w-full"
                        onClick={verifyAccess}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          'Verificar Acceso'
                        )}
                      </Button>
                    </>
                  )}

                  {isAuthenticated && cellInfo && (
                    <div className="space-y-3">
                      <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm flex justify-between items-center text-green-700 dark:text-green-400 transition-colors duration-300">
                        <span className="font-medium flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Acceso verificado
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-500/20 hover:text-green-800 dark:hover:text-green-300"
                          onClick={() => {
                            setIsAuthenticated(false);
                            setCellInfo(null);
                            setDraftId(null);
                            reset({ scope, cellId: '' });
                          }}
                        >
                          Cambiar
                        </Button>
                      </div>

                      <div className="bg-muted/30 p-3 rounded-lg space-y-2 text-sm border">
                        <div>
                          <span className="block text-xs text-muted-foreground uppercase">
                            Célula
                          </span>
                          <span className="font-semibold">{cellInfo.name}</span>
                        </div>

                        {cellInfo.leader && (
                          <div>
                            <span className="block text-xs text-muted-foreground uppercase">
                              Líder
                            </span>
                            <span>{cellInfo.leader}</span>
                          </div>
                        )}

                        {(cellInfo.sector || cellInfo.subSector) && (
                          <div className="grid grid-cols-2 gap-2">
                            {cellInfo.sector && (
                              <div>
                                <span className="block text-xs text-muted-foreground uppercase">
                                  Sector
                                </span>
                                <span>{cellInfo.sector}</span>
                              </div>
                            )}
                            {cellInfo.subSector && (
                              <div>
                                <span className="block text-xs text-muted-foreground uppercase">
                                  Subsector
                                </span>
                                <span>{cellInfo.subSector}</span>
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
                rules={{ required: 'Requerido' }}
              />
            )}
          </div>
        </div>

        {/* Form Fields - Only show if authenticated (for CELL scope) or if other scope */}
        {(scope !== 'CELL' || isAuthenticated) && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
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
                          className="rounded-lg border"
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full justify-between px-4 py-3"
                            >
                              <span className="text-base font-semibold">
                                {group.section.label || 'Sección'}
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
                    return (
                      <div
                        key={`group-${i}`}
                        className="grid grid-cols-1 gap-4"
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

            <div className="flex flex-col md:flex-row justify-end gap-3 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-md border shadow-sm z-20">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto gap-2"
                onClick={handleSubmit(onSaveDraft)}
                disabled={isSavingDraft || isSubmitting}
              >
                {isSavingDraft ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FaFloppyDisk />
                )}
                Guardar Borrador
              </Button>
              <Button
                type="submit"
                className="w-full md:w-auto gap-2"
                disabled={isSubmitting || isSavingDraft}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
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
