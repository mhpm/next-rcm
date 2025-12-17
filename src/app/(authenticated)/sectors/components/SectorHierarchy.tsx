"use client";

import React from "react";
import {
  useSectorHierarchy,
  useDeleteSector,
  useDeleteSubSector,
} from "../hooks/useSectors";
import type { SectorNode, CellNode } from "../types/sectors";
import CreateSectorModal from "./CreateSectorModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useNotificationStore } from "@/store/NotificationStore";
import {
  RiAddLine,
  RiEdit2Fill,
  RiDeleteBinLine,
  RiUserAddLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { useRouter } from "next/navigation";

function toNodes(
  data: any[],
  type: "SECTOR" | "SUB_SECTOR" = "SECTOR"
): SectorNode[] {
  return (data || []).map((s) => {
    const isSector = type === "SECTOR";
    const childrenData = isSector ? s.subSectors || [] : [];
    const children = toNodes(childrenData, "SUB_SECTOR");

    let cellsCount = 0;
    if (isSector) {
      cellsCount = children.reduce((acc, child) => acc + child.cellsCount, 0);
    } else {
      cellsCount = s._count?.cells ?? s.cells?.length ?? 0;
    }

    let membersCount = s._count?.members ?? 0;
    if (isSector) {
      membersCount += children.reduce(
        (acc, child) => acc + child.membersCount,
        0
      );
    } else if (s.cells) {
      // For subsectors, count members in cells
      membersCount = s.cells.reduce(
        (acc: number, cell: any) => acc + (cell._count?.members ?? 0),
        0
      );
    }

    const cells: CellNode[] | undefined =
      !isSector && s.cells
        ? s.cells.map((c: any) => ({
            id: c.id,
            name: c.name,
            leaderName: c.leader
              ? `${c.leader.firstName} ${c.leader.lastName}`
              : "Sin líder",
            hostName: c.host
              ? `${c.host.firstName} ${c.host.lastName}`
              : "Sin anfitrión",
            membersCount: c._count?.members ?? 0,
          }))
        : undefined;

    return {
      id: s.id,
      name: s.name,
      type,
      supervisorName: s.supervisor
        ? `${s.supervisor.firstName} ${s.supervisor.lastName}`
        : "Sin supervisor",
      supervisorId: s.supervisor?.id ?? null,
      membersCount,
      cellsCount,
      subSectorsCount: isSector ? children.length : 0,
      children,
      cells,
    };
  });
}

export default function SectorHierarchy() {
  const { data, isLoading, error, refetch } = useSectorHierarchy();
  const deleteSectorMutation = useDeleteSector();
  const deleteSubSectorMutation = useDeleteSubSector();
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createParentId, setCreateParentId] = React.useState<
    string | undefined
  >(undefined);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    name: string;
    type: "SECTOR" | "SUB_SECTOR";
  } | null>(null);
  const nodes = toNodes(data || []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6">
        <p className="text-error">Error al cargar la jerarquía de sectores</p>
        <button onClick={() => refetch()} className="btn btn-primary btn-sm">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-base-300 rounded-lg shadow-md">
      <div className="p-4 sm:p-6 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Sectores</h3>
          <p className="text-sm text-base-content/70 mt-1">
            Explora y gestiona los sectores y subsectores de tu iglesia
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm w-full sm:w-auto"
          onClick={() => {
            setCreateParentId(undefined);
            setCreateOpen(true);
          }}
        >
          <RiAddLine className="w-4 h-4" />
          Nuevo Sector
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center gap-6 h-48">
          <p className="text-base-content/70">Cargando jerarquía</p>
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : nodes.length === 0 ? (
        <div className="p-6 text-base-content/70">No hay sectores</div>
      ) : (
        <div className="p-4 sm:p-6 space-y-3">
          {nodes.map((node) => (
            <ParentCollapse
              key={node.id}
              node={node}
              onAddChild={(parentId) => {
                setCreateParentId(parentId);
                setCreateOpen(true);
              }}
              onEdit={(s) => {
                router.push(`/sectors/edit/${s.id}`);
              }}
              onDelete={(s) => {
                setDeleteTarget({ id: s.id, name: s.name, type: node.type });
                setDeleteOpen(true);
              }}
              onAddMembers={(sectorId) =>
                router.push(`/members?sector=${sectorId}`)
              }
            />
          ))}
        </div>
      )}

      <CreateSectorModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
        initialParentId={createParentId}
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        title={`Eliminar ${
          deleteTarget?.type === "SECTOR" ? "Sector" : "Subsector"
        }`}
        entityName={deleteTarget?.name}
        description="Esta acción no se puede deshacer."
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            if (deleteTarget.type === "SECTOR") {
              await deleteSectorMutation.mutateAsync(deleteTarget.id);
            } else {
              await deleteSubSectorMutation.mutateAsync(deleteTarget.id);
            }
            showSuccess(
              `${
                deleteTarget.type === "SECTOR" ? "Sector" : "Subsector"
              } eliminado`
            );
            setDeleteOpen(false);
            setDeleteTarget(null);
            refetch();
          } catch (e) {
            showError(
              `Error al eliminar el ${
                deleteTarget.type === "SECTOR" ? "sector" : "subsector"
              }`
            );
          }
        }}
        isPending={
          deleteSectorMutation.isPending || deleteSubSectorMutation.isPending
        }
      />
    </div>
  );
}

function ParentCollapse({
  node,
  onAddChild,
  onEdit,
  onDelete,
  onAddMembers,
}: {
  node: SectorNode;
  onAddChild: (parentId: string) => void;
  onEdit: (s: { id: string; name: string }) => void;
  onDelete: (s: { id: string; name: string }) => void;
  onAddMembers: (sectorId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={`collapse ${
        open ? "collapse-open" : "collapse-close"
      } bg-base-200`}
    >
      <div className="collapse-title p-3 sm:px-4 text-base font-semibold h-auto min-h-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
          <span className="pointer-events-auto text-sm sm:text-base wrap-break-word pr-2">
            {node.name}
          </span>
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            {node.supervisorName &&
              node.supervisorName !== "Sin supervisor" && (
                <div className="flex flex-wrap text-xs p-2">
                  Supervisor:{" "}
                  <span className="md:ml-2">{node.supervisorName}</span>
                </div>
              )}
            {node.type === "SECTOR" && (
              <div className="badge badge-soft text-xs">
                {node.subSectorsCount} subsectores
              </div>
            )}
            <div className="badge badge-soft text-xs">
              {node.cellsCount} células
            </div>
            <div className="badge badge-soft text-xs">
              {node.membersCount} miembros
            </div>

            <div className="flex items-center gap-1 ml-auto sm:ml-2">
              <button
                className="btn btn-ghost btn-xs sm:btn-sm btn-square"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(node);
                }}
              >
                <RiEdit2Fill className="w-4 h-4" />
              </button>
              <button
                className="btn btn-ghost btn-xs sm:btn-sm btn-square text-error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node);
                }}
              >
                <RiDeleteBinLine className="w-4 h-4" />
              </button>
              {node.type === "SECTOR" && (
                <button
                  className="btn btn-ghost btn-xs sm:btn-sm btn-square text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddChild(node.id);
                  }}
                >
                  <RiAddLine className="w-4 h-4" />
                </button>
              )}
              <button
                className="btn btn-ghost btn-xs sm:btn-sm btn-square"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
              >
                <RiArrowDownSLine
                  className={`w-5 h-5 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="collapse-content bg-base-100">
        <div className="pt-2 pl-2 sm:pl-4 border-l-2 border-base-300 space-y-2">
          {node.children.length > 0 ? (
            node.children.map((child) => (
              <ParentCollapse
                key={child.id}
                node={child}
                onAddChild={onAddChild}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddMembers={onAddMembers}
              />
            ))
          ) : node.cells && node.cells.length > 0 ? (
            <div className="space-y-2">
              {node.cells.map((cell) => (
                <div
                  key={cell.id}
                  className="bg-base-100 p-3 rounded-lg border border-base-200 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{cell.name}</div>
                    <div className="text-xs text-base-content/70 mt-1">
                      Líder: {cell.leaderName} | Anfitrión: {cell.hostName}
                    </div>
                  </div>
                  <div className="badge badge-sm badge-ghost">
                    {cell.membersCount} miembros
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-base-content/50 py-2 italic">
              {node.type === "SECTOR" ? "No hay subsectores" : "No hay células"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
