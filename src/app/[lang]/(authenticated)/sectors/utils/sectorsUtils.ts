import { SectorTableData, SectorWithDetails } from "../types/sectors";

/**
 * Transform sector data to table format
 */
export function transformSectorToTableData(
  sector: SectorWithDetails
): SectorTableData {
  const supervisorName = sector.supervisor
    ? `${sector.supervisor.firstName} ${sector.supervisor.lastName}`
    : "Sin supervisor";
  return {
    id: sector.id,
    name: sector.name,
    supervisorName,
    supervisorId: sector.supervisor?.id ?? null,
    parentName: sector.zone?.name,
    parentId: sector.zone?.id ?? null,
    cellsCount: sector.cellsCount || 0,
    membersCount: sector.membersCount || 0,
    subSectorsCount: sector.subSectorsCount || 0,
    createdAt: new Date(sector.createdAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    updatedAt: new Date(sector.updatedAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

/**
 * Transform array of sectors to table format
 */
export function transformSectorsToTableData(
  sectors: SectorWithDetails[]
): SectorTableData[] {
  return sectors.map(transformSectorToTableData);
}
