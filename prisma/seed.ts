import "dotenv/config";
import { PrismaClient, Prisma, $Enums } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { mockData } from "../src/mock";

// Create the adapter for PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Create the Prisma Client with the adapter
const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data in reverse order of dependencies
  console.log("🧹 Clearing existing data...");
  await prisma.cells.deleteMany();
  await prisma.sectors.deleteMany();
  await prisma.memberMinistry.deleteMany();
  await prisma.members.deleteMany();
  await prisma.ministries.deleteMany();
  await prisma.churches.deleteMany();

  // Seed Churches
  console.log("⛪ Seeding churches...");
  for (const church of mockData.churches) {
    const churchData: Prisma.ChurchesCreateInput = {
      id: church.id,
      name: church.name,
      slug: church.slug,
      createdAt: church.createdAt,
      updatedAt: church.updatedAt,
    };

    await prisma.churches.create({
      data: churchData,
    });
  }
  console.log(`✅ Created ${mockData.churches.length} churches`);

  // Seed Members
  console.log("👥 Seeding members...");
  for (const member of mockData.members) {
    const memberData: Prisma.MembersUncheckedCreateInput = {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      age: member.age,
      street: member.street,
      city: member.city,
      state: member.state,
      zip: member.zip,
      country: member.country,
      birthDate: member.birthDate,
      baptismDate: member.baptismDate,
      role: member.role as $Enums.MemberRole,
      gender: member.gender as $Enums.Gender,
      pictureUrl: member.pictureUrl,
      notes: member.notes,
      passwordHash: member.passwordHash,
      church_id: member.church_id,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };

    await prisma.members.create({
      data: memberData,
    });
  }
  console.log(`✅ Created ${mockData.members.length} members`);

  // Seed Ministries
  console.log("🙏 Seeding ministries...");
  for (const ministry of mockData.ministries) {
    const ministryData: Prisma.MinistriesUncheckedCreateInput = {
      id: ministry.id,
      name: ministry.name,
      description: ministry.description,
      church_id: ministry.church_id,
      createdAt: ministry.createdAt,
      updatedAt: ministry.updatedAt,
    };

    await prisma.ministries.create({
      data: ministryData,
    });
  }
  console.log(`✅ Created ${mockData.ministries.length} ministries`);

  console.log("🏘️ Seeding sectors and cells...");
  for (const church of mockData.churches) {
    const churchMembers = await prisma.members.findMany({
      where: { church_id: church.id },
      orderBy: { createdAt: "asc" },
    });

    if (churchMembers.length === 0) {
      continue;
    }

    const numSectors = Math.max(1, Math.min(3, Math.ceil(churchMembers.length / 20)));
    const sectorRecords: { id: string; name: string; church_id: string }[] = [];
    const usedSectorLeaderIds = new Set<string>();

    for (let i = 0; i < numSectors; i++) {
      const sectorLeader =
        churchMembers.find(
          (m) =>
            (m.role === $Enums.MemberRole.SUPERVISOR || m.role === $Enums.MemberRole.LIDER) &&
            !usedSectorLeaderIds.has(m.id)
        ) || churchMembers.find((m) => !usedSectorLeaderIds.has(m.id));

      const sector = await prisma.sectors.create({
        data: {
          name: `Sector ${i + 1} - ${church.name}`,
          church_id: church.id,
          leader_id: sectorLeader?.id ?? null,
        },
      });

      sectorRecords.push({ id: sector.id, name: sector.name, church_id: church.id });
      if (sectorLeader) usedSectorLeaderIds.add(sectorLeader.id);
    }

    for (let idx = 0; idx < churchMembers.length; idx++) {
      const sector = sectorRecords[idx % sectorRecords.length];
      await prisma.members.update({
        where: { id: churchMembers[idx].id },
        data: { sector_id: sector.id },
      });
    }

    for (const sector of sectorRecords) {
      const sectorMembers = await prisma.members.findMany({
        where: { church_id: church.id, sector_id: sector.id },
        orderBy: { createdAt: "asc" },
      });

      if (sectorMembers.length === 0) {
        continue;
      }

      const numCells = Math.max(1, Math.min(5, Math.ceil(sectorMembers.length / 10)));
      const cellRecords: { id: string; name: string }[] = [];
      const usedCellLeaderIds = new Set<string>();
      const usedCellHostIds = new Set<string>();

      for (let j = 0; j < numCells; j++) {
        const cellLeader =
          sectorMembers.find((m) => m.role === $Enums.MemberRole.LIDER && !usedCellLeaderIds.has(m.id)) ||
          sectorMembers.find((m) => !usedCellLeaderIds.has(m.id));

        const cellHost =
          sectorMembers.find((m) => m.role === $Enums.MemberRole.ANFITRION && !usedCellHostIds.has(m.id)) ||
          sectorMembers.find((m) => !usedCellHostIds.has(m.id));

        const cell = await prisma.cells.create({
          data: {
            name: `Célula ${j + 1} - ${sector.name}`,
            church_id: church.id,
            sector_id: sector.id,
            leader_id: cellLeader?.id ?? null,
            host_id: cellHost?.id ?? null,
          },
        });

        cellRecords.push({ id: cell.id, name: cell.name });
        if (cellLeader) usedCellLeaderIds.add(cellLeader.id);
        if (cellHost) usedCellHostIds.add(cellHost.id);
      }

      for (let k = 0; k < sectorMembers.length; k++) {
        const cell = cellRecords[k % cellRecords.length];
        await prisma.members.update({
          where: { id: sectorMembers[k].id },
          data: { cell_id: cell.id },
        });
      }
    }
  }

  // Seed Member-Ministry relationships
  console.log("🔗 Seeding member-ministry relationships...");
  for (const memberMinistry of mockData.memberMinistries) {
    const memberMinistryData: Prisma.MemberMinistryUncheckedCreateInput = {
      id: memberMinistry.id,
      memberId: memberMinistry.memberId,
      ministryId: memberMinistry.ministryId,
      church_id: memberMinistry.church_id,
      createdAt: memberMinistry.createdAt,
      updatedAt: memberMinistry.updatedAt,
    };

    await prisma.memberMinistry.create({
      data: memberMinistryData,
    });
  }
  console.log(
    `✅ Created ${mockData.memberMinistries.length} member-ministry relationships`
  );

  // Display summary statistics
  console.log("\n📊 Database seeding completed! Summary:");
  console.log("==========================================");

  for (const church of mockData.churches) {
    const members = mockData.members.filter((m) => m.church_id === church.id);
    const ministries = mockData.ministries.filter(
      (m) => m.church_id === church.id
    );
    const relationships = mockData.memberMinistries.filter(
      (mm) => mm.church_id === church.id
    );
    const sectorsCount = await prisma.sectors.count({ where: { church_id: church.id } });
    const cellsCount = await prisma.cells.count({ where: { church_id: church.id } });

    console.log(`\n⛪ ${church.name}:`);
    console.log(`   👥 Members: ${members.length}`);
    console.log(`   🏘️ Sectors: ${sectorsCount}`);
    console.log(`   🧩 Cells: ${cellsCount}`);
    console.log(`   🙏 Ministries: ${ministries.length}`);
    console.log(`   🔗 Relationships: ${relationships.length}`);

    // Member role breakdown
    const roleBreakdown = members.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("   📋 Roles:");
    Object.entries(roleBreakdown).forEach(([role, count]) => {
      console.log(`      ${role}: ${count}`);
    });
  }

  console.log("\n🎉 Seeding completed successfully!");
}

main();
