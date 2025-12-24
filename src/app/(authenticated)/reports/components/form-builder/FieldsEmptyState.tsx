export function FieldsEmptyState() {
  return (
    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-muted/20">
      <p className="text-muted-foreground">No hay preguntas todavía.</p>
      <p className="text-sm text-muted-foreground/70 mt-1">
        Haz clic en "+ Añadir" para comenzar.
      </p>
    </div>
  );
}
