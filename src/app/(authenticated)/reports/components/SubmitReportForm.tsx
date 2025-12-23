"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { InputField, SelectField } from "@/components/FormControls";
import type { ReportFieldType, ReportScope } from "@/generated/prisma/client";
import {
  createReportEntry,
  updateReportEntry,
  getReportEntityMembers,
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
  value?: any;
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

  const watchedCellId = watch("cellId");
  const watchedGroupId = watch("groupId");
  const watchedSectorId = watch("sectorId");

  React.useEffect(() => {
    const fetchMembers = async () => {
      let entityId: string | undefined;
      if (scope === "CELL") entityId = watchedCellId;
      if (scope === "GROUP") entityId = watchedGroupId;
      if (scope === "SECTOR") entityId = watchedSectorId;

      if (entityId) {
        try {
          const data = await getReportEntityMembers(scope, entityId);
          setMembers(data);
        } catch (e) {
          console.error(e);
          setMembers([]);
        }
      } else {
        setMembers([]);
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
      if (f.type === "SECTION") {
        // Check for Section Break
        if (f.value === "SECTION_BREAK") {
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
          control={control}
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
          control={control}
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
    if (f.type === "MEMBER_SELECT") {
      return (
        <SelectField<FormValues>
          key={f.id}
          name={baseName}
          label={f.label || f.key}
          control={control}
          options={[
            { value: "", label: "Selecciona un miembro" },
            ...members.map((m) => ({
              value: m.id,
              label: `${m.firstName} ${m.lastName}`,
            })),
          ]}
          rules={f.required ? { required: "Requerido" } : undefined}
        />
      );
    }
    if (f.type === "SECTION") {
      // Should not happen inside renderField as we handle it in groups, but fallback just in case
      return null;
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
              control={control}
              options={[
                { value: "", label: "Selecciona una célula" },
                ...cells,
              ]}
              rules={{ required: "Selecciona una célula" }}
            />
          )}

          {scope === "GROUP" && (
            <SelectField
              name="groupId"
              label="Grupo"
              control={control}
              options={[{ value: "", label: "Selecciona un grupo" }, ...groups]}
              rules={{ required: "Selecciona un grupo" }}
            />
          )}

          {scope === "SECTOR" && (
            <SelectField
              name="sectorId"
              label="Sector"
              control={control}
              options={[
                { value: "", label: "Selecciona un sector" },
                ...sectors,
              ]}
              rules={{ required: "Selecciona un sector" }}
            />
          )}
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="space-y-4 mt-4">
            {groupedFields.map((group, i) => {
              if (group.section) {
                return (
                  <div
                    key={group.section.id}
                    className="collapse collapse-arrow bg-base-50 border border-base-200"
                  >
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-lg font-bold">
                      {group.section.label || "Sección"}
                    </div>
                    <div className="collapse-content">
                      <div className="grid grid-cols-1 gap-4 pt-4">
                        {group.fields.map((f) => renderField(f))}
                      </div>
                    </div>
                  </div>
                );
              }
              // Default fields (no section)
              return (
                <div key={`group-${i}`} className="grid grid-cols-1 gap-4">
                  {group.fields.map((f) => renderField(f))}
                </div>
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
