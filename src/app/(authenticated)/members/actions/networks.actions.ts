'use server';

import { getChurchPrisma } from '@/actions/churchContext';
import { Networks } from '@/generated/prisma/client';

export async function getNetworks(): Promise<Networks[]> {
  const prisma = await getChurchPrisma();
  return prisma.networks.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}
