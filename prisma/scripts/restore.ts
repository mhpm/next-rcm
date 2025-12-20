import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const dateFields = new Set([
  "createdAt",
  "updatedAt",
  "birthDate",
  "baptismDate",
]);

function reviveDates(rows: any[]) {
  return rows.map((row) => {
    const newRow = { ...row };
    for (const key of Object.keys(newRow)) {
      if (dateFields.has(key) && typeof newRow[key] === "string") {
        newRow[key] = new Date(newRow[key]);
      }
    }
    return newRow;
  });
}

async function restore() {
  console.log("🔄 Starting restore...");

  const backupPath = path.join(__dirname, "../backup.json");
  if (!fs.existsSync(backupPath)) {
    throw new Error("Backup file not found at " + backupPath);
  }

  const data = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
  console.log("📖 Backup file loaded.");

  // Clean database
  console.log("🧹 Cleaning existing data...");
  // Delete in reverse order of dependency
  await prisma.reportEntryValues.deleteMany();
  await prisma.reportEntries.deleteMany();
  await prisma.reportFields.deleteMany();
  await prisma.reports.deleteMany();

  await prisma.groupFields.deleteMany();
  await prisma.groups.deleteMany();

  await prisma.cells.deleteMany();
  await prisma.subSectors.deleteMany();
  await prisma.sectors.deleteMany();
  await prisma.zones.deleteMany();

  await prisma.memberMinistry.deleteMany();
  await prisma.ministries.deleteMany();
  await prisma.members.deleteMany();
  await prisma.churches.deleteMany();

  console.log("🌱 Inserting data...");

  // 1. Churches
  if (data.churches?.length) {
    await prisma.churches.createMany({ data: reviveDates(data.churches) });
    console.log(`   + ${data.churches.length} Churches`);
  }

  // 2. Members (Base: no relations to cells/zones/sectors yet to avoid cycles)
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

  // 3. Ministries
  if (data.ministries?.length) {
    await prisma.ministries.createMany({ data: reviveDates(data.ministries) });
    console.log(`   + ${data.ministries.length} Ministries`);
  }

  // 4. Zones
  if (data.zones?.length) {
    await prisma.zones.createMany({ data: reviveDates(data.zones) });
    console.log(`   + ${data.zones.length} Zones`);
  }

  // 5. Sectors
  if (data.sectors?.length) {
    await prisma.sectors.createMany({ data: reviveDates(data.sectors) });
    console.log(`   + ${data.sectors.length} Sectors`);
  }

  // 6. SubSectors
  if (data.subSectors?.length) {
    await prisma.subSectors.createMany({ data: reviveDates(data.subSectors) });
    console.log(`   + ${data.subSectors.length} SubSectors`);
  }

  // 7. Cells
  if (data.cells?.length) {
    await prisma.cells.createMany({ data: reviveDates(data.cells) });
    console.log(`   + ${data.cells.length} Cells`);
  }

  // 8. Groups
  if (data.groups?.length) {
    // Groups might have parent_id, so we need to handle hierarchy.
    // Ideally, we should insert in order of depth or just disable foreign keys if possible (not easy in Prisma).
    // Or simpler: insert all with parent_id = null first, then update?
    // But createMany doesn't support setting null just for some fields easily without mapping.
    // However, if the backup is ordered (top-down), it might work if we insert sequentially.
    // But createMany is parallel/batch.
    // Let's try two passes:
    // Pass 1: Insert groups with parent_id = null
    // Pass 2: Insert groups with parent_id != null?
    // No, if a group depends on another group, the parent must exist.
    // A safe way for self-referencing tables is to insert all with parent_id = null, then update them.

    const groupsRaw = reviveDates(data.groups);
    // Insert all with parent_id = null
    const groupsBase = groupsRaw.map((g: any) => ({ ...g, parent_id: null }));
    await prisma.groups.createMany({ data: groupsBase });

    // Now update parent_ids for those that have one
    const groupsWithParent = groupsRaw.filter((g: any) => g.parent_id);
    console.log(
      `   > Updating parent links for ${groupsWithParent.length} groups...`
    );
    for (const g of groupsWithParent) {
      await prisma.groups.update({
        where: { id: g.id },
        data: { parent_id: g.parent_id },
      });
    }
    console.log(`   + ${data.groups.length} Groups`);
  }

  // 9. GroupFields
  if (data.groupFields?.length) {
    await prisma.groupFields.createMany({
      data: reviveDates(data.groupFields),
    });
    console.log(`   + ${data.groupFields.length} GroupFields`);
  }

  // 10. MemberMinistry
  if (data.memberMinistries?.length) {
    await prisma.memberMinistry.createMany({
      data: reviveDates(data.memberMinistries),
    });
    console.log(`   + ${data.memberMinistries.length} MemberMinistries`);
  }

  // 11. Reports
  if (data.reports?.length) {
    await prisma.reports.createMany({ data: reviveDates(data.reports) });
    console.log(`   + ${data.reports.length} Reports`);
  }

  // 12. ReportFields
  if (data.reportFields?.length) {
    await prisma.reportFields.createMany({
      data: reviveDates(data.reportFields),
    });
    console.log(`   + ${data.reportFields.length} ReportFields`);
  }

  // 13. ReportEntries
  if (data.reportEntries?.length) {
    await prisma.reportEntries.createMany({
      data: reviveDates(data.reportEntries),
    });
    console.log(`   + ${data.reportEntries.length} ReportEntries`);
  }

  // 14. ReportEntryValues
  if (data.reportEntryValues?.length) {
    await prisma.reportEntryValues.createMany({
      data: reviveDates(data.reportEntryValues),
    });
    console.log(`   + ${data.reportEntryValues.length} ReportEntryValues`);
  }

  // 15. Link Members to their hierarchy (Cells, Zones, Sectors)
  // We cleared these fields in step 2. Now we restore them.
  if (data.members?.length) {
    console.log("   > Restoring Member hierarchy links...");
    const membersWithLinks = reviveDates(data.members).filter(
      (m: any) => m.cell_id || m.zone_id || m.sector_id || m.sub_sector_id
    );

    // This might be slow for many members.
    // Optimization: we could use updateMany if we can group by link, but links are unique combinations.
    // For a backup/restore script, sequential updates are acceptable for reliability.
    // To speed up, we can use Promise.all in chunks.
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

  console.log("✅ Restore completed successfully!");
}

restore()
  .catch((e) => {
    console.error("❌ Restore failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
