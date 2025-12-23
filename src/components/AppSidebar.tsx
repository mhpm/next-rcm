"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  MapPin,
  BookOpen,
  FileText,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarItems = [
  {
    title: "Home",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Miembros", href: "/members", icon: Users },
      { title: "Celulas", href: "/cells", icon: Home },
      { title: "Sectores", href: "/sectors", icon: MapPin },
      { title: "Ministerios", href: "/ministries", icon: BookOpen },
    ],
  },
  {
    title: "Documents",
    items: [{ title: "Reportes", href: "/reports", icon: FileText }],
  },
];

interface AppSidebarProps {
  className?: string;
  collapsed?: boolean;
}

export function AppSidebar({ className, collapsed = false }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "pb-12 border-r min-h-screen bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className="space-y-4 py-4">
          <div className={cn("px-3 py-2", collapsed ? "text-center" : "")}>
            <div
              className={cn(
                "mb-2 flex items-center gap-2",
                collapsed ? "justify-center px-0" : "px-4"
              )}
            >
              <div className="h-6 w-6 rounded-full bg-primary shrink-0" />
              {!collapsed && (
                <h2 className="text-lg font-semibold tracking-tight truncate">
                  RCM Admin
                </h2>
              )}
            </div>
          </div>

          <div className="px-3 py-2">
            {!collapsed && (
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                Home
              </h2>
            )}
            <div className="space-y-1">
              {sidebarItems[0].items.map((item) => (
                <div key={item.href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            pathname === item.href ? "secondary" : "ghost"
                          }
                          className={cn(
                            "w-full justify-center px-0",
                            pathname === item.href &&
                              "bg-secondary text-secondary-foreground"
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
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        pathname === item.href &&
                          "bg-secondary text-secondary-foreground"
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

          <div className="px-3 py-2">
            {!collapsed && (
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                Documents
              </h2>
            )}
            <div className="space-y-1">
              {sidebarItems[1].items.map((item) => (
                <div key={item.href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            pathname === item.href ? "secondary" : "ghost"
                          }
                          className={cn(
                            "w-full justify-center px-0",
                            pathname === item.href &&
                              "bg-secondary text-secondary-foreground"
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
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        pathname === item.href &&
                          "bg-secondary text-secondary-foreground"
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
        </div>
      </div>
    </TooltipProvider>
  );
}
