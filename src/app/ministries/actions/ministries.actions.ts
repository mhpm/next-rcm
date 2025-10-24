"use server";

import { getTenantPrisma } from "@/actions/tenantActions";
import { Prisma } from "@prisma/client";

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
      }),
      prisma.ministries.count({ where: whereClause }),
    ]);

    return {
      ministries,
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
}) {
  try {
    const prisma = await getTenantPrisma();

    const ministry = await prisma.ministries.create({
      data: {
        name: data.name,
        description: data.description,
        church_id: "", // This will be overridden by the tenant middleware
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
  }
) {
  try {
    const prisma = await getTenantPrisma();

    const ministry = await prisma.ministries.update({
      where: { id },
      data,
    });

    return ministry;
  } catch (error) {
    console.error("Error updating ministry:", error);
    throw new Error("Failed to update ministry");
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
