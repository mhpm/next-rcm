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
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
          'pb-12 border-r h-full overflow-y-auto bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        <div className="space-y-4 py-4">
          <div className={cn('px-3 py-2', collapsed ? 'text-center' : '')}>
            <div
              className={cn(
                'mb-2 flex items-center gap-2',
                collapsed ? 'justify-center px-0' : 'px-4'
              )}
            >
              <div className="h-6 w-6 rounded-full bg-primary shrink-0" />
              {!collapsed && (
                <div className="flex flex-col overflow-hidden">
                  <h2 className="text-lg font-semibold tracking-tight truncate">
                    {churchName || 'RCM Admin'}
                  </h2>
                </div>
              )}
            </div>
          </div>

          {sidebarItems.map((section) => (
            <div key={section.title} className="px-3 py-2">
              {!collapsed && (
                <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                  {section.title}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              pathname === item.href ? 'secondary' : 'ghost'
                            }
                            className={cn(
                              'w-full justify-center px-0',
                              pathname === item.href &&
                                'bg-secondary text-secondary-foreground'
                            )}
                            asChild
                          >
                            <Link href={item.href}>
                              <item.icon className="h-4 w-4" />
                              <span className="sr-only">{item.title}</span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="flex items-center gap-4"
                        >
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Button
                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start',
                          pathname === item.href &&
                            'bg-secondary text-secondary-foreground'
                        )}
                        asChild
                      >
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
