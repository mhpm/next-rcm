"use server";

import { revalidatePath } from "next/cache";
import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { phaseSchema, PhaseFormValues } from "../schema/phases.schema";

export async function getPhases() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  // 1. Buscamos solo fases LOCALES
  const phases = await prisma.eventPhases.findMany({
    where: { church_id: churchId },
    orderBy: { createdAt: "asc" },
  });

  // 2. Si hay fases locales, retornamos.
  if (phases.length > 0) {
    return phases.map(p => ({ ...p, isSystem: false }));
  }

  // 3. Si NO hay fases locales, inicializamos (Seeding)
  //    Buscamos si existen fases globales para usarlas de plantilla (migración) o usamos defaults
  const defaults = [
    { name: "GANAR", color: "#eab308" },      // yellow-500
    { name: "CONSOLIDAR", color: "#22c55e" }, // green-500
    { name: "DISCIPULAR", color: "#3b82f6" }, // blue-500
  ];

  const newPhases = [];

  for (const d of defaults) {
    // Crear la fase local
    const newPhase = await prisma.eventPhases.create({
      data: {
        name: d.name,
        color: d.color,
        church_id: churchId,
      },
    });
    newPhases.push(newPhase);

    // MIGRACIÓN DE EVENTOS EXISTENTES:
    // Si ya existían eventos apuntando a una fase global con el mismo nombre, los movemos a la nueva local.
    // Buscamos la fase global equivalente
    const globalPhase = await prisma.eventPhases.findFirst({
        where: { name: d.name, church_id: null }
    });

    if (globalPhase) {
        await prisma.events.updateMany({
            where: { 
                church_id: churchId, 
                phase_id: globalPhase.id 
            },
            data: { phase_id: newPhase.id }
        });
    }
  }

  return newPhases.map(p => ({ ...p, isSystem: false }));
}

export async function createPhase(data: PhaseFormValues) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const validated = phaseSchema.parse(data);

  // Verificar si ya existe (solo localmente)
  const existing = await prisma.eventPhases.findFirst({
    where: { name: validated.name, church_id: churchId },
  });

  if (existing) {
    throw new Error("Ya existe una fase con este nombre.");
  }

  const phase = await prisma.eventPhases.create({
    data: {
      name: validated.name,
      color: validated.color,
      church_id: churchId,
    },
  });

  revalidatePath("/events/phases");
  revalidatePath("/events");
  return { success: true, data: phase };
}

export async function updatePhase(id: string, data: PhaseFormValues) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const validated = phaseSchema.parse(data);

  // Verificar ownership
  const existing = await prisma.eventPhases.findFirst({
    where: { id, church_id: churchId },
  });

  if (!existing) {
    throw new Error("No se puede editar esta fase o no existe.");
  }

  // Verificar duplicados (excluyendo self)
  const duplicate = await prisma.eventPhases.findFirst({
    where: { 
        name: validated.name, 
        church_id: churchId,
        NOT: { id }
    }
  });

  if (duplicate) {
      throw new Error("Ya existe otra fase con este nombre en tu iglesia.");
  }

  const phase = await prisma.eventPhases.update({
    where: { id },
    data: {
      name: validated.name,
      color: validated.color,
    },
  });

  revalidatePath("/events/phases");
  revalidatePath("/events");
  return { success: true, data: phase };
}

export async function deletePhase(id: string) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const existing = await prisma.eventPhases.findFirst({
    where: { id, church_id: churchId },
  });

  if (!existing) {
    throw new Error("No se puede eliminar esta fase o no existe.");
  }

  await prisma.eventPhases.delete({
    where: { id },
  });

  revalidatePath("/events/phases");
  revalidatePath("/events");
  return { success: true };
}
