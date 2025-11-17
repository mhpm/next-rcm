import { PrismaClient } from "../src/app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Testing Prisma connectivity and Churches query...");
  const churches = await prisma.churches.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
    take: 100,
  });
  console.log("Churches count:", churches.length);
  console.log("Slugs:", churches.map((c) => c.slug));
}

main()
  .catch((err) => {
    console.error("Prisma test failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });