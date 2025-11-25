import { Suspense } from "react";
import { Breadcrumbs, StatCard } from "@/components";
import {
  FaPeopleRoof,
  FaUserGroup,
  FaUsersGear,
  FaUsers,
  FaPersonChalkboard,
} from "react-icons/fa6";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { getMemberStats } from "@/app/members/actions/members.actions";
import { getMinistryStats } from "@/app/ministries/actions/ministries.actions";
import { getCellStats } from "@/app/cells/actions/cells.actions";

export default async function Dashboard() {
  // Shell se prerendera; contenido dinámico se manejará en límites de Suspense

  async function MinistriesCard() {
    "use cache";

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
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
      <Link href="/ministries" className="cursor-pointer">
        <StatCard
          title="Ministerios"
          value={totalMinistries}
          change="8.5%"
          changeType="increase"
          period="vs. 3 ultimo cuatrimestre"
          icon={<FaPersonChalkboard size={24} />}
          extraStats={extraMinistryStats}
          isLoading={false}
        />
      </Link>
    );
  }

  async function CellsCard() {
    "use cache";

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    const cellStats = await getCellStats();
    const totalCells = String(cellStats?.total ?? 0);
    const membersInCells = String(cellStats?.membersInCells ?? 0);
    const membersWithoutCell = String(cellStats?.membersWithoutCell ?? 0);
    const extraCellStats = [
      { label: "Miembros en células:", value: membersInCells },
      { label: "Miembros sin célula:", value: membersWithoutCell },
    ];
    return (
      <Link href="/cells" className="cursor-pointer">
        <StatCard
          title="Celulas"
          value={totalCells}
          change="21.2%"
          changeType="increase"
          period="vs. 12 ultimo cuatrimestre"
          icon={<FaPeopleRoof size={24} />}
          extraStats={extraCellStats}
          isLoading={false}
        />
      </Link>
    );
  }

  async function MembersCard() {
    "use cache";

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    const stats = await getMemberStats();
    const totalMembers = String(stats?.total ?? 0);
    return (
      <Link href="/members" className="cursor-pointer">
        <StatCard
          title="Miembros"
          value={totalMembers}
          change="10.8%"
          changeType="increase"
          period="vs. 12 ultimo cuatrimestre"
          icon={<FaUserGroup size={24} />}
          isLoading={false}
        />
      </Link>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Breadcrumbs />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense
          fallback={
            <div className="card bg-base-100 shadow-md">
              <div className="stats">
                <div className="stat">
                  <span className="skeleton h-8 w-24"></span>
                </div>
              </div>
            </div>
          }
        >
          <MinistriesCard />
        </Suspense>
        <Suspense
          fallback={
            <div className="card bg-base-100 shadow-md">
              <div className="stats">
                <div className="stat">
                  <span className="skeleton h-8 w-24"></span>
                </div>
              </div>
            </div>
          }
        >
          <CellsCard />
        </Suspense>
        <Suspense
          fallback={
            <div className="card bg-base-100 shadow-md">
              <div className="stats">
                <div className="stat">
                  <span className="skeleton h-8 w-24"></span>
                </div>
              </div>
            </div>
          }
        >
          <MembersCard />
        </Suspense>
        <Link href="/sectors" className="cursor-pointer">
          <StatCard
            title="Sectores"
            value="3"
            change="6.8%"
            changeType="decrease"
            period="vs. 28 ultimo cuatrimestre"
            icon={<FaUsersGear size={24} />}
            isLoading={false}
          />
        </Link>
        <Link href="/subsectors" className="cursor-pointer">
          <StatCard
            title="Subsectores"
            value="10"
            change="8.5%"
            changeType="increase"
            period="vs. 3 ultimo cuatrimestre"
            icon={<FaUsers size={24} />}
            isLoading={false}
          />
        </Link>
      </div>
    </div>
  );
}
