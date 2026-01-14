'use server';

import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack/server';
import { revalidatePath } from 'next/cache';

export async function updateAdminPermissions(
  adminId: string,
  data: {
    name?: string;
    permissions?: any;
  }
) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verificar que el usuario que realiza la acción sea Owner o Admin de la iglesia a la que pertenece el adminId
  // Primero obtenemos el church_id del admin que queremos editar
  const targetAdmin = await prisma.churchAdmins.findUnique({
    where: { id: adminId },
    select: { church_id: true },
  });

  if (!targetAdmin) throw new Error('Admin not found');

  // Prevent editing OWNER
  const targetAdminRecord = await prisma.churchAdmins.findUnique({
    where: { id: adminId },
    select: { role: true },
  });

  if (targetAdminRecord?.role === 'OWNER') {
    throw new Error('Cannot edit an OWNER administrator');
  }

  // Verificar permisos sobre esa iglesia
  const hasOwnerPermission = await prisma.churchAdmins.findFirst({
    where: {
      church_id: targetAdmin.church_id,
      OR: [{ user_id: user.id }, { email: user.primaryEmail || '' }],
      role: 'OWNER', // STRICTLY OWNER
    },
  });

  // También permitir si es el owner directo en la tabla churches
  const isDirectOwner = await prisma.churches.findFirst({
    where: {
      id: targetAdmin.church_id,
      OR: [
        { owner_id: user.id },
        { owner_id: { equals: user.primaryEmail || '', mode: 'insensitive' } },
      ],
    },
  });

  const isOwner = !!hasOwnerPermission || !!isDirectOwner;

  // Si no es owner, verificar si se está editando a sí mismo
  const isSelf = await prisma.churchAdmins.findFirst({
    where: {
      id: adminId,
      OR: [{ user_id: user.id }, { email: user.primaryEmail || '' }],
    },
  });

  if (!isOwner && !isSelf) {
    throw new Error(
      'You do not have permission to edit admins for this church'
    );
  }

  // Si es self pero no owner, solo permitir actualizar el nombre
  const updateData: any = {
    name: data.name,
  };

  if (isOwner) {
    updateData.permissions = data.permissions;
  }

  await prisma.churchAdmins.update({
    where: { id: adminId },
    data: updateData,
  });

  revalidatePath('/admin/organizations');
  return { success: true };
}
