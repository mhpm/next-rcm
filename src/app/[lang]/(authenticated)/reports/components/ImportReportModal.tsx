'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  RiUploadCloud2Line,
  RiFileExcel2Line,
  RiDownloadLine,
} from 'react-icons/ri';
import { useNotificationStore } from '@/store/NotificationStore';
import { FilterField } from './AdvancedFilterModal';
import { importReportEntriesAction } from '@/app/[lang]/(authenticated)/reports/actions/reports.actions';
import { useRouter } from 'next/navigation';

type ImportReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  fields: FilterField[];
  entityLabel?: string;
  availableEntities?: string[];
  onSuccess: () => void;
};

export default function ImportReportModal({
  isOpen,
  onClose,
  reportId,
  fields,
  entityLabel = 'Entidad',
  availableEntities,
  onSuccess,
}: ImportReportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showSuccess, showError } = useNotificationStore();
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const getColumnLetter = (colIndex: number) => {
    let temp,
      letter = '';
    while (colIndex > 0) {
      temp = (colIndex - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      colIndex = (colIndex - temp - 1) / 26;
    }
    return letter;
  };

  const handleDownloadTemplate = async () => {
    // Dynamically import exceljs to avoid bundling issues on client side if any
    const ExcelJS = (await import('exceljs')).default;

    const wb = new ExcelJS.Workbook();

    // 1. Create Template Sheet
    const ws = wb.addWorksheet('Template');

    const headers = [
      entityLabel,
      'Fecha',
      ...fields.map((f) => f.label || f.key),
    ];

    // Add headers row
    ws.addRow(headers);

    // Style headers (optional)
    ws.getRow(1).font = { bold: true };

    // Set Date Column Format (Column B / 2) to prevent ambiguity
    // Excel date format: dd-mmm-yyyy (e.g. 10-ene-2026) to make month clear
    ws.getColumn(2).numFmt = 'dd-mmm-yyyy';
    ws.getColumn(2).width = 15;

    // Add Date Validation to the main date column (Column 2)
    // Excel Data Validation type 'date' ensures valid date input
    for (let i = 2; i <= 1000; i++) {
      ws.getCell(`B${i}`).dataValidation = {
        type: 'date',
        operator: 'greaterThanOrEqual',
        formulae: [new Date(1900, 0, 1)], // Standard Excel base date
        showErrorMessage: true,
        errorTitle: 'Fecha inválida',
        error: 'Por favor ingrese una fecha válida.',
        showInputMessage: true,
        promptTitle: 'Formato de Fecha',
        prompt:
          'Verifique que la fecha se muestre correctamente (día-mes-año). Si su Excel está en inglés, use mm/dd/yyyy.',
      };
    }

    // Also apply date format and validation to any other column of type DATE
    fields.forEach((f, index) => {
      if (f.type === 'DATE') {
        // Headers are: Entity (1), Date (2), Field1 (3)...
        const colIndex = index + 3;
        const colLetter = getColumnLetter(colIndex);
        ws.getColumn(colIndex).numFmt = 'dd-mmm-yyyy';
        ws.getColumn(colIndex).width = 15;

        for (let i = 2; i <= 1000; i++) {
          ws.getCell(`${colLetter}${i}`).dataValidation = {
            type: 'date',
            operator: 'greaterThanOrEqual',
            formulae: [new Date(1900, 0, 1)],
            showErrorMessage: true,
            errorTitle: 'Fecha inválida',
            error: 'Por favor ingrese una fecha válida.',
            showInputMessage: true,
            promptTitle: 'Formato de Fecha',
            prompt:
              'Verifique que la fecha se muestre correctamente (día-mes-año). Si su Excel está en inglés, use mm/dd/yyyy.',
          };
        }
      }
    });

    // 2. Create Data Sheet (Hidden) if entities are available
    let dataSheetName = '';
    console.log('Available entities for template:', availableEntities);

    if (availableEntities && availableEntities.length > 0) {
      dataSheetName = 'Data';
      // Create hidden sheet
      const wsData = wb.addWorksheet(dataSheetName, { state: 'hidden' });

      // Add entities to column A
      availableEntities.forEach((entity) => {
        wsData.addRow([entity]);
      });

      // Add Data Validation to the first column (Entity) in Template sheet
      // Rows 2 to 1000
      const validationFormula = `'${dataSheetName}'!$A$1:$A$${availableEntities.length}`;
      console.log('Adding validation with formula:', validationFormula);

      for (let i = 2; i <= 1000; i++) {
        ws.getCell(`A${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [validationFormula],
          showErrorMessage: true,
          errorTitle: 'Valor inválido',
          error: 'Por favor seleccione una entidad de la lista.',
        };
      }
    } else {
      console.warn('No available entities found for validation.');
    }

    // 3. Handle CYCLE_WEEK_INDICATOR validation
    const hasWeekFields = fields.some((f) => f.type === 'CYCLE_WEEK_INDICATOR');

    if (hasWeekFields) {
      // Find the field to get options (verbs)
      const weekField = fields.find((f) => f.type === 'CYCLE_WEEK_INDICATOR');
      const verbs =
        weekField?.options && weekField.options.length > 0
          ? weekField.options
          : [
              'Orar',
              'Anotar',
              'Contactar',
              'Confirmar',
              'Desatar',
              'Llevar',
              'Motivar',
              'Integrar',
              'Consolidar',
              'Preparar',
              'Santificar',
              'Matricular',
              'Conservar',
              'Doctrinar',
              'Discipular',
              'Bautizar',
            ];

      // Generate 16 weeks with verbs
      const weeks = Array.from({ length: 16 }, (_, i) => {
        const verb = verbs[i];
        const verbLabel =
          typeof verb === 'string' ? verb : (verb as any).value || '';
        return `Semana ${i + 1}: ${verbLabel}`;
      });

      // Add weeks to Data sheet (column B)
      // If data sheet doesn't exist, create it (unlikely if we have entities, but possible if not)
      let wsData;
      if (!dataSheetName) {
        dataSheetName = 'Data';
        wsData = wb.addWorksheet(dataSheetName, { state: 'hidden' });
      } else {
        wsData = wb.getWorksheet(dataSheetName);
      }

      if (wsData) {
        weeks.forEach((week, i) => {
          // Column B is index 2. setCell is 1-based usually for rows, but columns?
          // ExcelJS: getCell('B1') or getRow(i).getCell(2)
          wsData.getRow(i + 1).getCell(2).value = week;
        });

        const weekValidationFormula = `'${dataSheetName}'!$B$1:$B$${weeks.length}`;

        // Find columns that need week validation
        // Headers are: Entity (1), Date (2), Field1 (3), ...
        fields.forEach((f, index) => {
          if (f.type === 'CYCLE_WEEK_INDICATOR') {
            const colIndex = index + 3; // 1-based index: Entity=1, Date=2, Field[0]=3
            const colLetter = getColumnLetter(colIndex);

            for (let i = 2; i <= 1000; i++) {
              ws.getCell(`${colLetter}${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [weekValidationFormula],
                showErrorMessage: true,
                errorTitle: 'Valor inválido',
                error: 'Por favor seleccione una semana válida.',
              };
            }
          }
        });
      }
    }

    // Generate buffer
    const buffer = await wb.xlsx.writeBuffer();

    // Create Blob and download
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantilla_importacion_reporte.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(10);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setProgress(30);

      if (jsonData.length > 0) {
        const firstRow = jsonData[0] as any;
        if (
          !firstRow['Entidad'] &&
          !firstRow['entidad'] &&
          !firstRow[entityLabel]
        ) {
          throw new Error(
            `El archivo debe contener una columna "${entityLabel}" para identificar la entidad.`
          );
        }
      }

      const labelToIdMap = fields.reduce((acc, f) => {
        acc[f.label || f.key] = f.id;
        return acc;
      }, {} as Record<string, string>);

      const rowsToImport = jsonData.map((row: any) => {
        const entryValues: Record<string, any> = {};
        const entidad = row['Entidad'] || row['entidad'] || row[entityLabel];
        let fecha = row['Fecha'] || row['fecha'];

        if (fecha instanceof Date) {
          // Handle Date objects (from cellDates: true)
          // Use local time methods to avoid timezone shifts
          const year = fecha.getFullYear();
          const month = String(fecha.getMonth() + 1).padStart(2, '0');
          const day = String(fecha.getDate()).padStart(2, '0');
          // Append T12:00:00Z to ensure it's treated as Noon UTC, preventing date shifts in all timezones
          fecha = `${year}-${month}-${day}T12:00:00Z`;
        } else if (typeof fecha === 'number') {
          // Fallback for number if cellDates didn't catch it or mixed content
          const date = new Date(Math.round((fecha - 25569) * 86400 * 1000));
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const day = String(date.getUTCDate()).padStart(2, '0');
          // Note: Here we use UTC methods because the manual conversion produces a UTC timestamp
          // representing the date at 00:00 UTC.
          // Append T12:00:00Z to ensure it's treated as Noon UTC, preventing date shifts in all timezones
          fecha = `${year}-${month}-${day}T12:00:00Z`;
        } else if (typeof fecha === 'string') {
          // Attempt to parse string dates like "dd/mm/yyyy"
          const ddmmyyyy = fecha.match(
            /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/
          );
          if (ddmmyyyy) {
            const day = parseInt(ddmmyyyy[1], 10);
            const month = parseInt(ddmmyyyy[2], 10) - 1;
            const year = parseInt(ddmmyyyy[3], 10);
            // Set to Noon UTC
            const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
            fecha = date.toISOString();
          }
        }

        Object.keys(row).forEach((header) => {
          if (
            header === 'Entidad' ||
            header === 'entidad' ||
            header === entityLabel ||
            header === 'Fecha' ||
            header === 'fecha'
          )
            return;

          const fieldId = labelToIdMap[header];
          if (fieldId) {
            entryValues[fieldId] = row[header];
          }
        });

        return {
          entidad,
          fecha,
          values: entryValues,
        };
      });

      // Post-process to parse "Semana X: Verbo" into { week: X, verb: "Verbo" }
      rowsToImport.forEach((row) => {
        fields.forEach((f) => {
          if (f.type === 'CYCLE_WEEK_INDICATOR') {
            const val = row.values[f.id];
            if (typeof val === 'string' && val.startsWith('Semana ')) {
              // Expected format: "Semana 1: Orar"
              const parts = val.split(':');
              if (parts.length >= 2) {
                const weekPart = parts[0].trim(); // "Semana 1"
                const verbPart = parts.slice(1).join(':').trim(); // "Orar"

                const weekNum = parseInt(weekPart.replace('Semana ', ''), 10);

                if (!isNaN(weekNum)) {
                  row.values[f.id] = {
                    week: weekNum,
                    verb: verbPart,
                  };
                }
              }
            }
          }
        });
      });

      setProgress(50);

      const result = await importReportEntriesAction({
        reportId,
        rows: rowsToImport,
      });

      if (!result.success) {
        throw new Error(result.error || 'Error al importar datos');
      }

      setProgress(100);
      showSuccess(`Se han importado ${result.count} entradas exitosamente.`);
      onSuccess();
      handleClose();
      router.refresh();
    } catch (error: any) {
      console.error('Import error:', error);
      showError(error.message || 'Error al procesar el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Entradas</DialogTitle>
          <DialogDescription>
            Sube un archivo Excel o CSV con los datos a importar. Asegúrate de
            que las columnas coincidan con los campos del reporte.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="gap-2"
            >
              <RiDownloadLine className="w-4 h-4" />
              Descargar Plantilla
            </Button>
          </div>

          <div
            {...getRootProps()}
            className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${
                      isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }
                    ${file ? 'bg-muted/30' : ''}
                `}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <RiFileExcel2Line className="w-10 h-10 text-green-600" />
                <span className="font-medium text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  Eliminar
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <RiUploadCloud2Line className="w-10 h-10" />
                <p className="font-medium">Arrastra tu archivo aquí</p>
                <p className="text-xs">
                  o haz clic para seleccionar (Excel, CSV)
                </p>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-1">
              <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Procesando archivo...
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || isUploading}>
            {isUploading ? 'Importando...' : 'Importar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
