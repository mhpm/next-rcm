import { DashboardGrid } from './components/DashboardGrid';
import { StatCard } from '@/components';
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

import {
  getMemberGrowthStats,
  getRecentActivity,
} from './actions/dashboard.actions';
import GrowthChart from './components/GrowthChart';
import { RecentActivityCard as RecentActivityComponent } from './components/RecentActivityCard';
import { buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2, TrendingDown, Clock } from 'lucide-react';

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
  const d = dict.dashboard;

  async function ChartCard({ slug }: { slug: string }) {
    'use cache';
    cacheLife({ stale: 600, revalidate: 3600, expire: 86400 });
    cacheTag('chart-growth');
    const data = await getMemberGrowthStats('month', slug);
    return <GrowthChart data={data} slug={slug} dict={dict.chart} />;
  }

  async function RecentActivityCard({
    slug,
    lang,
  }: {
    slug: string;
    lang: Locale;
  }) {
    'use cache';
    cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
    cacheTag('members', 'reports');
    const activities = await getRecentActivity(5, slug);
    return (
      <RecentActivityComponent activities={activities} lang={lang} dict={d} />
    );
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
        label: d.ministries.activeMembers,
        value: `${membersInAnyMinistry} / ${totalMembers}`,
      },
      {
        label: d.ministries.membersWithoutMinistry,
        value: `${Number(totalMembers) - Number(membersInAnyMinistry)}`,
      },
    ];
    return (
      <StatCard
        title={d.ministries.title}
        value={totalMinistries}
        change="8.5%"
        changeType="increase"
        period={d.stats.vsLast3Periods}
        icon={<FaPersonChalkboard size={24} />}
        extraStats={extraMinistryStats}
        isLoading={false}
        action={
          <Link
            href={`/${lang}/ministries`}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className:
                'w-full rounded-xl border-white/10 hover:bg-white/5 transition-all duration-200 font-semibold',
            })}
          >
            {d.ministries.viewDetails}
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
      { label: d.cells.membersInCells, value: membersInCells },
      {
        label: d.cells.membersWithoutCell,
        value: membersWithoutCell,
      },
    ];
    return (
      <StatCard
        title={d.cells.title}
        value={totalCells}
        change="21.2%"
        changeType="increase"
        period={d.stats.vsLast12Periods}
        icon={<FaPeopleRoof size={24} />}
        extraStats={extraCellStats}
        isLoading={false}
        action={
          <Link
            href={`/${lang}/cells`}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className:
                'w-full rounded-xl border-white/10 hover:bg-white/5 transition-all duration-200 font-semibold',
            })}
          >
            {d.cells.viewDetails}
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
        label: d.members.supervisors,
        value: String(supervisorCount),
      },
      { label: d.members.leaders, value: String(leaderCount) },
    ];

    return (
      <StatCard
        title={d.members.title}
        value={totalMembers}
        change="10.8%"
        changeType="increase"
        period={d.stats.vsLast12Periods}
        icon={<FaUserGroup size={24} />}
        extraStats={extraMemberStats}
        isLoading={false}
        isPrimary={true}
        action={
          <Link
            href={`/${lang}/members`}
            className={buttonVariants({
              variant: 'default',
              size: 'sm',
              className:
                'w-full rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200 font-bold shadow-lg shadow-primary/20',
            })}
          >
            {d.members.viewDetails}
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
        label: d.sectors.subSectors,
        value: String(stats.totalSubSectors),
      },
      { label: d.sectors.cells, value: String(stats.totalCells) },
      {
        label: d.sectors.members,
        value: String(stats.totalMembers),
      },
    ];

    return (
      <StatCard
        title={d.sectors.title}
        value={String(stats.totalSectors)}
        change="6.8%"
        changeType="decrease"
        period={d.stats.vsLastPeriod}
        icon={<FaUsersGear size={24} />}
        extraStats={extraStats}
        isLoading={false}
        action={
          <Link
            href={`/${lang}/sectors`}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className:
                'w-full rounded-xl border-white/10 hover:bg-white/5 transition-all duration-200 font-semibold',
            })}
          >
            {d.sectors.viewDetails}
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live Dashboard
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic">
            {d.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Clock className="w-3.5 h-3.5" />
            {d.lastUpdated.replace('{time}', '2 min')}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 rounded-xl h-10 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/10 bg-popover shadow-2xl">
              <SelectItem value="monthly" className="rounded-lg">
                {d.periods.monthly}
              </SelectItem>
              <SelectItem value="quarterly" className="rounded-lg">
                {d.periods.quarterly}
              </SelectItem>
              <SelectItem value="custom" className="rounded-lg">
                {d.periods.custom}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* New Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <h2 className="text-xs font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-4 ml-1">
            {d.insights.title}
          </h2>
        </div>

        <div className="group flex items-center gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all duration-300">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform duration-300">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground/90">
              {d.insights.noCell.replace('{count}', '276')}
            </p>
            <button className="text-[11px] font-bold text-red-500 uppercase tracking-wider hover:underline mt-1">
              Assign members now →
            </button>
          </div>
        </div>

        <div className="group flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/20 transition-all duration-300">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform duration-300">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground/90">
              {d.insights.negativeGrowth}
            </p>
            <button className="text-[11px] font-bold text-amber-500 uppercase tracking-wider hover:underline mt-1">
              Review sector →
            </button>
          </div>
        </div>

        <div className="group flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground/90">
              {d.insights.healthyGrowth}
            </p>
            <button className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider hover:underline mt-1">
              Create new cell →
            </button>
          </div>
        </div>
      </div>

      <DashboardGrid
        ministriesCard={<MinistriesCard slug={churchSlug} lang={lang} />}
        cellsCard={<CellsCard slug={churchSlug} lang={lang} />}
        membersCard={<MembersCard slug={churchSlug} lang={lang} />}
        sectorsCard={<SectorsCard slug={churchSlug} lang={lang} />}
        chartCard={<ChartCard slug={churchSlug} />}
        recentActivityCard={
          <RecentActivityCard slug={churchSlug} lang={lang} />
        }
      />
    </div>
  );
}
