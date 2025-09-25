'use server';
import { prisma } from '@/lib/prisma';
import { Prisma, MemberRole } from '@prisma/client';
import { MemberFormData } from '@/types';
import { generateUUID } from '@/lib/uuid';
import * as bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';
import { handlePrismaError, withErrorHandling, NotFoundError } from '@/lib/error-handler';

// Get all members with optional filtering and pagination
export async function getAllMembers(options?: {
  limit?: number;
  offset?: number;
  search?: string;
  role?: MemberRole;
  orderBy?: 'firstName' | 'lastName' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}) {
  try {
    const {
      limit = 50,
      offset = 0,
      search,
      role,
      orderBy = 'lastName',
      orderDirection = 'asc',
    } = options || {};

    const whereClause: Prisma.MemberWhereInput = {};

    // Add search filter
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add role filter
    if (role) {
      whereClause.role = role;
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: {
          [orderBy]: orderDirection,
        },
      }),
      prisma.member.count({ where: whereClause }),
    ]);

    return {
      members,
      total,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error('Error fetching members:', error);
    throw new Error('Failed to fetch members');
  }
}

// Get members with limit (legacy function for backward compatibility)
export async function getMembers(limit = 10) {
  try {
    const members = await prisma.member.findMany({
      take: limit,
      orderBy: {
        lastName: 'asc',
      },
    });

    return members;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw new Error('Failed to fetch members');
  }
}

// Get member by specific field
export async function getMemberBy(field: string, value: unknown) {
  try {
    const member = await prisma.member.findFirst({
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
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    throw new Error('Failed to fetch member');
  }
}

// ============ CREATE OPERATIONS ============

// Create a new member
export const createMember = withErrorHandling(async function createMember(data: MemberFormData) {
  try {
    // Hash password if provided
    let passwordHash = null;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 12);
    }

    // Get the first available church (for now, we'll use the existing one)
    const church = await prisma.churches.findFirst();
    if (!church) {
      throw new NotFoundError('No se encontró una iglesia válida. Contacta al administrador del sistema.');
    }

    // Prepare member data
    const memberData = {
      id: generateUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      age: data.age || null,
      street: data.street || null,
      city: data.city || null,
      state: data.state || null,
      zip: data.zip || null,
      country: data.country || null,
      birthDate: data.birthDate || null,
      baptismDate: data.baptismDate || null,
      role: data.role,
      gender: data.gender,
      ministerio: data.ministerio || '',
      notes: data.notes || null,
      skills: data.skills || [],
      passwordHash,
      pictureUrl: null, // Handle file upload separately if needed
      church_id: church.id, // Add the required church_id
    };

    const member = await prisma.member.create({
      data: memberData,
    });

    logger.info('Member created successfully', {
      operation: 'createMember',
      memberId: member.id,
      email: member.email,
    });

    return member;
  } catch (error) {
    // Log detallado del error para debugging
    logger.error('Error creating member', error as Error, {
      operation: 'createMember',
      memberData: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
      timestamp: new Date().toISOString(),
    });

    // Convertir errores de Prisma a errores de aplicación
    if (error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientValidationError ||
        error instanceof Prisma.PrismaClientInitializationError) {
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
    console.log('Updating member with ID:', id);
    console.log('Update data received:', data);

    // Validate ID
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid member ID provided');
    }

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      throw new Error('Member not found');
    }

    // Prepare update data with better validation
    const updateData: Prisma.MemberUpdateInput = {};

    // Required fields
    if (data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim().length === 0) {
        throw new Error('First name is required');
      }
      updateData.firstName = data.firstName.trim();
    }
    
    if (data.lastName !== undefined) {
      if (!data.lastName || data.lastName.trim().length === 0) {
        throw new Error('Last name is required');
      }
      updateData.lastName = data.lastName.trim();
    }
    
    if (data.email !== undefined) {
      if (!data.email || data.email.trim().length === 0) {
        throw new Error('Email is required');
      }
      updateData.email = data.email.trim().toLowerCase();
    }

    // Optional string fields
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.street !== undefined) updateData.street = data.street || null;
    if (data.city !== undefined) updateData.city = data.city || null;
    if (data.state !== undefined) updateData.state = data.state || null;
    if (data.zip !== undefined) updateData.zip = data.zip || null;
    if (data.country !== undefined) updateData.country = data.country || null;
    if (data.ministerio !== undefined) updateData.ministerio = data.ministerio || '';
    if (data.notes !== undefined) updateData.notes = data.notes || null;

    // Numeric fields
    if (data.age !== undefined) {
      updateData.age = data.age && data.age > 0 ? data.age : null;
    }

    // Date fields with validation
    if (data.birthDate !== undefined) {
      if (data.birthDate && data.birthDate instanceof Date) {
        updateData.birthDate = data.birthDate;
      } else {
        updateData.birthDate = null;
      }
    }
    
    if (data.baptismDate !== undefined) {
      if (data.baptismDate && data.baptismDate instanceof Date) {
        updateData.baptismDate = data.baptismDate;
      } else {
        updateData.baptismDate = null;
      }
    }

    // Enum fields
    if (data.role !== undefined) updateData.role = data.role;
    if (data.gender !== undefined) updateData.gender = data.gender;

    // Array fields
    if (data.skills !== undefined) {
      updateData.skills = Array.isArray(data.skills) ? data.skills : [];
    }

    // Handle password update
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    console.log('Final update data:', updateData);

    const updatedMember = await prisma.member.update({
      where: { id },
      data: updateData,
    });

    console.log('Member updated successfully:', updatedMember.id);
    return updatedMember;
  } catch (error) {
    console.error('Error updating member:', error);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('Unique constraint') || error.message.includes('unique constraint')) {
        throw new Error('A member with this email already exists');
      }
      if (error.message.includes('Member not found')) {
        throw error;
      }
      if (error.message.includes('required')) {
        throw error;
      }
      
      // Check for Prisma-specific errors
      if (error.message.includes('Invalid') || error.message.includes('validation')) {
        throw new Error(`Validation error: ${error.message}`);
      }
      
      // Re-throw the original error if it's a known validation error
      if (error.message.includes('First name') || 
          error.message.includes('Last name') || 
          error.message.includes('Email')) {
        throw error;
      }
    }
    
    // Log the raw error for debugging
    console.error('Raw error object:', JSON.stringify(error, null, 2));
    
    throw new Error(`Failed to update member: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============ DELETE OPERATIONS ============

// Delete a member by ID
export async function deleteMember(id: string) {
  try {
    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      throw new Error('Member not found');
    }

    await prisma.member.delete({
      where: { id },
    });

    return { success: true, message: 'Member deleted successfully' };
  } catch (error) {
    console.error('Error deleting member:', error);
    if (error instanceof Error && error.message.includes('Member not found')) {
      throw error;
    }
    throw new Error('Failed to delete member');
  }
}

// Soft delete a member (mark as inactive instead of deleting)
export async function deactivateMember(id: string) {
  try {
    // Note: This requires adding an 'active' field to your schema
    // For now, we'll add it to notes as a workaround
    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        notes: `DEACTIVATED: ${new Date().toISOString()}`,
      },
    });

    return updatedMember;
  } catch (error) {
    console.error('Error deactivating member:', error);
    throw new Error('Failed to deactivate member');
  }
}

// ============ UTILITY FUNCTIONS ============

// Check if email is already taken
export async function isEmailTaken(email: string, excludeId?: string) {
  try {
    const whereClause: Prisma.MemberWhereInput = { email };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const existingMember = await prisma.member.findFirst({
      where: whereClause,
    });

    return !!existingMember;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

// Get member statistics
export async function getMemberStats() {
  try {
    const [total, byRole, byGender] = await Promise.all([
      prisma.member.count(),
      prisma.member.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      prisma.member.groupBy({
        by: ['gender'],
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
    console.error('Error fetching member stats:', error);
    throw new Error('Failed to fetch member statistics');
  }
}
