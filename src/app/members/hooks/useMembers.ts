import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Member, UpdateMemberData } from '@/types';

interface MemberResponse {
  success: boolean;
  data: Member;
  error?: string;
  message?: string;
}

interface MembersResponse {
  success: boolean;
  data: Member[];
  error?: string;
}

// Fetch all members
const fetchMembers = async (): Promise<Member[]> => {
  const response = await fetch('/api/members');

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result: MembersResponse = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Error desconocido');
  }
};

// Fetch individual member
const fetchMember = async (id: string): Promise<Member> => {
  const response = await fetch(`/api/members/${id}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result: MemberResponse = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Error desconocido');
  }
};

// Update member
const updateMember = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateMemberData;
}): Promise<Member> => {
  const response = await fetch(`/api/members/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result: MemberResponse = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Error al actualizar miembro');
  }
};

// Delete member
const deleteMember = async (id: string): Promise<void> => {
  const response = await fetch(`/api/members/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result: MemberResponse = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Error al eliminar miembro');
  }
};

// Hook for fetching all members
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

// Hook for updating a member
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMember,
    onSuccess: (updatedMember) => {
      // Update the individual member cache
      queryClient.setQueryData(['member', updatedMember.id], updatedMember);

      // Invalidate and refetch the members list
      queryClient.invalidateQueries({ queryKey: ['members'] });
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
    mutationFn: deleteMember,
    onSuccess: (_, deletedId) => {
      // Remove from individual member cache
      queryClient.removeQueries({ queryKey: ['member', deletedId] });

      // Invalidate and refetch the members list
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      console.error('Error deleting member:', error);
    },
  });
};

// Export types for use in components
export type { MemberResponse, MembersResponse };
