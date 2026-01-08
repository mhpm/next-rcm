import { PrismaClient, MemberRole } from '../../generated/prisma/client';
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
  console.log('Starting update of cell leaders roles...');

  // 1. Get all cells with a leader assigned
  const cells = await prisma.cells.findMany({
    where: {
      leader_id: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      leader_id: true,
    },
  });

  console.log(`Found ${cells.length} cells with leaders.`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const cell of cells) {
    if (!cell.leader_id) continue;

    // 2. Check current role of the leader
    const leader = await prisma.members.findUnique({
      where: { id: cell.leader_id },
      select: { id: true, role: true, firstName: true, lastName: true },
    });

    if (!leader) {
      console.warn(
        `Leader with ID ${cell.leader_id} for cell ${cell.name} not found.`
      );
      continue;
    }

    if (leader.role !== MemberRole.LIDER) {
      // 3. Update role to LIDER
      await prisma.members.update({
        where: { id: leader.id },
        data: { role: MemberRole.LIDER },
      });
      console.log(
        `Updated ${leader.firstName} ${leader.lastName} (Cell: ${cell.name}) to LIDER.`
      );
      updatedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log('Update complete.');
  console.log(`Updated: ${updatedCount}`);
  console.log(`Already correct: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
