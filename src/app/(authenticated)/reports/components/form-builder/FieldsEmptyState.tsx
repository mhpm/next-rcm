"use client";

import React from "react";

export function FieldsEmptyState() {
  return (
    <div className="text-center py-12 border-2 border-dashed border-base-200 rounded-lg bg-base-50">
      <p className="text-base-content/50">No hay preguntas todavía.</p>
      <p className="text-sm text-base-content/40 mt-1">
        Haz clic en "+ Añadir" para comenzar.
      </p>
    </div>
  );
}
