import { stackServerApp } from '@/stack/server';
import prisma from '@/lib/prisma';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import { SettingsForm } from './components/SettingsForm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect(`/${lang}/sign-in`);
  }

  const dict = await getDictionary(lang);

  // Obtener el slug de la cookie para saber qué iglesia está seleccionada actualmente
  const cookieStore = await cookies();
  const currentChurchSlug = cookieStore.get('church_slug')?.value;

  // Buscar iglesia asociada al usuario (dueño o admin)
  // Si hay una iglesia seleccionada en la cookie, intentamos cargar esa primero
  let church = null;

  if (currentChurchSlug) {
    church = await prisma.churches.findFirst({
      where: {
        slug: currentChurchSlug,
        OR: [
          { owner_id: user.id },
          {
            owner_id: {
              equals: user.primaryEmail,
              mode: 'insensitive',
            },
          },
          {
            admins: {
              some: {
                OR: [{ email: user.primaryEmail || '' }, { user_id: user.id }],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  // Si no se encontró la iglesia de la cookie (o no había cookie), buscar la principal (dueño) o cualquiera donde sea admin
  if (!church) {
    church = await prisma.churches.findFirst({
      where: {
        OR: [
          { owner_id: user.id },
          {
            owner_id: {
              equals: user.primaryEmail,
              mode: 'insensitive',
            },
          },
          {
            admins: {
              some: {
                OR: [{ email: user.primaryEmail || '' }, { user_id: user.id }],
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  if (!church) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold">
          No se encontró ninguna iglesia asociada
        </h1>
        <p className="text-muted-foreground">
          Debes ser dueño o administrador de una iglesia para ver esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dict.header.settings}
          </h1>
          <p className="text-muted-foreground">
            {dict.settingsPage.churchDetailsDescription}
          </p>
        </div>
        <SettingsForm church={church} lang={lang} dict={dict} />
      </div>
    </div>
  );
}
