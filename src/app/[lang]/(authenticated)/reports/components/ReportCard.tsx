'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { toPng, toBlob } from 'html-to-image';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaFileLines,
  FaPenToSquare,
  FaTrash,
  FaTable,
  FaShareNodes,
  FaArrowUpRightFromSquare,
  FaFileSignature,
  FaQrcode,
  FaRegCopy,
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
  const params = useParams();
  const lang = (params?.lang as string) || 'es';
  const formRef = useRef<HTMLFormElement>(null);
  const qrCardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [isPending, startTransition] = useTransition();
  const { showSuccess } = useNotificationStore();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const onConfirm = () => {
    startTransition(() => {
      formRef.current?.requestSubmit();
      setOpen(false);
    });
  };

  const handleCopyLink = () => {
    if (!report.publicToken) return;
    const url = `${window.location.origin}/${lang}/public/reports/${report.publicToken}`;
    navigator.clipboard.writeText(url);
    showSuccess('Enlace copiado al portapapeles');
  };

  const handleDownloadImage = async () => {
    if (qrCardRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(qrCardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `reporte-${report.title}-qr.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  const handleCopyImage = async () => {
    if (qrCardRef.current === null) {
      return;
    }

    try {
      const blob = await toBlob(qrCardRef.current, { cacheBust: true });
      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      showSuccess('Imagen copiada al portapapeles');
    } catch (err) {
      console.error('Error copying image:', err);
    }
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
          <Link
            href={`/${lang}/reports/${report.id}/submit`}
            className="flex-1"
          >
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
                    href={`/${lang}/public/reports/${report.publicToken}`}
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
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-white hover:bg-white/20"
                  title="Ver código QR"
                  onClick={() => setQrOpen(true)}
                >
                  <FaQrcode className="text-lg" />
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
              <Link href={`/${lang}/reports/${report.id}/edit`}>
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
              <Link href={`/${lang}/reports/${report.id}/entries`}>
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

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Código QR para compartir</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-0 sm:p-6 space-y-4">
            {/* Printable Card Area */}
            <div
              ref={qrCardRef}
              className="relative flex flex-col items-center justify-between p-6 w-full max-w-[260px] shadow-2xl"
              style={{
                backgroundColor: '#111111',
                borderRadius: '0px',
                color: 'white',
                minHeight: '400px', // Ensure it has some vertical presence but not too tall
              }}
            >
              {/* QR Code Area */}
              <div className="w-full flex justify-center mt-4">
                <div className="bg-white p-2 rounded-xl">
                  {origin && report.publicToken && (
                    <QRCodeSVG
                      value={`${origin}/public/reports/${report.publicToken}`}
                      size={140}
                      level="H"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                      includeMargin={false}
                    />
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-2 my-4">
                <h3
                  className="font-black text-xl uppercase tracking-tighter leading-none"
                  style={{ color: report.color || '#3b82f6' }}
                >
                  {report.title}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                  Reporte Digital
                </p>
              </div>

              {/* Footer / URL */}
              <div className="w-full text-center pb-2">
                <div
                  className="w-8 h-0.5 mx-auto mb-3 rounded-full"
                  style={{ backgroundColor: report.color || '#3b82f6' }}
                />
                <p className="text-[8px] text-gray-600 font-mono break-all px-1 opacity-50 leading-tight">
                  {origin}/public/reports/{report.publicToken}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full items-stretch sm:items-center">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const url = `${origin}/public/reports/${report.publicToken}`;
                  navigator.clipboard.writeText(url);
                  showSuccess('Enlace copiado al portapapeles');
                }}
              >
                Copiar enlace
              </Button>
              <div className="flex gap-2 flex-1">
                <Button className="flex-1" onClick={handleDownloadImage}>
                  Descargar imagen
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyImage}
                  title="Copiar imagen al portapapeles"
                  className="shrink-0"
                >
                  <FaRegCopy />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
