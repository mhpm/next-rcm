"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useDashboardStore } from "../store/dashboardStore";
import { DraggableCard } from "./DraggableCard";

interface DashboardGridProps {
  ministriesCard: React.ReactNode;
  cellsCard: React.ReactNode;
  membersCard: React.ReactNode;
  groupsCard: React.ReactNode;
  reportsCard: React.ReactNode;
  sectorsCard: React.ReactNode;
  subsectorsCard: React.ReactNode;
}

export function DashboardGrid({
  ministriesCard,
  cellsCard,
  membersCard,
  groupsCard,
  reportsCard,
  sectorsCard,
  subsectorsCard,
}: DashboardGridProps) {
  const { cardsOrder, setCardsOrder } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const cardsMap: Record<string, React.ReactNode> = {
    ministries: ministriesCard,
    cells: cellsCard,
    members: membersCard,
    groups: groupsCard,
    reports: reportsCard,
    sectors: sectorsCard,
    subsectors: subsectorsCard,
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cardsOrder.indexOf(active.id as string);
      const newIndex = cardsOrder.indexOf(over.id as string);

      setCardsOrder(arrayMove(cardsOrder, oldIndex, newIndex));
    }
  }

  // Use the order from store if available, otherwise fallback to default keys
  // Note: During SSR, cardsOrder might be default from store definition, which matches.
  // We use mounted check to ensure client-side hydration doesn't mismatch if localStorage has different order.
  
  if (!mounted) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cardsOrder.map((id) => (
           <div key={id} className="h-full">{cardsMap[id]}</div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cardsOrder} strategy={rectSortingStrategy}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cardsOrder.map((id) => (
            <DraggableCard key={id} id={id}>
              {cardsMap[id]}
            </DraggableCard>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
