"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { FaFileLines, FaPenToSquare, FaTrash, FaTable } from "react-icons/fa6";
import { deleteReportAction } from "../actions/reports.actions";

type ReportCardProps = {
  report: {
    id: string;
    title: string;
    description: string | null;
    createdAt: string | Date;
    color?: string | null;
  };
};

export default function ReportCard({ report }: ReportCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onConfirm = () => {
    startTransition(() => {
      formRef.current?.requestSubmit();
      setOpen(false);
    });
  };

  return (
    <div
      className="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow border-t-8"
      style={{ borderTopColor: report.color || "#3b82f6" }}
    >
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <Link href={`/reports/${report.id}/submit`} className="flex-1">
            <h2 className="card-title text-base line-clamp-2">
              {report.title}
            </h2>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/reports/${report.id}/edit`}
              className="btn btn-ghost btn-sm"
              title="Editar"
            >
              <FaPenToSquare className="text-base-content/60 text-lg" />
            </Link>
            <Link
              href={`/reports/${report.id}/entries`}
              className="btn btn-ghost btn-sm"
              title="Ver entradas"
            >
              <FaTable className="text-base-content/60 text-lg" />
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-error"
              title="Eliminar"
              onClick={() => setOpen(true)}
            >
              <FaTrash className="text-error text-lg" />
            </button>
            <form
              ref={formRef}
              action={deleteReportAction}
              style={{ display: "none" }}
            >
              <input type="hidden" name="id" value={report.id} />
            </form>
          </div>
        </div>
        {report.description ? (
          <p className="text-sm text-base-content/70 line-clamp-3">
            {report.description}
          </p>
        ) : null}
        <div className="text-xs text-base-content/60 flex items-center gap-2">
          <FaFileLines />
          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <DeleteConfirmationModal
        open={open}
        entityName={report.title}
        onCancel={() => setOpen(false)}
        onConfirm={onConfirm}
        isPending={isPending}
        description="Se eliminará el reporte y todas sus entradas asociadas. Esta acción no se puede deshacer."
      />
    </div>
  );
}
