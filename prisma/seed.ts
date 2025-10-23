import { PrismaClient } from "@prisma/client";
import { members } from "../src/mock/membersMock";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Ensure the "demo" church exists
  const demoChurch = await prisma.churches.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      id: "demo-church-id",
      name: "Iglesia Demo",
      slug: "demo",
    },
  });

  console.log(`✅ Church "${demoChurch.name}" ensured to exist`);

  // Clear existing data for the demo church
  await prisma.memberMinistry.deleteMany({
    where: { church_id: demoChurch.id },
  });
  await prisma.members.deleteMany({
    where: { church_id: demoChurch.id },
  });
  await prisma.ministries.deleteMany({
    where: { church_id: demoChurch.id },
  });

  console.log("🗑️ Cleared existing members, ministries, and relationships");

  // Create sample ministries
  const ministries = [
    {
      name: "Alabanza y Adoración",
      description: "Ministerio encargado de la música y adoración en los servicios",
    },
    {
      name: "Evangelismo",
      description: "Ministerio dedicado a la evangelización y alcance comunitario",
    },
    {
      name: "Jóvenes",
      description: "Ministerio enfocado en el crecimiento espiritual de los jóvenes",
    },
    {
      name: "Niños",
      description: "Ministerio dedicado a la enseñanza y cuidado de los niños",
    },
    {
      name: "Intercesión",
      description: "Ministerio de oración e intercesión por la iglesia y comunidad",
    },
    {
      name: "Diaconado",
      description: "Ministerio de servicio y apoyo a las necesidades de la congregación",
    },
  ];

  const createdMinistries = [];
  for (const ministryData of ministries) {
    const ministry = await prisma.ministries.create({
      data: {
        ...ministryData,
        church_id: demoChurch.id,
      },
    });
    createdMinistries.push(ministry);
  }

  console.log(`✅ Created ${createdMinistries.length} ministries`);

  // Create members with the correct church_id
  const createdMembers = [];
  for (const memberData of members) {
    const member = await prisma.members.create({
      data: {
        ...memberData,
        church_id: demoChurch.id, // Use the actual church ID
      },
    });
    createdMembers.push(member);
  }

  console.log(`✅ Created ${createdMembers.length} members for church "${demoChurch.name}"`);

  // Associate members with ministries (randomly assign 1-3 ministries per member)
  for (const member of createdMembers) {
    // Randomly select 1-3 ministries for each member
    const numMinistries = Math.floor(Math.random() * 3) + 1; // 1 to 3 ministries
    const shuffledMinistries = [...createdMinistries].sort(() => 0.5 - Math.random());
    const selectedMinistries = shuffledMinistries.slice(0, numMinistries);

    for (const ministry of selectedMinistries) {
      await prisma.memberMinistry.create({
        data: {
          memberId: member.id,
          ministryId: ministry.id,
          church_id: demoChurch.id,
        },
      });
    }
  }

  console.log(`✅ Associated members with ministries`);
  console.log("🌱 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
