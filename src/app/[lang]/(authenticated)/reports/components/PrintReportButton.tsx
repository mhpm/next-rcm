'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export function PrintReportButton() {
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.print();
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2 print:hidden"
      onClick={handlePrint}
    >
      <Printer className="h-4 w-4" />
      Imprimir PDF
    </Button>
  );
}
