import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropZoneProps {
  id: string;
  label?: string;
  className?: string;
  isDragging?: boolean; // New prop to indicate dragging state globally
}

export function DropZone({ id, label, className, isDragging }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        transition-all duration-200 border-2 border-dashed rounded-lg flex items-center justify-center
        ${
          isOver
            ? 'border-primary bg-primary/10 text-primary scale-[1.01] shadow-md h-16 opacity-100 my-2 relative z-10'
            : isDragging
            ? 'border-base-300/50 bg-base-100/30 h-8 opacity-100 my-1 relative z-10' // Visible when dragging
            : 'border-transparent h-2 opacity-0 -my-1 pointer-events-none' // Hidden otherwise
        }
        ${className}
      `}
    >
      <span className={`text-xs font-medium ${isOver ? 'block' : 'hidden'}`}>
        {label || 'Soltar aquí'}
      </span>
    </div>
  );
}

// Fixed DropZone for bottom that is always visible-ish or expands
export function BottomDropZone({
  id,
  label,
  isDragging,
}: {
  id: string;
  label?: string;
  isDragging?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        mt-4 transition-all duration-200 border-2 border-dashed rounded-lg flex items-center justify-center
        ${
          isOver
            ? 'border-primary bg-primary/10 text-primary h-32 relative z-50 scale-[1.02] shadow-xl'
            : isDragging
            ? 'border-primary/50 bg-primary/5 text-primary/50 h-32 relative z-40'
            : 'border-base-300 bg-base-100/50 text-base-content/30 h-24 hover:border-base-content/30'
        }
      `}
    >
      <span className="text-sm font-medium">
        {isOver
          ? label || 'Soltar al final'
          : 'Arrastra aquí para mover al final'}
      </span>
    </div>
  );
}
