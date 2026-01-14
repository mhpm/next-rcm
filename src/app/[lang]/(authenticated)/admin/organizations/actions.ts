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

  const orgs = await prisma.churches.findMany({
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

  // Enrich organizations with owner's principal church name
  const orgsWithDetails = await Promise.all(
    orgs.map(async (org) => {
      // Find the OWNER admin record
      const ownerAdmin = org.admins.find((a) => a.role === 'OWNER');

      let ownerPrincipalChurchName = null;

      // If we found an admin record with OWNER role, use that user_id/email to find their principal church
      // Fallback to org.owner_id
      if (ownerAdmin) {
        // We need to check both user_id and email because different churches might be linked differently
        const searchConditions: any[] = [];

        if (ownerAdmin.user_id) {
          searchConditions.push({ owner_id: ownerAdmin.user_id });
        }

        if (ownerAdmin.email) {
          searchConditions.push({
            owner_id: { equals: ownerAdmin.email, mode: 'insensitive' },
          });
        }

        // If we have at least one identifier, search for the oldest church owned by ANY of them
        if (searchConditions.length > 0) {
          const principalChurch = await prisma.churches.findFirst({
            where: {
              OR: searchConditions,
            },
            orderBy: { createdAt: 'asc' },
            select: { name: true, id: true },
          });

          if (principalChurch) {
            ownerPrincipalChurchName = principalChurch.name;
          }
        }
      } else if (org.owner_id) {
        // Fallback if no OWNER admin record found (should be rare if data is consistent)
        const principalChurch = await prisma.churches.findFirst({
          where: {
            OR: [
              { owner_id: org.owner_id },
              ...(org.owner_id.includes('@')
                ? [
                    {
                      owner_id: {
                        equals: org.owner_id,
                        mode: 'insensitive' as const,
                      },
                    },
                  ]
                : []),
            ],
          },
          orderBy: { createdAt: 'asc' },
          select: { name: true, id: true },
        });

        if (principalChurch) {
          ownerPrincipalChurchName = principalChurch.name;
        }
      }

      return {
        ...org,
        ownerPrincipalChurchName,
      };
    })
  );

  return orgsWithDetails;
}

export async function createOrganization(data: { name: string; slug: string }) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify permissions:
  // 1. If user is creating their first organization, allow.
  // 2. If user is already an admin/owner of another organization, check "can_create_church" permission.

  const existingMemberships = await prisma.churchAdmins.findMany({
    where: {
      OR: [{ user_id: user.id }, { email: user.primaryEmail || '' }],
    },
  });

  if (existingMemberships.length > 0) {
    // Check if ANY of their memberships allow creation
    // Or strictly: if they are OWNER of at least one, allow.
    // If they are only ADMIN, check for permission.

    const isOwnerOfAny = existingMemberships.some((m) => m.role === 'OWNER');
    const hasPermission = existingMemberships.some((m) => {
      const perms = m.permissions as any;
      return perms?.can_create_church === true;
    });

    if (!isOwnerOfAny && !hasPermission) {
      throw new Error(
        'You do not have permission to create new organizations.'
      );
    }
  }

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

  // Verify permission: Must be OWNER of the church
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
              role: 'OWNER', // STRICTLY OWNER
            },
          },
        },
      ],
    },
  });

  if (!church)
    throw new Error('Permission denied. Only the Owner can add admins.');

  // Prevent inviting the owner themselves or someone who is already the owner
  if (
    church.owner_id === email ||
    (church.owner_id &&
      email &&
      church.owner_id.toLowerCase() === email.toLowerCase())
  ) {
    throw new Error('Este usuario ya es el dueño de la organización.');
  }

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

  // Verify permission: Must be OWNER of the church
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

  // Prevent removing OWNER
  const targetAdmin = await prisma.churchAdmins.findUnique({
    where: { id: adminId },
  });

  if (targetAdmin?.role === 'OWNER') {
    throw new Error('Cannot remove an OWNER administrator');
  }

  await prisma.churchAdmins.delete({
    where: { id: adminId },
  });

  revalidatePath('/admin/organizations');
}
