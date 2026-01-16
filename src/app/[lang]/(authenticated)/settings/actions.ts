'use server';

import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack/server';
import { revalidatePath } from 'next/cache';

/**
 * Actualiza el nombre de la iglesia actual
 */
export async function updateChurchSettings(
  churchId: string,
  data: {
    name: string;
    email?: string | null;
    phone?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null;
    typeId?: string | null;
  }
) {
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

    if (!data.name || data.name.trim().length < 3) {
      throw new Error(
        'El nombre de la iglesia debe tener al menos 3 caracteres'
      );
    }

    await prisma.churches.update({
      where: { id: churchId },
      data: {
        name: data.name.trim(),
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        typeId: data.typeId || null,
      },
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating church settings:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar la configuración',
    };
  }
}

/**
 * Acciones para gestionar tipos de iglesia
 */
export async function createChurchType(data: { name: string; description?: string }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error('No autenticado');

    // Validación simple
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('El nombre del tipo debe tener al menos 2 caracteres');
    }

    await prisma.churchType.create({
      data: {
        name: data.name.trim(),
        description: data.description,
      },
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al crear el tipo' };
  }
}

export async function updateChurchType(id: string, data: { name: string; description?: string }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error('No autenticado');

    await prisma.churchType.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description,
      },
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar el tipo' };
  }
}

export async function deleteChurchType(id: string) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error('No autenticado');

    await prisma.churchType.delete({
      where: { id },
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    // Manejar error de llave foránea si es necesario
    if (error.code === 'P2003') {
      return { success: false, error: 'No se puede eliminar porque hay iglesias usando este tipo' };
    }
    return { success: false, error: error.message || 'Error al eliminar el tipo' };
  }
}

