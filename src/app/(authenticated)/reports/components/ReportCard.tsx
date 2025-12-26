'use client';

import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FaFileLines,
  FaPenToSquare,
  FaTrash,
  FaTable,
  FaShareNodes,
  FaArrowUpRightFromSquare,
  FaFileSignature,
} from 'react-icons/fa6';
import { deleteReportAction } from '../actions/reports.actions';
import { useNotificationStore } from '@/store/NotificationStore';

type ReportCardProps = {
  report: {
    id: string;
    title: string;
    description: string | null;
    createdAt: string | Date;
    color?: string | null;
    publicToken?: string | null;
  };
};

export default function ReportCard({ report }: ReportCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showSuccess } = useNotificationStore();

  const onConfirm = () => {
    startTransition(() => {
      formRef.current?.requestSubmit();
      setOpen(false);
    });
  };

  const handleCopyLink = () => {
    if (!report.publicToken) return;
    const url = `${window.location.origin}/public/reports/${report.publicToken}`;
    navigator.clipboard.writeText(url);
    showSuccess('Enlace copiado al portapapeles');
  };

  return (
    <Card
      className="relative overflow-hidden border-0 text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
      style={{ backgroundColor: report.color || '#3b82f6' }}
    >
      {/* Background Icon */}
      <div className="absolute -right-6 -bottom-8 text-white opacity-20 rotate-12 pointer-events-none">
        <FaFileSignature className="text-9xl" />
      </div>

      <CardContent className="relative z-10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <Link href={`/reports/${report.id}/submit`} className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
              {report.title}
            </h2>
          </Link>
          <div className="flex w-full lg:w-auto justify-around sm:items-center gap-1 bg-white/20 backdrop-blur-md rounded-lg p-1 shadow-sm">
            {report.publicToken && (
              <>
                <Button
                  asChild
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-white hover:bg-white/20"
                  title="Ir al reporte público"
                >
                  <Link
                    href={`/public/reports/${report.publicToken}`}
                    target="_blank"
                  >
                    <FaArrowUpRightFromSquare className="text-lg" />
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-white hover:bg-white/20"
                  title="Copiar enlace público"
                  onClick={handleCopyLink}
                >
                  <FaShareNodes className="text-lg" />
                </Button>
              </>
            )}
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white hover:bg-white/20"
              title="Editar"
            >
              <Link href={`/reports/${report.id}/edit`}>
                <FaPenToSquare className="text-lg" />
              </Link>
            </Button>
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white hover:bg-white/20"
              title="Ver entradas"
            >
              <Link href={`/reports/${report.id}/entries`}>
                <FaTable className="text-lg" />
              </Link>
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white hover:bg-white/20 hover:text-red-200"
              title="Eliminar"
              onClick={() => setOpen(true)}
            >
              <FaTrash className="text-lg" />
            </Button>
            <form
              ref={formRef}
              action={deleteReportAction}
              style={{ display: 'none' }}
            >
              <input type="hidden" name="id" value={report.id} />
            </form>
          </div>
        </div>
        {report.description ? (
          <p className="text-sm text-white/90 line-clamp-2 mb-4 font-medium">
            {report.description}
          </p>
        ) : (
          <div className="mb-4" />
        )}
        <div className="mt-auto pt-2 flex items-center gap-3 text-white/80 text-xs font-medium">
          <div className="w-8 h-1 bg-white/40 rounded-full" />
          <span className="flex items-center gap-2">
            <FaFileLines />
            {new Date(report.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>

      <DeleteConfirmationModal
        open={open}
        entityName={report.title}
        onCancel={() => setOpen(false)}
        onConfirm={onConfirm}
        isPending={isPending}
        description="Se eliminará el reporte y todas sus entradas asociadas. Esta acción no se puede deshacer."
      />
    </Card>
  );
}
