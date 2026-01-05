'use server';

import { getChurchPrisma, getChurchId } from '@/actions/churchContext';
import { Networks } from '@/generated/prisma/client';

import { revalidateTag } from 'next/cache';
import { logger } from '@/lib/logger';
import { handlePrismaError, withErrorHandling } from '@/lib/error-handler';

export type NetworkWithCount = Networks & {
  _count?: {
    members: number;
  };
};

export async function getNetworks(): Promise<NetworkWithCount[]> {
  console.log('Fetching networks...');
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();
    console.log('Church ID:', churchId);

    // 1. Fetch existing networks for the current church
    // The extended client automatically adds church_id filter to findMany
    const networks = await prisma.networks.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
    console.log('Found networks:', networks.length);

    // 2. If networks exist, return them
    if (networks.length > 0) {
      return networks;
    }

    // 3. If no networks exist, seed default networks
    console.log('Seeding default networks...');
    const defaultNetworks = [
      'Varones',
      'Damas',
      'Jovenes',
      'Señoritas',
      'DNA Adolescentes',
      'DNA Niños',
    ];

    const newNetworks = [];

    for (const name of defaultNetworks) {
      try {
        // Use upsert to handle potential race conditions or partial seeds.
        // Since getChurchPrisma doesn't intercept 'upsert', we must provide church_id explicitly.
        const network = await prisma.networks.upsert({
          where: {
            name_church_id: {
              name,
              church_id: churchId,
            },
          },
          update: {},
          create: {
            name,
            church_id: churchId,
          },
          include: {
            _count: {
              select: { members: true },
            },
          },
        });
        newNetworks.push(network);
      } catch (error) {
        console.error(`Error creating network ${name}:`, error);
        // Continue with other networks
      }
    }
    console.log('Created networks:', newNetworks.length);

    // Sort created networks by name to match expected output
    return newNetworks.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error in getNetworks:', error);
    return [];
  }
}

export const createNetwork = withErrorHandling(async (name: string) => {
  try {
    const prisma = await getChurchPrisma();
    const churchId = await getChurchId();

    const network = await prisma.networks.create({
      data: {
        name,
        church_id: churchId,
      },
    });

    logger.info('Network created successfully', {
      operation: 'createNetwork',
      networkId: network.id,
      name: network.name,
    });

    revalidateTag('networks', { expire: 0 });
    return network;
  } catch (error) {
    throw handlePrismaError(error);
  }
});

export const updateNetwork = withErrorHandling(
  async (id: string, name: string) => {
    try {
      const prisma = await getChurchPrisma();

      const network = await prisma.networks.update({
        where: { id },
        data: { name },
      });

      logger.info('Network updated successfully', {
        operation: 'updateNetwork',
        networkId: network.id,
        name: network.name,
      });

      revalidateTag('networks', { expire: 0 });
      return network;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
);

export const deleteNetwork = withErrorHandling(async (id: string) => {
  try {
    const prisma = await getChurchPrisma();

    await prisma.networks.delete({
      where: { id },
    });

    logger.info('Network deleted successfully', {
      operation: 'deleteNetwork',
      networkId: id,
    });

    revalidateTag('networks', { expire: 0 });
    return { success: true };
  } catch (error) {
    throw handlePrismaError(error);
  }
});
