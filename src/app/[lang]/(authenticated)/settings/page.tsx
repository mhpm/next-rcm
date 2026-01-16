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

  // Buscar tipos de iglesia
  const churchTypes = await prisma.churchType.findMany({
    orderBy: { name: 'asc' },
  });

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
        email: true,
        phone: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        typeId: true,
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
        email: true,
        phone: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        typeId: true,
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
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{dict.settingsPage.title}</h1>
      <SettingsForm church={church} churchTypes={churchTypes} dict={dict} />
    </div>
  );
}
