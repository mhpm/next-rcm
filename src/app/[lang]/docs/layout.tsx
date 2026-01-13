import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Input } from '@/components/ui/input';

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict.docs;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              MultiplyNet
            </span>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-slate-200">
              Docs
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={d.search}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/${lang}/sign-in`}>
            <Button variant="ghost" size="sm" className="text-slate-600">
              {dict.nav.signIn}
            </Button>
          </Link>
          <Link href={`/${lang}/dashboard`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-4"
            >
              {dict.nav.dashboard}
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto flex">
        {/* Sidebar Navigation */}
        <aside className="w-72 border-r border-slate-100 h-[calc(100vh-64px)] sticky top-16 hidden lg:block overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
          <nav className="space-y-8">
            {Object.entries(d.categories).map(
              ([key, category]: [string, any]) => (
                <div key={key} className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                    {category.title}
                  </h4>
                  <ul className="space-y-1">
                    {Object.entries(category.items).map(
                      ([itemKey, itemLabel]: [string, any]) => (
                        <li key={itemKey}>
                          <Link
                            href={`/${lang}/docs/${key}/${itemKey}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                          >
                            <span className="flex-1">{itemLabel}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-8 md:p-12 lg:p-16">
          <div className="max-w-3xl">{children}</div>
        </main>

        {/* On this page (Optional Right Sidebar) */}
        <aside className="w-64 hidden xl:block h-[calc(100vh-64px)] sticky top-16 p-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            On this page
          </h4>
          <ul className="space-y-3 text-sm border-l border-slate-100 pl-4">
            <li>
              <a href="#" className="text-primary font-medium">
                Overview
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                Core concepts
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                Next steps
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
