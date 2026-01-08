'use client';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/AppSidebar';

interface SidebarSheetProps {
  churchName?: string | null;
  dict: any;
  lang: string;
}

export function SidebarSheet({ churchName, dict, lang }: SidebarSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{dict.header.toggleSidebar}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs p-0">
        <AppSidebar
          className="w-full border-none"
          churchName={churchName}
          dict={dict}
          lang={lang}
        />
      </SheetContent>
    </Sheet>
  );
}
