import { CellTableData } from "../types/cells";

export function transformCellToTableData(cell: any): CellTableData {
  const leaderName = cell.leader
    ? `${cell.leader.firstName} ${cell.leader.lastName}`
    : "Sin líder";
  const hostName = cell.host
    ? `${cell.host.firstName} ${cell.host.lastName}`
    : "Sin anfitrión";
  const assistantName = cell.assistant
    ? `${cell.assistant.firstName} ${cell.assistant.lastName}`
    : "Sin asistente";

  const zoneName = cell.sector?.zone?.name;
  const sectorName = cell.sector?.name;
  const subSectorName = cell.subSector?.name;

  const hierarchyParts = [zoneName, sectorName, subSectorName].filter(Boolean);
  const hierarchyString =
    hierarchyParts.length > 0 ? hierarchyParts.join(" > ") : "Sin ubicación";

  return {
    id: cell.id,
    name: cell.name,
    sectorName: hierarchyString,
    sectorId: cell.subSector?.id,
    parentSectorId: cell.sector?.id,
    subSectorId: cell.subSector?.id,
    leaderName,
    leaderId: cell.leader?.id,
    hostName,
    hostId: cell.host?.id,
    assistantName,
    assistantId: cell.assistant?.id,
    memberCount: cell.memberCount ?? cell._count?.members ?? 0,
    createdAt: new Date(cell.createdAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    updatedAt: new Date(cell.updatedAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

export function transformCellsToTableData(cells: any[]): CellTableData[] {
  return cells.map(transformCellToTableData);
}
