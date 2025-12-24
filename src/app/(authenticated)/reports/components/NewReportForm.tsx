"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { createReport } from "../actions/reports.actions";
import { useRouter } from "next/navigation";
import { ReportFormValues, ReportBuilder } from "./form-builder";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function NewReportForm() {
  const router = useRouter();
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ReportFormValues>({
    defaultValues: { scope: "CELL", fields: [], color: "#3b82f6" },
  });

  const onSubmit = async (data: ReportFormValues) => {
    try {
      await createReport({
        title: data.title,
        description: data.description,
        scope: data.scope,
        color: data.color || "#3b82f6",
        fields: data.fields.map((f, index) => {
          let key = f.key;
          // Ensure SECTION fields have a key even if label is empty
          if (f.type === "SECTION" && !key) {
            key = `section_${index}_${Math.random().toString(36).substr(2, 9)}`;
          }
          return {
            ...f,
            key,
            options: f.options?.map((o) => o.value),
          };
        }),
      });
      router.push(`/reports`);
    } catch (error) {
      console.error(error);
      alert(
        "Error al crear el reporte. Por favor revisa los campos e intenta de nuevo."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Crear Nuevo Reporte</h1>
        <p className="text-muted-foreground">Diseña la estructura de tu reporte.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <ReportBuilder
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Reporte"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
