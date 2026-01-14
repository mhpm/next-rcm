import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { i18n } from '@/i18n/config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export default async function DashboardRedirect() {
  const hdrs = await headers();
  const negotiatorHeaders: Record<string, string> = {};
  for (const [key, value] of hdrs) negotiatorHeaders[key] = value;
  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  // Redirect to the localized dashboard
  redirect(`/${locale}/dashboard`);
}
