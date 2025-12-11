import { DashboardGrid } from "./components/DashboardGrid";
import { Breadcrumbs, StatCard } from "@/components";
import {
  FaPeopleRoof,
  FaUserGroup,
  FaUsersGear,
  FaUsers,
  FaPersonChalkboard,
  FaFileLines,
} from "react-icons/fa6";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { getMemberStats } from "@/app/(authenticated)/members/actions/members.actions";
import { getMinistryStats } from "@/app/(authenticated)/ministries/actions/ministries.actions";
import { getCellStats } from "@/app/(authenticated)/cells/actions/cells.actions";
import { getGroupStats } from "@/app/(authenticated)/groups/actions/groups.actions";
import { getChurchPrisma } from "@/actions/churchContext";

export default async function Dashboard() {
  async function MinistriesCard() {
    "use cache";

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag("ministries");
    const ministryStats = await getMinistryStats();
    const totalMinistries = String(ministryStats?.total ?? 0);
    const totalMembers = String((await getMemberStats())?.total ?? 0);
    const membersInAnyMinistry = String(
      ministryStats?.membersInAnyMinistry ?? 0
    );
    const extraMinistryStats = [
      {
        label: "Miembros activos:",
        value: `${membersInAnyMinistry} / ${totalMembers}`,
      },
      {
        label: "Miemrbos sin ministerio:",
        value: `${Number(totalMembers) - Number(membersInAnyMinistry)}`,
      },
    ];
    return (
      <StatCard
        title="Ministerios"
        value={totalMinistries}
        change="8.5%"
        changeType="increase"
        period="vs. 3 ultimo cuatrimestre"
        icon={<FaPersonChalkboard size={24} />}
        extraStats={extraMinistryStats}
        isLoading={false}
        action={
          <Link
            href="/ministries"
            className="btn btn-sm btn-primary btn-outline w-full"
          >
            Ver más detalles
          </Link>
        }
      />
    );
  }

  async function CellsCard() {
    "use cache";

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag("cells");
    const cellStats = await getCellStats();
    const totalCells = String(cellStats?.total ?? 0);
    const membersInCells = String(cellStats?.membersInCells ?? 0);
    const membersWithoutCell = String(cellStats?.membersWithoutCell ?? 0);
    const extraCellStats = [
      { label: "Miembros en células:", value: membersInCells },
      { label: "Miembros sin célula:", value: membersWithoutCell },
    ];
    return (
      <StatCard
        title="Celulas"
        value={totalCells}
        change="21.2%"
        changeType="increase"
        period="vs. 12 ultimo cuatrimestre"
        icon={<FaPeopleRoof size={24} />}
        extraStats={extraCellStats}
        isLoading={false}
        action={
          <Link
            href="/cells"
            className="btn btn-sm btn-primary btn-outline w-full"
          >
            Ver más detalles
          </Link>
        }
      />
    );
  }

  async function MembersCard() {
    "use cache";

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag("members");
    const stats = await getMemberStats();
    const totalMembers = String(stats?.total ?? 0);
    return (
      <StatCard
        title="Miembros"
        value={totalMembers}
        change="10.8%"
        changeType="increase"
        period="vs. 12 ultimo cuatrimestre"
        icon={<FaUserGroup size={24} />}
        isLoading={false}
        action={
          <Link
            href="/members"
            className="btn btn-sm btn-primary btn-outline w-full"
          >
            Ver más detalles
          </Link>
        }
      />
    );
  }

  async function GroupsCard() {
    "use cache";

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag("groups");
    const stats = await getGroupStats();
    const totalGroups = String(stats?.total ?? 0);
    const extraGroupStats = [
      { label: "Grupos padres:", value: String(stats?.parents ?? 0) },
      { label: "Subgrupos:", value: String(stats?.subgroups ?? 0) },
      {
        label: "Miembros en grupos:",
        value: String(stats?.membersInGroups ?? 0),
      },
      {
        label: "Miembros sin grupo:",
        value: String(stats?.membersWithoutGroup ?? 0),
      },
    ];
    return (
      <StatCard
        title="Grupos"
        value={totalGroups}
        change="12.1%"
        changeType="increase"
        period="vs. último cuatrimestre"
        icon={<FaUsers size={24} />}
        extraStats={extraGroupStats}
        isLoading={false}
        action={
          <Link
            href="/groups"
            className="btn btn-sm btn-primary btn-outline w-full"
          >
            Ver más detalles
          </Link>
        }
      />
    );
  }

  async function ReportsCard() {
    "use cache";

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag("reports");
    const prisma = await getChurchPrisma();
    const [total, cell, group, sector, church] = await Promise.all([
      prisma.reports.count(),
      prisma.reports.count({ where: { scope: "CELL" } }),
      prisma.reports.count({ where: { scope: "GROUP" } }),
      prisma.reports.count({ where: { scope: "SECTOR" } }),
      prisma.reports.count({ where: { scope: "CHURCH" } }),
    ]);
    const extra = [
      { label: "Célula:", value: String(cell) },
      { label: "Grupo:", value: String(group) },
      { label: "Sector:", value: String(sector) },
      { label: "Iglesia:", value: String(church) },
    ];
    return (
      <StatCard
        title="Reportes"
        value={String(total)}
        change="2.3%"
        changeType="increase"
        period="vs. último cuatrimestre"
        icon={<FaFileLines size={24} />}
        extraStats={extra}
        isLoading={false}
        action={
          <Link
            href="/reports"
            className="btn btn-sm btn-primary btn-outline w-full"
          >
            Ver más detalles
          </Link>
        }
      />
    );
  }

  const SectorsCard = (
    <StatCard
      title="Sectores"
      value="3"
      change="6.8%"
      changeType="decrease"
      period="vs. 28 ultimo cuatrimestre"
      icon={<FaUsersGear size={24} />}
      isLoading={false}
      action={
        <Link
          href="/sectors"
          className="btn btn-sm btn-primary btn-outline w-full"
        >
          Ver más detalles
        </Link>
      }
    />
  );

  const SubsectorsCard = (
    <StatCard
      title="Subsectores"
      value="10"
      change="8.5%"
      changeType="increase"
      period="vs. 3 ultimo cuatrimestre"
      icon={<FaUsers size={24} />}
      isLoading={false}
      action={
        <Link
          href="/subsectors"
          className="btn btn-sm btn-primary btn-outline w-full"
        >
          Ver más detalles
        </Link>
      }
    />
  );

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Breadcrumbs />
      </div>
      <DashboardGrid
        ministriesCard={<MinistriesCard />}
        cellsCard={<CellsCard />}
        membersCard={<MembersCard />}
        groupsCard={<GroupsCard />}
        reportsCard={<ReportsCard />}
        sectorsCard={SectorsCard}
        subsectorsCard={SubsectorsCard}
      />
    </div>
  );
}
