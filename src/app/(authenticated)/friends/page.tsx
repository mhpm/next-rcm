import { Suspense } from 'react';
import { getFriends } from './actions/friends.actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function FriendsPage() {
  const { friends } = await getFriends();

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
          <Link href="/friends/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Amigo
          </Link>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Célula</TableHead>
              <TableHead>Padre Espiritual</TableHead>
              <TableHead>Invitado Por</TableHead>
              <TableHead>Bautizado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {friends.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  No hay amigos registrados.
                </TableCell>
              </TableRow>
            ) : (
              friends.map((friend) => (
                <TableRow key={friend.id}>
                  <TableCell className="font-medium">{friend.name}</TableCell>
                  <TableCell>{friend.cell?.name || 'Sin Célula'}</TableCell>
                  <TableCell>
                    {friend.spiritualFather
                      ? `${friend.spiritualFather.firstName} ${friend.spiritualFather.lastName}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {friend.invitedBy
                      ? `${friend.invitedBy.firstName} ${friend.invitedBy.lastName}`
                      : '-'}
                  </TableCell>
                  <TableCell>{friend.isBaptized ? 'Sí' : 'No'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
