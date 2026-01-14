import { stackServerApp } from '@/stack/server';
import { redirect } from 'next/navigation';
import AuthenticatedLayoutClient from './AuthenticatedLayoutClient';
import { getUserChurchName, getUserChurchSlug } from '@/actions/churchContext';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import { cookies } from 'next/headers';
import { ChurchCookieSyncer } from '@/components/ChurchCookieSyncer';

export default async function AuthenticatedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect(`/${lang}/sign-in`);
  }

  const churchName = await getUserChurchName();
  const userChurchSlug = await getUserChurchSlug();
  const cookieStore = await cookies();
  const currentCookieSlug = cookieStore.get('church_slug')?.value;

  const dict = await getDictionary(lang);

  return (
    <AuthenticatedLayoutClient churchName={churchName} dict={dict} lang={lang}>
      <ChurchCookieSyncer
        userChurchSlug={userChurchSlug}
        currentCookieSlug={currentCookieSlug}
      />
      {children}
    </AuthenticatedLayoutClient>
  );
}
