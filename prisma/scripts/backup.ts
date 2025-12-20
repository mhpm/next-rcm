import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

// Create the adapter for PostgreSQL
// Using the same pattern as seed.ts which seems to work with the installed version
// Note: Although seed.ts passed connectionString directly to PrismaPg,
// standard usage usually involves pg.Pool. If seed.ts works, it might be a specific version behavior
// or I misread. However, to be safe and standard compliant with @prisma/adapter-pg,
// we'll try the Pool approach which is standard, or fall back to seed.ts style if that fails.
// Actually, let's stick to EXACTLY what seed.ts did to avoid version mismatch issues.
// seed.ts: const adapter = new PrismaPg({ connectionString: ... });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function backup() {
  console.log("📦 Starting backup...");

  const data = {
    churches: await prisma.churches.findMany(),
    members: await prisma.members.findMany(),
    ministries: await prisma.ministries.findMany(),
    memberMinistries: await prisma.memberMinistry.findMany(),
    zones: await prisma.zones.findMany(),
    sectors: await prisma.sectors.findMany(),
    subSectors: await prisma.subSectors.findMany(),
    cells: await prisma.cells.findMany(),
    groups: await prisma.groups.findMany(),
    groupFields: await prisma.groupFields.findMany(),
    reports: await prisma.reports.findMany(),
    reportFields: await prisma.reportFields.findMany(),
    reportEntries: await prisma.reportEntries.findMany(),
    reportEntryValues: await prisma.reportEntryValues.findMany(),
  };

  const backupPath = path.join(__dirname, "../backup.json");
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  console.log(`✅ Backup created successfully at: ${backupPath}`);
  console.log(`   Churches: ${data.churches.length}`);
  console.log(`   Members: ${data.members.length}`);
  console.log(`   Ministries: ${data.ministries.length}`);
  console.log(`   Cells: ${data.cells.length}`);
  console.log(`   Reports: ${data.reports.length}`);
}

backup()
  .catch((e) => {
    console.error("❌ Backup failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
