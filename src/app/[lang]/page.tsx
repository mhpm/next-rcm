import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Users,
  CalendarDays,
  BarChart3,
  Shield,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { stackServerApp } from '@/stack/server';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { PricingSection } from '@/components/PricingSection';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: `${dict.hero.title} - ${dict.hero.subtitle}`,
    description: dict.hero.description,
    openGraph: {
      title: `${dict.hero.title} - ${dict.hero.subtitle}`,
      description: dict.hero.description,
      type: 'website',
      locale: lang,
      images: [
        {
          url: '/icon.svg',
          width: 512,
          height: 512,
          alt: 'MultiplyNet Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.hero.title,
      description: dict.hero.subtitle,
      images: ['/icon.svg'],
    },
    alternates: {
      languages: {
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const user = await stackServerApp.getUser();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MultiplyNet',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: dict.hero.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'MultiplyNet',
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 selection:bg-primary/30 overflow-x-hidden relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Background Gradients/Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-100 h-100 bg-primary/15 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-150 h-150 bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <header className="px-6 h-20 flex items-center justify-between border-b border-white/5 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-3 font-bold text-xl text-white tracking-tight">
          <Logo size="md" className="shadow-primary/20" />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            MultiplyNet
          </span>
        </div>
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link
            href="#features"
            className="hover:text-white transition-colors duration-200"
          >
            {dict.nav.features}
          </Link>
          <Link
            href="#testimonials"
            className="hover:text-white transition-colors duration-200"
          >
            {dict.nav.testimonials}
          </Link>
          <Link
            href="#pricing"
            className="hover:text-white transition-colors duration-200"
          >
            {dict.nav.pricing}
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <Link
            href={`/${lang}/security`}
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
          >
            <Shield className="h-3.5 w-3.5" />
            {dict.nav.security}
          </Link>
          <Link
            href={`/${lang}/docs`}
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            {dict.nav.docs}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          {user ? (
            <Link href={`/${lang}/dashboard`}>
              <Button className="relative overflow-hidden group bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full px-6 transition-all duration-300">
                <span className="relative z-10 flex items-center">
                  {dict.nav.dashboard}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href={`/${lang}/sign-in`} className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full px-5"
                >
                  {dict.nav.signIn}
                </Button>
              </Link>
              <Link href={`/${lang}/sign-in`}>
                <Button className="relative overflow-hidden group bg-primary hover:bg-primary/90 text-white border-0 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] rounded-full px-6 transition-all duration-300 hover:scale-105">
                  <span className="relative z-10 flex items-center">
                    {dict.nav.dashboard}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <section className="pt-24 pb-32 px-6 max-w-7xl mx-auto overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Copy + CTAs */}
            <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {dict.hero.newVersion}
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
                  {dict.hero.title.split(' ').map((word, i) => (
                    <span
                      key={i}
                      className={
                        i >= 3
                          ? 'text-primary bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400'
                          : ''
                      }
                    >
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                <p className="text-xl text-slate-300 max-w-xl leading-relaxed font-medium">
                  {dict.hero.subtitle}
                </p>
                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                  {dict.hero.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <Link href={`/${lang}/dashboard`}>
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-105 border-0"
                  >
                    {dict.nav.dashboard}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-105"
                >
                  {dict.hero.demo}
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-slate-500">Churches</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-white">20k+</div>
                  <div className="text-sm text-slate-500">Active Cells</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-slate-500">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Column: Dashboard Mockup */}
            <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="relative w-full max-w-[640px] aspect-[4/3] rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-purple-500/10 opacity-50" />

                {/* Mockup Header */}
                <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="mx-auto w-32 h-1.5 bg-white/10 rounded-full" />
                </div>

                {/* Mockup Content */}
                <div className="p-6 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1 h-24 rounded-xl bg-white/5 border border-white/5 p-4 space-y-3">
                      <div className="w-1/2 h-2 bg-white/10 rounded-full" />
                      <div className="w-3/4 h-4 bg-white/20 rounded-full" />
                    </div>
                    <div className="flex-1 h-24 rounded-xl bg-primary/10 border border-primary/20 p-4 space-y-3">
                      <div className="w-1/2 h-2 bg-primary/20 rounded-full" />
                      <div className="w-3/4 h-4 bg-primary/40 rounded-full" />
                    </div>
                  </div>
                  <div className="h-48 rounded-xl bg-white/5 border border-white/5 p-6 relative overflow-hidden">
                    <div className="flex justify-between items-end h-full gap-2">
                      {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/20 rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-white/5 rounded-full" />
                    <div className="h-3 w-5/6 bg-white/5 rounded-full" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 -right-8 w-48 p-4 rounded-2xl bg-slate-800/80 backdrop-blur-2xl border border-white/10 shadow-2xl animate-bounce-slow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-xs font-bold text-white">
                      +24% Growth
                    </div>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-emerald-500" />
                  </div>
                </div>

                <div className="absolute bottom-1/4 -left-8 w-48 p-4 rounded-2xl bg-slate-800/80 backdrop-blur-2xl border border-white/10 shadow-2xl animate-float">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-white">
                      12 New Cells
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-slate-800 bg-slate-700"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -z-10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
            </div>
          </div>
        </section>

        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-xl group">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-purple-500/5 opacity-50" />
            <div className="aspect-video flex items-center justify-center text-slate-500 bg-grid-white/[0.02] relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary/5 skew-x-12 animate-pulse" />

              {/* Dashboard Mockup - Main Preview */}
              <div className="relative w-4/5 aspect-[16/10] bg-slate-950 rounded-xl border border-white/10 shadow-2xl overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-700">
                <div className="h-8 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
                  </div>
                </div>
                <div className="p-4 grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-4">
                    <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                    <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="h-16 rounded-lg bg-primary/10 border border-primary/20" />
                    <div className="h-48 rounded-lg bg-white/5 border border-white/5" />
                  </div>
                </div>
              </div>

              {/* Caption Overlay */}
              <div className="absolute inset-0 flex items-end justify-center pb-12">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <p className="text-sm md:text-base font-semibold text-white tracking-wide">
                    {dict.hero.preview}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-3xl z-0" />
          <div className="container px-6 mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                {dict.features.title}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                {dict.features.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title={dict.features.cells.title}
                description={dict.features.cells.description}
                icon={<Users className="h-8 w-8 text-primary" />}
                featured
              />
              <FeatureCard
                title={dict.features.events.title}
                description={dict.features.events.description}
                icon={<CalendarDays className="h-8 w-8 text-primary" />}
              />
              <FeatureCard
                title={dict.features.reports.title}
                description={dict.features.reports.description}
                icon={<BarChart3 className="h-8 w-8 text-primary" />}
              />
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-24 relative bg-slate-900/30">
          <div className="container px-6 mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                {dict.testimonials.title}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                {dict.testimonials.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {dict.testimonials.list.map((testimonial, i) => (
                <TestimonialCard
                  key={i}
                  name={testimonial.name}
                  role={testimonial.role}
                  content={testimonial.content}
                  metrics={
                    i === 0
                      ? { label: 'Cell Growth', value: '+200%' }
                      : i === 1
                      ? { label: 'Reporting Time', value: '-80%' }
                      : { label: 'Strategic Decisions', value: 'Real-time' }
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <PricingSection dict={dict} lang={lang} />

        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-linear-to-br from-primary/20 via-slate-900 to-purple-500/20 border border-white/10 p-12 md:p-20 text-center relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {dict.finalCta.title}
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                {dict.finalCta.subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-6">
                <Link href={`/${lang}/dashboard`}>
                  <Button
                    size="lg"
                    className="h-16 px-10 text-xl rounded-full bg-white text-slate-900 hover:bg-slate-200 font-bold shadow-2xl shadow-white/10 transition-transform hover:scale-105 border-0"
                  >
                    {dict.finalCta.primary}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 text-xl rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-transform hover:scale-105"
                >
                  {dict.finalCta.secondary}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl text-slate-500 text-sm relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p>
            &copy; {new Date().getFullYear()} MultiplyNet. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-8">
            <Link
              href={`/${lang}/security`}
              className="hover:text-white transition-colors"
            >
              {dict.nav.security}
            </Link>
            <Link
              href={`/${lang}/docs`}
              className="hover:text-white transition-colors"
            >
              {dict.nav.docs}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  featured = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  featured?: boolean;
}) {
  return (
    <div
      className={`group p-8 rounded-3xl border transition-all duration-500 backdrop-blur-sm relative overflow-hidden ${
        featured
          ? 'bg-primary/5 border-primary/20 shadow-2xl shadow-primary/10'
          : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5'
      }`}
    >
      {/* Hover Gradient Blob */}
      <div
        className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150 opacity-0 group-hover:opacity-100 ${
          featured ? 'bg-primary/20 opacity-100' : 'bg-primary/10'
        }`}
      />

      <div
        className={`mb-6 inline-flex p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10 ${
          featured
            ? 'bg-primary/10 border-primary/20 shadow-lg shadow-primary/20'
            : 'bg-white/5 border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20'
        }`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white transition-colors relative z-10">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors relative z-10">
        {description}
      </p>
      <Link
        href="#"
        className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors gap-1 group/link relative z-10"
      >
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
      </Link>

      {featured && (
        <div className="absolute top-0 right-0 p-4 z-10">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
        </div>
      )}
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  content,
  metrics,
}: {
  name: string;
  role: string;
  content: string;
  metrics?: { label: string; value: string };
}) {
  return (
    <div className="p-8 rounded-3xl border border-white/5 bg-white/3 hover:bg-white/5 transition-all duration-500 backdrop-blur-sm flex flex-col h-full group relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/5">
      {/* Background Decor */}
      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150 opacity-0 group-hover:opacity-100" />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/10 group-hover:ring-primary/30">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-white group-hover:text-primary transition-colors">
            {name}
          </h4>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>

      <p className="text-slate-300 leading-relaxed italic mb-8 flex-1 relative z-10 group-hover:text-slate-200 transition-colors">
        "{content}"
      </p>

      {metrics && (
        <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
          <span className="text-sm text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
            {metrics.label}
          </span>
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 group-hover:from-primary group-hover:to-purple-300 transition-all">
            {metrics.value}
          </span>
        </div>
      )}
    </div>
  );
}
