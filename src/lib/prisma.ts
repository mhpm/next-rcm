import { PrismaClient } from '../generated/prisma';

// Ensure DATABASE_URL is properly defined
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Global instance to prevent multiple Prisma clients in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client - using standard connection for now
// Note: Neon serverless driver with HTTP is better for one-shot queries
// WebSocket support has compatibility issues in this environment
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;