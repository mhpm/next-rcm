'use client';

import React from 'react';
import {
  useSectorHierarchy,
  useDeleteSector,
  useDeleteSubSector,
  useDeleteCell,
} from '../hooks/useSectors';
import { updateCell } from '../../cells/actions/cells.actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SectorNode, CellNode } from '../types/sectors';
import CreateSectorModal from './CreateSectorModal';
import EditSectorModal from './EditSectorModal';
import CreateCellModal from '@/app/[lang]/(authenticated)/cells/components/CreateCellModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useNotificationStore } from '@/store/NotificationStore';
import Link from 'next/link';
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  Grid2X2,
  ChevronsDown,
  ChevronsUp,
  ChevronDown,
  ExternalLink,
  Loader2,
  Search,
} from 'lucide-react';
import { RiCloseLine } from 'react-icons/ri';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, useParams } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function toNodes(
  data: any[],
  type: 'SECTOR' | 'SUB_SECTOR' = 'SECTOR',
  parentId: string | null = null
): SectorNode[] {
  return (data || []).map((s) => {
    const isSector = type === 'SECTOR';
    const childrenData = isSector ? s.subSectors || [] : [];
    const children = toNodes(childrenData, 'SUB_SECTOR', s.id);

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
        ? s.cells
            .map((c: any) => ({
              id: c.id,
              name: c.name,
              leaderName: c.leader
                ? `${c.leader.firstName} ${c.leader.lastName}`
                : 'Sin líder',
              hostName: c.host
                ? `${c.host.firstName} ${c.host.lastName}`
                : 'Sin anfitrión',
              assistantName: c.assistant
                ? `${c.assistant.firstName} ${c.assistant.lastName}`
                : 'Sin asistente',
              membersCount: c._count?.members ?? 0,
              accessCode: c.accessCode,
            }))
            .sort((a: CellNode, b: CellNode) =>
              a.name.localeCompare(b.name, undefined, { numeric: true })
            )
        : undefined;

    return {
      id: s.id,
      name: s.name,
      type,
      supervisorName: s.supervisor
        ? `${s.supervisor.firstName} ${s.supervisor.lastName}`
        : 'Sin supervisor',
      supervisorId: s.supervisor?.id ?? null,
      parentId: parentId,
      zoneId: s.zone_id ?? null,
      membersCount,
      cellsCount,
      subSectorsCount: isSector ? children.length : 0,
      children,
      cells,
    };
  });
}

export default function SectorHierarchy() {
  const { data, isLoading, isFetching, error, refetch } = useSectorHierarchy();
  const deleteSectorMutation = useDeleteSector();
  const deleteSubSectorMutation = useDeleteSubSector();
  const deleteCellMutation = useDeleteCell();
  const isAnyMutationPending =
    deleteSectorMutation.isPending ||
    deleteSubSectorMutation.isPending ||
    deleteCellMutation.isPending;
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || 'es';
  const { showSuccess, showError } = useNotificationStore();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createParentId, setCreateParentId] = React.useState<
    string | undefined
  >(undefined);
  const [createCellOpen, setCreateCellOpen] = React.useState(false);
  const [targetSubSector, setTargetSubSector] = React.useState<{
    id: string;
    sectorId: string;
  } | null>(null);

  const [editOpen, setEditOpen] = React.useState(false);
  const [editNode, setEditNode] = React.useState<SectorNode | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    name: string;
    type: 'SECTOR' | 'SUB_SECTOR' | 'CELL';
  } | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const nodes = React.useMemo(() => {
    const allNodes = toNodes(data || []);
    if (!searchQuery.trim()) return allNodes;

    const query = searchQuery.toLowerCase();

    // Recursive filter function
    const filterNode = (node: SectorNode): SectorNode | null => {
      // Check if node itself matches
      const matches =
        node.name.toLowerCase().includes(query) ||
        (node.supervisorName || '').toLowerCase().includes(query);

      // Check children (subsectors)
      const filteredChildren = node.children
        .map((child) => filterNode(child))
        .filter((child): child is SectorNode => child !== null);

      // Check cells
      const filteredCells = node.cells?.filter(
        (cell) =>
          cell.name.toLowerCase().includes(query) ||
          cell.leaderName.toLowerCase().includes(query) ||
          cell.hostName.toLowerCase().includes(query) ||
          cell.assistantName.toLowerCase().includes(query)
      );

      // Return node if it matches OR has matching children OR has matching cells
      if (
        matches ||
        filteredChildren.length > 0 ||
        (filteredCells && filteredCells.length > 0)
      ) {
        return {
          ...node,
          children: filteredChildren,
          cells: filteredCells,
        };
      }

      return null;
    };

    return allNodes
      .map((node) => filterNode(node))
      .filter((node): node is SectorNode => node !== null);
  }, [data, searchQuery]);

  // Auto-expand on search
  React.useEffect(() => {
    if (searchQuery.trim()) {
      const allIds = new Set<string>();
      const collectIds = (nodesList: SectorNode[]) => {
        nodesList.forEach((node) => {
          allIds.add(node.id);
          if (node.children) collectIds(node.children);
        });
      };
      collectIds(nodes);
      setExpandedIds(allIds);
    }
  }, [searchQuery, nodes]);

  const queryClient = useQueryClient();
  const [editingAccessCode, setEditingAccessCode] = React.useState<{
    id: string;
    code: string;
  } | null>(null);

  const updateCellMutation = useMutation({
    mutationFn: (data: { id: string; accessCode: string }) =>
      updateCell(data.id, { accessCode: data.accessCode }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sectors', 'hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['sectors', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['cell', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['cells'] });
      setEditingAccessCode(null);
      showSuccess('Clave de acceso actualizada');
    },
    onError: (error) => {
      showError(
        error instanceof Error
          ? error.message
          : 'Error al actualizar la clave de acceso'
      );
    },
  });

  // State for expansion
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  const getAllIds = React.useCallback((nodes: SectorNode[]) => {
    const ids: string[] = [];
    const traverse = (list: SectorNode[]) => {
      list.forEach((node) => {
        ids.push(node.id);
        if (node.children) traverse(node.children);
      });
    };
    traverse(nodes);
    return ids;
  }, []);

  const allNodeIds = React.useMemo(() => getAllIds(nodes), [nodes, getAllIds]);
  const isAllExpanded =
    allNodeIds.length > 0 && expandedIds.size === allNodeIds.length;

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(allNodeIds));
    }
  };

  const toggleNode = (id: string) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6">
        <p className="text-destructive">
          Error al cargar la jerarquía de sectores
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6">
        <div>
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            Jerarquía de Sectores
            {(isFetching || isAnyMutationPending) && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
          <CardDescription>
            Gestiona la estructura de sectores, subsectores y células.
          </CardDescription>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar sector, célula o líder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
              >
                <RiCloseLine className="w-4 h-4" />
                <span className="sr-only">Limpiar búsqueda</span>
              </Button>
            )}
          </div>

          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={toggleExpandAll}
              className="flex-1 sm:flex-none"
              disabled={
                nodes.length === 0 || isFetching || isAnyMutationPending
              }
            >
              {isAllExpanded ? (
                <>
                  <ChevronsUp className="mr-2 h-4 w-4" />
                  Colapsar
                </>
              ) : (
                <>
                  <ChevronsDown className="mr-2 h-4 w-4" />
                  Expandir
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                setCreateParentId(undefined);
                setCreateOpen(true);
              }}
              className="flex-1 sm:flex-none"
              disabled={isFetching || isAnyMutationPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Sector
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:px-6 sm:pb-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center gap-6 h-48">
            <p className="text-muted-foreground">Cargando jerarquía</p>
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : nodes.length === 0 ? (
          <div className="p-6 text-muted-foreground text-center">
            No hay sectores registrados
          </div>
        ) : (
          <div className="space-y-4 p-0 sm:p-6">
            {nodes.map((node) => (
              <SectorItem
                key={node.id}
                node={node}
                expandedIds={expandedIds}
                onToggle={toggleNode}
                onAddChild={(parentId: string) => {
                  setCreateParentId(parentId);
                  setCreateOpen(true);
                }}
                onEdit={(node: SectorNode) => {
                  setEditNode(node);
                  setEditOpen(true);
                }}
                onDelete={(s: { id: string; name: string }) => {
                  setDeleteTarget({ id: s.id, name: s.name, type: node.type });
                  setDeleteOpen(true);
                }}
                onDeleteCell={(c: { id: string; name: string }) => {
                  setDeleteTarget({ id: c.id, name: c.name, type: 'CELL' });
                  setDeleteOpen(true);
                }}
                onAddMembers={(sectorId: string) =>
                  router.push(`/${lang}/members?sector=${sectorId}`)
                }
                onAddCell={(subSectorId: string, sectorId: string) => {
                  setTargetSubSector({ id: subSectorId, sectorId });
                  setCreateCellOpen(true);
                }}
                onEditAccessCode={(id: string, code: string) =>
                  setEditingAccessCode({ id, code })
                }
                disabled={isFetching || isAnyMutationPending}
              />
            ))}
          </div>
        )}
      </CardContent>

      <Dialog
        open={!!editingAccessCode}
        onOpenChange={(open) => !open && setEditingAccessCode(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clave de Acceso</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="accessCode">Clave de la célula</Label>
            <Input
              id="accessCode"
              value={editingAccessCode?.code || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditingAccessCode((prev) =>
                  prev ? { ...prev, code: e.target.value } : null
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editingAccessCode) {
                  e.preventDefault();
                  updateCellMutation.mutate({
                    id: editingAccessCode.id,
                    accessCode: editingAccessCode.code,
                  });
                }
              }}
              placeholder="Ingrese la clave"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingAccessCode(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (editingAccessCode) {
                  updateCellMutation.mutate({
                    id: editingAccessCode.id,
                    accessCode: editingAccessCode.code,
                  });
                }
              }}
              disabled={updateCellMutation.isPending}
            >
              {updateCellMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateSectorModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
        initialParentId={createParentId}
      />

      <EditSectorModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditNode(null);
        }}
        onUpdated={() => refetch()}
        node={editNode}
      />

      <CreateCellModal
        open={createCellOpen}
        onClose={() => {
          setCreateCellOpen(false);
          setTargetSubSector(null);
        }}
        onCreated={() => refetch()}
        initialData={
          targetSubSector
            ? {
                subSectorId: targetSubSector.id,
                sectorId: targetSubSector.sectorId,
              }
            : undefined
        }
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        title={`Eliminar ${
          deleteTarget?.type === 'SECTOR'
            ? 'Sector'
            : deleteTarget?.type === 'SUB_SECTOR'
            ? 'Subsector'
            : 'Célula'
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
            if (deleteTarget.type === 'SECTOR') {
              await deleteSectorMutation.mutateAsync(deleteTarget.id);
            } else if (deleteTarget.type === 'SUB_SECTOR') {
              await deleteSubSectorMutation.mutateAsync(deleteTarget.id);
            } else {
              await deleteCellMutation.mutateAsync(deleteTarget.id);
            }
            showSuccess(
              `${
                deleteTarget.type === 'SECTOR'
                  ? 'Sector'
                  : deleteTarget.type === 'SUB_SECTOR'
                  ? 'Subsector'
                  : 'Célula'
              } eliminado`
            );
            setDeleteOpen(false);
            setDeleteTarget(null);
            refetch();
          } catch (e) {
            showError(
              `Error al eliminar el ${
                deleteTarget.type === 'SECTOR'
                  ? 'sector'
                  : deleteTarget.type === 'SUB_SECTOR'
                  ? 'subsector'
                  : 'célula'
              }`
            );
          }
        }}
        isPending={
          deleteSectorMutation.isPending ||
          deleteSubSectorMutation.isPending ||
          deleteCellMutation.isPending
        }
      />
    </Card>
  );
}

function SectorItem({
  node,
  expandedIds,
  onToggle,
  onAddChild,
  onEdit,
  onDelete,
  onDeleteCell,
  onAddMembers,
  onAddCell,
  parentSectorId,
  onEditAccessCode,
  disabled,
}: {
  node: SectorNode;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onEdit: (node: SectorNode) => void;
  onDelete: (s: { id: string; name: string }) => void;
  onDeleteCell: (c: { id: string; name: string }) => void;
  onAddMembers: (sectorId: string) => void;
  onAddCell: (subSectorId: string, sectorId: string) => void;
  parentSectorId?: string;
  onEditAccessCode: (id: string, code: string) => void;
  disabled?: boolean;
}) {
  const params = useParams();
  const lang = (params?.lang as string) || 'es';
  const isOpen = expandedIds.has(node.id);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={() => onToggle(node.id)}
      className="group/collapsible"
    >
      <div className="flex items-center justify-between py-2 pr-2 hover:bg-muted/30 rounded-md transition-colors">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="p-2 hover:bg-transparent justify-start gap-2 h-auto font-semibold text-base sm:text-lg flex-1"
          >
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform duration-200 text-muted-foreground',
                isOpen ? '' : '-rotate-90'
              )}
            />
            <span
              className={cn(
                'text-foreground',
                node.type === 'SUB_SECTOR' && 'text-sm sm:text-base'
              )}
            >
              {node.name}
            </span>
          </Button>
        </CollapsibleTrigger>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            {node.supervisorName &&
              node.supervisorName !== 'Sin supervisor' && (
                <>
                  <span className="mr-2">Supervisor:</span>
                  <span className="font-medium text-foreground">
                    {node.supervisorName}
                  </span>
                </>
              )}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {node.type === 'SECTOR' && (
              <Badge variant="secondary" className="font-normal">
                {node.subSectorsCount} subsectores
              </Badge>
            )}
            <Badge variant="secondary" className="font-normal">
              {node.cellsCount} células
            </Badge>
            <Badge variant="secondary" className="font-normal">
              {node.membersCount} miembros
            </Badge>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={disabled}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Acciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(node)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>

                {node.type === 'SECTOR' && (
                  <DropdownMenuItem onClick={() => onAddChild(node.id)}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Subsector
                  </DropdownMenuItem>
                )}

                {node.type === 'SUB_SECTOR' && parentSectorId && (
                  <DropdownMenuItem
                    onClick={() => onAddCell(node.id, parentSectorId)}
                  >
                    <Grid2X2 className="mr-2 h-4 w-4" /> Agregar Célula
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => onDelete(node)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <CollapsibleContent>
        <div className="pl-3 sm:pl-8 ml-1 sm:ml-4 border-l border-border/50 space-y-4 pt-2 pb-4 pr-2">
          {/* Mobile stats */}
          <div className="flex sm:hidden flex-col gap-3 pb-2 text-sm text-muted-foreground">
            {node.supervisorName &&
              node.supervisorName !== 'Sin supervisor' && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wider opacity-70">
                    Supervisor
                  </span>
                  <span className="font-medium text-foreground text-sm">
                    {node.supervisorName}
                  </span>
                </div>
              )}
            <div className="flex flex-wrap gap-2">
              {node.type === 'SECTOR' && (
                <Badge variant="outline" className="text-xs">
                  {node.subSectorsCount} subsectores
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {node.cellsCount} células
              </Badge>
              <Badge variant="outline" className="text-xs">
                {node.membersCount} miembros
              </Badge>
            </div>
          </div>

          {node.children.length > 0 ? (
            <div className="space-y-2">
              {node.children.map((child) => (
                <SectorItem
                  key={child.id}
                  node={child}
                  expandedIds={expandedIds}
                  onToggle={onToggle}
                  onAddChild={onAddChild}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDeleteCell={onDeleteCell}
                  onAddMembers={onAddMembers}
                  onAddCell={onAddCell}
                  parentSectorId={node.type === 'SECTOR' ? node.id : undefined}
                  onEditAccessCode={onEditAccessCode}
                  disabled={disabled}
                />
              ))}
            </div>
          ) : node.cells && node.cells.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {node.cells.map((cell) => (
                <Card
                  key={cell.id}
                  className="bg-card/50 hover:bg-card transition-colors border-dashed"
                >
                  <CardHeader className="p-3 pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <Link
                        href={`/${lang}/cells/edit/${cell.id}`}
                        className="font-medium hover:underline flex items-center gap-2 text-primary w-full sm:w-auto"
                      >
                        <span className="truncate">{cell.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-50 shrink-0" />
                      </Link>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <span className="text-muted-foreground">Clave:</span>
                          <span className="font-mono">
                            {cell.accessCode || '---'}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() =>
                              onEditAccessCode(cell.id, cell.accessCode || '')
                            }
                            title="Editar clave de acceso"
                            disabled={disabled}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onDeleteCell(cell)}
                            title="Eliminar célula"
                            disabled={disabled}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {cell.membersCount} miembros
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground mt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                          Líder
                        </span>
                        <span className="text-foreground text-xs">
                          {cell.leaderName}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                          Asistente
                        </span>
                        <span className="text-foreground text-xs">
                          {cell.assistantName}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                          Anfitrión
                        </span>
                        <span className="text-foreground text-xs">
                          {cell.hostName}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic py-2 pl-2">
              {node.type === 'SECTOR'
                ? 'No hay subsectores registrados'
                : 'No hay células registradas'}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
