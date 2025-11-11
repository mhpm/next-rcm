// Import Prisma-generated types - single source of truth
import {
  Churches,
  Members,
  Ministries,
  MemberMinistry,
  MemberRole,
  Gender,
} from "../app/generated/prisma";

// Use Prisma-generated types directly
export type MockChurch = Churches;
export type MockMember = Members;
export type MockMinistry = Ministries;
export type MockMemberMinistry = MemberMinistry;

// Re-export enums for convenience
export { MemberRole, Gender };

// Helper function to generate CUID-like IDs
function generateId(prefix: string): string {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
}

// Mock Churches Data
export const mockChurches: MockChurch[] = [
  {
    id: "clm1church001",
    name: "Iglesia Cristiana Maranatha",
    slug: "maranatha-cdmx",
    createdAt: new Date("2020-01-15"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "clm2church002",
    name: "Centro Cristiano Vida Nueva",
    slug: "vida-nueva-guadalajara",
    createdAt: new Date("2018-03-20"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "clm3church003",
    name: "Iglesia Bautista Emanuel",
    slug: "emanuel-monterrey",
    createdAt: new Date("2015-07-10"),
    updatedAt: new Date("2024-10-30"),
  },
];

// Mock Members Data
export const mockMembers: MockMember[] = [
  // Iglesia Cristiana Maranatha Members
  {
    id: "clm1member001",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@maranatha.org",
    phone: "+52 55 1234 5678",
    age: 45,
    street: "Av. Insurgentes Sur 1234",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "03100",
    country: "México",
    birthDate: new Date("1979-03-15"),
    baptismDate: new Date("2005-06-12"),
    role: "PASTOR" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    notes: "Pastor principal con 15 años de experiencia ministerial",
    passwordHash: "$2b$10$example.hash.for.carlos",
    church_id: "clm1church001",
    createdAt: new Date("2020-01-15"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "clm1member002",
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@maranatha.org",
    phone: "+52 55 2345 6789",
    age: 38,
    street: "Calle Reforma 567",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "06600",
    country: "México",
    birthDate: new Date("1986-07-22"),
    baptismDate: new Date("2008-04-20"),
    role: "LIDER" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    notes: "Líder del ministerio de mujeres y alabanza",
    passwordHash: "$2b$10$example.hash.for.maria",
    church_id: "clm1church001",
    createdAt: new Date("2020-02-01"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "clm1member003",
    firstName: "José",
    lastName: "Martínez",
    email: "jose.martinez@maranatha.org",
    phone: "+52 55 3456 7890",
    age: 52,
    street: "Av. Universidad 890",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "04510",
    country: "México",
    birthDate: new Date("1972-11-08"),
    baptismDate: new Date("2010-09-15"),
    role: "TESORERO" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    notes: "Contador público, maneja las finanzas de la iglesia",
    passwordHash: "$2b$10$example.hash.for.jose",
    church_id: "clm1church001",
    createdAt: new Date("2020-03-10"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "clm1member004",
    firstName: "Ana",
    lastName: "López",
    email: "ana.lopez@maranatha.org",
    phone: "+52 55 4567 8901",
    age: 29,
    street: "Calle Madero 123",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "06000",
    country: "México",
    birthDate: new Date("1995-05-14"),
    baptismDate: new Date("2018-12-25"),
    role: "SUPERVISOR" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    notes: "Supervisora del ministerio juvenil",
    passwordHash: "$2b$10$example.hash.for.ana",
    church_id: "clm1church001",
    createdAt: new Date("2020-04-05"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "clm1member005",
    firstName: "Pedro",
    lastName: "Sánchez",
    email: "pedro.sanchez@maranatha.org",
    phone: "+52 55 5678 9012",
    age: 41,
    street: "Av. Revolución 456",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01030",
    country: "México",
    birthDate: new Date("1983-09-30"),
    baptismDate: new Date("2015-03-08"),
    role: "ANFITRION" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    notes: "Anfitrión de grupos pequeños en su hogar",
    passwordHash: "$2b$10$example.hash.for.pedro",
    church_id: "clm1church001",
    createdAt: new Date("2020-05-20"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "clm1member006",
    firstName: "Lucía",
    lastName: "Hernández",
    email: "lucia.hernandez@maranatha.org",
    phone: "+52 55 6789 0123",
    age: 26,
    street: "Calle Juárez 789",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "06050",
    country: "México",
    birthDate: new Date("1998-12-03"),
    baptismDate: new Date("2022-08-14"),
    role: "MIEMBRO" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    notes: "Nueva en la fe, muy entusiasta",
    passwordHash: "$2b$10$example.hash.for.lucia",
    church_id: "clm1church001",
    createdAt: new Date("2022-01-10"),
    updatedAt: new Date("2024-10-30"),
  },

  // Centro Cristiano Vida Nueva Members
  {
    id: "clm2member001",
    firstName: "Roberto",
    lastName: "Morales",
    email: "roberto.morales@vidanueva.org",
    phone: "+52 33 1234 5678",
    age: 48,
    street: "Av. Chapultepec 1001",
    city: "Guadalajara",
    state: "Jalisco",
    zip: "44100",
    country: "México",
    birthDate: new Date("1976-01-25"),
    baptismDate: new Date("2000-05-30"),
    role: "PASTOR" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    notes: "Pastor fundador de la iglesia",
    passwordHash: "$2b$10$example.hash.for.roberto",
    church_id: "clm2church002",
    createdAt: new Date("2018-03-20"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "clm2member002",
    firstName: "Carmen",
    lastName: "Jiménez",
    email: "carmen.jimenez@vidanueva.org",
    phone: "+52 33 2345 6789",
    age: 44,
    street: "Calle López Cotilla 234",
    city: "Guadalajara",
    state: "Jalisco",
    zip: "44140",
    country: "México",
    birthDate: new Date("1980-08-17"),
    baptismDate: new Date("2002-11-10"),
    role: "LIDER" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    notes: "Líder de intercesión y oración",
    passwordHash: "$2b$10$example.hash.for.carmen",
    church_id: "clm2church002",
    createdAt: new Date("2018-04-15"),
    updatedAt: new Date("2024-10-30"),
  },

  // Iglesia Bautista Emanuel Members
  {
    id: "clm3member001",
    firstName: "Miguel",
    lastName: "Torres",
    email: "miguel.torres@emanuel.org",
    phone: "+52 81 1234 5678",
    age: 39,
    street: "Av. Constitución 567",
    city: "Monterrey",
    state: "Nuevo León",
    zip: "64000",
    country: "México",
    birthDate: new Date("1985-04-12"),
    baptismDate: new Date("2010-07-18"),
    role: "PASTOR" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    notes: "Pastor con énfasis en enseñanza bíblica",
    passwordHash: "$2b$10$example.hash.for.miguel",
    church_id: "clm3church003",
    createdAt: new Date("2015-07-10"),
    updatedAt: new Date("2024-10-30"),
  },
];

// Mock Ministries Data
export const mockMinistries: MockMinistry[] = [
  // Emanuel Church Ministries
  {
    id: "clm1ministry001",
    name: "Alabanza y Adoración",
    description:
      "Ministerio encargado de la música y adoración en los servicios",
    church_id: "clm1church001",
    createdAt: new Date("2023-01-16T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },
  {
    id: "clm1ministry002",
    name: "Ministerio Juvenil",
    description: "Ministerio dedicado a los jóvenes de 13 a 25 años",
    church_id: "clm1church001",
    createdAt: new Date("2023-01-17T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },
  {
    id: "clm1ministry003",
    name: "Ministerio de Mujeres",
    description: "Ministerio para el crecimiento espiritual de las mujeres",
    church_id: "clm1church001",
    createdAt: new Date("2023-01-18T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },
  {
    id: "clm1ministry004",
    name: "Grupos Pequeños",
    description: "Ministerio de células y grupos de crecimiento en hogares",
    church_id: "clm1church001",
    createdAt: new Date("2023-01-19T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },
  {
    id: "clm1ministry005",
    name: "Ministerio de Niños",
    description: "Ministerio dedicado a la enseñanza y cuidado de los niños",
    church_id: "clm1church001",
    createdAt: new Date("2023-01-20T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },

  // Vida Nueva Church Ministries
  {
    id: "clm2ministry001",
    name: "Evangelismo",
    description: "Ministerio enfocado en la evangelización y misiones",
    church_id: "clm2church002",
    createdAt: new Date("2023-02-21T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },
  {
    id: "clm2ministry002",
    name: "Intercesión",
    description:
      "Ministerio de oración e intercesión por la iglesia y la ciudad",
    church_id: "clm2church002",
    createdAt: new Date("2023-02-22T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },
  {
    id: "clm2ministry003",
    name: "Ministerio de Parejas",
    description: "Ministerio para el fortalecimiento de matrimonios",
    church_id: "clm2church002",
    createdAt: new Date("2023-02-23T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },

  // El Buen Pastor Church Ministries
  {
    id: "clm3ministry001",
    name: "Escuela Bíblica",
    description: "Ministerio de enseñanza bíblica sistemática",
    church_id: "clm3church003",
    createdAt: new Date("2023-03-11T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },
  {
    id: "clm3ministry002",
    name: "Ministerio de Ancianos",
    description: "Ministerio para el cuidado pastoral de los adultos mayores",
    church_id: "clm3church003",
    createdAt: new Date("2023-03-12T10:00:00Z"),
    updatedAt: new Date("2024-10-30T10:00:00Z"),
  },
];

// Mock Member-Ministry Relationships
export const mockMemberMinistries: MockMemberMinistry[] = [
  // Emanuel Church Member-Ministry relationships
  {
    id: "clm1mm001",
    memberId: "clm1member001", // Carlos (Pastor)
    ministryId: "clm1ministry001", // Alabanza y Adoración
    church_id: "clm1church001",
    createdAt: new Date("2023-01-16T11:00:00Z"),
    updatedAt: new Date("2024-10-30T11:00:00Z"),
  },
  {
    id: "clm1mm002",
    memberId: "clm1member002", // María (Líder)
    ministryId: "clm1ministry001", // Alabanza y Adoración
    church_id: "clm1church001",
    createdAt: new Date("2023-01-20T12:00:00Z"),
    updatedAt: new Date("2024-10-30T12:00:00Z"),
  },
  {
    id: "clm1mm003",
    memberId: "clm1member002", // María (Líder)
    ministryId: "clm1ministry003", // Ministerio de Mujeres
    church_id: "clm1church001",
    createdAt: new Date("2023-01-20T12:30:00Z"),
    updatedAt: new Date("2024-10-30T12:30:00Z"),
  },
  {
    id: "clm1mm004",
    memberId: "clm1member004", // Ana (Supervisora)
    ministryId: "clm1ministry002", // Ministerio Juvenil
    church_id: "clm1church001",
    createdAt: new Date("2023-02-15T15:00:00Z"),
    updatedAt: new Date("2024-10-30T15:00:00Z"),
  },
  {
    id: "clm1mm005",
    memberId: "clm1member005", // Pedro (Anfitrión)
    ministryId: "clm1ministry004", // Grupos Pequeños
    church_id: "clm1church001",
    createdAt: new Date("2023-03-01T17:00:00Z"),
    updatedAt: new Date("2024-10-30T17:00:00Z"),
  },
  {
    id: "clm1mm006",
    memberId: "clm1member006", // Lucía (Miembro)
    ministryId: "clm1ministry005", // Ministerio de Niños
    church_id: "clm1church001",
    createdAt: new Date("2023-08-01T13:00:00Z"),
    updatedAt: new Date("2024-10-30T13:00:00Z"),
  },
  {
    id: "clm1mm007",
    memberId: "clm1member006", // Lucía (Miembro)
    ministryId: "clm1ministry002", // Ministerio Juvenil
    church_id: "clm1church001",
    createdAt: new Date("2023-08-01T13:30:00Z"),
    updatedAt: new Date("2024-10-30T13:30:00Z"),
  },

  // Vida Nueva Church Member-Ministry relationships
  {
    id: "clm2mm001",
    memberId: "clm2member001", // Roberto (Pastor)
    ministryId: "clm2ministry001", // Evangelismo
    church_id: "clm2church002",
    createdAt: new Date("2023-02-20T11:30:00Z"),
    updatedAt: new Date("2024-10-30T11:30:00Z"),
  },
  {
    id: "clm2mm002",
    memberId: "clm2member002", // Carmen (Líder)
    ministryId: "clm2ministry002", // Intercesión
    church_id: "clm2church002",
    createdAt: new Date("2023-02-25T12:00:00Z"),
    updatedAt: new Date("2024-10-30T12:00:00Z"),
  },
  {
    id: "clm2mm003",
    memberId: "clm2member002", // Carmen (Líder)
    ministryId: "clm2ministry003", // Ministerio de Parejas
    church_id: "clm2church002",
    createdAt: new Date("2023-02-25T12:30:00Z"),
    updatedAt: new Date("2024-10-30T12:30:00Z"),
  },

  // El Buen Pastor Church Member-Ministry relationships
  {
    id: "clm3mm001",
    memberId: "clm3member001", // Miguel (Pastor)
    ministryId: "clm3ministry001", // Escuela Bíblica
    church_id: "clm3church003",
    createdAt: new Date("2023-03-10T11:30:00Z"),
    updatedAt: new Date("2024-10-30T11:30:00Z"),
  },
  {
    id: "clm3mm002",
    memberId: "clm3member001", // Miguel (Pastor)
    ministryId: "clm3ministry002", // Ministerio de Ancianos
    church_id: "clm3church003",
    createdAt: new Date("2023-03-10T12:00:00Z"),
    updatedAt: new Date("2024-10-30T12:00:00Z"),
  },
];

// Export all mock data
export const mockData = {
  churches: mockChurches,
  members: mockMembers,
  ministries: mockMinistries,
  memberMinistries: mockMemberMinistries,
};

// Helper functions for working with mock data
export const getMembersByChurch = (churchId: string) =>
  mockMembers.filter((member) => member.church_id === churchId);

export const getMinistriesByChurch = (churchId: string) =>
  mockMinistries.filter((ministry) => ministry.church_id === churchId);

export const getMemberMinistries = (memberId: string) =>
  mockMemberMinistries.filter((mm) => mm.memberId === memberId);

export const getMinistryMembers = (ministryId: string) =>
  mockMemberMinistries.filter((mm) => mm.ministryId === ministryId);

export const getChurchStats = (churchId: string) => {
  const members = getMembersByChurch(churchId);
  const ministries = getMinistriesByChurch(churchId);

  return {
    totalMembers: members.length,
    totalMinistries: ministries.length,
    membersByRole: {
      pastores: members.filter((m) => m.role === "PASTOR").length,
      lideres: members.filter((m) => m.role === "LIDER").length,
      supervisores: members.filter((m) => m.role === "SUPERVISOR").length,
      anfitriones: members.filter((m) => m.role === "ANFITRION").length,
      tesoreros: members.filter((m) => m.role === "TESORERO").length,
      miembros: members.filter((m) => m.role === "MIEMBRO").length,
    },
    membersByGender: {
      masculino: members.filter((m) => m.gender === "MASCULINO").length,
      femenino: members.filter((m) => m.gender === "FEMENINO").length,
    },
    averageAge:
      members.reduce((sum, m) => sum + (m.age || 0), 0) / members.length,
  };
};

export default mockData;
