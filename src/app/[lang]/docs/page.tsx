import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import { BookOpen, MessageSquare, Rocket, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DocsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict.docs;

  const quickLinks = [
    {
      icon: <Rocket className="h-6 w-6 text-blue-500" />,
      title: d.categories.gettingStarted.title,
      description:
        'Everything you need to set up your account and church structure.',
      href: `/${lang}/docs/gettingStarted/introduction`,
      color: 'bg-blue-50',
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: d.categories.coreFeatures.title,
      description: 'Deep dive into cell management, events, and reports.',
      href: `/${lang}/docs/coreFeatures/cells`,
      color: 'bg-amber-50',
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-500" />,
      title: d.categories.roles.title,
      description: 'Learn about permissions for pastors, leaders, and admins.',
      href: `/${lang}/docs/roles/pastor`,
      color: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {d.title}
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed">{d.subtitle}</p>
      </section>

      <div className="grid sm:grid-cols-2 gap-6">
        {quickLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="group p-6 rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              {link.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">{link.title}</h3>
              <p className="text-sm text-slate-500">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="pt-8 border-t border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Browse by Module
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(d.categories).map(
            ([key, category]: [string, any]) => (
              <Link
                key={key}
                href={`/${lang}/docs/${key}/${Object.keys(category.items)[0]}`}
                className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 hover:bg-white hover:border-primary/20 hover:text-primary transition-all"
              >
                {category.title}
              </Link>
            )
          )}
        </div>
      </section>

      <section className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Need help?</h2>
          <p className="text-slate-400 mb-6 max-w-md">
            Our support team is available to help you with any questions or
            technical issues you might have.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={`/${lang}/docs/support/contact`}>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">
                Contact Support
              </Button>
            </Link>
            <Link href="#">
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white rounded-full"
              >
                Join Community
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageSquare className="h-32 w-32" />
        </div>
      </section>
    </div>
  );
}
