import { getGroupById } from '../../actions/groups.actions';
import EditGroupClient from './EditGroupClient';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = await getGroupById(id);

  if (!group) {
    notFound();
  }

  return <EditGroupClient group={group} />;
}
