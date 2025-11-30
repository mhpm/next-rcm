"use server";

import prisma from "@/lib/prisma";
import type { Churches } from "@/generated/prisma/client";

export type Church = Churches;

/**
 * Obtiene todas las iglesias disponibles
 */
export async function getAllChurches(): Promise<Church[]> {
  try {
    const churches = await prisma.churches.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return churches;
  } catch (error) {
    console.error("Error fetching churches:", error);
    throw new Error("Failed to fetch churches");
  }
}

/**
 * Obtiene una iglesia por su slug
 */
export async function getChurchBySlug(slug: string): Promise<Church | null> {
  try {
    const church = await prisma.churches.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return church;
  } catch (error) {
    console.error("Error fetching church by slug:", error);
    throw new Error("Failed to fetch church");
  }
}

/**
 * Verifica si existe una iglesia con el slug dado
 */
export async function churchExists(slug: string): Promise<boolean> {
  try {
    const church = await prisma.churches.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    return !!church;
  } catch (error) {
    console.error("Error checking if church exists:", error);
    return false;
  }
}
