import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSectors,
  getSectorById,
  getSectorHierarchy,
  getSectorStats,
  createSector,
  updateSector,
  deleteSector,
  createSubSector,
  updateSubSector,
  deleteSubSector,
} from '../actions/sectors.actions';
import {
  SectorsQueryOptions,
  SectorFormData,
  SubSectorFormData,
} from '../types/sectors';

// ============ UTILITY FUNCTIONS ============

const withTimeout = <T>(promise: Promise<T>, timeout = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};

// ============ QUERY FUNCTIONS ============

const fetchAllSectors = async (options?: SectorsQueryOptions) => {
  try {
    const result = await withTimeout(getAllSectors(options));
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error desconocido al obtener sectores'
    );
  }
};

const fetchSector = async (id: string) => {
  try {
    const result = await withTimeout(getSectorById(id));
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error desconocido al obtener sector'
    );
  }
};

// ============ HOOKS ============

export const useSectors = (options?: SectorsQueryOptions) => {
  return useQuery({
    queryKey: ['sectors', 'all', options],
    queryFn: () => fetchAllSectors(options),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSector = (id: string) => {
  return useQuery({
    queryKey: ['sector', id],
    queryFn: () => fetchSector(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSectorHierarchy = () => {
  return useQuery({
    queryKey: ['sectors', 'hierarchy'],
    queryFn: () => withTimeout(getSectorHierarchy()),
    staleTime: 0, // Always fetch fresh data on mount/focus
    gcTime: 10 * 60 * 1000,
  });
};

export const useSectorStats = () => {
  return useQuery<{
    totalSectors: number;
    totalSubSectors: number;
    totalCells: number;
    totalMembers: number;
    membersWithoutCell: number;
  }>({
    queryKey: ['sectors', 'stats'],
    queryFn: () => withTimeout(getSectorStats()),
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SectorFormData) => withTimeout(createSector(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['sectors', 'hierarchy'] });
    },
  });
};

export const useUpdateSector = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SectorFormData>) =>
      withTimeout(updateSector(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['sectors', 'hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['sector', id] });
    },
  });
};

export const useDeleteSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withTimeout(deleteSector(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['sectors', 'hierarchy'] });
    },
  });
};

export const useCreateSubSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubSectorFormData) => withTimeout(createSubSector(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['sectors', 'hierarchy'] });
    },
  });
};

export const useUpdateSubSector = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SubSectorFormData>) =>
      withTimeout(updateSubSector(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['sectors', 'hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['sector', id] });
    },
  });
};

export const useDeleteSubSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withTimeout(deleteSubSector(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['sectors', 'hierarchy'] });
    },
  });
};
