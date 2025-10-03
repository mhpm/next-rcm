import { members } from '@/mock';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Seed function for a specific church database
async function seedChurchDatabase(churchSlug: string) {
  console.log(`🌱 Starting database seed for church: ${churchSlug}...`);

  // Clear existing members for this church database
  await prisma.member.deleteMany({
    where: {
      church_id: churchSlug,
    },
  });

  console.log('🧹 Cleared existing members');

  await prisma.member.createMany({
    data: members.map((member) => ({
      ...member,
      church_id: churchSlug,
    })),
  });

  console.log(`✅ Created ${members.length} members for church: ${churchSlug}`);
  console.log('🎉 Database seed completed successfully!');
}

// Main function to seed multiple churches or a specific one
async function main() {
  const churchSlug = 'demo';
  await seedChurchDatabase(churchSlug);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
