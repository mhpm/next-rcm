'use server';

import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack/server';
import { revalidatePath } from 'next/cache';

export async function linkOrganization(churchId: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. Buscar la iglesia por ID
  const church = await prisma.churches.findUnique({
    where: { id: churchId },
  });

  if (!church) {
    throw new Error('Church not found');
  }

  // Verify permissions for linking
  // Similar logic to createOrganization: check if user is allowed to link churches
  const existingMemberships = await prisma.churchAdmins.findMany({
    where: {
      OR: [{ user_id: user.id }, { email: user.primaryEmail || '' }],
    },
  });

  if (existingMemberships.length > 0) {
    const isOwnerOfAny = existingMemberships.some((m) => m.role === 'OWNER');
    const hasPermission = existingMemberships.some((m) => {
      const perms = m.permissions as any;
      return perms?.can_link_church === true;
    });

    if (!isOwnerOfAny && !hasPermission) {
      throw new Error(
        'You do not have permission to link existing organizations.'
      );
    }
  }

  // 2. Verificar que no esté ya vinculada a este usuario como dueño
  if (
    church.owner_id === user.id ||
    (church.owner_id &&
      user.primaryEmail &&
      church.owner_id.toLowerCase() === user.primaryEmail.toLowerCase())
  ) {
    throw new Error('You are already the owner of this church');
  }

  // 3. Obtener el antiguo dueño para convertirlo en admin
  const previousOwnerId = church.owner_id;

  // 4. Actualizar el dueño de la iglesia
  await prisma.$transaction(async (tx) => {
    // Convertir antiguo dueño en admin (si existe y no es el mismo usuario)
    if (previousOwnerId && previousOwnerId !== user.id) {
      // Buscar si ya existe como admin
      const existingAdmin = await tx.churchAdmins.findFirst({
        where: {
          church_id: churchId,
          OR: [
            { user_id: previousOwnerId },
            { email: previousOwnerId }, // Si owner_id era un email
          ],
        },
      });

      if (existingAdmin) {
        // Asegurar que tenga rol de ADMIN
        await tx.churchAdmins.update({
          where: { id: existingAdmin.id },
          data: { role: 'ADMIN' },
        });
      } else {
        // Crear nuevo registro de admin para el antiguo dueño
        // Intentamos inferir si es email o user_id
        const isEmail = previousOwnerId.includes('@');
        await tx.churchAdmins.create({
          data: {
            church_id: churchId,
            user_id: isEmail ? undefined : previousOwnerId,
            email: isEmail ? previousOwnerId : '', // Prisma requires string, not undefined
            role: 'ADMIN',
          },
        });
      }
    }

    // Actualizar la iglesia con el nuevo dueño
    await tx.churches.update({
      where: { id: churchId },
      data: {
        owner_id: user.id,
      },
    });

    // Asegurar que el nuevo dueño tenga registro de admin con rol OWNER
    const newOwnerAdmin = await tx.churchAdmins.findFirst({
      where: {
        church_id: churchId,
        OR: [{ user_id: user.id }, { email: user.primaryEmail || '' }],
      },
    });

    if (newOwnerAdmin) {
      await tx.churchAdmins.update({
        where: { id: newOwnerAdmin.id },
        data: { role: 'OWNER' },
      });
    } else {
      await tx.churchAdmins.create({
        data: {
          church_id: churchId,
          user_id: user.id,
          email: user.primaryEmail || '',
          role: 'OWNER',
        },
      });
    }
  });

  revalidatePath('/admin/organizations');
  return { success: true };
}
