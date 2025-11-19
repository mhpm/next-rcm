import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  deleteMinistry,
  addMemberToMinistry,
  addMembersToMinistry,
  removeMemberFromMinistry,
} from "../actions/ministries.actions";
import { MinistriesQueryOptions, MinistryFormData } from "../types/ministries";

// ============ UTILITY FUNCTIONS ============

const withTimeout = <T>(promise: Promise<T>, timeout = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
};

// ============ QUERY FUNCTIONS ============

// Fetch all ministries with filtering and pagination
const fetchAllMinistries = async (options?: MinistriesQueryOptions) => {
  try {
    const result = await withTimeout(getAllMinistries(options));
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error desconocido al obtener ministerios"
    );
  }
};

// Fetch ministry by ID
const fetchMinistry = async (id: string) => {
  try {
    const result = await withTimeout(getMinistryById(id));
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error desconocido al obtener ministerio"
    );
  }
};

// ============ HOOKS ============

// Hook for fetching all ministries
export const useMinistries = (options?: MinistriesQueryOptions) => {
  return useQuery({
    queryKey: ["ministries", "all", options],
    queryFn: () => fetchAllMinistries(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single ministry
export const useMinistry = (id: string) => {
  return useQuery({
    queryKey: ["ministry", id],
    queryFn: () => fetchMinistry(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for creating a ministry
export const useCreateMinistry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MinistryFormData) => createMinistry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
    onError: (error) => {
      console.error("Error creating ministry:", error);
    },
  });
};

// Hook for updating a ministry
export const useUpdateMinistry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<MinistryFormData>;
    }) => updateMinistry(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      queryClient.invalidateQueries({ queryKey: ["ministry", id] });
      if (data.leaderId) {
        queryClient.invalidateQueries({ queryKey: ["member", data.leaderId] });
      }
    },
    onError: (error) => {
      console.error("Error updating ministry:", error);
    },
  });
};

// Hook for deleting a ministry
export const useDeleteMinistry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMinistry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
    onError: (error) => {
      console.error("Error deleting ministry:", error);
    },
  });
};

// Hook for prefetching a ministry (useful for hover states or navigation)
export const usePrefetchMinistry = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["ministry", id],
      queryFn: () => fetchMinistry(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// ============ MEMBERSHIP MUTATION HOOKS ============

export const useAddMemberToMinistry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ministryId, memberId }: { ministryId: string; memberId: string }) =>
      addMemberToMinistry(ministryId, memberId),
    onSuccess: (membership) => {
      // Invalidate the ministry detail to refresh members list
      queryClient.invalidateQueries({ queryKey: ["ministry", membership.ministryId] });
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
  });
};

export const useAddMembersToMinistry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ministryId, memberIds }: { ministryId: string; memberIds: string[] }) =>
      addMembersToMinistry(ministryId, memberIds),
    onSuccess: (_, variables) => {
      // Invalidate the ministry detail to refresh members list
      queryClient.invalidateQueries({ queryKey: ["ministry", variables.ministryId] });
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
  });
};

export const useRemoveMemberFromMinistry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ministryId, memberId }: { ministryId: string; memberId: string }) =>
      removeMemberFromMinistry(ministryId, memberId),
    onSuccess: (_, variables) => {
      // Invalidate the ministry detail to refresh members list
      queryClient.invalidateQueries({ queryKey: ["ministry", variables.ministryId] });
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      queryClient.invalidateQueries({ queryKey: ["member", variables.memberId] });
    },
  });
};
