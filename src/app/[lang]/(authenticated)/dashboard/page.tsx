import { DashboardGrid } from './components/DashboardGrid';
import { Breadcrumbs, StatCard } from '@/components';
import {
  FaPeopleRoof,
  FaUserGroup,
  FaUsersGear,
  FaPersonChalkboard,
} from 'react-icons/fa6';
import Link from 'next/link';
import { cacheLife, cacheTag } from 'next/cache';
import { getMemberStats } from '@/app/[lang]/(authenticated)/members/actions/members.actions';
import { getMinistryStats } from '@/app/[lang]/(authenticated)/ministries/actions/ministries.actions';
import { getCellStats } from '@/app/[lang]/(authenticated)/cells/actions/cells.actions';
import { getSectorStats } from '@/app/[lang]/(authenticated)/sectors/actions/sectors.actions';

import { getMemberGrowthStats } from './actions/dashboard.actions';
import GrowthChart from './components/GrowthChart';
import { buttonVariants } from '@/components/ui/button';

import {
  getUserChurchSlug,
  getChurchSlugFromSources,
} from '@/actions/churchContext';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';

export default async function Dashboard({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const userChurchSlug = await getUserChurchSlug();
  const churchSlug = await getChurchSlugFromSources(
    userChurchSlug ?? undefined
  );
  const dict = await getDictionary(lang);

  async function ChartCard({ slug }: { slug: string }) {
    'use cache';
    cacheLife({ stale: 600, revalidate: 3600, expire: 86400 });
    cacheTag('chart-growth');
    const data = await getMemberGrowthStats('month', slug);
    return <GrowthChart data={data} slug={slug} dict={dict.chart} />;
  }

  async function MinistriesCard({
    slug,
    lang,
  }: {
    slug: string;
    lang: Locale;
  }) {
    'use cache';

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag('ministries');
    const ministryStats = await getMinistryStats(slug);
    const totalMinistries = String(ministryStats?.total ?? 0);
    const totalMembers = String((await getMemberStats(slug))?.total ?? 0);
    const membersInAnyMinistry = String(
      ministryStats?.membersInAnyMinistry ?? 0
    );
    const extraMinistryStats = [
      {
        label: dict.dashboard.ministries.activeMembers,
        value: `${membersInAnyMinistry} / ${totalMembers}`,
      },
      {
        label: dict.dashboard.ministries.membersWithoutMinistry,
        value: `${Number(totalMembers) - Number(membersInAnyMinistry)}`,
      },
    ];
    return (
      <StatCard
        title={dict.dashboard.ministries.title}
        value={totalMinistries}
        change="8.5%"
        changeType="increase"
        period={dict.dashboard.stats.vsLast3Periods}
        icon={<FaPersonChalkboard size={24} />}
        extraStats={extraMinistryStats}
        isLoading={false}
        action={
          <Link
            href={`/${lang}/ministries`}
            className={buttonVariants({
              variant: 'secondary',
              size: 'sm',
              className: 'w-full',
            })}
          >
            {dict.dashboard.ministries.viewDetails}
          </Link>
        }
      />
    );
  }

  async function CellsCard({ slug, lang }: { slug: string; lang: Locale }) {
    'use cache';

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag('cells');
    const cellStats = await getCellStats(slug);
    const totalCells = String(cellStats?.total ?? 0);
    const membersInCells = String(cellStats?.membersInCells ?? 0);
    const membersWithoutCell = String(cellStats?.membersWithoutCell ?? 0);
    const extraCellStats = [
      { label: dict.dashboard.cells.membersInCells, value: membersInCells },
      {
        label: dict.dashboard.cells.membersWithoutCell,
        value: membersWithoutCell,
      },
    ];
    return (
      <StatCard
        title={dict.dashboard.cells.title}
        value={totalCells}
        change="21.2%"
        changeType="increase"
        period={dict.dashboard.stats.vsLast12Periods}
        icon={<FaPeopleRoof size={24} />}
        extraStats={extraCellStats}
        isLoading={false}
        action={
          <Link
            href={`/${lang}/cells`}
            className={buttonVariants({
              variant: 'secondary',
              size: 'sm',
              className: 'w-full',
            })}
          >
            {dict.dashboard.cells.viewDetails}
          </Link>
        }
      />
    );
  }

  async function MembersCard({ slug, lang }: { slug: string; lang: Locale }) {
    'use cache';

    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag('members');
    const stats = await getMemberStats(slug);
    const totalMembers = String(stats?.total ?? 0);
    const supervisorCount = stats?.byRole?.['SUPERVISOR'] ?? 0;
    const leaderCount = stats?.byRole?.['LIDER'] ?? 0;

    const extraMemberStats = [
      {
        label: dict.dashboard.members.supervisors,
        value: String(supervisorCount),
      },
      { label: dict.dashboard.members.leaders, value: String(leaderCount) },
    ];

    return (
      <StatCard
        title={dict.dashboard.members.title}
        value={totalMembers}
        change="10.8%"
        changeType="increase"
        period={dict.dashboard.stats.vsLast12Periods}
        icon={<FaUserGroup size={24} />}
        extraStats={extraMemberStats}
        isLoading={false}
        action={
          <Link
            href={`/${lang}/members`}
            className={buttonVariants({
              variant: 'secondary',
              size: 'sm',
              className: 'w-full',
            })}
          >
            {dict.dashboard.members.viewDetails}
          </Link>
        }
      />
    );
  }

  async function SectorsCard({ slug, lang }: { slug: string; lang: Locale }) {
    'use cache';
    cacheLife({ stale: 600, revalidate: 1800, expire: 86400 });
    cacheTag('sectors');
    const stats = await getSectorStats(slug);

    const extraStats = [
      {
        label: dict.dashboard.sectors.subSectors,
        value: String(stats.totalSubSectors),
      },
      { label: dict.dashboard.sectors.cells, value: String(stats.totalCells) },
      {
        label: dict.dashboard.sectors.members,
        value: String(stats.totalMembers),
      },
    ];

    return (
      <StatCard
        title={dict.dashboard.sectors.title}
        value={String(stats.totalSectors)}
        change="6.8%"
        changeType="decrease"
        period={dict.dashboard.stats.vsLastPeriod}
        icon={<FaUsersGear size={24} />}
        extraStats={extraStats}
        isLoading={false}
        action={
          <Link
            href={`/${lang}/sectors`}
            className={buttonVariants({
              variant: 'secondary',
              size: 'sm',
              className: 'w-full',
            })}
          >
            {dict.dashboard.sectors.viewDetails}
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{dict.dashboard.title}</h1>
        <Breadcrumbs />
      </div>
      <DashboardGrid
        ministriesCard={<MinistriesCard slug={churchSlug} lang={lang} />}
        cellsCard={<CellsCard slug={churchSlug} lang={lang} />}
        membersCard={<MembersCard slug={churchSlug} lang={lang} />}
        sectorsCard={<SectorsCard slug={churchSlug} lang={lang} />}
        chartCard={<ChartCard slug={churchSlug} />}
      />
    </div>
  );
}
