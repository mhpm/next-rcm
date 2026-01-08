import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Users,
  CalendarDays,
  BarChart3,
  Check,
} from 'lucide-react';
import { stackServerApp } from '@/stack/server';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import { LanguageToggle } from '@/components/LanguageToggle';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const user = await stackServerApp.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 selection:bg-primary/30 overflow-hidden relative">
      {/* Background Gradients/Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-100 h-100 bg-primary/15 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-150 h-150 bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <header className="px-6 h-20 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-3 font-bold text-xl text-white tracking-tight">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            M
          </div>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            MultiplyNet
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            {dict.nav.features}
          </Link>
          <Link
            href="#"
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
        </nav>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          {user ? (
            <Link href="/dashboard">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full px-6">
                {dict.nav.dashboard}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0 shadow-lg shadow-primary/25 rounded-full px-6 transition-all duration-300 hover:scale-105">
                {dict.nav.signIn}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <section className="pt-32 pb-24 px-6 text-center space-y-10 max-w-5xl mx-auto">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-primary backdrop-blur-sm mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {dict.hero.newVersion}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-linear-to-r from-white via-primary to-primary/60 mb-2">
              {dict.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium mb-6">
              {dict.hero.subtitle}
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              {dict.hero.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg rounded-full bg-white text-slate-900 hover:bg-slate-200 font-bold shadow-xl shadow-white/10 transition-transform hover:scale-105"
                >
                  {dict.nav.dashboard}
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg rounded-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-xl shadow-purple-500/30 transition-transform hover:scale-105 border-0"
                >
                  {dict.hero.cta}
                </Button>
              </Link>
            )}
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105"
            >
              {dict.hero.demo}
            </Button>
          </div>

          <div className="pt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-xl group">
              <div className="absolute inset-0 bg-linear-to-tr from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="aspect-video flex items-center justify-center text-slate-500 bg-grid-white/[0.02]">
                {/* Decorative elements resembling UI */}
                <div className="w-full h-full p-8 flex flex-col gap-4 opacity-50">
                  <div className="h-8 bg-white/10 rounded-lg w-1/3" />
                  <div className="flex gap-4 h-full">
                    <div className="w-1/4 h-full bg-white/5 rounded-lg" />
                    <div className="w-3/4 h-full bg-white/5 rounded-lg flex flex-col gap-4 p-4">
                      <div className="w-full h-32 bg-white/5 rounded-lg" />
                      <div className="w-full h-32 bg-white/5 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-medium bg-black/50 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                    {dict.hero.preview}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative">
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
                icon={<Users className="h-8 w-8 text-purple-400" />}
              />
              <FeatureCard
                title={dict.features.events.title}
                description={dict.features.events.description}
                icon={<CalendarDays className="h-8 w-8 text-blue-400" />}
              />
              <FeatureCard
                title={dict.features.reports.title}
                description={dict.features.reports.description}
                icon={<BarChart3 className="h-8 w-8 text-emerald-400" />}
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 relative bg-slate-900/30">
          <div className="container px-6 mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                {dict.pricing.title}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                {dict.pricing.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <PricingCard
                name={dict.pricing.free.name}
                price={dict.pricing.free.price}
                priceMXN={dict.pricing.free.priceMXN}
                description={dict.pricing.free.description}
                features={dict.pricing.free.features}
                cta={dict.pricing.free.cta}
                monthly={dict.pricing.monthly}
                lang={lang}
              />

              {/* Plus Plan */}
              <PricingCard
                name={dict.pricing.plus.name}
                price={dict.pricing.plus.price}
                priceMXN={dict.pricing.plus.priceMXN}
                description={dict.pricing.plus.description}
                features={dict.pricing.plus.features}
                cta={dict.pricing.plus.cta}
                monthly={dict.pricing.monthly}
                popular
                lang={lang}
              />

              {/* Premium Plan */}
              <PricingCard
                name={dict.pricing.premium.name}
                price={dict.pricing.premium.price}
                priceMXN={dict.pricing.premium.priceMXN}
                description={dict.pricing.premium.description}
                features={dict.pricing.premium.features}
                cta={dict.pricing.premium.cta}
                monthly={dict.pricing.monthly}
                extraCost={dict.pricing.premium.extraCost}
                lang={lang}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl text-center text-slate-500 text-sm relative z-10">
        <div className="flex justify-center gap-6 mb-8">
          {['Twitter', 'GitHub', 'Discord'].map((social) => (
            <a
              key={social}
              href="#"
              className="hover:text-white transition-colors"
            >
              {social}
            </a>
          ))}
        </div>
        <p>
          &copy; {new Date().getFullYear()} MultiplyNet. {dict.footer.rights}
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group p-8 rounded-3xl border border-white/5 bg-white/3 hover:bg-white/[0.08] hover:border-white/10 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-sm">
      <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
        {description}
      </p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  priceMXN,
  description,
  features,
  cta,
  monthly,
  extraCost,
  popular = false,
  lang,
}: {
  name: string;
  price: string;
  priceMXN: string;
  description: string;
  features: string[];
  cta: string;
  monthly: string;
  extraCost?: string;
  popular?: boolean;
  lang: Locale;
}) {
  const isUSD = lang === 'en';

  return (
    <div
      className={`relative p-8 rounded-3xl border flex flex-col ${
        popular
          ? 'bg-white/10 border-primary/50 shadow-2xl shadow-primary/20'
          : 'bg-white/5 border-white/5 hover:bg-white/[0.08] transition-colors'
      } backdrop-blur-sm`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className="text-slate-400 text-sm h-10">{description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">
            {isUSD ? '$' : '$'}
            {isUSD ? price : priceMXN}
          </span>
          <span className="text-slate-500">
            {isUSD ? 'USD' : 'MXN'} {monthly}
          </span>
        </div>
        {extraCost && (
          <p className="text-xs text-primary font-medium mt-2 bg-primary/10 inline-block px-2 py-1 rounded-md border border-primary/20">
            {extraCost}
          </p>
        )}
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
            <Check className="h-5 w-5 text-primary shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className={`w-full rounded-full h-12 font-bold ${
          popular
            ? 'bg-primary hover:bg-primary/90 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
        }`}
      >
        {cta}
      </Button>
    </div>
  );
}
