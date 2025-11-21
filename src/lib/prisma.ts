import { PrismaClient } from "@/app/generated/prisma";
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Singleton pattern for Prisma Client
const createPrismaClient = () => {
  const isDev = process.env.NODE_ENV === "development";
  const prismaLogLevel = process.env.PRISMA_LOG_LEVEL;
  const log: ("query" | "info" | "warn" | "error")[] =
    prismaLogLevel === "debug"
      ? ["query", "error", "warn"]
      : isDev
      ? ["query", "error", "warn"]
      : ["error", "warn"]; // Incluir warn en producción para mejor visibilidad

  // Create the adapter for PostgreSQL
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  return new PrismaClient({
    log,
    adapter,
  });
};

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
