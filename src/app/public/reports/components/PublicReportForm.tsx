"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField, SelectField } from "@/components/FormControls";
import type { ReportFieldType, ReportScope } from "@/generated/prisma/client";
import {
  submitPublicReportEntry,
  verifyCellAccess,
  getDraftReportEntry,
} from "../../actions";
import { useNotificationStore } from "@/store/NotificationStore";
import {
  FaLock,
  FaFloppyDisk,
  FaPaperPlane,
  FaSpinner,
  FaKey,
} from "react-icons/fa6";

type Option = { value: string; label: string };

type FieldDef = {
  id: string;
  key: string;
  label?: string | null;
  type: ReportFieldType;
  required?: boolean;
  options?: string[];
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
  const { showSuccess, showError, showWarning } = useNotificationStore();
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: { scope },
  });

  const accessCode = watch("accessCode");

  const verifyAccess = async () => {
    const isValid = await trigger("accessCode");
    if (!isValid) return;

    if (!accessCode) {
      showError("Ingresa la clave de acceso");
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
        setValue("cellId", cell.id);

        showSuccess("Acceso correcto. Buscando borradores...");

        // Load draft if exists
        const draft = await getDraftReportEntry(token, scope, cell.id);
        if (draft) {
          setDraftId(draft.id);
          showSuccess("Borrador recuperado");
          // Populate form
          draft.values.forEach((v: any) => {
            // Handle different value types if necessary
            if (v.field?.id) {
              setValue(`values.${v.field.id}`, v.value);
            }
          });
        }
      } else {
        showError("Clave incorrecta o célula no encontrada");
      }
    } catch (error) {
      console.error(error);
      showError("Error al verificar acceso");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFormSubmit = async (
    data: FormValues,
    isDraft: boolean
  ): Promise<boolean> => {
    if (scope === "CELL" && !isAuthenticated && isDraft) {
      showError("Debes autenticarte primero para guardar borrador");
      return false;
    }

    if (scope === "CELL" && !isAuthenticated) {
      showError("Debes autenticarte primero");
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
        cellId: scope === "CELL" ? data.cellId : undefined,
        groupId: scope === "GROUP" ? data.groupId : undefined,
        sectorId: scope === "SECTOR" ? data.sectorId : undefined,
        values,
        entryId: draftId || undefined,
        isDraft,
      });

      if (isDraft) {
        showSuccess("Borrador guardado exitosamente");
        if (result?.id) setDraftId(result.id);
      } else {
        showSuccess("Reporte enviado exitosamente");
        setSubmitted(true);
        reset();
        setDraftId(null);
        setIsAuthenticated(false);
      }
      return true;
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      showError("Error al enviar el reporte");
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
      }
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-base-100 rounded-lg shadow-lg border border-base-200">
        <div className="text-success text-5xl">✓</div>
        <h2 className="text-2xl font-bold">¡Reporte enviado!</h2>
        <p className="text-base-content/70">
          Gracias por enviar tu reporte para {churchName}.
        </p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => setSubmitted(false)}
        >
          Enviar otro reporte
        </button>
      </div>
    );
  }

  return (
    <>
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-xl shadow-2xl border border-base-200 p-6 max-w-md w-full relative">
            <h3 className="font-bold text-lg text-warning flex items-center gap-2">
              <FaLock /> Confirmar Envío
            </h3>
            <p className="py-4 text-base-content/80">
              ¿Estás seguro de que deseas enviar el reporte?
              <br />
              <span className="font-semibold text-error block mt-2">
                Una vez enviado, no podrás volver a modificarlo.
              </span>
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isConfirming}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmSubmit}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Enviando...
                  </>
                ) : (
                  "Confirmar y Enviar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onPreSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            {description && (
              <p className="text-base-content/70 mt-2">{description}</p>
            )}
          </div>
          <div className="md:col-span-1 space-y-4">
            {scope === "CELL" && (
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body p-4 space-y-4">
                  <h3 className="font-semibold text-lg uppercase text-base-content/60">
                    Autenticación
                  </h3>

                  {!isAuthenticated && (
                    <>
                      <InputField
                        name="accessCode"
                        label="Clave de Acceso"
                        register={register}
                        rules={{ required: "La clave de acceso es requerida" }}
                        error={errors.accessCode?.message}
                        type="password"
                        placeholder="Clave de Acceso"
                        startIcon={<FaKey className="text-base-content/40" />}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            verifyAccess();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-lg w-full"
                        onClick={verifyAccess}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Verificar Acceso"
                        )}
                      </button>
                    </>
                  )}

                  {isAuthenticated && cellInfo && (
                    <div className="space-y-3">
                      <div className="alert alert-success py-2 text-sm flex justify-between items-center">
                        <span className="font-medium">✓ Acceso verificado</span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content"
                          onClick={() => {
                            setIsAuthenticated(false);
                            setCellInfo(null);
                            setDraftId(null);
                            reset({ scope, cellId: "" });
                          }}
                        >
                          Cambiar
                        </button>
                      </div>

                      <div className="bg-base-200/50 p-3 rounded-lg space-y-2 text-sm">
                        <div>
                          <span className="block text-xs text-base-content/60 uppercase">
                            Célula
                          </span>
                          <span className="font-semibold text-base-content">
                            {cellInfo.name}
                          </span>
                        </div>

                        {cellInfo.leader && (
                          <div>
                            <span className="block text-xs text-base-content/60 uppercase">
                              Líder
                            </span>
                            <span className="text-base-content">
                              {cellInfo.leader}
                            </span>
                          </div>
                        )}

                        {(cellInfo.sector || cellInfo.subSector) && (
                          <div className="grid grid-cols-2 gap-2">
                            {cellInfo.sector && (
                              <div>
                                <span className="block text-xs text-base-content/60 uppercase">
                                  Sector
                                </span>
                                <span className="text-base-content">
                                  {cellInfo.sector}
                                </span>
                              </div>
                            )}
                            {cellInfo.subSector && (
                              <div>
                                <span className="block text-xs text-base-content/60 uppercase">
                                  Subsector
                                </span>
                                <span className="text-base-content">
                                  {cellInfo.subSector}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {scope === "GROUP" && (
              <SelectField
                name="groupId"
                label="Grupo"
                register={register}
                options={[
                  { value: "", label: "Selecciona un grupo" },
                  ...groups,
                ]}
                rules={{ required: "Requerido" }}
              />
            )}
            {scope === "SECTOR" && (
              <SelectField
                name="sectorId"
                label="Sector"
                register={register}
                options={[
                  { value: "", label: "Selecciona un sector" },
                  ...sectors,
                ]}
                rules={{ required: "Requerido" }}
              />
            )}
          </div>
        </div>

        {/* Form Fields - Only show if authenticated (for CELL scope) or if other scope */}
        {(scope !== "CELL" || isAuthenticated) && (
          <>
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {fields.map((f) => {
                    const baseName = `values.${f.id}` as const;
                    if (f.type === "NUMBER" || f.type === "CURRENCY") {
                      return (
                        <div key={f.id} className="w-[80%] mx-auto">
                          <InputField<FormValues>
                            name={baseName}
                            label={f.label || f.key}
                            register={register}
                            type="number"
                            step={f.type === "CURRENCY" ? "0.01" : "1"}
                            placeholder={f.type === "CURRENCY" ? "0.00" : "0"}
                            rules={{
                              ...(f.required ? { required: "Requerido" } : {}),
                              valueAsNumber: true,
                            }}
                            startIcon={
                              f.type === "CURRENCY" ? (
                                <span className="text-gray-500 font-bold">
                                  $
                                </span>
                              ) : undefined
                            }
                          />
                        </div>
                      );
                    }
                    if (f.type === "BOOLEAN") {
                      return (
                        <div key={f.id} className="w-[80%] mx-auto">
                          <SelectField<FormValues>
                            name={baseName}
                            label={f.label || f.key}
                            register={register}
                            options={[
                              { value: "", label: "Selecciona" },
                              { value: "true", label: "Sí" },
                              { value: "false", label: "No" },
                            ]}
                            rules={{
                              ...(f.required ? { required: "Requerido" } : {}),
                              setValueAs: (v) =>
                                v === "true"
                                  ? true
                                  : v === "false"
                                  ? false
                                  : undefined,
                            }}
                          />
                        </div>
                      );
                    }
                    if (f.type === "DATE") {
                      return (
                        <div key={f.id} className="w-[80%] mx-auto">
                          <InputField<FormValues>
                            name={baseName}
                            label={f.label || f.key}
                            register={register}
                            type="date"
                            rules={
                              f.required ? { required: "Requerido" } : undefined
                            }
                          />
                        </div>
                      );
                    }
                    if (f.type === "SELECT") {
                      return (
                        <div key={f.id} className="w-[80%] mx-auto">
                          <SelectField<FormValues>
                            name={baseName}
                            label={f.label || f.key}
                            register={register}
                            options={[
                              { value: "", label: "Selecciona una opción" },
                              ...(f.options || []).map((opt) => ({
                                value: opt,
                                label: opt,
                              })),
                            ]}
                            rules={
                              f.required ? { required: "Requerido" } : undefined
                            }
                          />
                        </div>
                      );
                    }
                    if (f.type === "SECTION") {
                      return (
                        <div
                          key={f.id}
                          className="divider font-bold text-lg mt-6 mb-2"
                        >
                          {f.label || "Nueva Sección"}
                        </div>
                      );
                    }
                    if (f.type === "MEMBER_SELECT") {
                      return (
                        <div key={f.id} className="w-[80%] mx-auto">
                          <SelectField<FormValues>
                            name={baseName}
                            label={f.label || f.key}
                            register={register}
                            options={[
                              { value: "", label: "Selecciona un miembro" },
                              ...members,
                            ]}
                            rules={
                              f.required ? { required: "Requerido" } : undefined
                            }
                          />
                        </div>
                      );
                    }
                    return (
                      <InputField<FormValues>
                        key={f.id}
                        name={baseName}
                        label={f.label || f.key}
                        register={register}
                        rules={
                          f.required ? { required: "Requerido" } : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-3 sticky bottom-4 bg-base-100/80 backdrop-blur-md p-4 rounded-xl border border-base-200 shadow-lg z-20">
              <button
                type="button"
                className="btn btn-ghost w-full md:w-auto gap-2"
                onClick={handleSubmit(onSaveDraft)}
                disabled={isSavingDraft || isSubmitting}
              >
                {isSavingDraft ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <FaFloppyDisk />
                )}
                Guardar Borrador
              </button>
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto gap-2"
                disabled={isSubmitting || isSavingDraft}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Enviar Reporte
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
