import { Member } from '@/types';

/**
 * Mock data for members
 * This file contains realistic sample data for testing and development purposes
 */
export const members: Member[] = [
  {
    id: 'a1b2c3d4-e5f6-4789-a012-123456789abc',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA',
    },
    birthDate: '1990-01-01',
    baptismDate: '2020-01-01',
    role: 'miembro',
    gender: 'masculino',
    ministerio: 'Ministério A',
    notes: 'Miembro activo y comprometido',
    skills: ['Liderazgo', 'Música'],
  },
  {
    id: 'b2c3d4e5-f6a7-4890-b123-234567890bcd',
    firstName: 'Jesus',
    lastName: 'Martinez',
    email: 'jesus.martinez@example.com',
    phone: '0987654321',
    age: 25,
    address: {
      street: '456 Oak St',
      city: 'Othertown',
      state: 'CA',
      zip: '54321',
      country: 'USA',
    },
    birthDate: '1995-05-15',
    baptismDate: '2021-01-01',
    role: 'supervisor',
    gender: 'masculino',
    ministerio: 'Ministério B',
    notes: 'Supervisor de jóvenes',
    skills: ['Enseñanza', 'Tecnología'],
  },
  {
    id: 'c3d4e5f6-a7b8-4901-c234-345678901cde',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    phone: '5566778899',
    age: 35,
    address: {
      street: '789 Pine St',
      city: 'Somewhere',
      state: 'TX',
      zip: '67890',
      country: 'USA',
    },
    birthDate: '1988-08-20',
    baptismDate: '2019-03-15',
    role: 'lider',
    gender: 'femenino',
    ministerio: 'Ministério de Mujeres',
    notes: 'Líder del ministerio de mujeres',
    skills: ['Liderazgo', 'Consejería'],
  },
  {
    id: 'd4e5f6a7-b8c9-4012-d345-456789012def',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@example.com',
    phone: '3344556677',
    age: 28,
    address: {
      street: '321 Elm St',
      city: 'Anywhere',
      state: 'FL',
      zip: '13579',
      country: 'USA',
    },
    birthDate: '1995-12-10',
    baptismDate: '2022-06-01',
    role: 'anfitrion',
    gender: 'masculino',
    ministerio: 'Hospitalidad',
    notes: 'Nuevo miembro, muy entusiasta',
    skills: ['Hospitalidad', 'Cocina'],
  },
  {
    id: 'e5f6a7b8-c9d0-4123-e456-567890123efa',
    firstName: 'Ana',
    lastName: 'Lopez',
    email: 'ana.lopez@example.com',
    phone: '2233445566',
    age: 42,
    address: {
      street: '654 Maple St',
      city: 'Everywhere',
      state: 'NY',
      zip: '24680',
      country: 'USA',
    },
    birthDate: '1981-03-25',
    baptismDate: '2018-12-25',
    role: 'lider',
    gender: 'femenino',
    ministerio: 'Pastoral',
    notes: 'Pastora asociada',
    skills: ['Predicación', 'Consejería', 'Liderazgo'],
  },
  {
    id: 'f6a7b8c9-d0e1-4234-f567-678901234fga',
    firstName: 'Luis',
    lastName: 'Gomez',
    email: 'luis.gomez@example.com',
    phone: '4455667788',
    age: 22,
    address: {
      street: '556 Cedar St',
      city: 'Anywhere',
      state: 'CA',
      zip: '33445',
      country: 'USA',
    },
    birthDate: '2000-07-15',
    baptismDate: '2023-01-01',
    role: 'miembro',
    gender: 'masculino',
    ministerio: 'Ministério A',
    notes: 'Nuevo miembro',
    skills: ['Hospitalidad', 'Cocina'],
  },
  {
    id: 'g7h8i9j0-k1l2-5345-g678-789012345ghb',
    firstName: 'Sofia',
    lastName: 'Hernandez',
    email: 'sofia.hernandez@example.com',
    phone: '5577889900',
    age: 29,
    address: {
      street: '890 Birch Ave',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'USA',
    },
    birthDate: '1994-11-08',
    baptismDate: '2020-08-15',
    role: 'supervisor',
    gender: 'femenino',
    ministerio: 'Ministério de Niños',
    notes: 'Especialista en educación infantil',
    skills: ['Educación', 'Arte', 'Paciencia'],
  },
  {
    id: 'h8i9j0k1-l2m3-6456-h789-890123456hic',
    firstName: 'Miguel',
    lastName: 'Torres',
    email: 'miguel.torres@example.com',
    phone: '6688990011',
    age: 45,
    address: {
      street: '234 Willow Dr',
      city: 'Austin',
      state: 'TX',
      zip: '73301',
      country: 'USA',
    },
    birthDate: '1978-04-12',
    baptismDate: '2015-06-20',
    role: 'lider',
    gender: 'masculino',
    ministerio: 'Administración',
    notes: 'Encargado de finanzas y administración',
    skills: ['Administración', 'Finanzas', 'Planificación'],
  },
  {
    id: 'i9j0k1l2-m3n4-7567-i890-901234567ijd',
    firstName: 'Carmen',
    lastName: 'Ruiz',
    email: 'carmen.ruiz@example.com',
    phone: '7799001122',
    age: 38,
    address: {
      street: '567 Spruce Ln',
      city: 'Phoenix',
      state: 'AZ',
      zip: '85001',
      country: 'USA',
    },
    birthDate: '1985-09-30',
    baptismDate: '2017-04-10',
    role: 'anfitrion',
    gender: 'femenino',
    ministerio: 'Eventos Especiales',
    notes: 'Coordinadora de eventos y celebraciones',
    skills: ['Organización', 'Decoración', 'Coordinación'],
  },
  {
    id: 'j0k1l2m3-n4o5-8678-j901-012345678jke',
    firstName: 'Roberto',
    lastName: 'Vargas',
    email: 'roberto.vargas@example.com',
    phone: '8800112233',
    age: 33,
    address: {
      street: '678 Aspen Ct',
      city: 'Denver',
      state: 'CO',
      zip: '80201',
      country: 'USA',
    },
    birthDate: '1990-07-22',
    baptismDate: '2019-11-03',
    role: 'miembro',
    gender: 'masculino',
    ministerio: 'Música y Alabanza',
    notes: 'Músico y director del coro',
    skills: ['Música', 'Canto', 'Instrumentos'],
  },
  {
    id: 'k1l2m3n4-o5p6-9789-k012-123456789klf',
    firstName: 'Isabella',
    lastName: 'Morales',
    email: 'isabella.morales@example.com',
    phone: '9911223344',
    age: 26,
    address: {
      street: '789 Redwood St',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'USA',
    },
    birthDate: '1997-02-14',
    baptismDate: '2022-02-14',
    role: 'miembro',
    gender: 'femenino',
    ministerio: 'Medios y Comunicación',
    notes: 'Especialista en redes sociales y comunicación digital',
    skills: ['Diseño Gráfico', 'Redes Sociales', 'Fotografía'],
  },
  {
    id: 'l2m3n4o5-p6q7-0890-l123-234567890lmg',
    firstName: 'Fernando',
    lastName: 'Castro',
    email: 'fernando.castro@example.com',
    phone: '1122334455',
    age: 50,
    address: {
      street: '890 Sequoia Blvd',
      city: 'Sacramento',
      state: 'CA',
      zip: '95814',
      country: 'USA',
    },
    birthDate: '1973-12-05',
    baptismDate: '2010-05-30',
    role: 'lider',
    gender: 'masculino',
    ministerio: 'Pastoral',
    notes: 'Pastor principal de la congregación',
    skills: ['Predicación', 'Liderazgo', 'Consejería', 'Teología'],
  },
];

/**
 * Helper functions for mock data manipulation
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
   * Get total count of members
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
      (member) => member.age >= minAge && member.age <= maxAge
    );
  },

  /**
   * Get members by state/location
   */
  getMembersByState: (state: string): Member[] => {
    return members.filter(
      (member) => member.address?.state?.toLowerCase() === state.toLowerCase()
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
    const ministerios = members.map((member) => member.ministerio);
    return [...new Set(ministerios)].filter(Boolean);
  },

  /**
   * Get all unique skills
   */
  getAllSkills: (): string[] => {
    const allSkills = members.flatMap((member) => member.skills || []);
    return [...new Set(allSkills)].sort();
  },

  /**
   * Get members statistics
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

    const avgAge = Math.round(
      members.reduce((sum, member) => sum + member.age, 0) / totalMembers
    );

    return {
      total: totalMembers,
      byRole: roleStats,
      byGender: genderStats,
      averageAge: avgAge,
      ministerios: mockHelpers.getAllMinisterios().length,
      skills: mockHelpers.getAllSkills().length,
    };
  },

  /**
   * Get paginated members
   */
  getPaginatedMembers: (
    page: number = 1,
    limit: number = 10
  ): {
    members: Member[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  } => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMembers = members.slice(startIndex, endIndex);
    const totalPages = Math.ceil(members.length / limit);

    return {
      members: paginatedMembers,
      pagination: {
        page,
        limit,
        total: members.length,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },

  /**
   * Add a new member (for testing purposes)
   */
  addMember: (newMember: Omit<Member, 'id'>): Member => {
    const member = {
      ...newMember,
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    } as Member;
    members.push(member);
    return member;
  },

  /**
   * Update a member (for testing purposes)
   */
  updateMember: (id: string, updates: Partial<Member>): Member | null => {
    const index = members.findIndex((member) => member.id === id);
    if (index === -1) return null;

    members[index] = { ...members[index], ...updates };
    return members[index];
  },

  /**
   * Delete a member (for testing purposes)
   */
  deleteMember: (id: string): boolean => {
    const index = members.findIndex((member) => member.id === id);
    if (index === -1) return false;

    members.splice(index, 1);
    return true;
  },

  /**
   * Reset members to original data (for testing purposes)
   */
  resetMembers: (): void => {
    // This would require storing the original data separately
    // For now, just a placeholder
    console.log('Reset functionality would restore original mock data');
  },

  /**
   * Advanced search with multiple filters
   */
  advancedSearch: (filters: {
    query?: string;
    role?: Member['role'];
    gender?: Member['gender'];
    ministerio?: string;
    minAge?: number;
    maxAge?: number;
    state?: string;
    skills?: string[];
  }): Member[] => {
    return members.filter((member) => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesText =
          member.firstName.toLowerCase().includes(query) ||
          member.lastName.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query);
        if (!matchesText) return false;
      }

      // Role filter
      if (filters.role && member.role !== filters.role) return false;

      // Gender filter
      if (filters.gender && member.gender !== filters.gender) return false;

      // Ministerio filter
      if (filters.ministerio && member.ministerio !== filters.ministerio)
        return false;

      // Age range filter
      if (filters.minAge && member.age < filters.minAge) return false;
      if (filters.maxAge && member.age > filters.maxAge) return false;

      // State filter
      if (
        filters.state &&
        member.address?.state?.toLowerCase() !== filters.state.toLowerCase()
      )
        return false;

      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        const hasAllSkills = filters.skills.every((skill) =>
          member.skills?.some((memberSkill) =>
            memberSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasAllSkills) return false;
      }

      return true;
    });
  },
};
