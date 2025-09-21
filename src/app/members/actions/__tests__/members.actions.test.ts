import {
  getAllMembers,
  getMembers,
  getMemberBy,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  deactivateMember,
  isEmailTaken,
  getMemberStats,
} from '../members.actions';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@/generated/prisma';
import { generateUUID } from '@/lib/uuid';
import * as bcrypt from 'bcryptjs';
import { MemberFormData } from '@/types';

// Mock the dependencies
jest.mock('@/lib/prisma');
jest.mock('@/lib/uuid');
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockPrisma = {
  member: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  churches: {
    findFirst: jest.fn(),
  },
} as {
  member: {
    findMany: jest.MockedFunction<PrismaClient['member']['findMany']>;
    findFirst: jest.MockedFunction<PrismaClient['member']['findFirst']>;
    findUnique: jest.MockedFunction<PrismaClient['member']['findUnique']>;
    create: jest.MockedFunction<PrismaClient['member']['create']>;
    update: jest.MockedFunction<PrismaClient['member']['update']>;
    delete: jest.MockedFunction<PrismaClient['member']['delete']>;
    count: jest.MockedFunction<PrismaClient['member']['count']>;
    groupBy: jest.MockedFunction<PrismaClient['member']['groupBy']>;
  };
  churches: {
    findFirst: jest.MockedFunction<PrismaClient['churches']['findFirst']>;
  };
};

// Override the prisma import
(prisma as any).member = mockPrisma.member;
(prisma as any).churches = mockPrisma.churches;

const mockGenerateUUID = generateUUID as jest.MockedFunction<
  typeof generateUUID
>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Sample test data
const mockMember = {
  id: 'test-id-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  age: 30,
  street: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  country: 'USA',
  birthDate: new Date('1990-01-01'),
  baptismDate: new Date('2020-01-01'),
  role: 'MIEMBRO' as const,
  gender: 'MASCULINO' as const,
  ministerio: 'Ministerio A',
  pictureUrl: null,
  notes: 'Test notes',
  skills: ['Leadership', 'Music'],
  passwordHash: 'hashedPassword',
  church_id: 'test-church-id',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMemberFormData: MemberFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  age: 30,
  street: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  country: 'USA',
  birthDate: new Date('1990-01-01'),
  baptismDate: new Date('2020-01-01'),
  role: 'MIEMBRO' as const,
  gender: 'MASCULINO' as const,
  ministerio: 'Ministerio A',
  notes: 'Test notes',
  skills: ['Leadership', 'Music'],
  password: 'testPassword123',
};

const mockChurch = {
  id: 'test-church-id',
  name: 'Test Church',
  slug: 'test-church',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Members Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateUUID.mockReturnValue('test-uuid-123');
    (mockBcrypt.hash as any).mockResolvedValue('hashedPassword');
    mockPrisma.churches.findFirst.mockResolvedValue(mockChurch);
  });

  describe('getAllMembers', () => {
    it('should fetch all members with default options', async () => {
      const mockMembers = [mockMember];
      const mockTotal = 1;

      mockPrisma.member.findMany.mockResolvedValue(mockMembers);
      mockPrisma.member.count.mockResolvedValue(mockTotal);

      const result = await getAllMembers();

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith({
        where: {},
        take: 50,
        skip: 0,
        orderBy: { lastName: 'asc' },
      });
      expect(result).toEqual({
        members: mockMembers,
        total: mockTotal,
        hasMore: false,
      });
    });

    it('should handle search filter', async () => {
      mockPrisma.member.findMany.mockResolvedValue([mockMember]);
      mockPrisma.member.count.mockResolvedValue(1);

      await getAllMembers({ search: 'John' });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { firstName: { contains: 'John', mode: 'insensitive' } },
            { lastName: { contains: 'John', mode: 'insensitive' } },
            { email: { contains: 'John', mode: 'insensitive' } },
          ],
        },
        take: 50,
        skip: 0,
        orderBy: { lastName: 'asc' },
      });
    });

    it('should throw error when database fails', async () => {
      mockPrisma.member.findMany.mockRejectedValue(new Error('Database error'));
      await expect(getAllMembers()).rejects.toThrow('Failed to fetch members');
    });
  });

  describe('getMembers', () => {
    it('should fetch members with limit', async () => {
      const mockMembers = [mockMember];
      mockPrisma.member.findMany.mockResolvedValue(mockMembers);

      const result = await getMembers(10);

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith({
        take: 10,
        orderBy: { lastName: 'asc' },
      });
      expect(result).toEqual(mockMembers);
    });

    it('should throw error when database fails', async () => {
      mockPrisma.member.findMany.mockRejectedValue(new Error('Database error'));
      await expect(getMembers(10)).rejects.toThrow('Failed to fetch members');
    });
  });

  describe('getMemberBy', () => {
    it('should fetch member by field', async () => {
      mockPrisma.member.findFirst.mockResolvedValue(mockMember);

      const result = await getMemberBy('email', 'john.doe@example.com');

      expect(mockPrisma.member.findFirst).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
      expect(result).toEqual(mockMember);
    });

    it('should return null when member not found', async () => {
      mockPrisma.member.findFirst.mockResolvedValue(null);

      const result = await getMemberBy('email', 'nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should throw error when database fails', async () => {
      mockPrisma.member.findFirst.mockRejectedValue(
        new Error('Database error')
      );
      await expect(getMemberBy('email', 'test@example.com')).rejects.toThrow(
        'Failed to fetch member'
      );
    });
  });

  describe('createMember', () => {
    it('should create member successfully', async () => {
      mockPrisma.member.create.mockResolvedValue(mockMember);

      const result = await createMember(mockMemberFormData);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('testPassword123', 12);
      expect(mockGenerateUUID).toHaveBeenCalled();
      expect(result).toEqual(mockMember);
    });

    it('should handle unique constraint error', async () => {
      const uniqueError = new Error('Unique constraint failed');
      mockPrisma.member.create.mockRejectedValue(uniqueError);

      await expect(createMember(mockMemberFormData)).rejects.toThrow(
        'A member with this email already exists'
      );
    });
  });

  describe('updateMember', () => {
    it('should update member successfully', async () => {
      const updateData = { firstName: 'Jane' };
      const updatedMember = { ...mockMember, ...updateData };

      mockPrisma.member.findUnique.mockResolvedValue(mockMember);
      mockPrisma.member.update.mockResolvedValue(updatedMember);

      const result = await updateMember('test-id-123', updateData);

      expect(mockPrisma.member.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
      });
      expect(result).toEqual(updatedMember);
    });

    it('should throw error when member not found', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      await expect(
        updateMember('nonexistent-id', { firstName: 'Jane' })
      ).rejects.toThrow('Member not found');
    });
  });

  describe('deleteMember', () => {
    it('should delete member successfully', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(mockMember);
      mockPrisma.member.delete.mockResolvedValue(mockMember);

      const result = await deleteMember('test-id-123');

      expect(result).toEqual({
        success: true,
        message: 'Member deleted successfully',
      });
    });

    it('should throw error when member not found', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);
      await expect(deleteMember('nonexistent-id')).rejects.toThrow(
        'Member not found'
      );
    });
  });

  describe('deactivateMember', () => {
    it('should deactivate member successfully', async () => {
      const deactivatedMember = {
        ...mockMember,
        notes: `DEACTIVATED: ${new Date().toISOString()}`,
      };

      mockPrisma.member.update.mockResolvedValue(deactivatedMember);

      const result = await deactivateMember('test-id-123');

      expect(mockPrisma.member.update).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
        data: { notes: expect.stringContaining('DEACTIVATED:') },
      });
      expect(result).toEqual(deactivatedMember);
    });

    it('should throw error when update fails', async () => {
      mockPrisma.member.update.mockRejectedValue(new Error('Database error'));
      await expect(deactivateMember('nonexistent-id')).rejects.toThrow(
        'Failed to deactivate member'
      );
    });
  });

  describe('getMemberById', () => {
    it('should fetch member by ID', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(mockMember);

      const result = await getMemberById('test-id-123');

      expect(result).toEqual(mockMember);
    });

    it('should throw error when member not found', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);
      await expect(getMemberById('nonexistent-id')).rejects.toThrow(
        'Failed to fetch member'
      );
    });
  });

  describe('isEmailTaken', () => {
    it('should return true when email is taken', async () => {
      mockPrisma.member.findFirst.mockResolvedValue(mockMember);

      const result = await isEmailTaken('john.doe@example.com');

      expect(result).toBe(true);
    });

    it('should return false when email is not taken', async () => {
      mockPrisma.member.findFirst.mockResolvedValue(null);

      const result = await isEmailTaken('available@example.com');

      expect(result).toBe(false);
    });
  });

  describe('getMemberStats', () => {
    it('should return member statistics', async () => {
      const mockByRole = [{ role: 'MIEMBRO' as const, _count: { role: 5 } }] as Awaited<ReturnType<typeof prisma.member.groupBy>>;
      const mockByGender = [{ gender: 'MASCULINO' as const, _count: { gender: 6 } }] as Awaited<ReturnType<typeof prisma.member.groupBy>>;

      mockPrisma.member.count.mockResolvedValue(10);
      mockPrisma.member.groupBy
        .mockResolvedValueOnce(mockByRole)
        .mockResolvedValueOnce(mockByGender);

      const result = await getMemberStats();

      expect(result).toEqual({
        total: 10,
        byRole: { MIEMBRO: 5 },
        byGender: { MASCULINO: 6 },
      });
    });
  });
});
