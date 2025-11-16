"use server";

import { getTenantPrisma, getChurchId } from "@/actions/tenantActions";
import { Prisma } from "@/app/generated/prisma";

// Get all ministries for the current tenant
export async function getAllMinistries(options?: {
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

    const prisma = await getTenantPrisma();
    const whereClause: Prisma.MinistriesWhereInput = {};

    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [ministries, total] = await Promise.all([
      prisma.ministries.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: {
          [orderBy]: orderDirection,
        },
        include: {
          // Include leader to show in the table
          leader: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
      }),
      prisma.ministries.count({ where: whereClause }),
    ]);

    // Transform ministries to include member count
    const ministriesWithCount = ministries.map((ministry) => ({
      ...ministry,
      memberCount: ministry._count.members,
    }));

    return {
      ministries: ministriesWithCount,
      total,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error("Error fetching ministries:", error);
    throw new Error("Failed to fetch ministries");
  }
}

// Get ministry by ID
export async function getMinistryById(id: string) {
  try {
    const prisma = await getTenantPrisma();

    const ministry = await prisma.ministries.findUnique({
      where: { id },
      include: {
        leader: true,
        members: {
          include: {
            member: true,
          },
        },
      },
    });

    if (!ministry) {
      throw new Error("Ministry not found");
    }

    return ministry;
  } catch (error) {
    console.error("Error fetching ministry:", error);
    throw new Error("Failed to fetch ministry");
  }
}

// Create new ministry
export async function createMinistry(data: {
  name: string;
  description?: string;
  leaderId?: string | null;
}) {
  try {
    const prisma = await getTenantPrisma();
    // Explicitly connect to current tenant to satisfy Prisma types
    const churchId = await getChurchId();

    const ministry = await prisma.ministries.create({
      data: {
        name: data.name,
        description: data.description,
        church: {
          connect: { id: churchId },
        },
        // Connect leader if provided; otherwise no leader relation is set
        ...(data.leaderId && data.leaderId !== ""
          ? {
              leader: {
                connect: { id: data.leaderId },
              },
            }
          : {}),
      },
    });

    return ministry;
  } catch (error) {
    console.error("Error creating ministry:", error);
    throw new Error("Failed to create ministry");
  }
}

// Update ministry
export async function updateMinistry(
  id: string,
  data: {
    name?: string;
    description?: string;
    leaderId?: string | null;
  }
) {
  try {
    const prisma = await getTenantPrisma();

    const updateData: Prisma.MinistriesUpdateInput = {
      ...(data.name ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
    };

    // Manejar explícitamente la conexión/desconexión del líder SIN usar any
    if (Object.prototype.hasOwnProperty.call(data, "leaderId")) {
      updateData.leader = data.leaderId && data.leaderId !== ""
        ? { connect: { id: data.leaderId } }
        : { disconnect: true };
    }

    const ministry = await prisma.ministries.update({
      where: { id },
      data: updateData,
    });

    return ministry;
  } catch (error) {
    console.error("Error updating ministry:", error);
    // Surface underlying error message in dev to help diagnose
    const message = error instanceof Error ? error.message : "Failed to update ministry";
    throw new Error(message);
  }
}

// Delete ministry
export async function deleteMinistry(id: string) {
  try {
    const prisma = await getTenantPrisma();

    await prisma.ministries.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting ministry:", error);
    throw new Error("Failed to delete ministry");
  }
}

// ============ MEMBERSHIP OPERATIONS ============

// List members belonging to a ministry (joins MemberMinistry -> Members)
export async function getMembersByMinistry(ministryId: string) {
  try {
    const prisma = await getTenantPrisma();

    const memberships = await prisma.memberMinistry.findMany({
      where: { ministryId },
      include: { member: true },
      orderBy: { createdAt: "asc" },
    });

    return memberships;
  } catch (error) {
    console.error("Error fetching ministry members:", error);
    throw new Error("Failed to fetch ministry members");
  }
}

// Add a member to a ministry
export async function addMemberToMinistry(
  ministryId: string,
  memberId: string
) {
  try {
    const prisma = await getTenantPrisma();
    const churchId = await getChurchId();

    // Create membership, respecting unique(memberId, ministryId)
    const membership = await prisma.memberMinistry.create({
      data: {
        ministry: { connect: { id: ministryId } },
        member: { connect: { id: memberId } },
        church: { connect: { id: churchId } },
      },
      include: { member: true, ministry: true },
    });

    return membership;
  } catch (error: unknown) {
    // Manejo seguro del error sin usar 'any'
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Violación de restricción única (memberId, ministryId)
      throw new Error("El miembro ya pertenece a este ministerio");
    }
    console.error("Error adding member to ministry:", error);
    throw new Error("Failed to add member to ministry");
  }
}

// Add multiple members to a ministry (bulk)
export async function addMembersToMinistry(
  ministryId: string,
  memberIds: string[]
) {
  try {
    const prisma = await getTenantPrisma();
    const churchId = await getChurchId();

    if (!memberIds?.length) {
      return { count: 0 };
    }

    // Use createMany for efficient bulk insert, skipping duplicates
    const result = await prisma.memberMinistry.createMany({
      data: memberIds.map((memberId) => ({
        ministryId,
        memberId,
        // createMany no admite relaciones; debemos usar la FK escalar mapeada
        // en el esquema como `church_id`
        church_id: churchId,
      })),
      skipDuplicates: true,
    });

    return { count: result.count };
  } catch (error: unknown) {
    console.error("Error adding members to ministry:", error);
    throw new Error("Failed to add members to ministry");
  }
}

// Remove a member from a ministry
export async function removeMemberFromMinistry(
  ministryId: string,
  memberId: string
) {
  try {
    const prisma = await getTenantPrisma();

    // Find membership id first (since delete requires a unique identifier)
    const membership = await prisma.memberMinistry.findFirst({
      where: { ministryId, memberId },
      select: { id: true },
    });

    if (!membership) {
      throw new Error("La relación miembro-ministerio no existe");
    }

    await prisma.memberMinistry.delete({ where: { id: membership.id } });

    return { success: true };
  } catch (error) {
    console.error("Error removing member from ministry:", error);
    throw new Error("Failed to remove member from ministry");
  }
}
