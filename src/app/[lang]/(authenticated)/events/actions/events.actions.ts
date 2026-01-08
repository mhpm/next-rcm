"use server";

import { revalidatePath } from "next/cache";
import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { eventSchema } from "../schema/events.schema";
import type {
  EventFormData,
  EventsQueryOptions,
  EventsListResult,
  EventWithStats,
} from "../types/events.d";
import { Prisma } from "@/generated/prisma/client";

export async function getEvents(
  options: EventsQueryOptions = {}
): Promise<EventsListResult> {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();
  const {
    limit = 50,
    offset = 0,
    search,
    orderBy = "date",
    orderDirection = "desc",
  } = options;

  const where: Prisma.EventsWhereInput = {
    church_id: churchId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [events, total] = await Promise.all([
    prisma.events.findMany({
      where,
      include: {
        _count: {
          select: { attendances: true },
        },
        phase: true,
      },
      orderBy: { [orderBy]: orderDirection },
      take: limit,
      skip: offset,
    }),
    prisma.events.count({ where }),
  ]);

  return {
    events: events as EventWithStats[],
    total,
    hasMore: offset + limit < total,
  };
}

export async function getEventById(id: string) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  return prisma.events.findFirst({
    where: { id, church_id: churchId },
  });
}

export async function createEvent(data: EventFormData) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const validated = eventSchema.parse(data);

  const event = await prisma.events.create({
    data: {
      ...validated,
      church_id: churchId,
    },
  });

  revalidatePath("/events");
  return { success: true, data: event };
}

export async function updateEvent(id: string, data: EventFormData) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const validated = eventSchema.parse(data);

  const event = await prisma.events.update({
    where: { id, church_id: churchId },
    data: validated,
  });

  revalidatePath("/events");
  return { success: true, data: event };
}

export async function deleteEvent(id: string) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  await prisma.events.delete({
    where: { id, church_id: churchId },
  });

  revalidatePath("/events");
  return { success: true };
}

export async function getEventPhases() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  // Seed/Sync default phases
  const defaults = [
    { name: "GANAR", color: "#eab308" }, // yellow-500
    { name: "CONSOLIDAR", color: "#22c55e" }, // green-500
    { name: "DISCIPULAR", color: "#3b82f6" }, // blue-500
  ];

  for (const d of defaults) {
    const existing = await prisma.eventPhases.findFirst({
      where: { name: d.name, church_id: null },
    });

    if (!existing) {
      await prisma.eventPhases.create({
        data: { name: d.name, color: d.color, church_id: null },
      });
    } else if (existing.color !== d.color) {
      // Nota: Si el usuario PERSONALIZÓ el color vía override local, esta actualización global no le afectará visualmente,
      // lo cual es correcto.
      await prisma.eventPhases.update({
        where: { id: existing.id },
        data: { color: d.color },
      });
    }
  }

  const allPhases = await prisma.eventPhases.findMany({
    where: {
      OR: [{ church_id: churchId }, { church_id: null }],
    },
    orderBy: { createdAt: "asc" },
  });

   // Lógica de Override (Misma que en phases.actions.ts)
  const phaseMap = new Map<string, typeof allPhases[0]>();
  allPhases.filter(p => p.church_id === null).forEach(p => phaseMap.set(p.name, p));
  allPhases.filter(p => p.church_id !== null).forEach(p => phaseMap.set(p.name, p));

  const phases = Array.from(phaseMap.values());
  phases.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return phases;
}
