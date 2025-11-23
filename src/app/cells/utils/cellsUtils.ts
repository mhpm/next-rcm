import { CellTableData } from "../types/cells";

export function transformCellToTableData(cell: any): CellTableData {
  const leaderName = cell.leader
    ? `${cell.leader.firstName} ${cell.leader.lastName}`
    : "Sin líder";
  const hostName = cell.host
    ? `${cell.host.firstName} ${cell.host.lastName}`
    : "Sin anfitrión";

  return {
    id: cell.id,
    name: cell.name,
    sectorName: cell.sector?.name ?? "Sin sector",
    leaderName,
    hostName,
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