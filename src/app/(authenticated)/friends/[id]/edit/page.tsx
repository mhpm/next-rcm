import { notFound } from 'next/navigation';
import { FriendForm } from '../../components/FriendForm';
import { getFriendById } from '../../actions/friends.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { connection } from 'next/server';

export default async function EditFriendPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const friend = await getFriendById(id);

  if (!friend) {
    notFound();
  }

  // Transform data to match form values
  const initialData = {
    name: friend.name,
    phone: friend.phone || '',
    isBaptized: friend.isBaptized,
    cell_id: friend.cell_id,
    spiritual_father_id: friend.spiritual_father_id || '',
    invited_by_id: friend.invited_by_id || undefined,
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Amigo</CardTitle>
          <CardDescription>
            Actualiza los datos del amigo invitado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FriendForm initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}
