'use server';

import prisma from '@/lib/prisma';
import { ReportScope, Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';
import crypto from 'crypto';

export async function getPublicReport(token: string) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    include: {
      fields: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] },
      church: { select: { name: true } },
    },
  });
  return report;
}

export async function getPublicReportBySlugs(
  churchSlug: string,
  reportSlug: string
) {
  console.log('getPublicReportBySlugs called with:', {
    churchSlug,
    reportSlug,
  });
  const church = await prisma.churches.findUnique({
    where: { slug: churchSlug },
    select: { id: true },
  });

  if (!church) {
    console.log('Church not found for slug:', churchSlug);
    return null;
  }

  const report = await prisma.reports.findFirst({
    where: {
      church_id: church.id,
      slug: reportSlug,
    },
    include: {
      fields: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] },
      church: { select: { name: true } },
    },
  });

  if (!report) {
    console.log(
      'Report not found for slug:',
      reportSlug,
      'in church:',
      church.id
    );
  } else {
    console.log('Report found:', report.id, 'publicToken:', report.publicToken);

    // Auto-fix: Generate publicToken if missing
    if (!report.publicToken) {
      console.log('Generating missing publicToken for report:', report.id);
      const newToken = crypto.randomBytes(16).toString('hex');
      await prisma.reports.update({
        where: { id: report.id },
        data: { publicToken: newToken },
      });
      report.publicToken = newToken;
    }
  }

  return report;
}

export async function getPublicEntities(token: string) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    select: { church_id: true },
  });

  if (!report) return null;

  const [groups, sectors, members, unlinkedMembers] = await Promise.all([
    prisma.groups.findMany({
      where: { church_id: report.church_id },
      select: {
        id: true,
        name: true,
        leader: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.sectors.findMany({
      where: { church_id: report.church_id },
      select: {
        id: true,
        name: true,
        supervisor: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.members.findMany({
      where: { church_id: report.church_id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { firstName: 'asc' },
    }),
    prisma.members.findMany({
      where: {
        church_id: report.church_id,
        cell_id: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { firstName: 'asc' },
    }),
  ]);

  return { groups, sectors, members, unlinkedMembers };
}

export async function getPublicEntitiesBySlugs(
  churchSlug: string,
  reportSlug: string
) {
  const church = await prisma.churches.findUnique({
    where: { slug: churchSlug },
    select: { id: true },
  });

  if (!church) return null;

  // Verify report exists for this church
  const report = await prisma.reports.findFirst({
    where: {
      church_id: church.id,
      slug: reportSlug,
    },
    select: { id: true },
  });

  if (!report) return null;

  const [groups, sectors, members, unlinkedMembers] = await Promise.all([
    prisma.groups.findMany({
      where: { church_id: church.id },
      select: {
        id: true,
        name: true,
        leader: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.sectors.findMany({
      where: { church_id: church.id },
      select: {
        id: true,
        name: true,
        supervisor: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.members.findMany({
      where: { church_id: church.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { firstName: 'asc' },
    }),
    prisma.members.findMany({
      where: {
        church_id: church.id,
        cell_id: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { firstName: 'asc' },
    }),
  ]);

  return { groups, sectors, members, unlinkedMembers };
}

export async function verifyCellAccess(code: string) {
  const cell = await prisma.cells.findFirst({
    where: { accessCode: code },
    select: {
      id: true,
      name: true,
      leader_id: true,
      leader: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      host_id: true,
      host: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      assistant_id: true,
      assistant: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      subSector: {
        select: {
          name: true,
          sector: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return cell;
}

export async function getDraftReportEntry(
  token: string,
  scope: ReportScope,
  entityId: string
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    select: { id: true },
  });

  if (!report) return null;

  const whereClause: Prisma.ReportEntriesWhereInput = {
    report_id: report.id,
    status: 'DRAFT',
  };

  if (scope === 'CELL') whereClause.cell_id = entityId;
  else if (scope === 'GROUP') whereClause.group_id = entityId;
  else if (scope === 'SECTOR') whereClause.sector_id = entityId;

  const entry = await prisma.reportEntries.findFirst({
    where: whereClause,
    include: {
      values: {
        include: {
          field: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return entry;
}

export type SubmitPublicReportEntryInput = {
  token: string;
  scope: ReportScope;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  values: { fieldId: string; value?: unknown }[];
  isDraft?: boolean;
};

export async function saveDraftReportEntry(
  input: SubmitPublicReportEntryInput & { entryId?: string }
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: input.token },
    include: { fields: { select: { id: true } } },
  });

  if (!report) throw new Error('Reporte no encontrado');

  // Filter out values for fields that don't exist in the report
  const validFieldIds = new Set(report.fields.map((f) => f.id));
  const validValues = input.values.filter(
    (v) => v.fieldId && validFieldIds.has(v.fieldId)
  );

  const { scope, cellId, groupId, sectorId } = input;
  const connectByScope =
    scope === 'CELL'
      ? { cell: { connect: { id: cellId! } } }
      : scope === 'GROUP'
      ? { group: { connect: { id: groupId! } } }
      : scope === 'SECTOR'
      ? { sector: { connect: { id: sectorId! } } }
      : {};

  if (input.entryId) {
    // Update existing draft
    await prisma.reportEntries.update({
      where: { id: input.entryId },
      data: {
        updatedAt: new Date(),
      },
    });

    for (const v of validValues) {
      // already filtered: if (!v.fieldId) continue;

      const val =
        typeof v.value === 'undefined'
          ? Prisma.JsonNull
          : (v.value as Prisma.InputJsonValue);

      // Check if value exists
      const existingValue = await prisma.reportEntryValues.findFirst({
        where: {
          entry_id: input.entryId,
          report_field_id: v.fieldId,
        },
      });

      if (existingValue) {
        await prisma.reportEntryValues.update({
          where: { id: existingValue.id },
          data: { value: val },
        });
      } else {
        await prisma.reportEntryValues.create({
          data: {
            entry: { connect: { id: input.entryId } },
            field: { connect: { id: v.fieldId } },
            value: val,
          },
        });
      }
    }

    revalidatePath(`/reports/${report.id}/entries`);
    revalidatePath('/reports');
    return { id: input.entryId };
  } else {
    // Create new draft
    const valuesCreate = validValues.map((v) => ({
      field: { connect: { id: v.fieldId } },
      value:
        typeof v.value !== 'undefined'
          ? (v.value as Prisma.InputJsonValue)
          : Prisma.JsonNull,
    }));

    const newEntry = await prisma.reportEntries.create({
      data: {
        scope,
        status: 'DRAFT',
        church: { connect: { id: report.church_id } },
        report: { connect: { id: report.id } },
        ...connectByScope,
        values: {
          create: valuesCreate,
        },
      },
    });

    revalidatePath(`/reports/${report.id}/entries`);
    revalidatePath('/reports');
    return { id: newEntry.id };
  }
}

export async function submitPublicReportEntry(
  input: SubmitPublicReportEntryInput & { entryId?: string }
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: input.token },
    include: { fields: { select: { id: true, type: true } } }, // Fetch types too
  });

  if (!report) {
    throw new Error('Reporte no encontrado');
  }

  // Always save/update values first
  const { id: entryId } = await saveDraftReportEntry(input);

  // If not draft, update to SUBMITTED and process side effects (Friends)
  if (!input.isDraft) {
    await prisma.$transaction(
      async (tx) => {
        await tx.reportEntries.update({
          where: { id: entryId },
          data: {
            status: 'SUBMITTED',
          },
        });

        // Handle FRIEND_REGISTRATION fields
        // Only if scope is CELL and we have a cellId (should be validated by now)
        if (input.scope === 'CELL' && input.cellId) {
          for (const v of input.values) {
            const fieldDef = report.fields.find((f) => f.id === v.fieldId);
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

                  const existingFriend = await tx.friends.findFirst({
                    where: {
                      name: { equals: fullName, mode: 'insensitive' },
                      cell_id: input.cellId,
                      church_id: report.church_id,
                    },
                  });

                  if (!existingFriend) {
                    await tx.friends.create({
                      data: {
                        name: fullName,
                        phone: friend.phone?.trim() || null,
                        church_id: report.church_id,
                        cell_id: input.cellId,
                        spiritual_father_id: friend.spiritualFatherId || null,
                      },
                    });
                  }
                }
              }
            }

            // Handle MEMBER_SELECT fields
            if (fieldDef?.type === 'MEMBER_SELECT' && Array.isArray(v.value)) {
              const memberIds = v.value as string[];

              // Fetch cell leader to protect them from being unlinked
              const cell = await tx.cells.findUnique({
                where: { id: input.cellId! },
                select: { leader_id: true },
              });
              const leaderId = cell?.leader_id;

              // Sync members:
              // 1. Unlink members currently in the cell but not in the new list
              // IMPORTANT: Never unlink the leader (leaderId)
              await tx.members.updateMany({
                where: {
                  cell_id: input.cellId,
                  church_id: report.church_id,
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
                    church_id: report.church_id,
                  },
                  data: {
                    cell_id: input.cellId,
                  },
                });
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

    revalidatePath(`/reports/${report.id}/entries`);
    revalidatePath('/friends');
    revalidateTag('cells', { expire: 0 });
  }

  return { id: entryId };
}

export async function getPublicReportEntityMembers(
  token: string,
  scope: ReportScope,
  entityId: string
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    select: { church_id: true },
  });

  if (!report) throw new Error('Reporte no encontrado');

  // Verify entity belongs to church
  let valid = false;
  if (scope === 'CELL') {
    const cell = await prisma.cells.findFirst({
      where: { id: entityId, church_id: report.church_id },
      select: { id: true },
    });
    valid = !!cell;
  } else if (scope === 'GROUP') {
    const group = await prisma.groups.findFirst({
      where: { id: entityId, church_id: report.church_id },
      select: { id: true },
    });
    valid = !!group;
  } else if (scope === 'SECTOR') {
    const sector = await prisma.sectors.findFirst({
      where: { id: entityId, church_id: report.church_id },
      select: { id: true },
    });
    valid = !!sector;
  }

  if (!valid) throw new Error('Entidad no válida');

  if (scope === 'CELL') {
    return prisma.members.findMany({
      where: { cell_id: entityId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    });
  } else if (scope === 'GROUP') {
    return prisma.members.findMany({
      where: { groups: { some: { id: entityId } } },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    });
  } else if (scope === 'SECTOR') {
    return prisma.members.findMany({
      where: { sector_id: entityId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    });
  }

  return [];
}
