'use client';

import { AppSidebar } from '@/components/AppSidebar';
import { SidebarSheet } from '@/components/SidebarSheet';
import { Sun, Moon, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUser } from '@stackframe/stack';
import { usePersistentFilters } from '@/hooks/usePersistentFilters';

export default function AuthenticatedLayoutClient({
  children,
  churchName,
}: {
  children: React.ReactNode;
  churchName: string | null;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const { filters: isSidebarOpen, setFilters: setIsSidebarOpen } =
    usePersistentFilters<boolean>('sidebar-open', true);
  const user = useUser();

  return (
    <div className="flex min-h-screen w-full bg-muted/40 overflow-x-hidden">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300',
          isSidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <AppSidebar
          className="border-none w-full"
          collapsed={!isSidebarOpen}
          churchName={churchName}
        />
      </aside>
      <div
        className={cn(
          'flex flex-col sm:gap-4 sm:py-4 w-full transition-all duration-300 min-w-0 overflow-x-hidden',
          isSidebarOpen ? 'sm:pl-64' : 'sm:pl-16'
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarSheet churchName={churchName} />
          <Button
            size="icon"
            variant="outline"
            className="hidden sm:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          {churchName && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">
                {churchName}
              </span>
            </div>
          )}
          <div className="relative ml-auto flex-1 md:grow-0"></div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profileImageUrl || ''}
                      alt={user?.displayName || '@user'}
                    />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.displayName || 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => user?.signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:py-0 md:gap-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
