"use server";

import { revalidatePath } from "next/cache";
import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { friendSchema } from "../schema/friends.schema";
import type {
  FriendFormData,
  FriendsQueryOptions,
  FriendsListResult,
  FriendWithRelations,
} from "../types/friends.d";
import { Prisma } from "@/generated/prisma/client";

export async function getFriends(
  options: FriendsQueryOptions = {}
): Promise<FriendsListResult> {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();
  const {
    limit = 50,
    offset = 0,
    search,
    cellId,
    isBaptized,
    orderBy = "name",
    orderDirection = "asc",
  } = options;

  const where: Prisma.FriendsWhereInput = {
    church_id: churchId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(cellId && { cell_id: cellId }),
    ...(isBaptized !== undefined && { isBaptized }),
  };

  const [friends, total] = await Promise.all([
    prisma.friends.findMany({
      where,
      include: {
        cell: {
          include: {
            leader: true,
            subSector: {
              include: {
                sector: {
                  include: {
                    zone: true,
                  },
                },
              },
            },
          },
        },
        invitedBy: true,
        spiritualFather: true,
      },
      orderBy: { [orderBy]: orderDirection },
      take: limit,
      skip: offset,
    }),
    prisma.friends.count({ where }),
  ]);

  return {
    friends: friends as FriendWithRelations[],
    total,
    hasMore: offset + limit < total,
  };
}

export async function getFriendById(id: string): Promise<FriendWithRelations | null> {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const friend = await prisma.friends.findFirst({
    where: { id, church_id: churchId },
    include: {
      cell: true,
      invitedBy: true,
      spiritualFather: true,
    },
  });

  return friend as FriendWithRelations | null;
}

export async function createFriend(data: FriendFormData) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const validated = friendSchema.parse(data);

  const friend = await prisma.friends.create({
    data: {
      ...validated,
      church_id: churchId,
    },
  });

  revalidatePath("/friends");
  return { success: true, data: friend };
}

export async function updateFriend(id: string, data: FriendFormData) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const validated = friendSchema.parse(data);

  const friend = await prisma.friends.update({
    where: { id, church_id: churchId },
    data: validated,
  });

  revalidatePath("/friends");
  return { success: true, data: friend };
}

export async function deleteFriend(id: string) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  await prisma.friends.delete({
    where: { id, church_id: churchId },
  });

  revalidatePath("/friends");
  return { success: true };
}
