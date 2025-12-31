import { stackServerApp } from '@/stack/server';
import { redirect } from 'next/navigation';
import AuthenticatedLayoutClient from './AuthenticatedLayoutClient';
import { getUserChurchName } from '@/actions/churchContext';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const churchName = await getUserChurchName();

  return (
    <AuthenticatedLayoutClient churchName={churchName}>
      {children}
    </AuthenticatedLayoutClient>
  );
}
