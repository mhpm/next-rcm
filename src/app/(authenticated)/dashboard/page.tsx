import { DashboardGrid } from "./components/DashboardGrid";
import { Breadcrumbs, StatCard } from "@/components";
import {
  FaPeopleRoof,
  FaUserGroup,
  FaUsersGear,
  FaUsers,
  FaPersonChalkboard,
} from "react-icons/fa6";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { getMemberStats } from "@/app/(authenticated)/members/actions/members.actions";
import { getMinistryStats } from "@/app/(authenticated)/ministries/actions/ministries.actions";
import { getCellStats } from "@/app/(authenticated)/cells/actions/cells.actions";
import { getSectorStats } from "@/app/(authenticated)/sectors/actions/sectors.actions";

import { getMemberGrowthStats } from "./actions/dashboard.actions";
import GrowthChart from "./components/GrowthChart";
import { buttonVariants } from "@/components/ui/button";

export default async function Dashboard() {
  async function ChartCard() {
    "use cache";
    cacheLife({ stale: 600, revalidate: 3600, expire: 86400 });
    cacheTag("chart-growth");
    const data = await getMemberGrowthStats();
    return <GrowthChart data={data} />;
  }

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
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "w-full",
            })}
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
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "w-full",
            })}
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
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "w-full",
            })}
          >
            Ver más detalles
          </Link>
        }
      />
    );
  }

  async function SectorsCard() {
    "use cache";
    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag("sectors");
    const stats = await getSectorStats();

    const extraStats = [
      { label: "Sub-sectores:", value: String(stats.totalSubSectors) },
      { label: "Células:", value: String(stats.totalCells) },
      { label: "Miembros:", value: String(stats.totalMembers) },
    ];

    return (
      <StatCard
        title="Sectores"
        value={String(stats.totalSectors)}
        change="6.8%"
        changeType="decrease"
        period="vs. último cuatrimestre"
        icon={<FaUsersGear size={24} />}
        extraStats={extraStats}
        isLoading={false}
        action={
          <Link
            href="/sectors"
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "w-full",
            })}
          >
            Ver más detalles
          </Link>
        }
      />
    );
  }

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
        sectorsCard={<SectorsCard />}
        chartCard={<ChartCard />}
      />
    </div>
  );
}
