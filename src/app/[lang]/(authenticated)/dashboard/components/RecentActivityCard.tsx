'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  User,
  FileText,
  Clock,
  ArrowRight,
  MoreHorizontal,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { RecentActivity } from '../actions/dashboard.actions';
import Link from 'next/link';

interface RecentActivityCardProps {
  activities: RecentActivity[];
  lang: string;
  dict: any;
}

export function RecentActivityCard({
  activities,
  lang,
  dict,
}: RecentActivityCardProps) {
  const dateLocale = lang === 'es' ? es : enUS;

  return (
    <Card className="col-span-1 lg:col-span-3 border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black tracking-tight uppercase italic flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {dict.recentActivity || 'Recent Activity'}
          </CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            {dict.latestUpdates || 'Latest updates from your church'}
          </CardDescription>
        </div>
        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-0">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">
                {dict.noActivity || 'No recent activity'}
              </p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={activity.id}
                className={cn(
                  'group/item relative flex items-center gap-4 px-6 py-4 transition-all duration-300 hover:bg-white/5',
                  index !== activities.length - 1 && 'border-b border-white/5'
                )}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-top" />

                <div
                  className={cn(
                    'p-3 rounded-2xl transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-3 shadow-lg',
                    activity.type === 'member'
                      ? 'bg-blue-500/10 text-blue-500 shadow-blue-500/5'
                      : 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/5'
                  )}
                >
                  {activity.type === 'member' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-black tracking-tight text-foreground/90 truncate group-hover/item:text-primary transition-colors">
                      {activity.title}
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">
                      {formatDistanceToNow(activity.date, {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      {activity.subtitle}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-widest',
                        activity.status === 'SUBMITTED' ||
                          activity.status === 'NEW_MEMBER'
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      )}
                    >
                      {activity.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button className="opacity-0 group-hover/item:opacity-100 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 translate-x-4 group-hover/item:translate-x-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-white/5 border-t border-white/5 group-hover:bg-white/10 transition-colors">
          <Link
            href={`/${lang}/reports`}
            className="w-full text-center text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 group/btn"
          >
            {dict.viewAllActivity || 'View All Activity'}
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
