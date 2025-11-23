"use server";

import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { Prisma } from "@/generated/prisma/client";

export async function getAllCells(options?: {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: "name" | "createdAt";
  orderDirection?: "asc" | "desc";
}) {
  try {
    const {
      limit = 50,
      offset = 0,
      search,
      orderBy = "name",
      orderDirection = "asc",
    } = options || {};

    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    const whereClause: Prisma.CellsWhereInput = { church_id: churchId };

    if (search && search.trim().length > 0) {
      whereClause.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const [cells, total] = await Promise.all([
      prisma.cells.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [orderBy]: orderDirection },
        include: {
          leader: true,
          host: true,
          sector: true,
          _count: { select: { members: true } },
        },
      }),
      prisma.cells.count({ where: whereClause }),
    ]);

    const cellsWithCount = cells.map((cell) => ({
      ...cell,
      memberCount: cell._count.members,
    }));

    return {
      cells: cellsWithCount,
      total,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error("Error fetching cells:", error);
    throw new Error("Failed to fetch cells");
  }
}

export async function deleteCell(id: string) {
  try {
    const prisma = await getChurchPrisma();
    await prisma.cells.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting cell:", error);
    throw new Error("Failed to delete cell");
  }
}