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
// Make leader_id optional for mocks to avoid updating all fixtures
export type MockMinistry = Omit<Ministries, "leader_id"> & { leader_id?: string | null };
export type MockMemberMinistry = MemberMinistry;

// Re-export enums for convenience
export { MemberRole, Gender };

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
  // Nuevo tenant de demostración
  {
    id: "clm4church004",
    name: "Iglesia Demo",
    slug: "demo",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-11-01"),
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

  // Iglesia Demo Members (20)
  {
    id: "clm4member001",
    firstName: "Andrea",
    lastName: "Pérez",
    email: "andrea.perez@demo.org",
    phone: "+52 55 1000 0001",
    age: 34,
    street: "Calle Demo 101",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1990-02-14"),
    baptismDate: new Date("2012-08-12"),
    role: "PASTOR" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    notes: "Pastora principal del tenant demo",
    passwordHash: "$2b$10$example.hash.for.andrea",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member002",
    firstName: "Javier",
    lastName: "Guzmán",
    email: "javier.guzman@demo.org",
    phone: "+52 55 1000 0002",
    age: 29,
    street: "Calle Demo 102",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1995-06-21"),
    baptismDate: new Date("2018-05-10"),
    role: "LIDER" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    notes: "Líder de jóvenes",
    passwordHash: "$2b$10$example.hash.for.javier",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member003",
    firstName: "Sofía",
    lastName: "Ramírez",
    email: "sofia.ramirez@demo.org",
    phone: "+52 55 1000 0003",
    age: 27,
    street: "Calle Demo 103",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1997-11-03"),
    baptismDate: new Date("2015-12-25"),
    role: "SUPERVISOR" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    notes: "Supervisora de discipulado",
    passwordHash: "$2b$10$example.hash.for.sofia",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member004",
    firstName: "Daniel",
    lastName: "Ortiz",
    email: "daniel.ortiz@demo.org",
    phone: "+52 55 1000 0004",
    age: 42,
    street: "Calle Demo 104",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1982-04-10"),
    baptismDate: new Date("2001-09-09"),
    role: "TESORERO" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    notes: "Responsable de finanzas",
    passwordHash: "$2b$10$example.hash.for.daniel",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member005",
    firstName: "Paola",
    lastName: "Santos",
    email: "paola.santos@demo.org",
    phone: "+52 55 1000 0005",
    age: 31,
    street: "Calle Demo 105",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1993-08-02"),
    baptismDate: new Date("2013-04-13"),
    role: "ANFITRION" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    notes: "Anfitriona de grupos hogares",
    passwordHash: "$2b$10$example.hash.for.paola",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member006",
    firstName: "Hugo",
    lastName: "Nava",
    email: "hugo.nava@demo.org",
    phone: "+52 55 1000 0006",
    age: 24,
    street: "Calle Demo 106",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("2000-05-22"),
    baptismDate: new Date("2020-06-10"),
    role: "MIEMBRO" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    notes: "Estudiante universitario",
    passwordHash: "$2b$10$example.hash.for.hugo",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member007",
    firstName: "Valeria",
    lastName: "Montes",
    email: "valeria.montes@demo.org",
    phone: "+52 55 1000 0007",
    age: 36,
    street: "Calle Demo 107",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1988-01-19"),
    baptismDate: new Date("2010-03-14"),
    role: "LIDER" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    notes: "Líder de hospitalidad",
    passwordHash: "$2b$10$example.hash.for.valeria",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member008",
    firstName: "Emilio",
    lastName: "Cárdenas",
    email: "emilio.cardenas@demo.org",
    phone: "+52 55 1000 0008",
    age: 28,
    street: "Calle Demo 108",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1996-03-11"),
    baptismDate: new Date("2016-10-02"),
    role: "MIEMBRO" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    notes: "Baterista del equipo de alabanza",
    passwordHash: "$2b$10$example.hash.for.emilio",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member009",
    firstName: "Alejandra",
    lastName: "Vega",
    email: "alejandra.vega@demo.org",
    phone: "+52 55 1000 0009",
    age: 33,
    street: "Calle Demo 109",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1991-09-30"),
    baptismDate: new Date("2012-01-01"),
    role: "SUPERVISOR" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    notes: "Supervisora de ujieres",
    passwordHash: "$2b$10$example.hash.for.alejandra",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member010",
    firstName: "Ricardo",
    lastName: "Serrano",
    email: "ricardo.serrano@demo.org",
    phone: "+52 55 1000 0010",
    age: 40,
    street: "Calle Demo 110",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1984-12-12"),
    baptismDate: new Date("2004-07-07"),
    role: "ANFITRION" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    notes: "Anfitrión de células en su empresa",
    passwordHash: "$2b$10$example.hash.for.ricardo",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member011",
    firstName: "Carolina",
    lastName: "Medina",
    email: "carolina.medina@demo.org",
    phone: "+52 55 1000 0011",
    age: 26,
    street: "Calle Demo 111",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1998-07-04"),
    baptismDate: new Date("2018-09-09"),
    role: "MIEMBRO" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    notes: "Diseñadora gráfica",
    passwordHash: "$2b$10$example.hash.for.carolina",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member012",
    firstName: "Fernando",
    lastName: "Ríos",
    email: "fernando.rios@demo.org",
    phone: "+52 55 1000 0012",
    age: 37,
    street: "Calle Demo 112",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1987-03-30"),
    baptismDate: new Date("2007-05-20"),
    role: "TESORERO" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    notes: "Apoya en administración",
    passwordHash: "$2b$10$example.hash.for.fernando",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member013",
    firstName: "Beatriz",
    lastName: "Campos",
    email: "beatriz.campos@demo.org",
    phone: "+52 55 1000 0013",
    age: 22,
    street: "Calle Demo 113",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("2002-11-20"),
    baptismDate: new Date("2021-03-03"),
    role: "MIEMBRO" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    notes: "Universitaria, apoyo en comunicación",
    passwordHash: "$2b$10$example.hash.for.beatriz",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member014",
    firstName: "Luis",
    lastName: "Pacheco",
    email: "luis.pacheco@demo.org",
    phone: "+52 55 1000 0014",
    age: 30,
    street: "Calle Demo 114",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1994-04-18"),
    baptismDate: new Date("2010-10-10"),
    role: "ANFITRION" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    notes: "Anfitrión y ujier",
    passwordHash: "$2b$10$example.hash.for.luis",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member015",
    firstName: "Marisol",
    lastName: "Aguilar",
    email: "marisol.aguilar@demo.org",
    phone: "+52 55 1000 0015",
    age: 35,
    street: "Calle Demo 115",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1989-09-09"),
    baptismDate: new Date("2008-08-08"),
    role: "SUPERVISOR" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    notes: "Supervisora de Escuela Dominical",
    passwordHash: "$2b$10$example.hash.for.marisol",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member016",
    firstName: "Óscar",
    lastName: "Salinas",
    email: "oscar.salinas@demo.org",
    phone: "+52 55 1000 0016",
    age: 27,
    street: "Calle Demo 116",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1997-01-01"),
    baptismDate: new Date("2014-04-04"),
    role: "MIEMBRO" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    notes: "Operador de audio",
    passwordHash: "$2b$10$example.hash.for.oscar",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member017",
    firstName: "Teresa",
    lastName: "Navarro",
    email: "teresa.navarro@demo.org",
    phone: "+52 55 1000 0017",
    age: 41,
    street: "Calle Demo 117",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1983-05-05"),
    baptismDate: new Date("1999-09-09"),
    role: "LIDER" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    notes: "Líder de oración",
    passwordHash: "$2b$10$example.hash.for.teresa",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member018",
    firstName: "Mauricio",
    lastName: "Flores",
    email: "mauricio.flores@demo.org",
    phone: "+52 55 1000 0018",
    age: 32,
    street: "Calle Demo 118",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1992-02-02"),
    baptismDate: new Date("2011-11-11"),
    role: "MIEMBRO" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    notes: "Participa en evangelismo",
    passwordHash: "$2b$10$example.hash.for.mauricio",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member019",
    firstName: "Nadia",
    lastName: "Reyes",
    email: "nadia.reyes@demo.org",
    phone: "+52 55 1000 0019",
    age: 25,
    street: "Calle Demo 119",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1999-10-10"),
    baptismDate: new Date("2018-08-18"),
    role: "MIEMBRO" as MemberRole,
    gender: "FEMENINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    notes: "Canta en el coro",
    passwordHash: "$2b$10$example.hash.for.nadia",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "clm4member020",
    firstName: "Iván",
    lastName: "Castillo",
    email: "ivan.castillo@demo.org",
    phone: "+52 55 1000 0020",
    age: 38,
    street: "Calle Demo 120",
    city: "Ciudad de México",
    state: "CDMX",
    zip: "01010",
    country: "México",
    birthDate: new Date("1986-06-06"),
    baptismDate: new Date("2005-05-05"),
    role: "ANFITRION" as MemberRole,
    gender: "MASCULINO" as Gender,
    pictureUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    notes: "Anfitrión y apoyo en tecnología",
    passwordHash: "$2b$10$example.hash.for.ivan",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-11-01"),
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

  // Demo Church Ministries (15)
  {
    id: "clm4ministry001",
    name: "Bienvenida",
    description: "Equipo de bienvenida y recepción",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:00:00Z"),
    updatedAt: new Date("2024-11-01T10:00:00Z"),
  },
  {
    id: "clm4ministry002",
    name: "Ujieres",
    description: "Orden y apoyo durante los servicios",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:05:00Z"),
    updatedAt: new Date("2024-11-01T10:05:00Z"),
  },
  {
    id: "clm4ministry003",
    name: "Hospitalidad",
    description: "Atención a visitantes y nuevos miembros",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:10:00Z"),
    updatedAt: new Date("2024-11-01T10:10:00Z"),
  },
  {
    id: "clm4ministry004",
    name: "Comunicación",
    description: "Redes sociales y comunicación",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:15:00Z"),
    updatedAt: new Date("2024-11-01T10:15:00Z"),
  },
  {
    id: "clm4ministry005",
    name: "Tecnología",
    description: "Soporte técnico y multimedia",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:20:00Z"),
    updatedAt: new Date("2024-11-01T10:20:00Z"),
  },
  {
    id: "clm4ministry006",
    name: "Producción",
    description: "Operación de audio, video y transmisión",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:25:00Z"),
    updatedAt: new Date("2024-11-01T10:25:00Z"),
  },
  {
    id: "clm4ministry007",
    name: "Alabanza",
    description: "Música y adoración",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:30:00Z"),
    updatedAt: new Date("2024-11-01T10:30:00Z"),
  },
  {
    id: "clm4ministry008",
    name: "Oración",
    description: "Intercesión y cadenas de oración",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:35:00Z"),
    updatedAt: new Date("2024-11-01T10:35:00Z"),
  },
  {
    id: "clm4ministry009",
    name: "Evangelismo",
    description: "Alcance y predicación del evangelio",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:40:00Z"),
    updatedAt: new Date("2024-11-01T10:40:00Z"),
  },
  {
    id: "clm4ministry010",
    name: "Misiones",
    description: "Apoyo a misioneros y viajes",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:45:00Z"),
    updatedAt: new Date("2024-11-01T10:45:00Z"),
  },
  {
    id: "clm4ministry011",
    name: "Escuela Dominical",
    description: "Niños y formación bíblica",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:50:00Z"),
    updatedAt: new Date("2024-11-01T10:50:00Z"),
  },
  {
    id: "clm4ministry012",
    name: "Jóvenes",
    description: "Grupo de jóvenes 13-25",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T10:55:00Z"),
    updatedAt: new Date("2024-11-01T10:55:00Z"),
  },
  {
    id: "clm4ministry013",
    name: "Matrimonios",
    description: "Fortalecimiento de matrimonios",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T11:00:00Z"),
    updatedAt: new Date("2024-11-01T11:00:00Z"),
  },
  {
    id: "clm4ministry014",
    name: "Discipulado",
    description: "Formación y mentoreo",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T11:05:00Z"),
    updatedAt: new Date("2024-11-01T11:05:00Z"),
  },
  {
    id: "clm4ministry015",
    name: "Media",
    description: "Fotografía y redes",
    church_id: "clm4church004",
    createdAt: new Date("2024-01-22T11:10:00Z"),
    updatedAt: new Date("2024-11-01T11:10:00Z"),
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

  // Relaciones Demo Church
  // Nota: dejamos 5 miembros sin ministerio (006, 008, 011, 018, 020)
  {
    id: "clm4mm001",
    memberId: "clm4member001", // Andrea (Pastora)
    ministryId: "clm4ministry007", // Alabanza
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:00:00Z"),
    updatedAt: new Date("2024-11-01T11:00:00Z"),
  },
  {
    id: "clm4mm002",
    memberId: "clm4member002", // Javier (Líder)
    ministryId: "clm4ministry012", // Jóvenes
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:05:00Z"),
    updatedAt: new Date("2024-11-01T11:05:00Z"),
  },
  {
    id: "clm4mm003",
    memberId: "clm4member003", // Sofía (Supervisora)
    ministryId: "clm4ministry014", // Discipulado
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:10:00Z"),
    updatedAt: new Date("2024-11-01T11:10:00Z"),
  },
  {
    id: "clm4mm004",
    memberId: "clm4member004", // Daniel (Tesorero)
    ministryId: "clm4ministry005", // Tecnología
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:15:00Z"),
    updatedAt: new Date("2024-11-01T11:15:00Z"),
  },
  {
    id: "clm4mm005",
    memberId: "clm4member005", // Paola (Anfitriona)
    ministryId: "clm4ministry003", // Hospitalidad
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:20:00Z"),
    updatedAt: new Date("2024-11-01T11:20:00Z"),
  },
  {
    id: "clm4mm006",
    memberId: "clm4member007", // Valeria (Líder)
    ministryId: "clm4ministry003", // Hospitalidad
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:25:00Z"),
    updatedAt: new Date("2024-11-01T11:25:00Z"),
  },
  {
    id: "clm4mm007",
    memberId: "clm4member007", // Valeria (Líder)
    ministryId: "clm4ministry002", // Ujieres
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:26:00Z"),
    updatedAt: new Date("2024-11-01T11:26:00Z"),
  },

  {
    id: "clm4mm009",
    memberId: "clm4member009", // Alejandra (Supervisora)
    ministryId: "clm4ministry002", // Ujieres
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:35:00Z"),
    updatedAt: new Date("2024-11-01T11:35:00Z"),
  },
  {
    id: "clm4mm010",
    memberId: "clm4member010", // Ricardo (Anfitrión)
    ministryId: "clm4ministry001", // Bienvenida
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:40:00Z"),
    updatedAt: new Date("2024-11-01T11:40:00Z"),
  },
  {
    id: "clm4mm011",
    memberId: "clm4member012", // Fernando (Tesorero)
    ministryId: "clm4ministry004", // Comunicación
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:45:00Z"),
    updatedAt: new Date("2024-11-01T11:45:00Z"),
  },
  {
    id: "clm4mm012",
    memberId: "clm4member013", // Beatriz (Miembro)
    ministryId: "clm4ministry015", // Media
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:50:00Z"),
    updatedAt: new Date("2024-11-01T11:50:00Z"),
  },
  {
    id: "clm4mm013",
    memberId: "clm4member014", // Luis (Anfitrión)
    ministryId: "clm4ministry002", // Ujieres
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T11:55:00Z"),
    updatedAt: new Date("2024-11-01T11:55:00Z"),
  },
  {
    id: "clm4mm014",
    memberId: "clm4member015", // Marisol (Supervisora)
    ministryId: "clm4ministry011", // Escuela Dominical
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T12:00:00Z"),
    updatedAt: new Date("2024-11-01T12:00:00Z"),
  },
  {
    id: "clm4mm015",
    memberId: "clm4member016", // Óscar (Miembro)
    ministryId: "clm4ministry006", // Producción
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T12:05:00Z"),
    updatedAt: new Date("2024-11-01T12:05:00Z"),
  },
  {
    id: "clm4mm016",
    memberId: "clm4member017", // Teresa (Líder)
    ministryId: "clm4ministry008", // Oración
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T12:10:00Z"),
    updatedAt: new Date("2024-11-01T12:10:00Z"),
  },
  {
    id: "clm4mm017",
    memberId: "clm4member019", // Nadia (Miembro)
    ministryId: "clm4ministry007", // Alabanza
    church_id: "clm4church004",
    createdAt: new Date("2024-01-23T12:15:00Z"),
    updatedAt: new Date("2024-11-01T12:15:00Z"),
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
