import { Member } from '@/types';

/**
 * Mock data for members with updated structure matching Prisma schema
 */
export const members: Member[] = [
  {
    id: 'a1b2c3d4-e5f6-4789-a012-123456789abc',
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
    role: 'MIEMBRO',
    gender: 'MASCULINO',
    ministerio: 'Ministério A',
    pictureUrl: null,
    notes: 'Miembro activo y comprometido',
    skills: ['Liderazgo', 'Música'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'b2c3d4e5-f6a7-4890-b123-234567890bcd',
    firstName: 'Jesus',
    lastName: 'Martinez',
    email: 'jesus.martinez@example.com',
    phone: '0987654321',
    age: 25,
    street: '456 Oak St',
    city: 'Othertown',
    state: 'CA',
    zip: '54321',
    country: 'USA',
    birthDate: new Date('1995-05-15'),
    baptismDate: new Date('2021-01-01'),
    role: 'SUPERVISOR',
    gender: 'MASCULINO',
    ministerio: 'Ministério B',
    pictureUrl: null,
    notes: 'Supervisor de jóvenes',
    skills: ['Enseñanza', 'Tecnología'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'c3d4e5f6-a7b8-4901-c234-345678901cde',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    phone: '5566778899',
    age: 35,
    street: '789 Pine St',
    city: 'Somewhere',
    state: 'TX',
    zip: '67890',
    country: 'USA',
    birthDate: new Date('1988-08-20'),
    baptismDate: new Date('2019-03-15'),
    role: 'LIDER',
    gender: 'FEMENINO',
    ministerio: 'Ministério de Mujeres',
    pictureUrl: null,
    notes: 'Líder del ministerio de mujeres',
    skills: ['Enseñanza', 'Consejería'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'd4e5f6a7-b8c9-4012-d345-456789012def',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@example.com',
    phone: '3344556677',
    age: 28,
    street: '321 Elm St',
    city: 'Anywhere',
    state: 'FL',
    zip: '13579',
    country: 'USA',
    birthDate: new Date('1995-12-10'),
    baptismDate: new Date('2022-06-01'),
    role: 'ANFITRION',
    gender: 'MASCULINO',
    ministerio: 'Hospitalidad',
    pictureUrl: null,
    notes: 'Nuevo miembro, muy entusiasta',
    skills: ['Hospitalidad', 'Cocina'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'e5f6a7b8-c9d0-4123-e456-567890123efa',
    firstName: 'Ana',
    lastName: 'Lopez',
    email: 'ana.lopez@example.com',
    phone: '2233445566',
    age: 42,
    street: '654 Maple St',
    city: 'Everywhere',
    state: 'NY',
    zip: '24680',
    country: 'USA',
    birthDate: new Date('1981-03-25'),
    baptismDate: new Date('2018-12-25'),
    role: 'LIDER',
    gender: 'FEMENINO',
    ministerio: 'Pastoral',
    pictureUrl: null,
    notes: 'Pastora asociada',
    skills: ['Predicación', 'Consejería', 'Liderazgo'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Helper functions for working with mock member data
 */
export const mockHelpers = {
  /**
   * Get member by ID
   */
  getMemberById: (id: string): Member | undefined => {
    return members.find((member) => member.id === id);
  },

  /**
   * Get members by role
   */
  getMembersByRole: (role: Member['role']): Member[] => {
    return members.filter((member) => member.role === role);
  },

  /**
   * Get members by ministerio
   */
  getMembersByMinisterio: (ministerio: string): Member[] => {
    return members.filter((member) => member.ministerio === ministerio);
  },

  /**
   * Get total number of members
   */
  getTotalMembers: (): number => {
    return members.length;
  },

  /**
   * Search members by name or email
   */
  searchMembers: (query: string): Member[] => {
    const lowercaseQuery = query.toLowerCase();
    return members.filter(
      (member) =>
        member.firstName.toLowerCase().includes(lowercaseQuery) ||
        member.lastName.toLowerCase().includes(lowercaseQuery) ||
        member.email.toLowerCase().includes(lowercaseQuery)
    );
  },

  /**
   * Get members by gender
   */
  getMembersByGender: (gender: Member['gender']): Member[] => {
    return members.filter((member) => member.gender === gender);
  },

  /**
   * Get members by age range
   */
  getMembersByAgeRange: (minAge: number, maxAge: number): Member[] => {
    return members.filter(
      (member) => member.age && member.age >= minAge && member.age <= maxAge
    );
  },

  /**
   * Get members by state/location
   */
  getMembersByState: (state: string): Member[] => {
    return members.filter(
      (member) => member.state?.toLowerCase() === state.toLowerCase()
    );
  },

  /**
   * Get members with specific skills
   */
  getMembersBySkill: (skill: string): Member[] => {
    return members.filter((member) =>
      member.skills?.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    );
  },

  /**
   * Get all unique ministerios
   */
  getAllMinisterios: (): string[] => {
    return [...new Set(members.map((member) => member.ministerio))];
  },

  /**
   * Get all unique skills
   */
  getAllSkills: (): string[] => {
    const allSkills = members.flatMap((member) => member.skills || []);
    return [...new Set(allSkills)];
  },

  /**
   * Get member statistics
   */
  getMemberStats: () => {
    const totalMembers = members.length;
    const roleStats = members.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const genderStats = members.reduce((acc, member) => {
      acc[member.gender] = (acc[member.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageAge = members.reduce((sum, member) => sum + (member.age || 0), 0) / totalMembers;

    return {
      total: totalMembers,
      roles: roleStats,
      genders: genderStats,
      averageAge: Math.round(averageAge),
    };
  },
};
