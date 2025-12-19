"use client";

import React from "react";
import {
  Control,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReportFormValues } from "./types";
import { SortableField } from "./SortableField";
import { FieldEditor } from "./FieldEditor";
import { AddFieldMenu } from "./AddFieldMenu";
import { FieldsEmptyState } from "./FieldsEmptyState";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { LivePreview } from "./LivePreview";
import { ReportFieldType } from "@/generated/prisma/client";

interface ReportBuilderProps {
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
  watch: UseFormWatch<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
}

export function ReportBuilder({
  control,
  register,
  watch,
  setValue,
}: ReportBuilderProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over?.id);
      move(oldIndex, newIndex);
    }
  };

  const addField = (type: ReportFieldType) => {
    append({
      key: "",
      label: "",
      type,
      value:
        type === "NUMBER" || type === "CURRENCY"
          ? 0
          : type === "BOOLEAN"
          ? "false"
          : "",
      options:
        type === "SELECT"
          ? [{ value: "Opción 1" }, { value: "Opción 2" }]
          : undefined,
      required: false,
    });
  };

  const duplicateField = (index: number) => {
    const f = fields[index];
    append({
      key: "",
      label: f.label || "",
      type: f.type,
      value: f.value,
      options: f.options ? [...f.options] : undefined,
      required: !!f.required,
    });
  };

  const watchedValues = watch();

  const [activeTab, setActiveTab] = React.useState<"general" | "fields">(
    "general"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Form Builder */}
      <div className="space-y-6">
        {/* Tabs */}
        <div role="tablist" className="tabs tabs-border bg-base-200 p-1">
          <a
            role="tab"
            className={`tab ${activeTab === "general" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            Configuración General
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "fields" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("fields")}
          >
            Campos del Reporte
          </a>
        </div>

        <div className={activeTab === "general" ? "block" : "hidden"}>
          <GeneralSettingsForm
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </div>

        <div
          className={`bg-base-100 p-6 rounded-sm shadow-sm border border-base-300 ${
            activeTab === "fields" ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-base-content">
              Campos del Reporte
            </h2>
            <AddFieldMenu onAdd={addField} />
          </div>

          {fields.length === 0 ? (
            <FieldsEmptyState />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <SortableField key={field.id} id={field.id}>
                      <FieldEditor
                        field={field}
                        index={index}
                        register={register}
                        control={control}
                        setValue={setValue}
                        onRemove={remove}
                        onDuplicate={duplicateField}
                      />
                    </SortableField>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="hidden lg:block">
        <div className="sticky top-8">
          <LivePreview values={watchedValues} />
        </div>
      </div>
    </div>
  );
}
