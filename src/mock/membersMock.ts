import { Member } from '@/types';

/**
 * Mock data for members with updated structure matching Prisma schema
 */
export const members: Member[] = [
  {
    id: 'a1b2c3d4-e5f6-4789-a012-123456789abc',
    firstName: 'Juan',
    lastName: 'Hernández',
    email: 'juan.hernandez@example.com',
    phone: '5551234567',
    age: 30,
    street: 'Calle Allende 123',
    city: 'Guadalajara',
    state: 'Jalisco',
    zip: '44100',
    country: 'México',
    birthDate: new Date('1990-01-01'),
    baptismDate: new Date('2020-01-01'),
    role: 'MIEMBRO',
    gender: 'MASCULINO',
    ministerio: 'Ministerio A',
    pictureUrl: null,
    notes: 'Miembro activo y comprometido',
    skills: ['Liderazgo', 'Música'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'b2c3d4e5-f6a7-4890-b123-234567890bcd',
    firstName: 'Jesús',
    lastName: 'Martínez',
    email: 'jesus.martinez@example.com',
    phone: '5559876543',
    age: 25,
    street: 'Avenida Reforma 456',
    city: 'Ciudad de México',
    state: 'CDMX',
    zip: '06600',
    country: 'México',
    birthDate: new Date('1995-05-15'),
    baptismDate: new Date('2021-01-01'),
    role: 'SUPERVISOR',
    gender: 'MASCULINO',
    ministerio: 'Ministerio B',
    pictureUrl: null,
    notes: 'Supervisor de jóvenes',
    skills: ['Enseñanza', 'Tecnología'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'c3d4e5f6-a7b8-4901-c234-345678901cde',
    firstName: 'María',
    lastName: 'García',
    email: 'maria.garcia@example.com',
    phone: '5556677889',
    age: 35,
    street: 'Calle Hidalgo 789',
    city: 'Monterrey',
    state: 'Nuevo León',
    zip: '64000',
    country: 'México',
    birthDate: new Date('1988-08-20'),
    baptismDate: new Date('2019-03-15'),
    role: 'LIDER',
    gender: 'FEMENINO',
    ministerio: 'Ministerio de Mujeres',
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
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '5553445566',
    age: 28,
    street: 'Calle Juárez 321',
    city: 'Puebla',
    state: 'Puebla',
    zip: '72000',
    country: 'México',
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
    lastName: 'López',
    email: 'ana.lopez@example.com',
    phone: '5552233445',
    age: 42,
    street: 'Calle 5 de Mayo 654',
    city: 'Mérida',
    state: 'Yucatán',
    zip: '97000',
    country: 'México',
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
  {
    id: 'f6a7b8c9-d0e1-4234-f567-678901234fab',
    firstName: 'Luis',
    lastName: 'González',
    email: 'luis.gonzalez@example.com',
    phone: '5554455667',
    age: 33,
    street: 'Avenida Juárez 987',
    city: 'León',
    state: 'Guanajuato',
    zip: '37000',
    country: 'México',
    birthDate: new Date('1990-07-12'),
    baptismDate: new Date('2019-08-10'),
    role: 'MIEMBRO',
    gender: 'MASCULINO',
    ministerio: 'Ministerio de Alabanza',
    pictureUrl: null,
    notes: 'Músico talentoso',
    skills: ['Música', 'Alabanza'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'a7b8c9d0-e1f2-5345-g678-789012345fbc',
    firstName: 'Sofía',
    lastName: 'Ramírez',
    email: 'sofia.ramirez@example.com',
    phone: '5567788990',
    age: 29,
    street: 'Calle Independencia 159',
    city: 'Querétaro',
    state: 'Querétaro',
    zip: '76000',
    country: 'México',
    birthDate: new Date('1994-11-03'),
    baptismDate: new Date('2020-09-20'),
    role: 'SUPERVISOR',
    gender: 'FEMENINO',
    ministerio: 'Ministerio de Niños',
    pictureUrl: null,
    notes: 'Trabaja con niños de 3 a 5 años',
    skills: ['Enseñanza', 'Paciencia'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'b8c9d0e1-f2a3-6456-h789-890123456fcd',
    firstName: 'Diego',
    lastName: 'Torres',
    email: 'diego.torres@example.com',
    phone: '5545566778',
    age: 38,
    street: 'Calle 16 de Septiembre 753',
    city: 'Toluca',
    state: 'Estado de México',
    zip: '50000',
    country: 'México',
    birthDate: new Date('1985-04-18'),
    baptismDate: new Date('2017-05-30'),
    role: 'LIDER',
    gender: 'MASCULINO',
    ministerio: 'Ministerio de Jóvenes',
    pictureUrl: null,
    notes: 'Líder de adolescentes',
    skills: ['Liderazgo', 'Deportes'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'c9d0e1f2-a3b4-7567-i890-901234567fde',
    firstName: 'Valentina',
    lastName: 'Flores',
    email: 'valentina.flores@example.com',
    phone: '5578899001',
    age: 26,
    street: 'Calle Madero 246',
    city: 'Aguascalientes',
    state: 'Aguascalientes',
    zip: '20000',
    country: 'México',
    birthDate: new Date('1997-02-28'),
    baptismDate: new Date('2021-11-15'),
    role: 'ANFITRION',
    gender: 'FEMENINO',
    ministerio: 'Hospitalidad',
    pictureUrl: null,
    notes: 'Ayuda en la cafetería',
    skills: ['Cocina', 'Servicio'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'd0e1f2a3-b4c5-8678-j901-012345678gef',
    firstName: 'Ricardo',
    lastName: 'Vargas',
    email: 'ricardo.vargas@example.com',
    phone: '5533445566',
    age: 45,
    street: 'Avenida Universidad 852',
    city: 'Morelia',
    state: 'Michoacán',
    zip: '58000',
    country: 'México',
    birthDate: new Date('1978-09-07'),
    baptismDate: new Date('2015-04-12'),
    role: 'MIEMBRO',
    gender: 'MASCULINO',
    ministerio: 'Ministerio de Oración',
    pictureUrl: null,
    notes: 'Intercesor dedicado',
    skills: ['Oración', 'Consejería'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'e1f2a3b4-c5d6-9789-k012-123456789ahg',
    firstName: 'Camila',
    lastName: 'Morales',
    email: 'camila.morales@example.com',
    phone: '5522334455',
    age: 31,
    street: 'Calle Zaragoza 369',
    city: 'Saltillo',
    state: 'Coahuila',
    zip: '25000',
    country: 'México',
    birthDate: new Date('1992-06-14'),
    baptismDate: new Date('2020-03-22'),
    role: 'SUPERVISOR',
    gender: 'FEMENINO',
    ministerio: 'Ministerio de Damas',
    pictureUrl: null,
    notes: 'Coordinadora de damas',
    skills: ['Organización', 'Consejería'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'f2a3b4c5-d6e7-0890-l123-234567890bih',
    firstName: 'Antonio',
    lastName: 'Ortiz',
    email: 'antonio.ortiz@example.com',
    phone: '5566778899',
    age: 50,
    street: 'Boulevard Solidaridad 147',
    city: 'Cancún',
    state: 'Quintana Roo',
    zip: '77500',
    country: 'México',
    birthDate: new Date('1973-01-30'),
    baptismDate: new Date('2016-07-18'),
    role: 'LIDER',
    gender: 'MASCULINO',
    ministerio: 'Ministerio de Hombres',
    pictureUrl: null,
    notes: 'Líder de hombres mayores',
    skills: ['Predicación', 'Liderazgo'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'a3b4c5d6-e7f8-1901-m234-345678901cji',
    firstName: 'Lucía',
    lastName: 'Castillo',
    email: 'lucia.castillo@example.com',
    phone: '5544556677',
    age: 27,
    street: 'Calle Allende 741',
    city: 'Tijuana',
    state: 'Baja California',
    zip: '22000',
    country: 'México',
    birthDate: new Date('1996-10-05'),
    baptismDate: new Date('2022-02-14'),
    role: 'ANFITRION',
    gender: 'FEMENINO',
    ministerio: 'Recepción',
    pictureUrl: null,
    notes: 'Recibe a nuevos visitantes',
    skills: ['Hospitalidad', 'Comunicación'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'b4c5d6e7-f8a9-2012-n345-456789012dkj',
    firstName: 'Miguel',
    lastName: 'Mendoza',
    email: 'miguel.mendoza@example.com',
    phone: '5555667788',
    age: 36,
    street: 'Calle 5 de Febrero 258',
    city: 'Chihuahua',
    state: 'Chihuahua',
    zip: '31000',
    country: 'México',
    birthDate: new Date('1987-12-22'),
    baptismDate: new Date('2019-10-30'),
    role: 'MIEMBRO',
    gender: 'MASCULINO',
    ministerio: 'Ministerio de Música',
    pictureUrl: null,
    notes: 'Toca batería en el equipo de alabanza',
    skills: ['Música', 'Batería'],
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'c5d6e7f8-a9b0-3123-o456-567890123elk',
    firstName: 'Daniela',
    lastName: 'Reyes',
    email: 'daniela.reyes@example.com',
    phone: '5533445566',
    age: 24,
    street: 'Avenida Juárez 654',
    city: 'Hermosillo',
    state: 'Sonora',
    zip: '83000',
    country: 'México',
    birthDate: new Date('1999-07-08'),
    baptismDate: new Date('2023-01-10'),
    role: 'SUPERVISOR',
    gender: 'FEMENINO',
    ministerio: 'Ministerio de Adolescentes',
    pictureUrl: null,
    notes: 'Trabaja con jóvenes de 12 a 17 años',
    skills: ['Enseñanza', 'Música'],
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

    const averageAge =
      members.reduce((sum, member) => sum + (member.age || 0), 0) /
      totalMembers;

    return {
      total: totalMembers,
      roles: roleStats,
      genders: genderStats,
      averageAge: Math.round(averageAge),
    };
  },
};
