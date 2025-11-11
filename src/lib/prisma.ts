import { PrismaClient } from "@/app/generated/prisma";

declare global {
  var __prisma: PrismaClient | undefined;
}

// Singleton pattern for Prisma Client
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
