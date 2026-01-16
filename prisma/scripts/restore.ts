import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

// Usamos DIRECT_URL para operaciones de backup/restore para evitar problemas de pooler
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const adapter = new PrismaPg({
  connectionString: connectionString!,
});

const prisma = new PrismaClient({ adapter });

const dateFields = new Set([
  'createdAt',
  'updatedAt',
  'birthDate',
  'baptismDate',
  'date',
]);

function reviveDates(rows: any[]) {
  if (!rows) return [];
  return rows.map((row) => {
    const newRow = { ...row };
    for (const key of Object.keys(newRow)) {
      if (dateFields.has(key) && typeof newRow[key] === 'string') {
        newRow[key] = new Date(newRow[key]);
      }
    }
    return newRow;
  });
}

async function restore() {
  console.log('🔄 Starting restore...');

  const backupPath = path.join(__dirname, '../backup.json');
  if (!fs.existsSync(backupPath)) {
    throw new Error('Backup file not found at ' + backupPath);
  }

  const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  console.log('📖 Backup file loaded.');

  // Clean database in reverse order of dependency
  console.log('🧹 Cleaning existing data...');
  await prisma.reportEntryValues.deleteMany();
  await prisma.reportEntries.deleteMany();
  await prisma.reportFields.deleteMany();
  await prisma.reports.deleteMany();
  await prisma.cellGoals.deleteMany();
  await prisma.eventAttendances.deleteMany();
  await prisma.events.deleteMany();
  await prisma.eventPhases.deleteMany();
  await prisma.friends.deleteMany();
  await prisma.groupFields.deleteMany();
  await prisma.groups.deleteMany();
  await prisma.cells.deleteMany();
  await prisma.subSectors.deleteMany();
  await prisma.sectors.deleteMany();
  await prisma.zones.deleteMany();
  await prisma.networks.deleteMany();
  await prisma.memberMinistry.deleteMany();
  await prisma.ministries.deleteMany();
  await prisma.members.deleteMany();
  await prisma.churchAdmins.deleteMany();
  await prisma.churches.deleteMany();
  await prisma.churchType.deleteMany();

  console.log('🌱 Inserting data...');

  // 0. ChurchTypes (Independent)
  if (data.churchType?.length) {
    await prisma.churchType.createMany({ data: reviveDates(data.churchType) });
    console.log(`   + ${data.churchType.length} ChurchTypes`);
  }

  // 1. Churches
  if (data.churches?.length) {
    await prisma.churches.createMany({ data: reviveDates(data.churches) });
    console.log(`   + ${data.churches.length} Churches`);
  }

  // 2. ChurchAdmins
  if (data.churchAdmins?.length) {
    await prisma.churchAdmins.createMany({ data: reviveDates(data.churchAdmins) });
    console.log(`   + ${data.churchAdmins.length} ChurchAdmins`);
  }

  // 3. Networks
  if (data.networks?.length) {
    await prisma.networks.createMany({ data: reviveDates(data.networks) });
    console.log(`   + ${data.networks.length} Networks`);
  }

  // 4. Members (Base: sin relaciones jerárquicas para evitar ciclos)
  if (data.members?.length) {
    const membersBase = reviveDates(data.members).map((m: any) => ({
      ...m,
      cell_id: null,
      zone_id: null,
      sector_id: null,
      sub_sector_id: null,
    }));
    await prisma.members.createMany({ data: membersBase });
    console.log(`   + ${data.members.length} Members (base)`);
  }

  // 5. Ministries
  if (data.ministries?.length) {
    await prisma.ministries.createMany({ data: reviveDates(data.ministries) });
    console.log(`   + ${data.ministries.length} Ministries`);
  }

  // 6. MemberMinistry
  if (data.memberMinistries?.length) {
    await prisma.memberMinistry.createMany({ data: reviveDates(data.memberMinistries) });
    console.log(`   + ${data.memberMinistries.length} MemberMinistries`);
  }

  // 7. Zones
  if (data.zones?.length) {
    await prisma.zones.createMany({ data: reviveDates(data.zones) });
    console.log(`   + ${data.zones.length} Zones`);
  }

  // 8. Sectors
  if (data.sectors?.length) {
    await prisma.sectors.createMany({ data: reviveDates(data.sectors) });
    console.log(`   + ${data.sectors.length} Sectors`);
  }

  // 9. SubSectors
  if (data.subSectors?.length) {
    await prisma.subSectors.createMany({ data: reviveDates(data.subSectors) });
    console.log(`   + ${data.subSectors.length} SubSectors`);
  }

  // 10. Cells
  if (data.cells?.length) {
    await prisma.cells.createMany({ data: reviveDates(data.cells) });
    console.log(`   + ${data.cells.length} Cells`);
  }

  // 11. Groups (Jerárquico)
  if (data.groups?.length) {
    const groupsRaw = reviveDates(data.groups);
    const groupsBase = groupsRaw.map((g: any) => ({ ...g, parent_id: null }));
    await prisma.groups.createMany({ data: groupsBase });

    const groupsWithParent = groupsRaw.filter((g: any) => g.parent_id);
    if (groupsWithParent.length > 0) {
      console.log(`   > Updating parent links for ${groupsWithParent.length} groups...`);
      for (const g of groupsWithParent) {
        await prisma.groups.update({
          where: { id: g.id },
          data: { parent_id: g.parent_id },
        });
      }
    }
    console.log(`   + ${data.groups.length} Groups`);
  }

  // 12. GroupFields
  if (data.groupFields?.length) {
    await prisma.groupFields.createMany({ data: reviveDates(data.groupFields) });
    console.log(`   + ${data.groupFields.length} GroupFields`);
  }

  // 13. Friends
  if (data.friends?.length) {
    await prisma.friends.createMany({ data: reviveDates(data.friends) });
    console.log(`   + ${data.friends.length} Friends`);
  }

  // 14. EventPhases
  if (data.eventPhases?.length) {
    await prisma.eventPhases.createMany({ data: reviveDates(data.eventPhases) });
    console.log(`   + ${data.eventPhases.length} EventPhases`);
  }

  // 15. Events
  if (data.events?.length) {
    await prisma.events.createMany({ data: reviveDates(data.events) });
    console.log(`   + ${data.events.length} Events`);
  }

  // 16. EventAttendances
  if (data.eventAttendances?.length) {
    await prisma.eventAttendances.createMany({ data: reviveDates(data.eventAttendances) });
    console.log(`   + ${data.eventAttendances.length} EventAttendances`);
  }

  // 17. CellGoals
  if (data.cellGoals?.length) {
    await prisma.cellGoals.createMany({ data: reviveDates(data.cellGoals) });
    console.log(`   + ${data.cellGoals.length} CellGoals`);
  }

  // 18. Reports
  if (data.reports?.length) {
    await prisma.reports.createMany({ data: reviveDates(data.reports) });
    console.log(`   + ${data.reports.length} Reports`);
  }

  // 19. ReportFields
  if (data.reportFields?.length) {
    await prisma.reportFields.createMany({ data: reviveDates(data.reportFields) });
    console.log(`   + ${data.reportFields.length} ReportFields`);
  }

  // 20. ReportEntries
  if (data.reportEntries?.length) {
    await prisma.reportEntries.createMany({ data: reviveDates(data.reportEntries) });
    console.log(`   + ${data.reportEntries.length} ReportEntries`);
  }

  // 21. ReportEntryValues
  if (data.reportEntryValues?.length) {
    await prisma.reportEntryValues.createMany({ data: reviveDates(data.reportEntryValues) });
    console.log(`   + ${data.reportEntryValues.length} ReportEntryValues`);
  }

  // 22. Restaurar links jerárquicos de Members
  if (data.members?.length) {
    console.log('   > Restoring Member hierarchy links...');
    const membersWithLinks = reviveDates(data.members).filter(
      (m: any) => m.cell_id || m.zone_id || m.sector_id || m.sub_sector_id
    );

    const CHUNK_SIZE = 50;
    for (let i = 0; i < membersWithLinks.length; i += CHUNK_SIZE) {
      const chunk = membersWithLinks.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map((m: any) =>
          prisma.members.update({
            where: { id: m.id },
            data: {
              cell_id: m.cell_id,
              zone_id: m.zone_id,
              sector_id: m.sector_id,
              sub_sector_id: m.sub_sector_id,
            },
          })
        )
      );
    }
    console.log(`   + Restored links for ${membersWithLinks.length} Members`);
  }

  console.log('✅ Restore completed successfully!');
}

restore()
  .catch((e) => {
    console.error('❌ Restore failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
