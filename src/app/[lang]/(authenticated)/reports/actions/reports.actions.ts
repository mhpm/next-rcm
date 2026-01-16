'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { getChurchPrisma, getChurchId } from '@/actions/churchContext';
import { Prisma } from '@/generated/prisma/client';
import {
  ReportFieldType,
  ReportScope,
  ReportEntryStatus,
} from '@/generated/prisma/client';
import { slugify } from '@/lib/utils';
import crypto from 'crypto';

export type ReportFieldInput = {
  id?: string;
  key: string;
  label?: string | null;
  description?: string | null;
  type: ReportFieldType;
  value?: unknown;
  options?: string[] | any[]; // Add options
  visibilityRules?: any;
  validation?: any;
  required?: boolean;
};

export type CreateReportInput = {
  title: string;
  description?: string | null;
  scope: ReportScope;
  color?: string | null;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  fields?: ReportFieldInput[];
};

export async function createReport(input: CreateReportInput) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  if (!input.title || input.title.trim().length === 0) {
    throw new Error('El título es requerido');
  }

  // Solo tipo (scope) en plantillas; no se vincula a una entidad aquí
  const { scope } = input;

  const slug = slugify(input.title) || 'report';
  let uniqueSlug = slug;
  let counter = 1;

  while (
    await prisma.reports.findFirst({
      where: { church_id: churchId, slug: uniqueSlug },
    })
  ) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const fieldsCreate: Prisma.ReportFieldsCreateWithoutReportInput[] = (
    input.fields || []
  ).map((f) => {
    // Validate key or generate one
    let key = f.key;
    if (!key || key.trim().length === 0) {
      // Simple slugify fallback or random
      const labelSlug = f.label
        ? slugify(f.label)
        : `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      key = labelSlug;
    }

    const base: Prisma.ReportFieldsCreateWithoutReportInput = {
      key,
      label: f.label ?? null,
      description: f.description ?? null,
      type: f.type,
      required: !!f.required,
    };

    if (typeof f.value !== 'undefined') {
      (base as any).value = f.value as Prisma.InputJsonValue;
    }
    if (f.options && Array.isArray(f.options)) {
      (base as any).options = f.options as Prisma.InputJsonValue;
    }
    if (f.visibilityRules) {
      (base as any).visibilityRules =
        f.visibilityRules as Prisma.InputJsonValue;
    }
    if (f.validation) {
      (base as any).validation = f.validation as Prisma.InputJsonValue;
    }

    return base;
  });

  await prisma.reports.create({
    data: {
      church: { connect: { id: churchId } },
      title: input.title,
      slug: uniqueSlug,
      description: input.description,
      scope,
      color: input.color || '#4F46E5',
      publicToken: crypto.randomBytes(16).toString('hex'),
      fields: {
        create: fieldsCreate,
      },
    },
  });

  revalidatePath('/reports');
}

export async function deleteReport(id: string) {
  const prisma = await getChurchPrisma();
  await prisma.reports.delete({ where: { id } });
  revalidatePath('/reports');
}

export async function deleteReportAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) throw new Error('id requerido');
  await deleteReport(id);
}

export async function deleteReportEntriesAction(ids: string[]) {
  const prisma = await getChurchPrisma();
  // We need to find at least one entry to know the report_id for revalidation,
  // or just revalidate all if that's acceptable.
  // Let's get the report_id from the first one.
  const first = await prisma.reportEntries.findUnique({
    where: { id: ids[0] },
    select: { report_id: true },
  });

  await prisma.reportEntries.deleteMany({
    where: { id: { in: ids } },
  });

  if (first) {
    revalidatePath(`/reports/${first.report_id}/entries`);
  }
}

export type UpdateReportInput = {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  scope: ReportScope;
  color?: string | null;
  fields?: ReportFieldInput[];
};

export async function updateReportWithFields(input: UpdateReportInput) {
  const prisma = await getChurchPrisma();

  await prisma.$transaction(
    async (tx) => {
      // 1. Get current report to check for publicToken and church_id
      const currentReport = await tx.reports.findUnique({
        where: { id: input.id },
        select: { publicToken: true, church_id: true, slug: true },
      });

      if (!currentReport) throw new Error('Reporte no encontrado');

      // Validate Slug Uniqueness if changed
      let uniqueSlug = input.slug;
      if (uniqueSlug && uniqueSlug !== currentReport.slug) {
        uniqueSlug = slugify(uniqueSlug);
        // Ensure slug is not empty after slugify
        if (!uniqueSlug) uniqueSlug = slugify(input.title) || 'report';

        const existing = await tx.reports.findFirst({
          where: {
            church_id: currentReport.church_id,
            slug: uniqueSlug,
            id: { not: input.id },
          },
        });

        if (existing) {
          throw new Error(`La URL "${uniqueSlug}" ya está en uso.`);
        }
      }

      // 2. Update basic fields
      await tx.reports.update({
        where: { id: input.id },
        data: {
          title: input.title,
          slug: uniqueSlug,
          description: input.description,
          scope: input.scope,
          color: input.color,
          // Generate token if missing
          ...(!currentReport?.publicToken
            ? { publicToken: crypto.randomBytes(16).toString('hex') }
            : {}),
        },
      });

      // 3. Handle fields logic
      // Get current fields inside transaction to ensure consistency
      const currentFields = await tx.reportFields.findMany({
        where: { report_id: input.id },
        select: { id: true, key: true },
      });
      const currentIds = currentFields.map((c) => c.id);
      const inputIds = (input.fields || [])
        .map((f) => f.id)
        .filter(Boolean) as string[];

      const toDelete = currentIds.filter((id) => !inputIds.includes(id));

      // Helper to generate unique key
      const usedKeys = new Set<string>();
      const ensureUniqueKey = (key: string) => {
        let finalKey = key;
        let counter = 1;
        while (usedKeys.has(finalKey)) {
          finalKey = `${key}_${counter}`;
          counter++;
        }
        usedKeys.add(finalKey);
        return finalKey;
      };

      if (toDelete.length > 0) {
        await tx.reportFields.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      // Prepare fields with unique keys and correct order
      const preparedFields = (input.fields || []).map((f, index) => {
        let key = f.key;
        if (!key) {
          key = slugify(
            f.label ||
              `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          );
        }

        // Normalize key
        key = ensureUniqueKey(key);

        return { ...f, key, order: index };
      });

      // Separate updates and creates
      const updates = preparedFields.filter((f) => f.id);
      const creates = preparedFields.filter((f) => !f.id);

      // 1. Perform Updates
      for (const f of updates) {
        const base: Prisma.ReportFieldsUncheckedUpdateInput = {
          key: f.key,
          label: f.label ?? null,
          description: f.description ?? null,
          type: f.type,
          required: !!f.required,
          order: f.order,
        } as Prisma.ReportFieldsUncheckedUpdateInput;

        if (typeof f.value !== 'undefined') {
          (base as any).value = f.value as Prisma.InputJsonValue;
        }
        if (f.options && Array.isArray(f.options)) {
          (base as any).options = f.options as Prisma.InputJsonValue;
        }
        if (f.visibilityRules) {
          (base as any).visibilityRules =
            f.visibilityRules as Prisma.InputJsonValue;
        }
        if (f.validation) {
          (base as any).validation = f.validation as Prisma.InputJsonValue;
        }

        await tx.reportFields.update({
          where: { id: f.id! },
          data: base,
        });
      }

      // 2. Perform Creates
      for (const f of creates) {
        const createData: Prisma.ReportFieldsCreateInput = {
          key: f.key,
          label: f.label ?? null,
          description: f.description ?? null,
          type: f.type,
          required: !!f.required,
          order: f.order,
          report: { connect: { id: input.id } },
        };
        if (typeof f.value !== 'undefined') {
          (createData as any).value = f.value as Prisma.InputJsonValue;
        }
        if (f.options && Array.isArray(f.options)) {
          (createData as any).options = f.options as Prisma.InputJsonValue;
        }
        if (f.visibilityRules) {
          (createData as any).visibilityRules =
            f.visibilityRules as Prisma.InputJsonValue;
        }
        if (f.validation) {
          (createData as any).validation =
            f.validation as Prisma.InputJsonValue;
        }
        await tx.reportFields.create({ data: createData });
      }
    },
    {
      maxWait: 10000,
      timeout: 60000,
    }
  );

  // We need to fetch report again or pass publicToken if we want to revalidate properly,
  // but since we updated it inside tx, we can use the return value if we returned it.
  // But we didn't return report from tx.
  // However, input.id is known.
  // To get publicToken, we can fetch it or just revalidate generic paths.
  // The original code revalidated public path if token existed.
  // Let's assume revalidatePath('/reports') covers most.
  // If we really need publicToken, we can fetch it.

  revalidatePath('/reports');
  revalidatePath(`/reports/${input.id}`);
  revalidatePath(`/reports/${input.id}/edit`);
  revalidatePath(`/reports/${input.id}/submit`);
  // Optimistic revalidation for public path without fetching token
  // If needed, we can fetch report inside transaction and return it.
}

export async function deleteReportEntry(id: string) {
  const prisma = await getChurchPrisma();
  const entry = await prisma.reportEntries.delete({ where: { id } });
  revalidatePath(`/reports/${entry.report_id}/entries`);
  return entry;
}

export async function deleteReportEntryAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) throw new Error('id requerido');
  await deleteReportEntry(id);
}

export type UpdateReportEntryInput = {
  id: string;
  scope: ReportScope;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  values: { fieldId: string; value?: unknown }[];
  createdAt?: Date;
  status?: ReportEntryStatus;
};

export async function updateReportEntry(input: UpdateReportEntryInput) {
  const prisma = await getChurchPrisma();

  const { scope, cellId, groupId, sectorId, createdAt } = input;
  if (scope === 'CELL' && !cellId && !input.id)
    throw new Error('Debes seleccionar una célula');

  // Fetch report definition to get church_id
  const entryForChurch = await prisma.reportEntries.findUnique({
    where: { id: input.id },
    select: { church_id: true, cell_id: true, report_id: true },
  });

  if (!entryForChurch) throw new Error('Entrada no encontrada');

  const churchId = entryForChurch.church_id || (await getChurchId());
  let targetCellId = cellId || entryForChurch.cell_id;

  // Fetch field definitions to identify special types
  const fieldDefs = await prisma.reportFields.findMany({
    where: {
      id: { in: input.values.map((v) => v.fieldId) },
    },
    select: { id: true, type: true },
  });

  const connectByScope =
    scope === 'CELL' && cellId
      ? { cell: { connect: { id: cellId! } } }
      : scope === 'GROUP' && groupId
      ? { group: { connect: { id: groupId! } } }
      : scope === 'SECTOR' && sectorId
      ? { sector: { connect: { id: sectorId! } } }
      : {};

  await prisma.$transaction(
    async (tx) => {
      // 1. Update Report Entry metadata
      await tx.reportEntries.update({
        where: { id: input.id },
        data: {
          ...connectByScope,
          ...(createdAt ? { createdAt } : {}),
          status: input.status || undefined,
          updatedAt: new Date(),
        },
      });

      // 2. Update/Upsert values
      for (const v of input.values) {
        const val =
          typeof v.value === 'undefined'
            ? Prisma.JsonNull
            : (v.value as Prisma.InputJsonValue);

        const existing = await tx.reportEntryValues.findFirst({
          where: {
            entry_id: input.id,
            report_field_id: v.fieldId,
          },
        });

        if (existing) {
          await tx.reportEntryValues.update({
            where: { id: existing.id },
            data: { value: val },
          });
        } else {
          await tx.reportEntryValues.create({
            data: {
              entry: { connect: { id: input.id } },
              field: { connect: { id: v.fieldId } },
              value: val,
            },
          });
        }

        // Process side effects (only for non-drafts or as requested by harmony)
        if (input.status === 'SUBMITTED' || !input.status) {
          // Process FRIEND_REGISTRATION fields
          if (scope === 'CELL' && targetCellId) {
            const fieldDef = fieldDefs.find((f) => f.id === v.fieldId);
            if (
              fieldDef?.type === 'FRIEND_REGISTRATION' &&
              Array.isArray(v.value)
            ) {
              const friendsData = v.value as {
                firstName: string;
                lastName: string;
                phone?: string;
                spiritualFatherId?: string;
              }[];

              for (const friend of friendsData) {
                if (friend.firstName?.trim() && friend.lastName?.trim()) {
                  const fullName = `${friend.firstName.trim()} ${friend.lastName.trim()}`;

                  const existingFriend = await tx.friends.findFirst({
                    where: {
                      name: { equals: fullName, mode: 'insensitive' },
                      cell_id: targetCellId,
                      church_id: churchId,
                    },
                  });

                  if (!existingFriend) {
                    await tx.friends.create({
                      data: {
                        name: fullName,
                        phone: friend.phone?.trim() || null,
                        church_id: churchId,
                        cell_id: targetCellId,
                        spiritual_father_id: friend.spiritualFatherId || null,
                      },
                    });
                  }
                }
              }
            }
          }

          // Process MEMBER_SELECT fields
          if (scope === 'CELL' && targetCellId) {
            const fieldDef = fieldDefs.find((f) => f.id === v.fieldId);
            if (fieldDef?.type === 'MEMBER_SELECT' && Array.isArray(v.value)) {
              const memberIds = v.value as string[];

              const cell = await tx.cells.findUnique({
                where: { id: targetCellId },
                select: { leader_id: true },
              });
              const leaderId = cell?.leader_id;

              await tx.members.updateMany({
                where: {
                  cell_id: targetCellId,
                  church_id: churchId,
                  id: {
                    notIn: memberIds,
                    ...(leaderId ? { not: leaderId } : {}),
                  },
                },
                data: {
                  cell_id: null,
                },
              });

              if (memberIds.length > 0) {
                await tx.members.updateMany({
                  where: {
                    id: { in: memberIds },
                    church_id: churchId,
                  },
                  data: {
                    cell_id: targetCellId,
                  },
                });
              }
            }
          }
        }
      }
    },
    {
      maxWait: 10000,
      timeout: 60000,
    }
  );

  if (entryForChurch.report_id) {
    revalidatePath(`/reports/${entryForChurch.report_id}/entries`);
  }
  revalidatePath('/friends');
  revalidateTag('cells', { expire: 0 });
}

export type CreateReportEntryInput = {
  reportId: string;
  scope: ReportScope;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  values: { fieldId: string; value?: unknown }[];
  createdAt?: Date;
  status?: ReportEntryStatus;
};

export async function createReportEntry(input: CreateReportEntryInput) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const { scope, cellId, groupId, sectorId, createdAt } = input;
  if (scope === 'CELL' && !cellId)
    throw new Error('Debes seleccionar una célula');
  if (scope === 'GROUP' && !groupId)
    throw new Error('Debes seleccionar un grupo');
  if (scope === 'SECTOR' && !sectorId)
    throw new Error('Debes seleccionar un sector');

  // Fetch field definitions to identify special types
  const fieldDefs = await prisma.reportFields.findMany({
    where: {
      id: { in: input.values.map((v) => v.fieldId) },
    },
    select: { id: true, type: true },
  });

  const connectByScope =
    scope === 'CELL'
      ? { cell: { connect: { id: cellId! } } }
      : scope === 'GROUP'
      ? { group: { connect: { id: groupId! } } }
      : scope === 'SECTOR'
      ? { sector: { connect: { id: sectorId! } } }
      : {};

  const valuesCreate = (input.values || [])
    .filter((v) => v.fieldId)
    .map((v) => ({
      report_field_id: v.fieldId,
      value: typeof v.value !== 'undefined' ? (v.value as any) : null,
    }));

  // Use transaction to create entry and friends
  await prisma.$transaction(
    async (tx) => {
      // 1. Create Report Entry
      const entry = await tx.reportEntries.create({
        data: {
          church: { connect: { id: churchId } },
          report: { connect: { id: input.reportId } },
          createdAt: createdAt || new Date(), // Use provided date or now
          status: input.status || 'SUBMITTED',
          ...connectByScope,
        },
      });

      // 2. Create Values manually to avoid issues with nested create
      if (valuesCreate.length > 0) {
        await tx.reportEntryValues.createMany({
          data: valuesCreate.map((v) => ({
            ...v,
            entry_id: entry.id,
          })),
        });
      }

      // 3. Process side effects (only if NOT a draft)
      if (input.status !== 'DRAFT') {
        // 2.1 Process FRIEND_REGISTRATION fields
        if (cellId) {
          for (const v of input.values) {
            const fieldDef = fieldDefs.find((f) => f.id === v.fieldId);
            if (
              fieldDef?.type === 'FRIEND_REGISTRATION' &&
              Array.isArray(v.value)
            ) {
              const friendsData = v.value as {
                firstName: string;
                lastName: string;
                phone?: string;
                spiritualFatherId?: string;
              }[];
              for (const friend of friendsData) {
                if (friend.firstName?.trim() && friend.lastName?.trim()) {
                  const fullName = `${friend.firstName.trim()} ${friend.lastName.trim()}`;

                  // Check if friend already exists to avoid duplicates
                  const existingFriend = await tx.friends.findFirst({
                    where: {
                      name: { equals: fullName, mode: 'insensitive' },
                      cell_id: cellId,
                      church_id: churchId,
                    },
                  });

                  if (!existingFriend) {
                    await tx.friends.create({
                      data: {
                        name: fullName,
                        phone: friend.phone?.trim() || null,
                        church_id: churchId,
                        cell_id: cellId,
                        spiritual_father_id: friend.spiritualFatherId || null,
                      },
                    });
                  }
                }
              }
            }
          }
        }

        // 2.2 Process MEMBER_SELECT fields
        if (cellId) {
          for (const v of input.values) {
            const fieldDef = fieldDefs.find((f) => f.id === v.fieldId);
            if (fieldDef?.type === 'MEMBER_SELECT' && Array.isArray(v.value)) {
              const memberIds = v.value as string[];

              // Fetch cell leader to protect them from being unlinked
              const cell = await tx.cells.findUnique({
                where: { id: cellId },
                select: { leader_id: true },
              });
              const leaderId = cell?.leader_id;

              // Sync members:
              // 1. Unlink members currently in the cell but not in the new list
              // IMPORTANT: Never unlink the leader (leaderId)
              await tx.members.updateMany({
                where: {
                  cell_id: cellId,
                  church_id: churchId,
                  id: {
                    notIn: memberIds,
                    ...(leaderId ? { not: leaderId } : {}),
                  },
                },
                data: {
                  cell_id: null,
                },
              });
              // 2. Link members in the new list to the cell
              if (memberIds.length > 0) {
                await tx.members.updateMany({
                  where: {
                    id: { in: memberIds },
                    church_id: churchId,
                  },
                  data: {
                    cell_id: cellId,
                  },
                });
              }
            }
          }
        }
      }
    },
    {
      maxWait: 10000,
      timeout: 60000,
    }
  );

  revalidatePath(`/reports/${input.reportId}/entries`);
  revalidatePath('/friends'); // Refresh friends list
  revalidateTag('cells', { expire: 0 });
}

export async function getUnlinkedMembers() {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  return prisma.members.findMany({
    where: {
      church_id: churchId,
      cell_id: null,
    },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: 'asc' },
  });
}

export async function getReportEntityMembers(
  scope: ReportScope,
  entityId: string
) {
  const prisma = await getChurchPrisma();

  if (scope === 'CELL') {
    return prisma.members.findMany({
      where: { cell_id: entityId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    });
  }
  // Expand for other scopes if needed (requires recursive relation checks)
  return [];
}

export async function getReportEntityInfo(
  scope: ReportScope,
  entityId: string
) {
  const prisma = await getChurchPrisma();

  if (scope === 'CELL') {
    const cell = await prisma.cells.findUnique({
      where: { id: entityId },
      select: {
        id: true,
        name: true,
        subSector: {
          select: {
            id: true,
            name: true,
            sector: {
              select: {
                id: true,
                name: true,
                zone: { select: { id: true, name: true } },
              },
            },
          },
        },
        leader_id: true,
        leader: { select: { firstName: true, lastName: true } },
        host_id: true,
        host: { select: { firstName: true, lastName: true } },
        assistant_id: true,
        assistant: { select: { firstName: true, lastName: true } },
        _count: { select: { members: true } },
      },
    });

    if (!cell) return null;

    return {
      sector: cell.subSector?.sector?.name || 'N/A',
      sectorId: cell.subSector?.sector?.id,
      subSector: cell.subSector?.name || 'N/A',
      subSectorId: cell.subSector?.id,
      zoneId: cell.subSector?.sector?.zone?.id,
      leader: cell.leader
        ? `${cell.leader.firstName} ${cell.leader.lastName}`
        : 'N/A',
      leaderId: cell.leader_id,
      host: cell.host ? `${cell.host.firstName} ${cell.host.lastName}` : 'N/A',
      hostId: cell.host_id,
      assistant: cell.assistant
        ? `${cell.assistant.firstName} ${cell.assistant.lastName}`
        : 'N/A',
      assistantId: cell.assistant_id,
      membersCount: cell._count.members,
    };
  }

  return null;
}

export type ImportReportEntryInput = {
  reportId: string;
  rows: { entidad: string; fecha?: string; values: Record<string, any> }[];
};

export async function importReportEntriesAction(input: ImportReportEntryInput) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const report = await prisma.reports.findUnique({
    where: { id: input.reportId },
    include: { fields: true },
  });

  if (!report) throw new Error('Reporte no encontrado');

  // Fetch entities based on scope
  const entityMap = new Map<string, any>();

  if (report.scope === 'CELL') {
    const cells = await prisma.cells.findMany({
      where: { church_id: churchId },
      select: {
        id: true,
        name: true,
        subSector: {
          select: {
            sector_id: true,
            id: true,
            sector: { select: { zone_id: true } },
          },
        },
      },
    });
    cells.forEach((c) => entityMap.set(c.name.toLowerCase().trim(), c));
  } else if (report.scope === 'GROUP') {
    const groups = await prisma.groups.findMany({
      where: { church_id: churchId },
      select: { id: true, name: true },
    });
    groups.forEach((g) => entityMap.set(g.name.toLowerCase().trim(), g));
  } else if (report.scope === 'SECTOR') {
    const sectors = await prisma.sectors.findMany({
      where: { church_id: churchId },
      select: {
        id: true,
        name: true,
        zone_id: true,
      },
    });
    sectors.forEach((s) => entityMap.set(s.name.toLowerCase().trim(), s));
  } else if (report.scope === 'ZONE') {
    const zones = await prisma.zones.findMany({
      where: { church_id: churchId },
      select: { id: true, name: true },
    });
    zones.forEach((z) => entityMap.set(z.name.toLowerCase().trim(), z));
  }

  let successCount = 0;
  const errors: string[] = [];

  // Prepare data for transaction
  const entriesToCreate = [];

  for (const row of input.rows) {
    if (!row.entidad) continue;

    const entityName = row.entidad.toLowerCase().trim();
    const entity = entityMap.get(entityName);

    if (!entity) {
      errors.push(`Entidad no encontrada: ${row.entidad}`);
      continue;
    }

    // Determine scope IDs
    const scopeData: any = {};
    if (report.scope === 'CELL') {
      scopeData.cell = { connect: { id: entity.id } };
      // scopeData.sub_sector_id = entity.subSector?.id; // These might be auto-resolved or need explicit connect if relations exist
      // Usually only the direct relation is needed for connect: { id }
    } else if (report.scope === 'GROUP') {
      scopeData.group = { connect: { id: entity.id } };
    } else if (report.scope === 'SECTOR') {
      scopeData.sector = { connect: { id: entity.id } };
    } else if (report.scope === 'ZONE') {
      // Zone connection might be different if it's top level, check schema if needed
      // Assuming similar pattern
      // scopeData.zone = { connect: { id: entity.id } }; // If zone relation exists on ReportEntries
    }

    // Prepare values
    const reportValues = [];
    for (const [key, value] of Object.entries(row.values)) {
      const field = report.fields.find((f) => f.id === key);
      if (field) {
        reportValues.push({
          report_field_id: field.id,
          value: value,
        });
      }
    }

    entriesToCreate.push({
      scope: report.scope,
      status: ReportEntryStatus.SUBMITTED,
      createdAt: row.fecha ? new Date(row.fecha) : new Date(),
      ...scopeData,
      values: {
        create: reportValues,
      },
      church: {
        connect: { id: churchId },
      },
      report: {
        connect: { id: report.id },
      },
    });
  }

  if (entriesToCreate.length === 0) {
    return {
      success: false,
      error: 'No se encontraron entradas válidas para importar.',
      errors,
    };
  }

  try {
    const chunkSize = 50;
    for (let i = 0; i < entriesToCreate.length; i += chunkSize) {
      const chunk = entriesToCreate.slice(i, i + chunkSize);
      await prisma.$transaction(
        chunk.map((data) => prisma.reportEntries.create({ data }))
      );
    }

    successCount = entriesToCreate.length;
  } catch (e: any) {
    console.error('Import transaction error', e);
    return {
      success: false,
      error: 'Error guardando datos en base de datos: ' + e.message,
    };
  }

  revalidatePath(`/reports/${input.reportId}/entries`);
  return { success: true, count: successCount, errors };
}
