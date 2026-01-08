import {
  MinistryTableData,
  MinistryWithMemberCount,
} from "../types/ministries";

/**
 * Transform ministry data to table format
 */
export function transformMinistryToTableData(
  ministry: MinistryWithMemberCount
): MinistryTableData {
  const leaderName = ministry.leader
    ? `${ministry.leader.firstName} ${ministry.leader.lastName}`
    : "Sin líder";
  return {
    id: ministry.id,
    name: ministry.name,
    description: ministry.description || "Sin descripción",
    leaderName,
    leaderId: ministry.leader?.id ?? null,
    memberCount: ministry.memberCount || 0,
    createdAt: new Date(ministry.createdAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    updatedAt: new Date(ministry.updatedAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

/**
 * Transform array of ministries to table format
 */
export function transformMinistriesToTableData(
  ministries: MinistryWithMemberCount[]
): MinistryTableData[] {
  return ministries.map(transformMinistryToTableData);
}
