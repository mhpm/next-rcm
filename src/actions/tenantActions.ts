import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

// Tipos para operaciones de creación
type MemberCreateManyData = Prisma.MembersCreateManyInput;
type MinistryCreateManyData = Prisma.MinistriesCreateManyInput;
type MemberMinistryCreateManyData = Prisma.MemberMinistryCreateManyInput;

/**
 * Helper para crear un cliente Prisma con filtrado automático por church_id
 * Este helper debe ser usado en el servidor, donde tenemos acceso al store
 */
export function createTenantPrisma(churchId: string) {
  // Extender el cliente Prisma con middleware para filtrado automático
  const tenantPrisma = prisma.$extends({
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
          args.where = { ...args.where, church_id: churchId };
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
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
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
          args.where = { ...args.where, church_id: churchId };
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
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
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
          args.where = { ...args.where, church_id: churchId };
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
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async delete({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, church_id: churchId };
          return query(args);
        },
      },
    },
  });

  return tenantPrisma;
}

/**
 * Helper para obtener el church_id desde headers en server actions
 * En Next.js 16, intentamos obtener desde headers si están disponibles
 */
export async function getChurchIdFromHeaders(): Promise<string> {
  if (typeof window !== "undefined") {
    throw new Error(
      "getChurchIdFromHeaders should only be called on the server"
    );
  }

  try {
    const headerStore = await headers();
    const churchSlug = headerStore.get("x-church-slug");

    if (!churchSlug) {
      // En lugar de lanzar error, retornamos null para intentar cookies
      throw new Error("Church slug not found in headers");
    }

    // Convertir slug a church ID
    const church = await prisma.churches.findUnique({
      where: { slug: churchSlug },
      select: { id: true },
    });

    if (!church) {
      throw new Error(`Church not found for slug: ${churchSlug}`);
    }

    return church.id;
  } catch (error) {
    console.error("Error getting church ID from headers:", error);
    throw new Error("Failed to get church context from headers");
  }
}

/**
 * Helper para obtener el church_id desde cookies en server actions
 */
export async function getChurchIdFromCookies(): Promise<string> {
  if (typeof window !== "undefined") {
    throw new Error(
      "getChurchIdFromCookies should only be called on the server"
    );
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const churchSlug = cookieStore.get("church-slug")?.value;

    if (!churchSlug) {
      throw new Error(
        "Church slug not found in cookies. Make sure tenant is properly set."
      );
    }

    // Convertir slug a church ID
    const church = await prisma.churches.findUnique({
      where: { slug: churchSlug },
      select: { id: true },
    });

    if (!church) {
      throw new Error(`Church not found for slug: ${churchSlug}`);
    }

    return church.id;
  } catch (error) {
    console.error("Error getting church ID from cookies:", error);
    throw new Error("Failed to get church context from cookies");
  }
}

/**
 * Helper para obtener church-slug desde múltiples fuentes
 * Prioridad: URL params > Headers > Cookies > Default
 */
export async function getChurchSlugFromSources(): Promise<string> {
  if (typeof window !== "undefined") {
    throw new Error("getChurchSlugFromSources should only be called on the server");
  }

  try {
    // 1. Intentar desde headers (si están disponibles)
    try {
      const headerStore = await headers();
      const churchSlug = headerStore.get("x-church-slug");
      if (churchSlug) {
        console.log("Church slug found in headers:", churchSlug);
        return churchSlug;
      }
    } catch (error) {
      console.log("Headers not available or no church-slug found");
    }

    // 2. Intentar desde cookies
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const churchSlug = cookieStore.get("church-slug")?.value;
      if (churchSlug) {
        console.log("Church slug found in cookies:", churchSlug);
        return churchSlug;
      }
    } catch (error) {
      console.log("Cookies not available or no church-slug found");
    }

    // 3. Fallback a 'demo' para desarrollo
    console.log("Using fallback church slug: demo");
    return "demo";
  } catch (error) {
    console.error("Error getting church slug from sources:", error);
    return "demo"; // Fallback seguro
  }
}

/**
 * Helper principal para obtener el church_id en server actions
 * Usa el nuevo método de múltiples fuentes
 */
export async function getChurchId(): Promise<string> {
  try {
    const churchSlug = await getChurchSlugFromSources();
    
    // Convertir slug a church ID
    const church = await prisma.churches.findUnique({
      where: { slug: churchSlug },
      select: { id: true },
    });

    if (!church) {
      console.error(`Church not found for slug: ${churchSlug}`);
      throw new Error(`Church not found for slug: ${churchSlug}`);
    }

    return church.id;
  } catch (error) {
    console.error("Error getting church ID:", error);
    throw new Error("Failed to get church context");
  }
}

/**
 * Helper para crear un cliente Prisma con tenant automático en server actions
 */
export async function getTenantPrisma() {
  const churchId = await getChurchId();
  return createTenantPrisma(churchId);
}
