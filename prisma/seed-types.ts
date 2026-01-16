import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultTypes = [
  { name: 'Nacional', description: 'Iglesia de nivel nacional' },
  { name: 'Distrital', description: 'Iglesia de nivel distrital' },
  { name: 'Presbiterial', description: 'Iglesia de nivel presbiterial' },
  { name: 'Local', description: 'Iglesia local' },
];

async function main() {
  console.log('Start seeding church types...');

  for (const type of defaultTypes) {
    const existingType = await prisma.churchType.findUnique({
      where: { name: type.name },
    });

    if (!existingType) {
      await prisma.churchType.create({
        data: type,
      });
      console.log(`Created church type: ${type.name}`);
    } else {
      console.log(`Church type already exists: ${type.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
