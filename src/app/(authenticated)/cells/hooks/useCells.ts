import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCells,
  getCellById,
  createCell,
  updateCell,
  deleteCell,
  addMemberToCell,
  addMembersToCell,
  removeMemberFromCell,
  getCellStats,
} from "../actions/cells.actions";
import { CellsQueryOptions } from "../types/cells";
import type { CellListItem, CellWithRelations } from "../types/cells";

const withTimeout = <T>(promise: Promise<T>, timeout = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
};

const fetchAllCells = async (options?: CellsQueryOptions) => {
  try {
    const result = await withTimeout(getAllCells(options));
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener células"
    );
  }
};

export const useCells = (options?: CellsQueryOptions) => {
  return useQuery<{ cells: CellListItem[]; total: number; hasMore: boolean }>({
    queryKey: ["cells", "all", options],
    queryFn: () => fetchAllCells(options),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

const fetchCellStats = async () => {
  return getCellStats();
};

export const useCellStats = () => {
  return useQuery({
    queryKey: ["cells", "stats"],
    queryFn: () => fetchCellStats(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useDeleteCell = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCell(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["cells"] });
      queryClient.invalidateQueries({ queryKey: ["cell", id] });
      queryClient.invalidateQueries({ queryKey: ["cell", "members", id] });
      // Refrescar listados de miembros para que aparezcan como disponibles
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", "all"] });
    },
  });
};

export const useCell = (id: string) => {
  return useQuery<CellWithRelations>({
    queryKey: ["cell", id],
    queryFn: () => withTimeout(getCellById(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateCell = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      subSectorId?: string | null;
      leaderId?: string | null;
      hostId?: string | null;
    }) => createCell(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cells"] });
    },
  });
};

export const useUpdateCell = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        subSectorId?: string | null;
        leaderId?: string | null;
        hostId?: string | null;
      };
    }) => updateCell(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["cells"] });
      queryClient.invalidateQueries({ queryKey: ["cell", id] });
    },
  });
};

export const useAddMemberToCell = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cellId, memberId }: { cellId: string; memberId: string }) =>
      addMemberToCell(cellId, memberId),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["cell", vars.cellId] });
      queryClient.invalidateQueries({ queryKey: ["cells"] });
    },
  });
};

export const useAddMembersToCell = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cellId,
      memberIds,
    }: {
      cellId: string;
      memberIds: string[];
    }) => addMembersToCell(cellId, memberIds),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["cell", vars.cellId] });
      queryClient.invalidateQueries({
        queryKey: ["cell", "members", vars.cellId],
      });
      queryClient.invalidateQueries({ queryKey: ["cells"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", "all"] });
    },
  });
};

export const useRemoveMemberFromCell = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cellId, memberId }: { cellId: string; memberId: string }) =>
      removeMemberFromCell(cellId, memberId),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["cell", vars.cellId] });
      queryClient.invalidateQueries({
        queryKey: ["cell", "members", vars.cellId],
      });
      queryClient.invalidateQueries({ queryKey: ["cells"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", "all"] });
    },
  });
};
