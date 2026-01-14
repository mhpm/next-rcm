'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Home,
  MapPin,
  BookOpen,
  FileText,
  Network,
  Building,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Logo } from '@/components/Logo';

interface AppSidebarProps {
  className?: string;
  collapsed?: boolean;
  churchName?: string | null;
  dict: any;
  lang: string;
}

export function AppSidebar({
  className,
  collapsed = false,
  dict,
  lang,
  churchName,
}: AppSidebarProps) {
  const pathname = usePathname();

  const sidebarItems = [
    {
      title: dict.sidebar.home,
      items: [
        {
          title: dict.sidebar.dashboard,
          href: `/${lang}/dashboard`,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: dict.sidebar.administration,
      items: [
        { title: dict.sidebar.members, href: `/${lang}/members`, icon: Users },
        { title: dict.sidebar.cells, href: `/${lang}/cells`, icon: Home },
        { title: dict.sidebar.sectors, href: `/${lang}/sectors`, icon: MapPin },
        {
          title: dict.sidebar.ministries,
          href: `/${lang}/ministries`,
          icon: BookOpen,
        },
        {
          title: dict.sidebar.networks,
          href: `/${lang}/networks`,
          icon: Network,
        },
        {
          title: dict.sidebar.organizations,
          href: `/${lang}/admin/organizations`,
          icon: Building,
        },
      ],
    },
    {
      title: dict.sidebar.metrics,
      items: [
        {
          title: dict.sidebar.tracking,
          href: `/${lang}/evangelism`,
          icon: LayoutDashboard,
        },
        { title: dict.sidebar.friends, href: `/${lang}/friends`, icon: Users },
        { title: dict.sidebar.events, href: `/${lang}/events`, icon: BookOpen },
      ],
    },
    {
      title: dict.sidebar.documents,
      items: [
        {
          title: dict.sidebar.reports,
          href: `/${lang}/reports`,
          icon: FileText,
        },
      ],
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'pb-12 border-r h-full overflow-y-auto bg-card/50 backdrop-blur-xl transition-all duration-500 border-white/5',
          collapsed ? 'w-20' : 'w-72',
          className
        )}
      >
        <div className="space-y-4 py-8">
          <div className={cn('px-4 py-2', collapsed ? 'text-center' : '')}>
            <div
              className={cn(
                'mb-8 flex items-center gap-3',
                collapsed ? 'justify-center px-0' : 'px-4'
              )}
            >
              <div className="p-2 rounded-2xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                <Logo size="sm" />
              </div>
              {!collapsed && (
                <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-sm font-black tracking-tight truncate text-foreground uppercase italic">
                    {churchName || 'MultiplyNet'}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                      Enterprise
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {sidebarItems.map((section) => (
              <div key={section.title} className="px-4">
                {!collapsed && (
                  <h2 className="mb-4 px-4 text-[10px] font-black tracking-[0.25em] text-muted-foreground/30 uppercase">
                    {section.title}
                  </h2>
                )}
                <div className="space-y-1.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <div key={item.href}>
                        {collapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className={cn(
                                  'w-full justify-center px-0 h-12 rounded-2xl transition-all duration-300',
                                  isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 border-none'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                )}
                                asChild
                              >
                                <Link href={item.href}>
                                  <item.icon
                                    className={cn(
                                      'h-5 w-5 transition-transform',
                                      isActive && 'scale-110'
                                    )}
                                  />
                                  <span className="sr-only">{item.title}</span>
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="bg-popover/90 backdrop-blur-md border-white/10 text-popover-foreground shadow-2xl rounded-xl"
                            >
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-start h-11 px-4 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                              isActive
                                ? 'bg-primary/10 text-primary font-bold border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]'
                                : 'text-muted-foreground/70 hover:text-foreground hover:bg-white/5'
                            )}
                            asChild
                          >
                            <Link href={item.href}>
                              {isActive && (
                                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                              )}
                              <item.icon
                                className={cn(
                                  'mr-3 h-4 w-4 transition-all duration-500 z-10',
                                  isActive
                                    ? 'text-primary scale-110'
                                    : 'group-hover:scale-110 group-hover:text-foreground'
                                )}
                              />
                              <span className="text-sm tracking-tight z-10">
                                {item.title}
                              </span>
                              {isActive && (
                                <div className="absolute left-0 w-1.5 h-5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                              )}
                            </Link>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
