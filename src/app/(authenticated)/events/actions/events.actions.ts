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
