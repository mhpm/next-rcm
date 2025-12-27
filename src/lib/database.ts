import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { isValidChurchSlug } from './church-context';

// Cache for database connections
const databaseConnections = new Map<string, PrismaClient>();

// Get database URL for a specific church
function getDatabaseUrl(churchSlug: string): string {
  console.log('🚀 ~ getDatabaseUrl ~ getDatabaseUrl:', getDatabaseUrl);
  // In production, this would come from environment variables or a configuration service
  // For now, we'll use a pattern-based approach
  const baseUrl =
    process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432';
  console.log('DATABASE_URL: ', process.env.DATABASE_URL);

  // Extract the base URL without the database name
  const urlParts = baseUrl.split('/');
  const baseWithoutDb = urlParts.slice(0, -1).join('/');

  // Create church-specific database URL
  return `${baseWithoutDb}/${churchSlug}_church_db`;
}

// Get or create a database connection for a specific church
export function getDatabaseConnection(churchSlug: string): PrismaClient {
  // Check if we already have a connection for this church
  if (databaseConnections.has(churchSlug)) {
    return databaseConnections.get(churchSlug)!;
  }

  // Create new connection for this church
  const databaseUrl = getDatabaseUrl(churchSlug);

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

  // Cache the connection
  databaseConnections.set(churchSlug, prisma);

  return prisma;
}

// Close a specific database connection
export async function closeDatabaseConnection(
  churchSlug: string
): Promise<void> {
  const connection = databaseConnections.get(churchSlug);
  if (connection) {
    await connection.$disconnect();
    databaseConnections.delete(churchSlug);
  }
}

// Close all database connections (useful for cleanup)
export async function closeAllDatabaseConnections(): Promise<void> {
  const disconnectPromises = Array.from(databaseConnections.values()).map(
    (connection) => connection.$disconnect()
  );

  await Promise.all(disconnectPromises);
  databaseConnections.clear();
}

// getChurchSlugFromHost and isValidChurchSlug are imported from edge-safe module

// Initialize database for a new church (creates tables if they don't exist)
export async function initializeChurchDatabase(
  churchSlug: string
): Promise<void> {
  if (!isValidChurchSlug(churchSlug)) {
    throw new Error(`Invalid church slug: ${churchSlug}`);
  }

  const prisma = getDatabaseConnection(churchSlug);

  try {
    // Run migrations for this database
    // Note: In production, you'd want to run actual Prisma migrations
    // For now, we'll just test the connection
    await prisma.$connect();
    console.log(`Database initialized for church: ${churchSlug}`);
  } catch (error) {
    console.error(
      `Failed to initialize database for church ${churchSlug}:`,
      error
    );
    throw error;
  }
}

// Health check for a specific church database
export async function checkDatabaseHealth(
  churchSlug: string
): Promise<boolean> {
  try {
    const prisma = getDatabaseConnection(churchSlug);
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error(
      `Database health check failed for church ${churchSlug}:`,
      error
    );
    return false;
  }
}
