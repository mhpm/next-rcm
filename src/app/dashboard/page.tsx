"use client";
import { Breadcrumbs, StatCard } from "@/components";
import {
  FaPeopleRoof,
  FaUserGroup,
  FaUsersGear,
  FaUsers,
  FaPersonChalkboard,
} from "react-icons/fa6";
import Link from "next/link";
import { useMemberStats } from "@/app/members/hooks/useMembers";
import { useMinistryStats } from "@/app/ministries/hooks/useMinistries";
import { useCellStats } from "@/app/cells/hooks/useCells";

export default function Dashboard() {
  const { data: stats, isLoading } = useMemberStats();
  const { data: ministryStats, isLoading: isLoadingMinistries } =
    useMinistryStats();
  const { data: cellStats, isLoading: isLoadingCells } = useCellStats();

  const totalMembers = String(stats?.total ?? 0);
  const totalMinistries = String(ministryStats?.total ?? 0);
  const membersInAnyMinistry = String(ministryStats?.membersInAnyMinistry ?? 0);
  const extraMinistryStats = isLoadingMinistries
    ? undefined
    : [
        {
          label: "Miembros activos:",
          value: `${membersInAnyMinistry} / ${totalMembers}`,
        },
        {
          label: "Miemrbos sin ministerio:",
          value: `${Number(totalMembers) - Number(membersInAnyMinistry)}`,
        },
      ];

  const totalCells = String(cellStats?.total ?? 0);
  const membersInCells = String(cellStats?.membersInCells ?? 0);
  const membersWithoutCell = String(cellStats?.membersWithoutCell ?? 0);
  const extraCellStats = isLoadingCells
    ? undefined
    : [
        { label: "Miembros en células:", value: membersInCells },
        { label: "Miembros sin célula:", value: membersWithoutCell },
      ];

  const statsCards = [
    {
      href: "/ministries",
      title: "Ministerios",
      value: totalMinistries,
      change: "8.5%",
      changeType: "increase" as const,
      period: "vs. 3 ultimo cuatrimestre",
      icon: <FaPersonChalkboard size={24} />,
      extraStats: extraMinistryStats,
      isLoading: isLoadingMinistries,
    },
    {
      href: "/cells",
      title: "Celulas",
      value: totalCells,
      change: "21.2%",
      changeType: "increase" as const,
      period: "vs. 12 ultimo cuatrimestre",
      icon: <FaPeopleRoof size={24} />,
      extraStats: extraCellStats,
      isLoading: isLoadingCells,
    },
    {
      href: "/members",
      title: "Miembros",
      value: totalMembers,
      change: "10.8%",
      changeType: "increase" as const,
      period: "vs. 12 ultimo cuatrimestre",
      icon: <FaUserGroup size={24} />,
      isLoading,
    },

    {
      href: "/sectors",
      title: "Sectores",
      value: "3",
      change: "6.8%",
      changeType: "decrease" as const,
      period: "vs. 28 ultimo cuatrimestre",
      icon: <FaUsersGear size={24} />,
      isLoading: false,
    },
    {
      href: "/subsectors",
      title: "Subsectores",
      value: "10",
      change: "8.5%",
      changeType: "increase" as const,
      period: "vs. 3 ultimo cuatrimestre",
      icon: <FaUsers size={24} />,
      isLoading: false,
    },
  ];

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Breadcrumbs />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card) => (
          <Link key={card.title} href={card.href} className="cursor-pointer">
            <StatCard
              title={card.title}
              value={card.value}
              change={card.change}
              changeType={card.changeType}
              period={card.period}
              icon={card.icon}
              extraStats={card.extraStats}
              isLoading={card.isLoading}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
