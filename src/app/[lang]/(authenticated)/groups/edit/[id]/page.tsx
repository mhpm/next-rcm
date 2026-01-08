import { getGroupById } from '../../actions/groups.actions';
import EditGroupClient from './EditGroupClient';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const group = await getGroupById(id);

  if (!group) {
    notFound();
  }

  return <EditGroupClient group={group} />;
}
