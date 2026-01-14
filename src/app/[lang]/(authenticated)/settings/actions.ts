'use server';

import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack/server';
import { revalidatePath } from 'next/cache';

/**
 * Actualiza el nombre de la iglesia actual
 */
export async function updateChurchName(churchId: string, newName: string) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error('No autenticado');
    }

    // Verificar que el usuario tenga permisos sobre esta iglesia
    const church = await prisma.churches.findFirst({
      where: {
        id: churchId,
        OR: [
          { owner_id: user.id },
          { owner_id: { equals: user.primaryEmail, mode: 'insensitive' } },
          {
            admins: {
              some: {
                OR: [{ email: user.primaryEmail || '' }, { user_id: user.id }],
              },
            },
          },
        ],
      },
    });

    if (!church) {
      throw new Error('No tienes permisos para editar esta iglesia');
    }

    if (!newName || newName.trim().length < 3) {
      throw new Error(
        'El nombre de la iglesia debe tener al menos 3 caracteres'
      );
    }

    await prisma.churches.update({
      where: { id: churchId },
      data: { name: newName.trim() },
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating church name:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar el nombre',
    };
  }
}
