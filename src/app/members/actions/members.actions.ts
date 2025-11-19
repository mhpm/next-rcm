"use server";
import { Prisma, MemberRole } from "@/app/generated/prisma";
import { MemberFormData } from "@/types";
import * as bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";
import {
  handlePrismaError,
  withErrorHandling,
  NotFoundError,
} from "@/lib/error-handler";
import { processImageUpload } from "@/lib/file-upload";
import {
  updateMemberSchema,
  insertMemberFormSchema,
} from "@/app/members/schema/members.schema";
import { getChurchPrisma, getChurchId } from "@/actions/churchContext";

// Get all members with optional filtering and pagination
export async function getAllMembers(options?: {
  limit?: number;
  offset?: number;
  search?: string;
  role?: MemberRole;
  orderBy?: "firstName" | "lastName" | "createdAt";
  orderDirection?: "asc" | "desc";
}) {
  try {
    const {
      limit = 50,
      offset = 0,
      search,
      role,
      orderBy = "lastName",
      orderDirection = "asc",
    } = options || {};

    const prisma = await getChurchPrisma();
    const whereClause: Prisma.MembersWhereInput = {};

    // Add search filter (supports "first last" queries and single-term)
    if (search) {
      const term = search.trim();
      const parts = term.split(/\s+/).filter(Boolean);

      const orClauses: Prisma.MembersWhereInput[] = [
        { firstName: { contains: term, mode: "insensitive" } },
        { lastName: { contains: term, mode: "insensitive" } },
        { email: { contains: term, mode: "insensitive" } },
      ];

      // If query includes two or more parts, support "First Last" matching in both orders
      if (parts.length >= 2) {
        const first = parts[0];
        const last = parts.slice(1).join(" "); // support multi-word last names

        orClauses.push(
          {
            AND: [
              { firstName: { contains: first, mode: "insensitive" } },
              { lastName: { contains: last, mode: "insensitive" } },
            ],
          },
          {
            AND: [
              { firstName: { contains: last, mode: "insensitive" } },
              { lastName: { contains: first, mode: "insensitive" } },
            ],
          }
        );
      }

      whereClause.OR = orClauses;
    }

    // Add role filter
    if (role) {
      whereClause.role = role;
    }

    const [members, total] = await Promise.all([
      prisma.members.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: {
          [orderBy]: orderDirection,
        },
        include: {
          ministries: {
            include: {
              ministry: true,
            },
          },
        },
      }),
      prisma.members.count({ where: whereClause }),
    ]);

    return {
      members,
      total,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
}

// Get members with limit (legacy function for backward compatibility)
export async function getMembers(limit = 10) {
  try {
    const prisma = await getChurchPrisma();
    const members = await prisma.members.findMany({
      take: limit,
      orderBy: {
        lastName: "asc",
      },
      include: {
        ministries: {
          include: {
            ministry: true,
          },
        },
      },
    });

    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
}

// Get member by specific field
export async function getMemberBy(field: string, value: unknown) {
  try {
    const prisma = await getChurchPrisma();
    const member = await prisma.members.findFirst({
      where: {
        [field]: value,
      },
    });

    return member;
  } catch (error) {
    console.error(`Error fetching member by ${field}:`, error);
    throw new Error(`Failed to fetch member by ${field}`);
  }
}

// Get member by ID
export async function getMemberById(id: string) {
  try {
    const prisma = await getChurchPrisma();

    const member = await prisma.members.findUnique({
      where: { id },
      include: {
        ministries: {
          include: {
            ministry: true,
          },
        },
      },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    return member;
  } catch (error) {
    console.error("Error fetching member by ID:", error);
    throw new Error("Failed to fetch member");
  }
}

// ============ CREATE OPERATIONS ============

// Create a new member
export const createMember = withErrorHandling(async function createMember(
  data: MemberFormData
) {
  try {
    // Debug: Log incoming data
    console.log(
      "🚀 ~ createMember ~ incoming data:",
      JSON.stringify(data, null, 2)
    );

    // Validate and normalize payload with Zod (using form schema for proper data transformation)
    // The insertMemberFormSchema handles string-to-date conversion and age string-to-number conversion
    const parsed = insertMemberFormSchema.parse(data);

    // Debug: Log parsed data
    console.log(
      "🚀 ~ createMember ~ parsed data:",
      JSON.stringify(parsed, null, 2)
    );
    // Hash password if provided
    let passwordHash = null;
    if (parsed.password) {
      passwordHash = await bcrypt.hash(parsed.password, 12);
    }

    // Process image upload if provided
    let pictureUrl = null;
    if (parsed.picture && parsed.picture.length > 0) {
      try {
        pictureUrl = await processImageUpload(parsed.picture);
      } catch (uploadError) {
        logger.error("Error uploading image", uploadError as Error, {
          operation: "createMember",
          email: parsed.email,
        });
        // Continue without image if upload fails
        pictureUrl = null;
      }
    }

    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    // Prepare member data with explicit church_id
    const memberData = {
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      email: parsed.email,
      phone: parsed.phone || null,
      age: parsed.age || null,
      street: parsed.street || null,
      city: parsed.city || null,
      state: parsed.state || null,
      zip: parsed.zip || null,
      ...(parsed.country && { country: parsed.country }),
      birthDate: parsed.birthDate || null,
      baptismDate: parsed.baptismDate || null,
      role: parsed.role,
      gender: parsed.gender,
      // ministerio: parsed.ministerio || "", // Removed - will be handled via MemberMinistry relation
      notes: parsed.notes || null,
      passwordHash,
      pictureUrl, // Now includes the uploaded image URL
      church: {
        connect: {
          id: churchId,
        },
      },
    };

    const member = await prisma.members.create({
      data: memberData,
    });

    // Create MemberMinistry relations if ministries are provided
    if (parsed.ministries && parsed.ministries.length > 0) {
      const memberMinistryData = parsed.ministries.map((ministryId) => ({
        memberId: member.id,
        ministryId: ministryId,
        church_id: churchId,
      }));

      await prisma.memberMinistry.createMany({
        data: memberMinistryData,
      });

      logger.info("Member ministries created successfully", {
        operation: "createMember",
        memberId: member.id,
        ministriesCount: parsed.ministries.length,
      });
    }

    logger.info("Member created successfully", {
      operation: "createMember",
      memberId: member.id,
      email: member.email,
    });

    return member;
  } catch (error) {
    // Log detallado del error para debugging
    logger.error("Error creating member", error as Error, {
      operation: "createMember",
      memberData: {
        email: (data as MemberFormData)?.email,
        firstName: (data as MemberFormData)?.firstName,
        lastName: (data as MemberFormData)?.lastName,
        role: (data as MemberFormData)?.role,
      },
      timestamp: new Date().toISOString(),
    });

    // Convertir errores de Prisma a errores de aplicación
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      throw handlePrismaError(error);
    }

    // Re-lanzar errores de aplicación conocidos
    throw error;
  }
});

// ============ UPDATE OPERATIONS ============

// Update an existing member
export async function updateMember(id: string, data: Partial<MemberFormData>) {
  try {
    const parsed = updateMemberSchema.parse({ id, ...data });
    const prisma = await getChurchPrisma();

    // Ensure member exists
    const existingMember = await prisma.members.findUnique({
      where: { id: parsed.id! },
    });
    if (!existingMember) {
      throw new NotFoundError("Member not found");
    }

    const updateData: Prisma.MembersUpdateInput = {};

    // Strings and required-like fields
    if (parsed.firstName !== undefined)
      updateData.firstName = parsed.firstName.trim();
    if (parsed.lastName !== undefined)
      updateData.lastName = parsed.lastName.trim();
    if (parsed.email !== undefined)
      updateData.email = parsed.email.trim().toLowerCase();

    // Optional strings
    if (parsed.phone !== undefined) updateData.phone = parsed.phone || null;
    if (parsed.street !== undefined) updateData.street = parsed.street || null;
    if (parsed.city !== undefined) updateData.city = parsed.city || null;
    if (parsed.state !== undefined) updateData.state = parsed.state || null;
    if (parsed.zip !== undefined) updateData.zip = parsed.zip || null;
    if (parsed.country !== undefined && parsed.country)
      updateData.country = parsed.country;
    // if (parsed.ministerio !== undefined)
    //   updateData.ministerio = parsed.ministerio || ""; // Removed - will be handled via MemberMinistry relation
    if (parsed.notes !== undefined) updateData.notes = parsed.notes || null;

    // Numbers
    if (parsed.age !== undefined)
      updateData.age = parsed.age && parsed.age > 0 ? parsed.age : null;

    // Dates
    if (parsed.birthDate !== undefined)
      updateData.birthDate = parsed.birthDate ?? null;
    if (parsed.baptismDate !== undefined)
      updateData.baptismDate = parsed.baptismDate ?? null;

    // Enums
    if (parsed.role !== undefined) updateData.role = parsed.role;
    if (parsed.gender !== undefined) updateData.gender = parsed.gender;

    // Arrays
    if (parsed.password) {
      // Password
      updateData.passwordHash = await bcrypt.hash(parsed.password, 12);
    }

    // Handle ministries update if provided
    if (parsed.ministries !== undefined) {
      // Delete existing ministry relations
      await prisma.memberMinistry.deleteMany({
        where: { memberId: parsed.id! },
      });

      // Create new ministry relations if ministries are provided
      if (parsed.ministries.length > 0) {
        const churchId = await getChurchId();
        const memberMinistryData = parsed.ministries.map((ministryId) => ({
          memberId: parsed.id!,
          ministryId: ministryId,
          church_id: churchId,
        }));

        await prisma.memberMinistry.createMany({
          data: memberMinistryData,
        });

        logger.info("Member ministries updated successfully", {
          operation: "updateMember",
          memberId: parsed.id!,
          ministriesCount: parsed.ministries.length,
        });
      }
    }

    // Si no hay cambios en los datos del miembro, pero sí en ministerios, devolver el miembro con ministerios actualizados
    if (
      Object.keys(updateData).length === 0 &&
      parsed.ministries !== undefined
    ) {
      const memberWithMinistries = await prisma.members.findUnique({
        where: { id: parsed.id! },
        include: {
          ministries: {
            include: {
              ministry: true,
            },
          },
        },
      });

      logger.info(
        "Only ministries updated in updateMember; returning member with updated ministries",
        {
          operation: "updateMember",
          memberId: parsed.id!,
        }
      );
      return memberWithMinistries!;
    }

    // Si no hay cambios en los datos ni en ministerios, devolver el miembro existente sin error
    if (Object.keys(updateData).length === 0) {
      logger.info(
        "No changes detected in updateMember; returning existing member",
        {
          operation: "updateMember",
          memberId: parsed.id!,
        }
      );
      return existingMember;
    }

    const updatedMember = await prisma.members.update({
      where: { id: parsed.id! },
      data: updateData,
      include: {
        ministries: {
          include: {
            ministry: true,
          },
        },
      },
    });
    return updatedMember;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      throw handlePrismaError(error);
    }
    throw error;
  }
}

// ============ DELETE OPERATIONS ============

// Delete a member by ID
export async function deleteMember(id: string) {
  try {
    const prisma = await getChurchPrisma();

    // Check if member exists
    const existingMember = await prisma.members.findUnique({
      where: { id },
    });

    if (!existingMember) {
      throw new Error("Member not found");
    }

    // Before deleting the member, check if they are a leader of any ministry
    // and nullify the leader_id in those ministries.
    await prisma.ministries.updateMany({
      where: { leader_id: id },
      data: { leader_id: null },
    });

    await prisma.members.delete({
      where: { id },
    });

    return { success: true, message: "Member deleted successfully" };
  } catch (error) {
    console.error("Error deleting member:", error);
    if (error instanceof Error && error.message.includes("Member not found")) {
      throw error;
    }
    throw new Error("Failed to delete member");
  }
}

// Soft delete a member (mark as inactive instead of deleting)
export async function deactivateMember(id: string) {
  try {
    const prisma = await getChurchPrisma();

    // Note: This requires adding an 'active' field to your schema
    // For now, we'll add it to notes as a workaround
    const updatedMember = await prisma.members.update({
      where: { id },
      data: {
        notes: `DEACTIVATED: ${new Date().toISOString()}`,
      },
    });

    return updatedMember;
  } catch (error) {
    console.error("Error deactivating member:", error);
    throw new Error("Failed to deactivate member");
  }
}

// ============ UTILITY FUNCTIONS ============

// Check if email is already taken
export async function isEmailTaken(email: string, excludeId?: string) {
  try {
    const prisma = await getChurchPrisma();
    const whereClause: Prisma.MembersWhereInput = { email };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const existingMember = await prisma.members.findFirst({
      where: whereClause,
    });

    return !!existingMember;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}

// Get member statistics
export async function getMemberStats() {
  try {
    const prisma = await getChurchPrisma();

    const [total, byRole, byGender] = await Promise.all([
      prisma.members.count(),
      prisma.members.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
      prisma.members.groupBy({
        by: ["gender"],
        _count: { gender: true },
      }),
    ]);

    return {
      total,
      byRole: byRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {} as Record<string, number>),
      byGender: byGender.reduce((acc, item) => {
        acc[item.gender] = item._count.gender;
        return acc;
      }, {} as Record<string, number>),
    };
  } catch (error) {
    console.error("Error fetching member stats:", error);
    throw new Error("Failed to fetch member statistics");
  }
}
