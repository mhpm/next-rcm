'use server';

import { getChurchPrisma, getChurchId } from '@/actions/churchContext';

export async function getCellsForSelect() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const cells = await prisma.cells.findMany({
    where: { church_id: churchId },
    select: {
      id: true,
      name: true,
      leader: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return cells.map((cell) => ({
    id: cell.id,
    name: cell.name,
    leaderName: cell.leader
      ? `${cell.leader.firstName} ${cell.leader.lastName}`
      : 'Sin líder',
  }));
}

export async function getMembersForSelect() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const members = await prisma.members.findMany({
    where: { church_id: churchId },
    select: { id: true, firstName: true, lastName: true, cell_id: true },
    orderBy: { lastName: 'asc' },
  });

  return members.map((m) => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
    cell_id: m.cell_id,
  }));
}
