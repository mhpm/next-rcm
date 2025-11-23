import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCells, deleteCell } from "../actions/cells.actions";
import { CellsQueryOptions } from "../types/cells";

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
  return useQuery({
    queryKey: ["cells", "all", options],
    queryFn: () => fetchAllCells(options),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDeleteCell = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCell(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cells"] });
    },
  });
};