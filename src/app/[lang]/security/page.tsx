import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import {
  Shield,
  Lock,
  Users,
  Cloud,
  Zap,
  ScrollText,
  Mail,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SecurityPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);
  const s = dict.security;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-primary/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
              <ChevronLeft className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              MultiplyNet
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/docs`}>
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                {dict.nav.docs}
              </Button>
            </Link>
            <Link href={`/${lang}#pricing`}>
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                {dict.nav.pricing}
              </Button>
            </Link>
            <Link href={`/${lang}/sign-in`}>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                {dict.nav.signIn}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Security Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {s.title}
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">{s.subtitle}</p>
        </div>

        {/* Security Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {/* Data Protection */}
          <SecurityCard
            icon={<Lock className="h-6 w-6 text-primary" />}
            title={s.dataProtection.title}
            description={s.dataProtection.description}
            bullets={s.dataProtection.bullets}
          />

          {/* Access Control */}
          <SecurityCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title={s.accessControl.title}
            description={s.accessControl.description}
            bullets={s.accessControl.bullets}
          />

          {/* Infrastructure */}
          <SecurityCard
            icon={<Cloud className="h-6 w-6 text-primary" />}
            title={s.infrastructure.title}
            description={s.infrastructure.description}
            bullets={s.infrastructure.bullets}
          />

          {/* Reliability */}
          <SecurityCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title={s.reliability.title}
            description={s.reliability.description}
            bullets={s.reliability.bullets}
          />

          {/* Privacy */}
          <SecurityCard
            icon={<ScrollText className="h-6 w-6 text-primary" />}
            title={s.privacy.title}
            description={s.privacy.description}
            bullets={s.privacy.bullets}
          />

          {/* Contact */}
          <div className="p-8 rounded-3xl border border-primary/20 bg-primary/5 flex flex-col items-center text-center justify-center">
            <div className="bg-primary/10 p-3 rounded-2xl mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {s.contact.title}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {s.contact.description}
            </p>
            <a
              href={`mailto:${s.contact.email}`}
              className="text-lg font-bold text-primary hover:underline transition-all"
            >
              {s.contact.email}
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="max-w-2xl mx-auto text-center border-t border-white/5 pt-20">
          <p className="text-slate-500 text-sm">
            MultiplyNet is committed to maintaining the highest standards of
            data security and privacy. For more details, please review our{' '}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  description,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
      <div className="bg-white/5 p-3 rounded-2xl w-fit mb-6 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-3">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
