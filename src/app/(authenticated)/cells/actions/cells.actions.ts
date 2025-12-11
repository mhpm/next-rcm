"use server";

import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { Prisma } from "@/generated/prisma/client";
import type { Cells, Members, Sectors } from "@/generated/prisma/client";
import type { CellListItem, CellWithRelations } from "../types/cells";
import { revalidateTag } from "next/cache";
// Removed prisma-zod types usage; rely on Prisma types and normal Zod for form payloads

export async function getAllCells(options?: {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: "name" | "createdAt";
  orderDirection?: "asc" | "desc";
}): Promise<{ cells: CellListItem[]; total: number; hasMore: boolean }> {
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

    const findArgs = {
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
    } satisfies Prisma.CellsFindManyArgs;

    // Validation of Prisma args removed (using Prisma types directly)

    const [cells, total] = await Promise.all([
      prisma.cells.findMany(findArgs) as Promise<
        (Cells & {
          leader: Members | null;
          host: Members | null;
          sector: Sectors | null;
          _count: { members: number };
        })[]
      >,
      prisma.cells.count({ where: whereClause }) as Promise<number>,
    ]);

    const cellsWithCount: CellListItem[] = cells.map((cell) => ({
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
    revalidateTag("cells", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Error deleting cell:", error);
    throw new Error("Failed to delete cell");
  }
}

export async function getCellById(id: string): Promise<CellWithRelations> {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    const findUniqueArgs = {
      where: { id },
      include: {
        leader: true,
        host: true,
        sector: true,
        members: true,
      },
    } satisfies Prisma.CellsFindUniqueArgs;
    // Validation of Prisma args removed

    const cell = await prisma.cells.findUnique(findUniqueArgs);

    if (!cell || cell.church_id !== churchId) {
      throw new Error("Cell not found");
    }

    return cell as CellWithRelations;
  } catch (error) {
    console.error("Error fetching cell:", error);
    throw new Error("Failed to fetch cell");
  }
}

export async function createCell(data: {
  name: string;
  sectorId?: string | null;
  leaderId?: string | null;
  hostId?: string | null;
}) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    const prismaData: Prisma.CellsCreateInput = {
      name: data.name,
      church: { connect: { id: churchId } },
      ...(data.sectorId && data.sectorId !== ""
        ? { sector: { connect: { id: data.sectorId } } }
        : {}),
      ...(data.leaderId && data.leaderId !== ""
        ? { leader: { connect: { id: data.leaderId } } }
        : {}),
      ...(data.hostId && data.hostId !== ""
        ? { host: { connect: { id: data.hostId } } }
        : {}),
    };

    const cell = await prisma.cells.create({ data: prismaData });

    // Asegurar que líder/anfitrión figuren como miembros de la célula
    const ensureMemberIds = [data.leaderId, data.hostId].filter(
      (v): v is string => !!v && v !== ""
    );
    if (ensureMemberIds.length) {
      await prisma.members.updateMany({
        where: { id: { in: ensureMemberIds }, church_id: churchId },
        data: { cell_id: cell.id },
      });
    }

    revalidateTag("cells", { expire: 0 });

    return cell;
  } catch (error) {
    console.error("Error creating cell:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `Error de base de datos al crear la célula: ${error.message}`
      );
    }
    const message =
      error instanceof Error ? error.message : "Failed to create cell";
    throw new Error(message);
  }
}

export async function updateCell(
  id: string,
  data: {
    name?: string;
    sectorId?: string | null;
    leaderId?: string | null;
    hostId?: string | null;
  }
) {
  let churchId: string | undefined;
  try {
    const prisma = await getChurchPrisma();
    churchId = await getChurchId();

    const existingCell = await prisma.cells.findUnique({
      where: { id },
      select: { id: true, church_id: true },
    });
    if (!existingCell || existingCell.church_id !== churchId) {
      throw new Error(
        "La célula no existe en esta iglesia o el ID es inválido."
      );
    }

    const updateData: Prisma.CellsUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (Object.prototype.hasOwnProperty.call(data, "sectorId")) {
      updateData.sector =
        data.sectorId && data.sectorId !== ""
          ? { connect: { id: data.sectorId } }
          : { disconnect: true };
    }

    if (Object.prototype.hasOwnProperty.call(data, "leaderId")) {
      updateData.leader =
        data.leaderId && data.leaderId !== ""
          ? { connect: { id: data.leaderId } }
          : { disconnect: true };
    }
    if (Object.prototype.hasOwnProperty.call(data, "hostId")) {
      updateData.host =
        data.hostId && data.hostId !== ""
          ? { connect: { id: data.hostId } }
          : { disconnect: true };
    }

    const cell = await prisma.cells.update({ where: { id }, data: updateData });

    // Si se asignó líder/anfitrión, asegurar su membresía en la célula
    const setIds: string[] = [];
    if (
      Object.prototype.hasOwnProperty.call(data, "leaderId") &&
      data.leaderId &&
      data.leaderId !== ""
    ) {
      setIds.push(data.leaderId);
    }
    if (
      Object.prototype.hasOwnProperty.call(data, "hostId") &&
      data.hostId &&
      data.hostId !== ""
    ) {
      setIds.push(data.hostId);
    }
    if (setIds.length) {
      await prisma.members.updateMany({
        where: { id: { in: setIds }, church_id: churchId },
        data: { cell_id: id },
      });
    }

    revalidateTag("cells", { expire: 0 });

    return cell;
  } catch (error) {
    console.error("Error updating cell:", { error, id, data, churchId });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `Error de base de datos al actualizar la célula: ${error.message}`
      );
    }
    const message =
      error instanceof Error ? error.message : "Failed to update cell";
    throw new Error(message);
  }
}

export async function searchSectors(term: string) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();
    const sectors = await prisma.sectors.findMany({
      where: {
        church_id: churchId,
        name: { contains: term, mode: "insensitive" },
      },
      orderBy: { name: "asc" },
      take: 10,
    });
    return sectors;
  } catch (error) {
    console.error("Error searching sectors:", error);
    throw new Error("Failed to search sectors");
  }
}

export async function getAllSectors() {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();
    const sectors = await prisma.sectors.findMany({
      where: { church_id: churchId },
      orderBy: { name: "asc" },
    });
    return sectors;
  } catch (error) {
    console.error("Error fetching sectors:", error);
    throw new Error("Failed to fetch sectors");
  }
}

export async function getSectorById(id: string) {
  try {
    const prisma = await getChurchPrisma();
    const sector = await prisma.sectors.findUnique({ where: { id } });
    return sector;
  } catch (error) {
    console.error("Error fetching sector by ID:", error);
    return null;
  }
}

export async function getMembersByCell(cellId: string) {
  try {
    const prisma = await getChurchPrisma();
    const membersFindArgs = {
      where: { cell_id: cellId },
      orderBy: { createdAt: "asc" },
    } satisfies Prisma.MembersFindManyArgs;
    const members = await prisma.members.findMany(membersFindArgs);
    return members;
  } catch (error) {
    console.error("Error fetching cell members:", error);
    throw new Error("Failed to fetch cell members");
  }
}

export async function getCellStats() {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    const [total, membersInCells, membersWithoutCell] = await Promise.all([
      prisma.cells.count({ where: { church_id: churchId } }),
      prisma.members.count({
        where: { church_id: churchId, cell_id: { not: null } },
      }),
      prisma.members.count({ where: { church_id: churchId, cell_id: null } }),
    ]);

    return { total, membersInCells, membersWithoutCell };
  } catch (error) {
    console.error("Error fetching cell stats:", error);
    throw new Error("Failed to fetch cell statistics");
  }
}

export async function searchMembersInCell(cellId: string, term: string) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();
    const searchArgs = {
      where: {
        church_id: churchId,
        cell_id: cellId,
        OR: [
          { firstName: { contains: term, mode: "insensitive" } },
          { lastName: { contains: term, mode: "insensitive" } },
          { email: { contains: term, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 10,
    } satisfies Prisma.MembersFindManyArgs;
    const members = await prisma.members.findMany(searchArgs);
    return members.map((m) => ({ ...m, ministries: [] }));
  } catch (error) {
    console.error("Error searching members in cell:", error);
    throw new Error("Failed to search members in cell");
  }
}

export async function addMemberToCell(cellId: string, memberId: string) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    const [cell, member] = await Promise.all([
      prisma.cells.findUnique({
        where: { id: cellId },
        select: { id: true, church_id: true },
      }),
      prisma.members.findFirst({
        where: { id: memberId, church_id: churchId },
        select: { id: true },
      }),
    ]);

    if (!cell || cell.church_id !== churchId) {
      throw new Error("La célula no pertenece a esta iglesia");
    }
    if (!member) {
      throw new Error("El miembro no pertenece a esta iglesia");
    }

    const updateMemberArgs = {
      where: { id: memberId },
      data: { cell: { connect: { id: cellId } } },
    } satisfies Prisma.MembersUpdateArgs;
    const updated = await prisma.members.update(updateMemberArgs);
    revalidateTag("cells", { expire: 0 });
    return updated;
  } catch (error) {
    console.error("Error adding member to cell:", error);
    throw new Error("Failed to add member to cell");
  }
}

export async function addMembersToCell(cellId: string, memberIds: string[]) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();
    if (!memberIds?.length) return { count: 0 };

    const updateManyArgs = {
      where: { id: { in: memberIds }, church_id: churchId },
      data: { cell_id: cellId },
    } satisfies Prisma.MembersUpdateManyArgs;
    const result = await prisma.members.updateMany(updateManyArgs);
    revalidateTag("cells", { expire: 0 });
    return { count: result.count };
  } catch (error) {
    console.error("Error adding members to cell:", error);
    throw new Error("Failed to add members to cell");
  }
}

export async function removeMemberFromCell(cellId: string, memberId: string) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();
    const [existing, cell] = await Promise.all([
      prisma.members.findFirst({
        where: { id: memberId, cell_id: cellId, church_id: churchId },
        select: { id: true },
      }),
      prisma.cells.findUnique({
        where: { id: cellId },
        select: { id: true, church_id: true, leader_id: true, host_id: true },
      }),
    ]);
    if (!existing) {
      throw new Error("El miembro no pertenece a esta célula");
    }
    if (!cell || cell.church_id !== churchId) {
      throw new Error("La célula no pertenece a esta iglesia");
    }
    const removeMemberArgs = {
      where: { id: memberId },
      data: { cell_id: null },
    } satisfies Prisma.MembersUpdateArgs;
    await prisma.members.update(removeMemberArgs);

    const updates: Prisma.CellsUpdateInput = {};
    if (cell.leader_id === memberId) {
      updates.leader = { disconnect: true };
    }
    if (cell.host_id === memberId) {
      updates.host = { disconnect: true };
    }
    if (Object.keys(updates).length > 0) {
      const updateCellArgs = {
        where: { id: cellId },
        data: updates,
      } satisfies Prisma.CellsUpdateArgs;
      await prisma.cells.update(updateCellArgs);
    }
    revalidateTag("cells", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Error removing member from cell:", error);
    throw new Error("Failed to remove member from cell");
  }
}
