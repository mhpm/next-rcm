import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

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
  console.log('📦 Starting backup...');

  const data = {
    churches: await prisma.churches.findMany(),
    networks: await prisma.networks.findMany(),
    members: await prisma.members.findMany(),
    ministries: await prisma.ministries.findMany(),
    memberMinistries: await prisma.memberMinistry.findMany(),
    zones: await prisma.zones.findMany(),
    sectors: await prisma.sectors.findMany(),
    subSectors: await prisma.subSectors.findMany(),
    cells: await prisma.cells.findMany(),
    groups: await prisma.groups.findMany(),
    groupFields: await prisma.groupFields.findMany(),
    friends: await prisma.friends.findMany(),
    events: await prisma.events.findMany(),
    eventPhases: await prisma.eventPhases.findMany(),
    eventAttendances: await prisma.eventAttendances.findMany(),
    cellGoals: await prisma.cellGoals.findMany(),
    reports: await prisma.reports.findMany(),
    reportFields: await prisma.reportFields.findMany(),
    reportEntries: await prisma.reportEntries.findMany(),
    reportEntryValues: await prisma.reportEntryValues.findMany(),
  };

  const backupPath = path.join(__dirname, '../backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  console.log(`✅ Backup created successfully at: ${backupPath}`);
  console.log(`   Churches: ${data.churches.length}`);
  console.log(`   Networks: ${data.networks.length}`);
  console.log(`   Members: ${data.members.length}`);
  console.log(`   Ministries: ${data.ministries.length}`);
  console.log(`   MemberMinistries: ${data.memberMinistries.length}`);
  console.log(`   Zones: ${data.zones.length}`);
  console.log(`   Sectors: ${data.sectors.length}`);
  console.log(`   SubSectors: ${data.subSectors.length}`);
  console.log(`   Cells: ${data.cells.length}`);
  console.log(`   Groups: ${data.groups.length}`);
  console.log(`   GroupFields: ${data.groupFields.length}`);
  console.log(`   Friends: ${data.friends.length}`);
  console.log(`   Events: ${data.events.length}`);
  console.log(`   EventPhases: ${data.eventPhases.length}`);
  console.log(`   EventAttendances: ${data.eventAttendances.length}`);
  console.log(`   CellGoals: ${data.cellGoals.length}`);
  console.log(`   Reports: ${data.reports.length}`);
  console.log(`   ReportFields: ${data.reportFields.length}`);
  console.log(`   ReportEntries: ${data.reportEntries.length}`);
  console.log(`   ReportEntryValues: ${data.reportEntryValues.length}`);
}

backup()
  .catch((e) => {
    console.error('❌ Backup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
