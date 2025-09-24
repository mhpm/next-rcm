import { PrismaClient } from '../generated/prisma';

// Ensure DATABASE_URL is properly defined
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not defined');
  console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE')));
  throw new Error('DATABASE_URL environment variable is not defined. Please check your environment configuration.');
}

// Log database connection info in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 Database connection configured');
  console.log('📍 Environment:', process.env.NODE_ENV);
}

// Global instance to prevent multiple Prisma clients in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with enhanced error handling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// Test database connection on initialization
prisma.$connect()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Database connected successfully');
    }
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    console.error('🔍 Check your DATABASE_URL and network connectivity');
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;