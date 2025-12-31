import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

// Tipos para operaciones de creación
type MemberCreateManyData = Prisma.MembersCreateManyInput;
type MinistryCreateManyData = Prisma.MinistriesCreateManyInput;
type MemberMinistryCreateManyData = Prisma.MemberMinistryCreateManyInput;

/**
 * Helper para crear un cliente Prisma con filtrado automático por church_id
 * Este helper debe ser usado en el servidor, donde tenemos acceso al store
 */
export function createChurchPrisma(churchId: string) {
  // Extender el cliente Prisma con middleware para filtrado automático
  const churchPrisma = prisma.$extends({
    query: {
      members: {
        async findMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findUnique({ args, query }) {
          // No modificar findUnique con church_id para evitar romper filtros únicos usados por connect/findUnique
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async create({ args, query }) {
          const data = args.data as Prisma.MembersCreateInput;
          if (!data.church) {
            (args.data as Prisma.MembersCreateInput).church = {
              connect: { id: churchId },
            };
          }
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map((item: MemberCreateManyData) => ({
              ...item,
              church_id: item.church_id || churchId,
            }));
          } else {
            args.data = {
              ...args.data,
              church_id: args.data.church_id || churchId,
            };
          }
          return query(args);
        },
        async update({ args, query }) {
          // No forzar church_id en update de un registro único (where por id)
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          // No forzar church_id en delete de un registro único (where por id)
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
      },
      ministries: {
        async findMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findUnique({ args, query }) {
          // No modificar findUnique con church_id para evitar romper filtros únicos usados por connect/findUnique
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async create({ args, query }) {
          const data = args.data as Prisma.MinistriesCreateInput;
          if (!data.church) {
            (args.data as Prisma.MinistriesCreateInput).church = {
              connect: { id: churchId },
            };
          }
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map((item: MinistryCreateManyData) => ({
              ...item,
              church_id: item.church_id || churchId,
            }));
          } else {
            args.data = {
              ...args.data,
              church_id: args.data.church_id || churchId,
            };
          }
          return query(args);
        },
        async update({ args, query }) {
          // No forzar church_id en update de un registro único (where por id)
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          // No forzar church_id en delete de un registro único (where por id)
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
      },
      sectors: {
        async findMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findUnique({ args, query }) {
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async create({ args, query }) {
          const data = args.data as Prisma.SectorsCreateInput;
          if (!data.church) {
            (args.data as Prisma.SectorsCreateInput).church = {
              connect: { id: churchId },
            };
          }
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map(
              (item: Prisma.SectorsCreateManyInput) => ({
                ...item,
                church_id: item.church_id || churchId,
              })
            );
          } else {
            args.data = {
              ...args.data,
              church_id:
                (args.data as Prisma.SectorsCreateManyInput).church_id ||
                churchId,
            };
          }
          return query(args);
        },
        async update({ args, query }) {
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
      },
      cells: {
        async findMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findUnique({ args, query }) {
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async create({ args, query }) {
          const data = args.data as Prisma.CellsCreateInput;
          if (!data.church) {
            (args.data as Prisma.CellsCreateInput).church = {
              connect: { id: churchId },
            };
          }
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map((item: Prisma.CellsCreateManyInput) => ({
              ...item,
              church_id: item.church_id || churchId,
            }));
          } else {
            args.data = {
              ...args.data,
              church_id:
                (args.data as Prisma.CellsCreateManyInput).church_id ||
                churchId,
            };
          }
          return query(args);
        },
        async update({ args, query }) {
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
      },
      groups: {
        async findMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findUnique({ args, query }) {
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async create({ args, query }) {
          const data = args.data as Prisma.GroupsCreateInput;
          if (!data.church) {
            (args.data as Prisma.GroupsCreateInput).church = {
              connect: { id: churchId },
            };
          }
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map((item: Prisma.GroupsCreateManyInput) => ({
              ...item,
              church_id: item.church_id || churchId,
            }));
          } else {
            args.data = {
              ...args.data,
              church_id:
                (args.data as Prisma.GroupsCreateManyInput).church_id ||
                churchId,
            };
          }
          return query(args);
        },
        async update({ args, query }) {
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
      },
      reports: {
        async findMany({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportsWhereInput;
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportsWhereInput;
          return query(args);
        },
        async findUnique({ args, query }) {
          return query(args);
        },
        async count({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportsWhereInput;
          return query(args);
        },
        async create({ args, query }) {
          const data = args.data as Prisma.ReportsCreateInput;
          if (!data.church) {
            (args.data as Prisma.ReportsCreateInput).church = {
              connect: { id: churchId },
            };
          }
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map(
              (item: Prisma.ReportsCreateManyInput) => ({
                ...item,
                church_id: item.church_id || churchId,
              })
            );
          } else {
            args.data = {
              ...args.data,
              church_id:
                (args.data as Prisma.ReportsCreateManyInput).church_id ||
                churchId,
            };
          }
          return query(args);
        },
        async update({ args, query }) {
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportsWhereInput;
          return query(args);
        },
        async delete({ args, query }) {
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportsWhereInput;
          return query(args);
        },
      },
      reportFields: {
        async findMany({ args, query }) {
          args.where = {
            ...args.where,
            report: { church_id: churchId },
          } as Prisma.ReportFieldsWhereInput;
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = {
            ...args.where,
            report: { church_id: churchId },
          } as Prisma.ReportFieldsWhereInput;
          return query(args);
        },
        async findUnique({ args, query }) {
          return query(args);
        },
        async count({ args, query }) {
          args.where = {
            ...args.where,
            report: { church_id: churchId },
          } as Prisma.ReportFieldsWhereInput;
          return query(args);
        },
        async create({ args, query }) {
          // No se fuerza church_id aquí; se deriva del report
          return query(args);
        },
        async createMany({ args, query }) {
          return query(args);
        },
        async update({ args, query }) {
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = {
            ...args.where,
            report: { church_id: churchId },
          } as Prisma.ReportFieldsWhereInput;
          return query(args);
        },
        async delete({ args, query }) {
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = {
            ...args.where,
            report: { church_id: churchId },
          } as Prisma.ReportFieldsWhereInput;
          return query(args);
        },
      },
      reportEntries: {
        async findMany({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportEntriesWhereInput;
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportEntriesWhereInput;
          return query(args);
        },
        async findUnique({ args, query }) {
          return query(args);
        },
        async count({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportEntriesWhereInput;
          return query(args);
        },
        async create({ args, query }) {
          const data = args.data as Prisma.ReportEntriesCreateInput;
          if (!data.church) {
            (args.data as Prisma.ReportEntriesCreateInput).church = {
              connect: { id: churchId },
            };
          }
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map(
              (item: Prisma.ReportEntriesCreateManyInput) => ({
                ...item,
                church_id: item.church_id || churchId,
              })
            );
          } else {
            args.data = {
              ...args.data,
              church_id:
                (args.data as Prisma.ReportEntriesCreateManyInput).church_id ||
                churchId,
            };
          }
          return query(args);
        },
        async update({ args, query }) {
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportEntriesWhereInput;
          return query(args);
        },
        async delete({ args, query }) {
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = {
            ...args.where,
            church_id: churchId,
          } as Prisma.ReportEntriesWhereInput;
          return query(args);
        },
      },
      memberMinistry: {
        async findMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async findUnique({ args, query }) {
          // No modificar findUnique con church_id para evitar romper filtros únicos usados por connect/findUnique
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async create({ args, query }) {
          const data = args.data as Prisma.MemberMinistryCreateInput;
          if (
            !data.church &&
            !data.member &&
            !data.ministry &&
            !data.member &&
            !data.ministry
          ) {
            (args.data as Prisma.MemberMinistryCreateInput).church = {
              connect: { id: churchId },
            };
          }
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map((item: MemberMinistryCreateManyData) => {
              // Solo agregar church_id si no hay IDs directos ya proporcionados
              if (!item.memberId && !item.ministryId) {
                return { ...item, church_id: churchId };
              }
              return item;
            });
          } else {
            // Solo agregar church_id si no hay IDs directos ya proporcionados
            const data = args.data as MemberMinistryCreateManyData;
            if (!data.memberId && !data.ministryId) {
              args.data = { ...args.data, church_id: churchId };
            }
          }
          return query(args);
        },
        async update({ args, query }) {
          // No forzar church_id en update de un registro único (where por id)
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          // No forzar church_id en delete de un registro único (where por id)
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
      },
    },
  });

  return churchPrisma;
}

import { stackServerApp } from '@/stack/server';

/**
 * Obtiene el slug de la iglesia desde las credenciales del usuario autenticado.
 *
 * Busca una iglesia donde owner_id coincida con el ID del usuario actual.
 */
export async function getUserChurchSlug(): Promise<string | null> {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return null;

    // Buscar iglesia asociada al usuario
    const church = await prisma.churches.findFirst({
      where: {
        OR: [{ owner_id: user.id }, { owner_id: user.primaryEmail }],
      },
      select: { slug: true },
    });

    return church?.slug ?? null;
  } catch (error) {
    console.error('Error getting user church slug:', error);
    return null;
  }
}

export async function getUserChurchName(): Promise<string | null> {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return null;

    // Buscar iglesia asociada al usuario
    const church = await prisma.churches.findFirst({
      where: {
        OR: [{ owner_id: user.id }, { owner_id: user.primaryEmail }],
      },
      select: { name: true },
    });

    return church?.name ?? null;
  } catch (error) {
    console.error('Error getting user church name:', error);
    return null;
  }
}

export const getChurchSlugFromAuth = getUserChurchSlug;

/**
 * Helper para obtener el church_id desde headers en server actions
 * En Next.js 16, intentamos obtener desde headers si están disponibles
 */
// getChurchIdFromHeaders eliminado: el church se resolverá exclusivamente desde auth/default

/**
 * Helper para obtener el church_id desde cookies en server actions
 */
// getChurchIdFromCookies eliminado: el church se resolverá exclusivamente desde auth/default

/**
 * Obtén el church-slug exclusivamente desde credenciales (auth) y/o default.
 *
 * Se deja de lado headers/cookies según la solicitud.
 * Por ahora, siempre retorna "demo" hasta que exista login.
 */
export async function getChurchSlugFromSources(
  churchSlug?: string
): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error(
      'getChurchSlugFromSources should only be called on the server'
    );
  }

  try {
    // If a slug is explicitly provided (and not empty), use it directly.
    // This allows bypassing the auth check which might use cookies (dynamic data)
    // inside cached scopes.
    if (churchSlug && churchSlug.trim().length > 0) {
      console.log(`[getChurchSlug] Using provided slug: ${churchSlug}`);
      return churchSlug;
    }

    const fromAuth = await getChurchSlugFromAuth();
    if (fromAuth) {
      console.log(`[getChurchSlug] Found slug in auth: ${fromAuth}`);
      return fromAuth;
    }

    // 3. Default final solo si todo lo demás falla
    console.log("[getChurchSlug] No slug found, using default 'demo'");
    return 'demo';
  } catch (error) {
    console.error('Error getting church slug from sources', error);
    // Default de seguridad
    return 'demo';
  }
}

/**
 * Helper principal para obtener el church_id en server actions
 * Usa el método basado en auth/default
 */
export async function getChurchId(churchSlug?: string): Promise<string> {
  try {
    // Ensure database connection is alive (helps with occasional Closed connection errors)
    try {
      await prisma.$connect();
    } catch (e) {
      console.warn('Prisma connect warning:', e);
    }

    const slug = await getChurchSlugFromSources(churchSlug);

    // Convertir slug a church ID
    const church = await prisma.churches.findUnique({
      where: { slug: slug },
      select: { id: true },
    });

    if (!church) {
      // Sin fallback: queremos usar exclusivamente la iglesia "demo"..
      // Si no existe, lanzamos error claro para que sea creada (seed o manualmente).
      throw new Error(
        `Church not found for slug '${slug}'. Ensure a church with slug '${slug}' exists.`
      );
    }

    return church.id;
  } catch (error) {
    console.error('Error getting church ID:', error);
    throw new Error('Failed to get church context');
  }
}

/**
 * Helper para crear un cliente Prisma con church automático en server actions
 */
export async function getChurchPrisma(churchSlug?: string) {
  const churchId = await getChurchId(churchSlug);
  return createChurchPrisma(churchId);
}
