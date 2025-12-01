'use server';

import { getChurchPrisma, getChurchId } from '@/actions/churchContext';
import { Prisma } from '@/generated/prisma/client';
import type { Groups, Members } from '@/generated/prisma/client';
import { revalidateTag } from 'next/cache';

export async function getAllGroups(options?: {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: 'name' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}): Promise<{
  groups: (Groups & { leader: Members | null; _count: { members: number } })[];
  total: number;
  hasMore: boolean;
}> {
  const {
    limit = 50,
    offset = 0,
    search,
    orderBy = 'name',
    orderDirection = 'asc',
  } = options || {};

  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const whereClause: Prisma.GroupsWhereInput = { church_id: churchId };
  if (search && search.trim().length > 0) {
    whereClause.OR = [{ name: { contains: search, mode: 'insensitive' } }];
  }

  const findArgs = {
    where: whereClause,
    take: limit,
    skip: offset,
    orderBy: { [orderBy]: orderDirection },
    include: { leader: true, _count: { select: { members: true } } },
  } satisfies Prisma.GroupsFindManyArgs;

  const [groups, total] = await Promise.all([
    prisma.groups.findMany(findArgs) as Promise<
      (Groups & { leader: Members | null; _count: { members: number } })[]
    >,
    prisma.groups.count({ where: whereClause }) as Promise<number>,
  ]);

  return { groups, total, hasMore: offset + limit < total };
}

export async function searchGroups(term: string) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();
  const groups = await prisma.groups.findMany({
    where: {
      church_id: churchId,
      name: { contains: term, mode: 'insensitive' },
    },
    orderBy: { name: 'asc' },
    take: 10,
    select: { id: true, name: true },
  });
  return groups;
}

export async function getGroupById(id: string) {
  const prisma = await getChurchPrisma();
  const group = await prisma.groups.findUnique({
    where: { id },
    include: { leader: true, members: true },
  });
  return group;
}

export async function createGroup(data: {
  name: string;
  leaderId?: string | null;
  parentId?: string | null;
}) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const prismaData: Prisma.GroupsCreateInput = {
    name: data.name,
    church: { connect: { id: churchId } },
    ...(data.leaderId && data.leaderId !== ''
      ? { leader: { connect: { id: data.leaderId } } }
      : {}),
    ...(data.parentId && data.parentId !== ''
      ? { parent: { connect: { id: data.parentId } } }
      : {}),
  };

  const created = await prisma.groups.create({ data: prismaData });
  revalidateTag('groups', { expire: 0 });
  return created;
}

export async function deleteGroup(id: string) {
  const prisma = await getChurchPrisma();
  await prisma.groups.delete({ where: { id } });
  revalidateTag('groups', { expire: 0 });
  return { success: true };
}

export async function getGroupHierarchy() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const parents = await prisma.groups.findMany({
    where: { church_id: churchId, parent_id: null },
    orderBy: { name: 'asc' },
    include: {
      leader: true,
      fields: true,
      _count: { select: { members: true, subgroups: true } },
      subgroups: {
        orderBy: { name: 'asc' },
        include: {
          leader: true,
          fields: true,
          _count: { select: { members: true, subgroups: true } },
          // optional second level if present
          subgroups: {
            orderBy: { name: 'asc' },
            include: {
              leader: true,
              fields: true,
              _count: { select: { members: true, subgroups: true } },
            },
          },
        },
      },
    },
  });

  return parents;
}

export async function updateGroup(
  id: string,
  data: { name?: string; leaderId?: string | null; parentId?: string | null }
) {
  const prisma = await getChurchPrisma();
  const updateData: Prisma.GroupsUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (Object.prototype.hasOwnProperty.call(data, 'leaderId')) {
    updateData.leader =
      data.leaderId && data.leaderId !== ''
        ? { connect: { id: data.leaderId } }
        : { disconnect: true };
  }
  if (Object.prototype.hasOwnProperty.call(data, 'parentId')) {
    updateData.parent =
      data.parentId && data.parentId !== ''
        ? { connect: { id: data.parentId } }
        : { disconnect: true };
  }
  const updated = await prisma.groups.update({
    where: { id },
    data: updateData,
  });
  revalidateTag('groups', { expire: 0 });
  return updated;
}

export async function getGroupStats() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const [total, parents, subgroups, membersTotal, membersInGroups] =
    await Promise.all([
      prisma.groups.count({ where: { church_id: churchId } }),
      prisma.groups.count({ where: { church_id: churchId, parent_id: null } }),
      prisma.groups.count({
        where: { church_id: churchId, parent_id: { not: null } },
      }),
      prisma.members.count({ where: { church_id: churchId } }),
      prisma.members.count({
        where: { church_id: churchId, groups: { some: {} } },
      }),
    ]);

  return {
    total,
    parents,
    subgroups,
    membersInGroups,
    membersWithoutGroup: Math.max(0, membersTotal - membersInGroups),
  };
}
