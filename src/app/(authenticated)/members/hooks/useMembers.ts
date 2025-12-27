import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  Member,
  MemberWithMinistries,
  MemberFormData,
} from '@/app/(authenticated)/members/types/member';
import { MemberRole } from '@/generated/prisma/enums';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember as updateMemberAction,
  deleteMember as deleteMemberAction,
  deleteMembers as deleteMembersAction,
  deactivateMember,
  isEmailTaken,
  getMemberStats,
} from '../actions/members.actions';

// ============ TYPES ============

interface MemberResponse {
  success: boolean;
  data: Member;
  error?: string;
  message?: string;
}

interface MembersResponse {
  success: boolean;
  data: MemberWithMinistries[];
  total: number;
  hasMore: boolean;
  error?: string;
}

interface MembersQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  role?: MemberRole;
  orderBy?: 'firstName' | 'lastName' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

interface MemberStats {
  total: number;
  byRole: Record<string, number>;
  byGender: Record<string, number>;
}

// Añadimos un helper para prevenir que las consultas queden colgadas indefinidamente
const withTimeout = <T>(promise: Promise<T>, ms = 15000): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          'Tiempo de espera agotado al obtener datos. Intenta nuevamente.'
        )
      );
    }, ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// ============ QUERY FUNCTIONS ============

// Fetch all members with filtering and pagination
const fetchAllMembers = async (options?: MembersQueryOptions) => {
  try {
    const result = await withTimeout(getAllMembers(options));
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error desconocido al obtener miembros'
    );
  }
};

// Fetch members (legacy - for backward compatibility)
const fetchMembers = async (): Promise<MemberWithMinistries[]> => {
  try {
    const result = await withTimeout(getAllMembers({ limit: 5000 }));
    return result.members;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error desconocido al obtener miembros'
    );
  }
};

// Fetch individual member
const fetchMember = async (id: string): Promise<MemberWithMinistries> => {
  try {
    const member = await getMemberById(id);
    return member;
  } catch (error) {
    console.error('Error fetching member:', error);
    throw error;
  }
};

// Fetch member statistics
const fetchMemberStats = async (): Promise<MemberStats> => {
  try {
    const stats = await getMemberStats();
    return stats;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al obtener estadísticas'
    );
  }
};

// Check if email is available
const checkEmailAvailability = async (
  email: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    const isTaken = await isEmailTaken(email, excludeId);
    return !isTaken; // Return true if email is available (not taken)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al verificar email'
    );
  }
};

// ============ MUTATION FUNCTIONS ============

// Create new member
const createNewMember = async (data: MemberFormData): Promise<Member> => {
  try {
    const member = await createMember(data);
    return member;
  } catch (error) {
    // Preserve the original error message from the server action
    throw error;
  }
};

// Update existing member
const updateExistingMember = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<MemberFormData>;
}): Promise<Member> => {
  try {
    const member = await updateMemberAction(id, data);
    return member;
  } catch (error) {
    // Preserve the original error message from the server action
    throw error;
  }
};

// Delete member permanently
const deleteExistingMember = async (id: string): Promise<void> => {
  try {
    await deleteMemberAction(id);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al eliminar miembro'
    );
  }
};

// Delete multiple members
const deleteMultipleMembers = async (ids: string[]): Promise<void> => {
  try {
    await deleteMembersAction(ids);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al eliminar miembros'
    );
  }
};

// Deactivate member (soft delete)
const deactivateExistingMember = async (id: string): Promise<Member> => {
  try {
    const member = await deactivateMember(id);
    return member;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al desactivar miembro'
    );
  }
};

// ============ QUERY HOOKS ============

// Hook para escuchar cambios de church y invalidar queries
export const useChurchChangeListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleChurchChange = () => {
      // Invalidar todas las queries relacionadas con members
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member'] });
      queryClient.invalidateQueries({ queryKey: ['memberStats'] });
      queryClient.invalidateQueries({ queryKey: ['emailAvailability'] });
    };

    const handleChurchClear = () => {
      // Limpiar todas las queries cuando se limpia el church
      queryClient.clear();
    };

    // Agregar listeners para eventos de cambio de church
    window.addEventListener('churchChanged', handleChurchChange);
    window.addEventListener('churchCleared', handleChurchClear);

    // Cleanup
    return () => {
      window.removeEventListener('churchChanged', handleChurchChange);
      window.removeEventListener('churchCleared', handleChurchClear);
    };
  }, [queryClient]);
};

// Hook for fetching all members with enhanced options
export const useAllMembers = (options?: MembersQueryOptions) => {
  // Escuchar cambios de church
  useChurchChangeListener();

  return useQuery({
    queryKey: ['members', 'all', options],
    queryFn: () => fetchAllMembers(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching all members (legacy - for backward compatibility)
export const useMembers = () => {
  // Escuchar cambios de church
  useChurchChangeListener();

  return useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single member
export const useMember = (id: string) => {
  // Escuchar cambios de church
  useChurchChangeListener();

  return useQuery({
    queryKey: ['member', id],
    queryFn: () => fetchMember(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching member statistics
export const useMemberStats = () => {
  // Escuchar cambios de church
  useChurchChangeListener();

  return useQuery({
    queryKey: ['members', 'stats'],
    queryFn: fetchMemberStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook for checking email availability
export const useEmailAvailability = (email: string, excludeId?: string) => {
  return useQuery({
    queryKey: ['email', 'availability', email, excludeId],
    queryFn: () => checkEmailAvailability(email, excludeId),
    enabled: !!email && email.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============ MUTATION HOOKS ============

// Hook for creating a new member
export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewMember,
    onSuccess: (newMember) => {
      // Add to individual member cache
      queryClient.setQueryData(['member', newMember.id], newMember);

      // Invalidate and refetch all member-related queries
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    },
    // Removido onError para que los errores se propaguen correctamente
  });
};

// Hook for updating a member
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExistingMember,
    onSuccess: (updatedMember) => {
      // Update the individual member cache
      queryClient.setQueryData(['member', updatedMember.id], updatedMember);

      // Invalidate and refetch member-related queries
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', 'stats'] });
    },
    // Removido onError para que los errores se propaguen correctamente
  });
};

// Hook for deleting a member
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExistingMember,
    onSuccess: (_, deletedId) => {
      // Remove from individual member cache
      queryClient.removeQueries({ queryKey: ['member', deletedId] });

      // Invalidate and refetch member-related queries
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    },
    // Removido onError para que los errores se propaguen correctamente
  });
};

// Hook for deleting multiple members
export const useDeleteMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMultipleMembers,
    onSuccess: () => {
      // Invalidate and refetch member-related queries
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    },
  });
};

// Hook for deactivating a member (soft delete)
export const useDeactivateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateExistingMember,
    onSuccess: (deactivatedMember) => {
      // Update the individual member cache
      queryClient.setQueryData(
        ['member', deactivatedMember.id],
        deactivatedMember
      );

      // Invalidate and refetch member-related queries
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', 'stats'] });
    },
    // Removido onError para que los errores se propaguen correctamente
  });
};

// ============ UTILITY HOOKS ============

// Hook for invalidating all member-related queries (useful for manual refresh)
export const useRefreshMembers = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['members'] });
  };
};

// Hook for prefetching a member (useful for hover states or navigation)
export const usePrefetchMember = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['member', id],
      queryFn: () => fetchMember(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// Export types for use in components
export type {
  MemberResponse,
  MembersResponse,
  MembersQueryOptions,
  MemberStats,
};
