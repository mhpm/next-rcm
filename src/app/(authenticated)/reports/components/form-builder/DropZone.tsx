import { Droppable } from '@hello-pangea/dnd';

// We don't need the individual DropZone for react-beautiful-dnd 
// because it handles placeholders automatically. 
// But we keep BottomDropZone as a specific drop target.

export function DropZone() {
  // No-op for now, or could be used for custom placeholders if needed
  return null;
}

export function BottomDropZone({
  id,
  label,
  isDragging,
}: {
  id: string;
  label?: string;
  isDragging?: boolean;
}) {
  return (
    <Droppable droppableId={id} isDropDisabled={!isDragging}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            mt-4 transition-all duration-200 border-2 border-dashed rounded-lg flex items-center justify-center
            ${
              snapshot.isDraggingOver
                ? 'border-primary bg-primary/10 text-primary h-32 relative z-50 scale-[1.02] shadow-xl'
                : isDragging
                ? 'border-primary/50 bg-primary/5 text-primary/50 h-32 relative z-40'
                : 'border-border bg-muted/20 text-muted-foreground/60 h-24 hover:border-muted-foreground/60'
            }
          `}
        >
          <span className="text-sm font-medium">
            {snapshot.isDraggingOver
              ? label || 'Soltar al final'
              : 'Arrastra aquí para mover al final'}
          </span>
          <div className="hidden">{provided.placeholder}</div>
        </div>
      )}
    </Droppable>
  );
}
