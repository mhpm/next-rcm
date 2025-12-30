"use server";

import { revalidatePath } from "next/cache";
import { getChurchPrisma, getChurchId } from "@/actions/churchContext";

export interface FriendAttendance {
  id: string;
  name: string;
  attended: boolean;
}

export async function getEventAttendance(eventId: string): Promise<FriendAttendance[]> {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  // Fetch all friends and their attendance for this specific event
  const friends = await prisma.friends.findMany({
    where: {
      church_id: churchId,
    },
    select: {
      id: true,
      name: true,
      attendances: {
        where: {
          event_id: eventId,
        },
        select: {
          attended: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Map to a simpler structure
  return friends.map((friend) => ({
    id: friend.id,
    name: friend.name,
    attended: friend.attendances.length > 0 && friend.attendances[0].attended,
  }));
}

export async function toggleAttendance(eventId: string, friendId: string, attended: boolean) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  if (attended) {
    // Upsert to ensure it exists and is set to true
    await prisma.eventAttendances.upsert({
      where: {
        friend_id_event_id: {
          friend_id: friendId,
          event_id: eventId,
        },
      },
      create: {
        church_id: churchId,
        friend_id: friendId,
        event_id: eventId,
        attended: true,
      },
      update: {
        attended: true,
      },
    });
  } else {
    // If not attended, we can either delete the record or set attended to false.
    // Setting to false is often better for history, but deleting is cleaner if "attendance" implies existence of record.
    // Based on the schema `attended Boolean @default(false)`, it seems we should update it.
    // However, usually "not attending" means no record or record with false.
    // Let's delete the record if they are unchecked to keep the table smaller, 
    // OR update to false if we want to track "absent vs not marked".
    // For simplicity and common patterns, if I uncheck, I remove the "attendance".
    
    // Check if record exists first to avoid errors? No, deleteMany is safe.
    // Actually, `attended` field suggests we might want to keep track of "No" vs "Did not answer"?
    // But usually in these lists, Checked = Yes, Unchecked = No (or no record).
    // Let's use delete for "Unchecked".
    
    await prisma.eventAttendances.deleteMany({
      where: {
        friend_id: friendId,
        event_id: eventId,
        church_id: churchId,
      },
    });
  }

  revalidatePath("/events");
  revalidatePath("/evangelism"); // Also update the stats view
  return { success: true };
}
