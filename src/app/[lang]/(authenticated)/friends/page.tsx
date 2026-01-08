import { getFriends } from './actions/friends.actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { connection } from 'next/server';
import { FriendsTable } from './components/FriendsTable';
import { Locale } from '@/i18n/config';

export default async function FriendsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  await connection();
  const { friends } = await getFriends({ limit: 1000 }); // Get all for client-side filtering/pagination

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Amigos</h1>
          <p className="text-muted-foreground">
            Gestión de amigos y seguimiento evangelístico
          </p>
        </div>
        <Button asChild>
          <Link href={`/${lang}/friends/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Amigo
          </Link>
        </Button>
      </div>

      <div className="border rounded-md">
        <FriendsTable friends={friends} />
      </div>
    </div>
  );
}
