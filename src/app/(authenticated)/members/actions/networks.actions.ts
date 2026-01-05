'use server';

import { getChurchPrisma, getChurchId } from '@/actions/churchContext';
import { Networks } from '@/generated/prisma/client';

export async function getNetworks(): Promise<Networks[]> {
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
