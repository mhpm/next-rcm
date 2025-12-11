"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField, SelectField } from "@/components/FormControls";
import type { ReportFieldType, ReportScope } from "@/generated/prisma/client";
import { submitPublicReportEntry } from "../../actions";
import { useNotificationStore } from "@/store/NotificationStore";

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
  values: Record<string, unknown>; // fieldId -> value
};

export default function PublicReportForm({
  token,
  title,
  description,
  scope,
  fields,
  cells,
  groups,
  sectors,
  churchName,
}: {
  token: string;
  title: string;
  description?: string | null;
  scope: ReportScope;
  fields: FieldDef[];
  cells: Option[];
  groups: Option[];
  sectors: Option[];
  churchName: string;
}) {
  const { showSuccess, showError } = useNotificationStore();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { scope },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const values = Object.entries(data.values || {}).map(
        ([fieldId, value]) => ({
          fieldId,
          value,
        })
      );

      await submitPublicReportEntry({
        token,
        scope,
        cellId: scope === "CELL" ? data.cellId : undefined,
        groupId: scope === "GROUP" ? data.groupId : undefined,
        sectorId: scope === "SECTOR" ? data.sectorId : undefined,
        values,
      });

      showSuccess("Reporte enviado exitosamente");
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      showError("Error al enviar el reporte");
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
              if (f.type === "NUMBER") {
                return (
                  <InputField<FormValues>
                    key={f.id}
                    name={baseName}
                    label={f.label || f.key}
                    register={register}
                    type="number"
                    rules={{
                      ...(f.required ? { required: "Requerido" } : {}),
                      valueAsNumber: true,
                    }}
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
          type="submit"
          className="btn btn-primary w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Enviando...
            </>
          ) : (
            "Enviar Reporte"
          )}
        </button>
      </div>
    </form>
  );
}
