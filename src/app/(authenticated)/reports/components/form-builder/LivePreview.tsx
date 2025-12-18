import React from "react";
import { ReportFormValues } from "./types";

export function LivePreview({ values }: { values: Partial<ReportFormValues> }) {
  return (
    <div className="mockup-window border border-base-300 bg-base-200 shadow-xl h-full">
      <div className="flex justify-center px-4 py-8 bg-base-100 h-full overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="w-full max-w-lg space-y-6">
          <div
            className="text-center mb-8 border-b border-base-200 pb-6 rounded-t-lg border-t-8"
            style={{ borderTopColor: values.color || "#3b82f6" }}
          >
            <h2 className="text-2xl font-bold text-base-content mt-4">
              {values.title || "Título del Reporte"}
            </h2>
            {values.description ? (
              <p className="text-base-content/70 mt-2">{values.description}</p>
            ) : (
              <p className="text-base-content/30 italic mt-2">
                Sin descripción
              </p>
            )}
          </div>

          <div className="space-y-4">
            {/* Scope Selection Preview */}
            {values.scope === "CELL" && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Célula</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <select className="select select-bordered w-full" disabled>
                  <option>Selecciona una célula</option>
                </select>
              </div>
            )}
            {values.scope === "GROUP" && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Grupo</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <select className="select select-bordered w-full" disabled>
                  <option>Selecciona un grupo</option>
                </select>
              </div>
            )}
            {values.scope === "SECTOR" && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Sector</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <select className="select select-bordered w-full" disabled>
                  <option>Selecciona un sector</option>
                </select>
              </div>
            )}

            {/* Dynamic Fields Preview */}
            {values.fields?.map((field, i) => (
              <div
                key={i}
                className="form-control w-full p-4 bg-base-50 rounded-lg border border-base-200"
              >
                {field.type !== "SECTION" && (
                  <label className="label">
                    <span className="label-text font-medium">
                      {field.label || `Pregunta ${i + 1}`}
                    </span>
                    {field.required && (
                      <span className="label-text-alt text-error">*</span>
                    )}
                  </label>
                )}

                {field.type === "TEXT" && (
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Tu respuesta"
                    disabled
                  />
                )}

                {field.type === "NUMBER" && (
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="0"
                    disabled
                  />
                )}

                {field.type === "CURRENCY" && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      className="input input-bordered w-full pl-8"
                      placeholder="0.00"
                      disabled
                    />
                  </div>
                )}

                {field.type === "DATE" && (
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    disabled
                  />
                )}

                {field.type === "BOOLEAN" && (
                  <select className="select select-bordered w-full" disabled>
                    <option>Selecciona una opción</option>
                    <option>Sí</option>
                    <option>No</option>
                  </select>
                )}

                {field.type === "SELECT" && (
                  <select className="select select-bordered w-full" disabled>
                    <option>Selecciona una opción</option>
                    {field.options?.map((opt, idx) => (
                      <option key={idx}>{opt.value}</option>
                    ))}
                  </select>
                )}

                {field.type === "SECTION" && (
                  <div className="divider font-bold text-lg">
                    {field.label || "Nueva Sección"}
                  </div>
                )}

                {field.type === "MEMBER_SELECT" && (
                  <select className="select select-bordered w-full" disabled>
                    <option>Selecciona un miembro</option>
                  </select>
                )}
              </div>
            ))}

            {(!values.fields || values.fields.length === 0) && (
              <div className="text-center py-8 text-base-content/40 border-2 border-dashed border-base-200 rounded-lg">
                No hay preguntas añadidas
              </div>
            )}
          </div>

          <div className="flex justify-end py-6 border-t border-base-200 mt-8">
            <button className="btn btn-primary w-full sm:w-auto" disabled>
              Enviar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
