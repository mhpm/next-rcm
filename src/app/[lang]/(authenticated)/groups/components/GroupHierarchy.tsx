'use client';

import React from 'react';
import { useGroupHierarchy, useDeleteGroup } from '../hooks/useGroups';
import type { GroupNode } from '../types/groups';
import CreateGroupModal from './CreateGroupModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useNotificationStore } from '@/store/NotificationStore';
import {
  RiAddLine,
  RiEdit2Fill,
  RiDeleteBinLine,
  RiUserAddLine,
  RiArrowDownSLine,
} from 'react-icons/ri';
import { useRouter, useParams } from 'next/navigation';

function toNodes(data: any[]): GroupNode[] {
  return (data || []).map((g) => ({
    id: g.id,
    name: g.name,
    leaderName: g.leader
      ? `${g.leader.firstName} ${g.leader.lastName}`
      : 'Sin líder',
    leaderId: g.leader?.id ?? null,
    memberCount: g._count?.members ?? 0,
    subgroupCount:
      g._count && typeof g._count.subgroups === 'number'
        ? g._count.subgroups
        : Array.isArray(g.subgroups)
        ? g.subgroups.length
        : 0,
    fields: (g.fields || []).map((f: any) => ({
      key: f.key,
      label: f.label,
      type: f.type,
      value: f.value,
    })),
    children: toNodes(g.subgroups || []),
  }));
}

export default function GroupHierarchy() {
  const { data, isLoading, error, refetch } = useGroupHierarchy();
  const deleteMutation = useDeleteGroup();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || 'es';
  const { showSuccess, showError } = useNotificationStore();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createParentId, setCreateParentId] = React.useState<
    string | undefined
  >(undefined);
  const [createShowParentField, setCreateShowParentField] =
    React.useState<boolean>(true);
  const [createParentReadonly, setCreateParentReadonly] =
    React.useState<boolean>(false);
  const [createParentName, setCreateParentName] = React.useState<
    string | undefined
  >(undefined);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const nodes = toNodes(data || []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6">
        <p className="text-error">Error al cargar la jerarquía de grupos</p>
        <button onClick={() => refetch()} className="btn btn-primary btn-sm">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-base-300 rounded-lg overflow-hidden shadow-md">
      <div className="p-4 sm:p-6 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Grupos</h3>
          <p className="text-sm text-base-content/70 mt-1">
            Explora y gestiona los grupos de tu iglesia
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm w-full sm:w-auto"
          onClick={() => {
            setCreateParentId(undefined);
            setCreateShowParentField(false);
            setCreateParentReadonly(false);
            setCreateParentName(undefined);
            setCreateOpen(true);
          }}
        >
          <RiAddLine className="w-4 h-4" />
          Nuevo Grupo
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center gap-6 h-48">
          <p className="text-base-content/70">Cargando jerarquía</p>
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : nodes.length === 0 ? (
        <div className="p-6 text-base-content/70">No hay grupos padres</div>
      ) : (
        <div className="p-4 sm:p-6 space-y-3">
          {nodes.map((node) => (
            <ParentCollapse
              key={node.id}
              node={node}
              onAddChild={(parentId) => {
                setCreateParentId(parentId);
                setCreateShowParentField(true);
                setCreateParentReadonly(true);
                setCreateParentName(node.name);
                setCreateOpen(true);
              }}
              onEdit={(g) => {
                router.push(`/${lang}/groups/edit/${g.id}`);
              }}
              onDelete={(g) => {
                setDeleteTarget({ id: g.id, name: g.name });
                setDeleteOpen(true);
              }}
              onAddMembers={(groupId) =>
                router.push(`/${lang}/members?group=${groupId}`)
              }
            />
          ))}
        </div>
      )}

      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
        initialParentId={createParentId}
        initialParentName={createParentName}
        parentReadonly={createParentReadonly}
        showParentField={createShowParentField}
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        entityName={deleteTarget?.name}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            showSuccess('Grupo eliminado');
            setDeleteOpen(false);
            setDeleteTarget(null);
            refetch();
          } catch (e) {
            showError('Error al eliminar el grupo');
          }
        }}
        isPending={deleteMutation.isPending}
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
  node: GroupNode;
  onAddChild: (parentId: string) => void;
  onEdit: (g: {
    id: string;
    name: string;
    leaderId?: string | null;
    parentId?: string | null;
  }) => void;
  onDelete: (g: { id: string; name: string }) => void;
  onAddMembers: (groupId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={`collapse ${
        open ? 'collapse-open' : 'collapse-close'
      } bg-base-200`}
    >
      <div className="collapse-title p-3 sm:px-4 text-base font-semibold h-auto min-h-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
          <span className="pointer-events-auto text-sm sm:text-base wrap-break-word pr-2">
            {node.name}
          </span>
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="flex gap-2">
              <span className="badge badge-soft badge-xs sm:badge-sm whitespace-nowrap">
                Miembros: {node.memberCount}
              </span>
              <span className="badge badge-soft badge-xs sm:badge-sm whitespace-nowrap">
                Subgrupos: {node.subgroupCount}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="btn btn-ghost btn-xs btn-square group pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAddMembers(node.id);
                }}
                title="Agregar miembros"
              >
                <RiUserAddLine className="w-4 h-4 transition-colors group-hover:text-primary" />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAddChild(node.id);
                }}
                title="Agregar subgrupo"
              >
                <RiAddLine className="w-4 h-4 transition-colors group-hover:text-primary" />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square group pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEdit({
                    id: node.id,
                    name: node.name,
                    leaderId: node.leaderId || null,
                    parentId: undefined,
                  });
                }}
                title="Editar"
              >
                <RiEdit2Fill className="w-4 h-4 transition-colors group-hover:text-primary" />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square group pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete({ id: node.id, name: node.name });
                }}
                title="Eliminar"
              >
                <RiDeleteBinLine className="w-4 h-4 transition-colors group-hover:text-error" />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square pointer-events-auto"
                aria-label="Toggle"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpen((prev) => !prev);
                }}
              >
                <RiArrowDownSLine
                  className={`w-5 h-5 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="collapse-content">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold">Líder</h4>
              <p className="text-sm text-base-content/80">{node.leaderName}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Campos</h4>
              {node.fields.length === 0 ? (
                <p className="text-sm text-base-content/60">
                  Sin campos configurados
                </p>
              ) : (
                <ul className="text-sm">
                  {node.fields.map((f) => (
                    <li key={f.key} className="flex gap-2">
                      <span className="font-semibold">{f.label || f.key}:</span>
                      <span className="text-base-content/80">
                        {String(f.value ?? '')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {node.children.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Subgrupos</h4>
              <div className="space-y-2">
                {node.children.map((child) => (
                  <ChildItem
                    key={child.id}
                    node={child}
                    onAddChild={onAddChild}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddMembers={onAddMembers}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChildItem({
  node,
  onAddChild,
  onEdit,
  onDelete,
  onAddMembers,
}: {
  node: GroupNode;
  onAddChild: (parentId: string) => void;
  onEdit: (g: {
    id: string;
    name: string;
    leaderId?: string | null;
    parentId?: string | null;
  }) => void;
  onDelete: (g: { id: string; name: string }) => void;
  onAddMembers: (groupId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={`collapse ${
        open ? 'collapse-open' : 'collapse-close'
      } bg-base-100 border border-base-300`}
    >
      <div className="collapse-title p-3 sm:px-4 text-base font-semibold h-auto min-h-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
          <span className="pointer-events-auto text-sm sm:text-base wrap-break-word pr-2">
            {node.name}
          </span>
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="flex gap-2">
              <span className="badge badge-soft badge-xs sm:badge-sm whitespace-nowrap">
                Miembros: {node.memberCount}
              </span>
              <span className="badge badge-soft badge-xs sm:badge-sm whitespace-nowrap">
                Subgrupos: {node.subgroupCount}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="btn btn-ghost btn-xs btn-square group pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAddMembers(node.id);
                }}
                title="Agregar miembros"
              >
                <RiUserAddLine className="w-4 h-4 transition-colors group-hover:text-primary" />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAddChild(node.id);
                }}
                title="Agregar subgrupo"
              >
                <RiAddLine className="w-4 h-4 transition-colors group-hover:text-primary" />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square group pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEdit({
                    id: node.id,
                    name: node.name,
                    leaderId: node.leaderId || null,
                    parentId: undefined,
                  });
                }}
                title="Editar"
              >
                <RiEdit2Fill className="w-4 h-4 transition-colors group-hover:text-primary" />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square group pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete({ id: node.id, name: node.name });
                }}
                title="Eliminar"
              >
                <RiDeleteBinLine className="w-4 h-4 transition-colors group-hover:text-error" />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square pointer-events-auto"
                aria-label="Toggle"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpen((prev) => !prev);
                }}
              >
                <RiArrowDownSLine
                  className={`w-5 h-5 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="collapse-content">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs font-semibold">Líder</h5>
              <p className="text-xs text-base-content/80">{node.leaderName}</p>
            </div>
            <div>
              <h5 className="text-xs font-semibold">Campos</h5>
              {node.fields.length === 0 ? (
                <p className="text-xs text-base-content/60">Sin campos</p>
              ) : (
                <ul className="text-xs">
                  {node.fields.map((f) => (
                    <li key={f.key} className="flex gap-2">
                      <span className="font-semibold">{f.label || f.key}:</span>
                      <span className="text-base-content/80">
                        {String(f.value ?? '')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {node.children.length > 0 && (
            <div className="mt-3">
              <h5 className="text-xs font-semibold mb-1">Subgrupos</h5>
              <div className="space-y-1">
                {node.children.map((child) => (
                  <ChildItem
                    key={child.id}
                    node={child}
                    onAddChild={onAddChild}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddMembers={onAddMembers}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
