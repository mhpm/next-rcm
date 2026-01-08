import { stackServerApp } from '@/stack/server';
import { redirect } from 'next/navigation';
import AuthenticatedLayoutClient from './AuthenticatedLayoutClient';
import { getUserChurchName } from '@/actions/churchContext';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';

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
  const dict = await getDictionary(lang);

  return (
    <AuthenticatedLayoutClient churchName={churchName} dict={dict} lang={lang}>
      {children}
    </AuthenticatedLayoutClient>
  );
}
