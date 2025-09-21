import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Member, MemberFormData } from '@/types';
import { MemberRole } from '@/generated/prisma';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember as updateMemberAction,
  deleteMember as deleteMemberAction,
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
  data: Member[];
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

// ============ QUERY FUNCTIONS ============

// Fetch all members with filtering and pagination
const fetchAllMembers = async (options?: MembersQueryOptions) => {
  try {
    const result = await getAllMembers(options);
    return result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error desconocido al obtener miembros');
  }
};

// Fetch members (legacy - for backward compatibility)
const fetchMembers = async (): Promise<Member[]> => {
  try {
    const result = await getAllMembers({ limit: 50 });
    return result.members;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error desconocido al obtener miembros');
  }
};

// Fetch individual member
const fetchMember = async (id: string): Promise<Member> => {
  try {
    const member = await getMemberById(id);
    return member;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error desconocido al obtener miembro');
  }
};

// Fetch member statistics
const fetchMemberStats = async (): Promise<MemberStats> => {
  try {
    const stats = await getMemberStats();
    return stats;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al obtener estadísticas');
  }
};

// Check if email is available
const checkEmailAvailability = async (email: string, excludeId?: string): Promise<boolean> => {
  try {
    const isTaken = await isEmailTaken(email, excludeId);
    return !isTaken; // Return true if email is available (not taken)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al verificar email');
  }
};

// ============ MUTATION FUNCTIONS ============

// Create new member
const createNewMember = async (data: MemberFormData): Promise<Member> => {
  try {
    const member = await createMember(data);
    return member;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al crear miembro');
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
    throw new Error(error instanceof Error ? error.message : 'Error al actualizar miembro');
  }
};

// Delete member permanently
const deleteExistingMember = async (id: string): Promise<void> => {
  try {
    await deleteMemberAction(id);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al eliminar miembro');
  }
};

// Deactivate member (soft delete)
const deactivateExistingMember = async (id: string): Promise<Member> => {
  try {
    const member = await deactivateMember(id);
    return member;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al desactivar miembro');
  }
};

// ============ QUERY HOOKS ============

// Hook for fetching all members with enhanced options
export const useAllMembers = (options?: MembersQueryOptions) => {
  return useQuery({
    queryKey: ['members', 'all', options],
    queryFn: () => fetchAllMembers(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching all members (legacy - for backward compatibility)
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single member
export const useMember = (id: string) => {
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
    },
    onError: (error) => {
      console.error('Error creating member:', error);
    },
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
    onError: (error) => {
      console.error('Error updating member:', error);
    },
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
    },
    onError: (error) => {
      console.error('Error deleting member:', error);
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
      queryClient.setQueryData(['member', deactivatedMember.id], deactivatedMember);

      // Invalidate and refetch member-related queries
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', 'stats'] });
    },
    onError: (error) => {
      console.error('Error deactivating member:', error);
    },
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
  MemberStats 
};
