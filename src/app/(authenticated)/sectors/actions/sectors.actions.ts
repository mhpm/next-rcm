"use server";

import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { Prisma } from "@/generated/prisma/client";
import { MemberRole } from "@/generated/prisma/enums";
import { revalidateTag } from "next/cache";

// Helper to ensure member has SUPERVISOR role
async function ensureSupervisorRole(prisma: any, memberId: string) {
  const member = await prisma.members.findUnique({
    where: { id: memberId },
    select: { role: true },
  });

  if (member && member.role !== MemberRole.SUPERVISOR) {
    await prisma.members.update({
      where: { id: memberId },
      data: { role: MemberRole.SUPERVISOR },
    });
  }
}

// Get all sectors for the current church
export async function getAllSectors(options?: {
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
    const whereClause: Prisma.SectorsWhereInput = { church_id: churchId };

    // Add search filter
    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }

    const findManyArgs = {
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        supervisor: true,
        zone: true,
        _count: {
          select: { subSectors: true, members: true },
        },
      },
    } satisfies Prisma.SectorsFindManyArgs;

    const [sectors, total] = await Promise.all([
      prisma.sectors.findMany(findManyArgs),
      prisma.sectors.count({ where: whereClause }),
    ]);

    // Transform sectors to include counts
    const sectorsWithCounts = sectors.map((sector) => ({
      ...sector,
      cellsCount: 0, // Cells are now in subsectors
      membersCount: sector._count.members,
      subSectorsCount: sector._count.subSectors,
    }));

    return {
      sectors: sectorsWithCounts,
      total,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error("Error fetching sectors:", error);
    throw new Error("Failed to fetch sectors");
  }
}

// Get sector or subsector by ID
export async function getSectorById(id: string) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    // Try finding as Sector
    const sector = await prisma.sectors.findUnique({
      where: { id },
      include: {
        supervisor: true,
        zone: true,
        subSectors: {
          include: {
            cells: true,
            supervisor: true,
          },
        },
        members: true,
      },
    });

    if (sector && sector.church_id === churchId) {
      return { ...sector, type: "SECTOR" as const };
    }

    // Try finding as SubSector
    const subSector = await prisma.subSectors.findUnique({
      where: { id },
      include: {
        supervisor: true,
        sector: {
          include: {
            zone: true,
          },
        },
        cells: true,
        members: true,
      },
    });

    if (
      subSector &&
      subSector.sector &&
      subSector.sector.church_id === churchId
    ) {
      return { ...subSector, type: "SUB_SECTOR" as const };
    }

    throw new Error("Sector or SubSector not found");
  } catch (error) {
    console.error("Error fetching sector/subsector:", error);
    throw new Error("Failed to fetch sector or subsector");
  }
}

export async function getSectorHierarchy() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const sectors = await prisma.sectors.findMany({
    where: { church_id: churchId },
    orderBy: { name: "asc" },
    include: {
      supervisor: true,
      _count: { select: { members: true, subSectors: true } },
      subSectors: {
        orderBy: { name: "asc" },
        include: {
          supervisor: true,
          cells: {
            include: {
              leader: true,
              host: true,
              assistant: true,
              _count: { select: { members: true } },
            },
          },
          _count: { select: { cells: true, members: true } },
        },
      },
    },
  });

  return sectors;
}

// Create new sector
export async function createSector(data: {
  name: string;
  supervisorId?: string | null;
  zoneId?: string | null;
}) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    if (data.supervisorId) {
      await ensureSupervisorRole(prisma, data.supervisorId);
    }

    const sector = await prisma.sectors.create({
      data: {
        name: data.name,
        church: { connect: { id: churchId } },
        supervisor: data.supervisorId
          ? { connect: { id: data.supervisorId } }
          : undefined,
        zone: data.zoneId ? { connect: { id: data.zoneId } } : undefined,
      },
    });

    revalidateTag("sectors", { expire: 0 });
    return sector;
  } catch (error) {
    console.error("Error creating sector:", error);
    throw new Error("Failed to create sector");
  }
}

// Create new sub-sector
export async function createSubSector(data: {
  name: string;
  sectorId: string;
  supervisorId?: string | null;
}) {
  try {
    const prisma = await getChurchPrisma();

    if (data.supervisorId) {
      await ensureSupervisorRole(prisma, data.supervisorId);
    }

    // Verify sector exists
    const sector = await prisma.sectors.findUnique({
      where: { id: data.sectorId },
    });

    if (!sector) {
      throw new Error("Sector padre no encontrado");
    }

    const subSector = await prisma.subSectors.create({
      data: {
        name: data.name,
        sector: { connect: { id: data.sectorId } },
        supervisor: data.supervisorId
          ? { connect: { id: data.supervisorId } }
          : undefined,
      },
    });

    revalidateTag("sectors", { expire: 0 });
    return subSector;
  } catch (error) {
    console.error("Error creating sub-sector:", error);
    throw new Error("Failed to create sub-sector");
  }
}

// Update sector
export async function updateSector(
  id: string,
  data: {
    name?: string;
    supervisorId?: string | null;
    zoneId?: string | null;
  }
) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    if (data.supervisorId) {
      await ensureSupervisorRole(prisma, data.supervisorId);
    }

    // Verify ownership
    const existingSector = await prisma.sectors.findUnique({
      where: { id },
    });

    if (!existingSector || existingSector.church_id !== churchId) {
      throw new Error("Sector not found or access denied");
    }

    const sector = await prisma.sectors.update({
      where: { id },
      data: {
        name: data.name,
        supervisor:
          data.supervisorId === undefined
            ? undefined
            : data.supervisorId
            ? { connect: { id: data.supervisorId } }
            : { disconnect: true },
        zone:
          data.zoneId === undefined
            ? undefined
            : data.zoneId
            ? { connect: { id: data.zoneId } }
            : { disconnect: true },
      },
    });

    revalidateTag("sectors", { expire: 0 });
    return sector;
  } catch (error) {
    console.error("Error updating sector:", error);
    throw new Error("Failed to update sector");
  }
}

export async function updateSubSector(
  id: string,
  data: {
    name?: string;
    supervisorId?: string | null;
    sectorId?: string;
  }
) {
  try {
    const prisma = await getChurchPrisma();

    if (data.supervisorId) {
      await ensureSupervisorRole(prisma, data.supervisorId);
    }

    const subSector = await prisma.subSectors.update({
      where: { id },
      data: {
        name: data.name,
        supervisor:
          data.supervisorId === undefined
            ? undefined
            : data.supervisorId
            ? { connect: { id: data.supervisorId } }
            : { disconnect: true },
        sector:
          data.sectorId === undefined
            ? undefined
            : { connect: { id: data.sectorId } },
      },
    });

    revalidateTag("sectors", { expire: 0 });
    return subSector;
  } catch (error) {
    console.error("Error updating sub-sector:", error);
    throw new Error("Failed to update sub-sector");
  }
}

// Delete sector
export async function deleteSector(id: string) {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    // Verify ownership
    const existingSector = await prisma.sectors.findUnique({
      where: { id },
    });

    if (!existingSector || existingSector.church_id !== churchId) {
      throw new Error("Sector not found or access denied");
    }

    await prisma.sectors.delete({
      where: { id },
    });

    revalidateTag("sectors", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Error deleting sector:", error);
    throw new Error("Failed to delete sector");
  }
}

export async function deleteSubSector(id: string) {
  try {
    const prisma = await getChurchPrisma();
    await prisma.subSectors.delete({ where: { id } });
    revalidateTag("sectors", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Error deleting sub-sector:", error);
    throw new Error("Failed to delete sub-sector");
  }
}

export async function getSectorStats() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const [totalSectors, totalSubSectors, totalCells, totalMembers] =
    await Promise.all([
      prisma.sectors.count({
        where: { church_id: churchId },
      }),
      prisma.subSectors.count({
        where: { sector: { church_id: churchId } },
      }),
      prisma.cells.count({
        where: { subSector: { sector: { church_id: churchId } } },
      }),
      prisma.members.count({
        where: { church_id: churchId }, // Simplified for now, or should be filtered by having a sector/subsector?
        // User previously wanted members in sectors.
        // Members now have sub_sector_id, sector_id, zone_id relations.
        // Let's count members linked to any sector via subsector or sector directly if we support that.
        // For now, let's keep it simple: all members in the church or specifically in the hierarchy?
        // Original query was: where: { sector: { church_id: churchId } }
        // Let's use: where: { subSector: { sector: { church_id: churchId } } } or similar
      }),
    ]);

  // Re-evaluating members count query based on new schema
  // Members have sector_id and sub_sector_id
  const totalMembersInHierarchy = await prisma.members.count({
    where: {
      cell_id: { not: null },
      church_id: churchId,
    },
  });

  return {
    totalSectors,
    totalSubSectors,
    totalCells,
    totalMembers: totalMembersInHierarchy,
  };
}
