"use server";

import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { Prisma } from "@/generated/prisma/client";
import { revalidateTag } from "next/cache";
// Removed generated Zod schemas; rely on Prisma types directly and normal Zod for forms

// Get all ministries for the current church
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

    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();
    const whereClause: Prisma.MinistriesWhereInput = { church_id: churchId };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const findManyArgs = {
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        leader: true,
        _count: {
          select: { members: true },
        },
      },
    } satisfies Prisma.MinistriesFindManyArgs;

    const [ministries, total] = await Promise.all([
      prisma.ministries.findMany(findManyArgs),
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
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    const findUniqueArgs = {
      where: { id },
      include: {
        leader: true,
        members: { include: { member: true } },
      },
    } satisfies Prisma.MinistriesFindUniqueArgs;
    const ministry = await prisma.ministries.findUnique(findUniqueArgs);

    if (!ministry || ministry.church_id !== churchId) {
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
    const prisma = await getChurchPrisma();
    // Explicitly connect to current church to satisfy Prisma types
    const churchId = await getChurchId();

    const prismaData: Prisma.MinistriesCreateInput = {
      name: data.name,
      description: data.description,
      church: { connect: { id: churchId } },
      ...(data.leaderId && data.leaderId !== ""
        ? { leader: { connect: { id: data.leaderId } } }
        : {}),
    };
    const ministry = await prisma.ministries.create({ data: prismaData });

    // Si se asignó líder al crear el ministerio, asegurar que pertenezca al ministerio
    if (data.leaderId && data.leaderId !== "") {
      const existingMembership = await prisma.memberMinistry.findFirst({
        where: { ministryId: ministry.id, memberId: data.leaderId },
      });
      if (!existingMembership) {
        try {
          await prisma.memberMinistry.create({
            data: {
              church: { connect: { id: churchId } },
              member: { connect: { id: data.leaderId } },
              ministry: { connect: { id: ministry.id } },
            },
          });
        } catch (e) {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002"
          ) {
            // ya existe la relación (única por memberId+ministryId)
          } else {
            throw e;
          }
        }
      }
    }

    revalidateTag("ministries", { expire: 0 });

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
  let churchId: string | undefined;
  try {
    const prisma = await getChurchPrisma();
    churchId = await getChurchId();

    // Pre-validación: asegurar que el ministerio existe en la iglesia actual
    const existingMinistry = await prisma.ministries.findUnique({
      where: { id },
      select: { id: true, name: true, church_id: true },
    });
    if (!existingMinistry || existingMinistry.church_id !== churchId) {
      throw new Error(
        "El ministerio no existe en esta iglesia o el ID es inválido."
      );
    }

    // Pre-validación del líder (si se envió leaderId): debe existir en la iglesia actual
    if (Object.prototype.hasOwnProperty.call(data, "leaderId")) {
      const leaderIdValue = data.leaderId ?? null;
      if (leaderIdValue) {
        const existingLeader = await prisma.members.findFirst({
          where: { id: leaderIdValue, church_id: churchId },
          select: { id: true, firstName: true, lastName: true },
        });
        if (!existingLeader) {
          throw new Error(
            "No se pudo asignar el líder: el miembro seleccionado no pertenece a esta iglesia."
          );
        }
      }
    }

    const updateData: Prisma.MinistriesUpdateInput = {
      ...(data.name ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
    };

    // Manejar explícitamente la conexión/desconexión del líder SIN usar any
    if (Object.prototype.hasOwnProperty.call(data, "leaderId")) {
      updateData.leader =
        data.leaderId && data.leaderId !== ""
          ? { connect: { id: data.leaderId } }
          : { disconnect: true };
    }

    const ministry = await prisma.ministries.update({
      where: { id },
      data: updateData,
    });

    // After updating the ministry, if a new leader was assigned, ensure they are a member.
    if (data.leaderId) {
      const isMember = await prisma.memberMinistry.findFirst({
        where: {
          ministryId: id,
          memberId: data.leaderId,
        },
      });

      if (!isMember) {
        try {
          await prisma.memberMinistry.create({
            data: {
              church: { connect: { id: churchId! } },
              member: { connect: { id: data.leaderId } },
              ministry: { connect: { id } },
            },
          });
          console.log("[updateMinistry:memberAdded]", {
            ministryId: id,
            memberId: data.leaderId,
          });
        } catch (e) {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002"
          ) {
            console.warn("[updateMinistry:memberExists]", {
              ministryId: id,
              memberId: data.leaderId,
            });
          } else {
            throw e;
          }
        }
      }
    }

    // Log de éxito para inspección en producción
    console.log("[updateMinistry:success]", {
      operation: "updateMinistry",
      ministryId: id,
      leaderIdAttempted: Object.prototype.hasOwnProperty.call(data, "leaderId")
        ? (data.leaderId ?? null)
        : "not-provided",
      churchId,
      resultLeaderId: ministry.leader_id ?? null,
    });

    revalidateTag("ministries", { expire: 0 });
    return ministry;
  } catch (error) {
    // Log detallado para diagnosticar fallas de conexión de líder en producción
    console.error("Error updating ministry:", {
      error,
      context: {
        operation: "updateMinistry",
        ministryId: id,
        leaderId: data?.leaderId ?? null,
        churchId,
      },
    });

    // Si es un error conocido de Prisma (por ejemplo, P2025 al intentar conectar líder que no existe en la iglesia)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error(
          "No se pudo asignar el líder: el miembro seleccionado no se encontró en esta iglesia. Verifica que el líder pertenezca a la misma iglesia."
        );
      }
      throw new Error(
        `Error de base de datos al actualizar el ministerio: ${error.message}`
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to update ministry";
    throw new Error(message);
  }
}

// Delete ministry
export async function deleteMinistry(id: string) {
  try {
    const prisma = await getChurchPrisma();

    // Asegurar que todos los miembros (incluyendo líder) pierdan relación con el ministerio
    await prisma.memberMinistry.deleteMany({ where: { ministryId: id } });

    await prisma.ministries.delete({ where: { id } });

    revalidateTag("ministries", { expire: 0 });
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
    const prisma = await getChurchPrisma();

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
    const prisma = await getChurchPrisma();
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

    revalidateTag("ministries", { expire: 0 });
    revalidateTag("members", { expire: 0 });

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
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    if (!memberIds?.length) {
      return { count: 0 };
    }

    // Use createMany for efficient bulk insert, skipping duplicates
    const result = await prisma.memberMinistry.createMany({
      data: memberIds.map((memberId) => ({
        ministryId,
        memberId,
        church_id: churchId,
      })),
      skipDuplicates: true,
    });

    revalidateTag("ministries", { expire: 0 });
    revalidateTag("members", { expire: 0 });

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
    const prisma = await getChurchPrisma();

    // Find membership id first (since delete requires a unique identifier)
    const membership = await prisma.memberMinistry.findFirst({
      where: { ministryId, memberId },
      select: { id: true },
    });

    if (!membership) {
      throw new Error("La relación miembro-ministerio no existe");
    }

    // Eliminar la relación miembro-ministerio
    await prisma.memberMinistry.delete({ where: { id: membership.id } });

    // Si el miembro era líder, actualizar a null en la tabla ministries
    await prisma.ministries.updateMany({
      where: { id: ministryId, leader_id: memberId },
      data: { leader_id: null },
    });

    revalidateTag("ministries", { expire: 0 });
    revalidateTag("members", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Error removing member from ministry:", error);
    throw new Error("Failed to remove member from ministry");
  }
}

// Get ministry stats
export async function getMinistryStats() {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    const [total, membershipsByMinistry] = await Promise.all([
      prisma.ministries.count({ where: { church_id: churchId } }),
      prisma.memberMinistry.groupBy({
        where: { church_id: churchId },
        by: ["ministryId"],
        _count: { ministryId: true },
      }),
    ]);

    const ministryIds = membershipsByMinistry.map((m) => m.ministryId);
    const ministries = ministryIds.length
      ? await prisma.ministries.findMany({
          where: { id: { in: ministryIds } },
          select: { id: true, name: true },
        })
      : [];
    const nameMap = new Map(ministries.map((m) => [m.id, m.name]));

    const byMinistry = membershipsByMinistry.reduce(
      (acc, item) => {
        const name = nameMap.get(item.ministryId) ?? item.ministryId;
        acc[name] = item._count.ministryId;
        return acc;
      },
      {} as Record<string, number>
    );

    const distinctMembers = await prisma.memberMinistry.findMany({
      where: { church_id: churchId },
      distinct: ["memberId"],
      select: { memberId: true },
    });
    const membersInAnyMinistry = distinctMembers.length;

    return {
      total,
      membersInAnyMinistry,
      byMinistry,
    };
  } catch (error) {
    console.error("Error fetching ministry stats:", error);
    throw new Error("Failed to fetch ministry statistics");
  }
}
