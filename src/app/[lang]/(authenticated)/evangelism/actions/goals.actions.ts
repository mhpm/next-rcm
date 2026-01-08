"use server";

import { revalidatePath } from "next/cache";
import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { z } from "zod";

const setGoalSchema = z.object({
  cellId: z.string().min(1),
  eventId: z.string().min(1),
  target: z.coerce.number().min(0),
});

export async function setCellGoal(data: z.infer<typeof setGoalSchema>) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();
  
  const validated = setGoalSchema.parse(data);

  await prisma.cellGoals.upsert({
    where: {
      cell_id_event_id: {
        cell_id: validated.cellId,
        event_id: validated.eventId,
      },
    },
    update: {
      target: validated.target,
    },
    create: {
      church_id: churchId,
      cell_id: validated.cellId,
      event_id: validated.eventId,
      target: validated.target,
    },
  });

  revalidatePath("/evangelism");
  return { success: true };
}
