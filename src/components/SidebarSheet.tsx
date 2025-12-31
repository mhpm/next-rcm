'use client';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/AppSidebar';

interface SidebarSheetProps {
  churchName?: string | null;
}

export function SidebarSheet({ churchName }: SidebarSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs p-0">
        <AppSidebar className="w-full border-none" churchName={churchName} />
      </SheetContent>
    </Sheet>
  );
}
