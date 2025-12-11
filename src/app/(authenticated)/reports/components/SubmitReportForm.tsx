"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { InputField, SelectField } from "@/components/FormControls";
import type { ReportFieldType, ReportScope } from "@/generated/prisma/client";
import {
  createReportEntry,
  updateReportEntry,
} from "@/app/(authenticated)/reports/actions/reports.actions";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/NotificationStore";

type Option = { value: string; label: string };

type FieldDef = {
  id: string;
  key: string;
  label?: string | null;
  type: ReportFieldType;
  required?: boolean;
  options?: string[]; // Add options
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
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: initialValues || { scope },
  });

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
          cellId: scope === "CELL" ? data.cellId : undefined,
          groupId: scope === "GROUP" ? data.groupId : undefined,
          sectorId: scope === "SECTOR" ? data.sectorId : undefined,
          values,
        });
        showSuccess("Entrada actualizada exitosamente");
        router.push(`/reports/${reportId}/entries`);
      } else {
        await createReportEntry({
          reportId,
          scope,
          cellId: scope === "CELL" ? data.cellId : undefined,
          groupId: scope === "GROUP" ? data.groupId : undefined,
          sectorId: scope === "SECTOR" ? data.sectorId : undefined,
          values,
        });
        showSuccess("Reporte enviado exitosamente");
        reset(); // Limpiar el formulario para una nueva entrada
        router.refresh();
      }
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      showError("Error al enviar el reporte");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-base-content/70 mt-2">{description}</p>
          )}
        </div>
        <div className="md:col-span-1">
          {scope === "CELL" && (
            <SelectField
              name="cellId"
              label="Célula"
              register={register}
              options={[
                { value: "", label: "Selecciona una célula" },
                ...cells,
              ]}
              rules={{ required: "Requerido" }}
            />
          )}
          {scope === "GROUP" && (
            <SelectField
              name="groupId"
              label="Grupo"
              register={register}
              options={[{ value: "", label: "Selecciona un grupo" }, ...groups]}
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

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 mt-4">
            {fields.map((f) => {
              const baseName = `values.${f.id}` as const;
              if (f.type === "NUMBER" || f.type === "CURRENCY") {
                return (
                  <InputField<FormValues>
                    key={f.id}
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
                        <span className="text-gray-500 font-bold">$</span>
                      ) : undefined
                    }
                  />
                );
              }
              if (f.type === "BOOLEAN") {
                return (
                  <SelectField<FormValues>
                    key={f.id}
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
                        v === "true" ? true : v === "false" ? false : undefined,
                    }}
                  />
                );
              }
              if (f.type === "DATE") {
                return (
                  <InputField<FormValues>
                    key={f.id}
                    name={baseName}
                    label={f.label || f.key}
                    register={register}
                    type="date"
                    rules={f.required ? { required: "Requerido" } : undefined}
                  />
                );
              }
              if (f.type === "SELECT") {
                return (
                  <SelectField<FormValues>
                    key={f.id}
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
                    rules={f.required ? { required: "Requerido" } : undefined}
                  />
                );
              }
              return (
                <InputField<FormValues>
                  key={f.id}
                  name={baseName}
                  label={f.label || f.key}
                  register={register}
                  rules={f.required ? { required: "Requerido" } : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="btn"
          onClick={() => router.push("/reports")}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Enviando...
            </>
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </form>
  );
}
