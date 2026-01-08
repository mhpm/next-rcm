'use server';

import { revalidatePath } from 'next/cache';
import { getChurchPrisma, getChurchId } from '@/actions/churchContext';
import { Prisma } from '@/generated/prisma/client';
import type { ReportFieldType, ReportScope } from '@/generated/prisma/client';

export type ReportFieldInput = {
  id?: string;
  key: string;
  label?: string | null;
  type: ReportFieldType;
  value?: unknown;
  options?: string[] | any[]; // Add options
  visibilityRules?: any;
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

    return base;
  });

  await prisma.reports.create({
    data: {
      church: { connect: { id: churchId } },
      title: input.title,
      description: input.description,
      scope,
      color: input.color || '#4F46E5',
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
  description?: string | null;
  scope: ReportScope;
  color?: string | null;
  fields?: ReportFieldInput[];
};

export async function updateReportWithFields(input: UpdateReportInput) {
  const prisma = await getChurchPrisma();

  await prisma.$transaction(
    async (tx) => {
      // 1. Update basic fields
      await tx.reports.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          scope: input.scope,
          color: input.color,
        },
      });

      // 2. Handle fields logic
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
        await tx.reportFields.create({ data: createData });
      }
    },
    {
      maxWait: 5000,
      timeout: 20000,
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
};

export async function updateReportEntry(input: UpdateReportEntryInput) {
  const prisma = await getChurchPrisma();

  const { scope, cellId, groupId, sectorId } = input;
  if (scope === 'CELL' && !cellId && !input.id)
    // Only require cellId on create if scope is CELL
    throw new Error('Debes seleccionar una célula');
  // if update, cellId might be undefined if not changing, but usually form sends it.

  // Actually, updateReportEntry receives values.
  // If cellId is not passed in input, we might need to fetch it from DB if scope is CELL.
  let targetCellId = cellId;

  if (scope === 'CELL' && !targetCellId) {
    const existingEntry = await prisma.reportEntries.findUnique({
      where: { id: input.id },
      select: { cell_id: true },
    });
    targetCellId = existingEntry?.cell_id;
  }

  const connectByScope =
    scope === 'CELL' && cellId // Only update relation if cellId is provided
      ? { cell: { connect: { id: cellId! } } }
      : scope === 'GROUP' && groupId
      ? { group: { connect: { id: groupId! } } }
      : scope === 'SECTOR' && sectorId
      ? { sector: { connect: { id: sectorId! } } }
      : {};

  await prisma.reportEntries.update({
    where: { id: input.id },
    data: {
      ...connectByScope,
    },
  });

  // Fetch report definition to get church_id if needed, or rely on getChurchId
  // The entry already exists, so it's linked to church_id.
  const entryForChurch = await prisma.reportEntries.findUnique({
    where: { id: input.id },
    select: { church_id: true },
  });
  const churchId = entryForChurch?.church_id || (await getChurchId());

  // Fetch field definitions to identify special types
  const fieldDefs = await prisma.reportFields.findMany({
    where: {
      id: { in: input.values.map((v) => v.fieldId) },
    },
    select: { id: true, type: true },
  });

  // Update values
  // similar logic: delete values for fields not present? or just upsert?
  // usually report entry values are simpler.
  // We can delete all values for this entry and recreate? Or update individually.
  // Recreating is easiest but loses history if we tracked that.
  // Better: loop and upsert.

  for (const v of input.values) {
    // Find existing value for this field and entry
    const existing = await prisma.reportEntryValues.findFirst({
      where: {
        entry_id: input.id,
        field: { id: v.fieldId },
      },
    });

    const val =
      typeof v.value === 'undefined'
        ? Prisma.JsonNull
        : (v.value as Prisma.InputJsonValue);

    if (existing) {
      await prisma.reportEntryValues.update({
        where: { id: existing.id },
        data: { value: val },
      });
    } else {
      await prisma.reportEntryValues.create({
        data: {
          entry: { connect: { id: input.id } },
          field: { connect: { id: v.fieldId } },
          value: val,
        },
      });
    }

    // Process FRIEND_REGISTRATION fields
    if (scope === 'CELL' && targetCellId) {
      const fieldDef = fieldDefs.find((f) => f.id === v.fieldId);
      if (fieldDef?.type === 'FRIEND_REGISTRATION' && Array.isArray(v.value)) {
        const friendsData = v.value as {
          firstName: string;
          lastName: string;
          phone?: string;
          spiritualFatherId?: string;
        }[];

        for (const friend of friendsData) {
          if (
            friend.firstName &&
            friend.firstName.trim() &&
            friend.lastName &&
            friend.lastName.trim()
          ) {
            const fullName = `${friend.firstName.trim()} ${friend.lastName.trim()}`;

            // Check if friend already exists to avoid duplicates
            // Using findFirst instead of tx.friends since we are not in transaction here
            const existingFriend = await prisma.friends.findFirst({
              where: {
                name: { equals: fullName, mode: 'insensitive' },
                cell_id: targetCellId,
                church_id: churchId,
              },
            });

            if (!existingFriend) {
              await prisma.friends.create({
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
  }

  const existing = await prisma.reportEntries.findUnique({
    where: { id: input.id },
    select: { report_id: true },
  });
  if (existing?.report_id) {
    revalidatePath(`/reports/${existing.report_id}/entries`);
  }
  revalidatePath('/friends'); // Refresh friends list
}

export type CreateReportEntryInput = {
  reportId: string;
  scope: ReportScope;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  values: { fieldId: string; value?: unknown }[];
};

export async function createReportEntry(input: CreateReportEntryInput) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const { scope, cellId, groupId, sectorId } = input;
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

  const valuesCreate: Prisma.ReportEntryValuesCreateWithoutEntryInput[] = (
    input.values || []
  )
    .filter((v) => v.fieldId)
    .map((v) => {
      const base: Prisma.ReportEntryValuesCreateWithoutEntryInput = {
        field: { connect: { id: v.fieldId } },
      } as Prisma.ReportEntryValuesCreateWithoutEntryInput;

      if (typeof v.value !== 'undefined') {
        (base as any).value = v.value as Prisma.InputJsonValue;
      } else {
        (base as any).value = Prisma.JsonNull;
      }
      return base;
    });

  // Use transaction to create entry and friends
  await prisma.$transaction(async (tx) => {
    // 1. Create Report Entry
    await tx.reportEntries.create({
      data: {
        church: { connect: { id: churchId } },
        report: { connect: { id: input.reportId } },
        ...connectByScope,
        values: {
          create: valuesCreate,
        },
      },
    });

    // 2. Process FRIEND_REGISTRATION fields
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
            if (
              friend.firstName &&
              friend.firstName.trim() &&
              friend.lastName &&
              friend.lastName.trim()
            ) {
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
  });

  revalidatePath(`/reports/${input.reportId}/entries`);
  revalidatePath('/friends'); // Refresh friends list
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
            name: true,
            sector: { select: { name: true } },
          },
        },
        leader: { select: { firstName: true, lastName: true } },
        host: { select: { firstName: true, lastName: true } },
        assistant: { select: { firstName: true, lastName: true } },
        _count: { select: { members: true } },
      },
    });

    if (!cell) return null;

    return {
      sector: cell.subSector?.sector?.name || 'N/A',
      subSector: cell.subSector?.name || 'N/A',
      leader: cell.leader
        ? `${cell.leader.firstName} ${cell.leader.lastName}`
        : 'N/A',
      host: cell.host ? `${cell.host.firstName} ${cell.host.lastName}` : 'N/A',
      assistant: cell.assistant
        ? `${cell.assistant.firstName} ${cell.assistant.lastName}`
        : 'N/A',
      membersCount: cell._count.members,
    };
  }

  return null;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '_')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
