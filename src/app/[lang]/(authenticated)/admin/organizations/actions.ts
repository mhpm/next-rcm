'use server';

import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack/server';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { sendInvitationEmail } from '@/lib/email';

export async function switchOrganization(slug: string) {
  const cookieStore = await cookies();
  cookieStore.set('church_slug', slug);
  revalidatePath('/');
}

export async function getUserOrganizations() {
  const user = await stackServerApp.getUser();
  if (!user) return [];

  return prisma.churches.findMany({
    where: {
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
    include: {
      admins: true,
      _count: {
        select: {
          members: true,
          cells: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function createOrganization(data: { name: string; slug: string }) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Unauthorized');

  // Check if slug exists
  const exists = await prisma.churches.findUnique({
    where: { slug: data.slug },
  });

  if (exists) {
    throw new Error('Slug already exists');
  }

  const church = await prisma.churches.create({
    data: {
      name: data.name,
      slug: data.slug,
      owner_id: user.id,
      // Add creator as admin too? Not strictly necessary if owner_id covers it,
      // but good for consistency if we move away from owner_id.
      admins: {
        create: {
          user_id: user.id,
          email: user.primaryEmail || '',
          role: 'OWNER',
        },
      },
    },
  });

  revalidatePath('/admin/organizations');
  return church;
}

export async function addAdminToOrganization(churchId: string, email: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify permission: Must be OWNER or ADMIN of the church
  // Also allow if owner_id matches user email (case insensitive)
  const church = await prisma.churches.findFirst({
    where: {
      id: churchId,
      OR: [
        { owner_id: user.id },
        { owner_id: { equals: user.primaryEmail || '', mode: 'insensitive' } },
        {
          admins: {
            some: {
              OR: [{ user_id: user.id }, { email: user.primaryEmail || '' }],
              role: { in: ['OWNER', 'ADMIN'] },
            },
          },
        },
      ],
    },
  });

  if (!church) throw new Error('Permission denied');

  // Check if user is already an admin of ANOTHER church
  const existingAdmin = await prisma.churchAdmins.findFirst({
    where: {
      email: email,
      church_id: { not: churchId },
    },
    include: { church: true },
  });

  if (existingAdmin) {
    throw new Error(
      `Este usuario ya es administrador de la iglesia "${existingAdmin.church.name}". No puede administrar múltiples iglesias.`
    );
  }

  // Check if user is already an admin of THIS church (to avoid duplicates)
  const currentAdmin = await prisma.churchAdmins.findFirst({
    where: {
      email: email,
      church_id: churchId,
    },
  });

  if (currentAdmin) {
    throw new Error('Este usuario ya es administrador de esta iglesia.');
  }

  // Create admin invite
  await prisma.churchAdmins.create({
    data: {
      church_id: churchId,
      email: email,
      role: 'ADMIN',
    },
  });

  // Send invitation email
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || headersList.get('host') || '';
    // Si obtenemos solo el host (ej: localhost:3000), le pegamos el protocolo.
    // En producción con Vercel/Neon esto puede variar, pero origin suele ser seguro.
    const protocol = origin.includes('http') ? '' : 'https://';
    const baseUrl = origin.startsWith('http') ? origin : `${protocol}${origin}`;

    await sendInvitationEmail({
      email,
      organizationName: church.name,
      inviterName: user.displayName || user.primaryEmail || 'Un administrador',
      link: `${baseUrl}/admin/organizations`,
    });
  } catch (error) {
    console.error('Failed to send invitation email:', error);
    // No fallamos la request completa, solo logueamos
  }

  revalidatePath('/admin/organizations');
}

export async function resendInvitation(churchId: string, email: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify permission: Must be OWNER or ADMIN of the church
  const church = await prisma.churches.findFirst({
    where: {
      id: churchId,
      OR: [
        { owner_id: user.id },
        {
          admins: {
            some: {
              user_id: user.id,
              role: { in: ['OWNER', 'ADMIN'] },
            },
          },
        },
      ],
    },
  });

  if (!church) throw new Error('Permission denied');

  // Verify that the user is actually an admin of this church (even if pending)
  const adminEntry = await prisma.churchAdmins.findFirst({
    where: {
      church_id: churchId,
      email: email,
    },
  });

  if (!adminEntry) throw new Error('Admin not found in this organization');

  // Send invitation email
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || headersList.get('host') || '';
    const protocol = origin.includes('http') ? '' : 'https://';
    const baseUrl = origin.startsWith('http') ? origin : `${protocol}${origin}`;

    await sendInvitationEmail({
      email,
      organizationName: church.name,
      inviterName: user.displayName || user.primaryEmail || 'Un administrador',
      link: `${baseUrl}/admin/organizations`,
    });
  } catch (error: any) {
    console.error('Failed to send invitation email:', error);
    throw new Error(error.message || 'Failed to send email');
  }

  return { success: true };
}

export async function removeAdminFromOrganization(
  churchId: string,
  adminId: string
) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify permission
  // Must be OWNER of the church (either by owner_id or via churchAdmins with role OWNER)
  const church = await prisma.churches.findFirst({
    where: {
      id: churchId,
      OR: [
        { owner_id: user.id },
        { owner_id: { equals: user.primaryEmail || '', mode: 'insensitive' } },
        {
          admins: {
            some: {
              OR: [{ user_id: user.id }, { email: user.primaryEmail || '' }],
              role: 'OWNER',
            },
          },
        },
      ],
    },
  });

  if (!church) throw new Error('Permission denied');

  await prisma.churchAdmins.delete({
    where: { id: adminId },
  });

  revalidatePath('/admin/organizations');
}
