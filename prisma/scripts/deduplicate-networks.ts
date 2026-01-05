import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Starting network deduplication...');

  const networks = await prisma.networks.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const uniqueMap = new Map<string, string>(); // key: "name-churchId" -> id
  let duplicates = 0;

  for (const net of networks) {
    const key = `${net.name}-${net.church_id}`;
    if (uniqueMap.has(key)) {
      // Duplicate found, delete it
      console.log(`Deleting duplicate: ${net.name} (${net.id})`);
      await prisma.networks.delete({ where: { id: net.id } });
      duplicates++;
    } else {
      uniqueMap.set(key, net.id);
    }
  }

  console.log(`✅ Cleanup complete. Removed ${duplicates} duplicates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
