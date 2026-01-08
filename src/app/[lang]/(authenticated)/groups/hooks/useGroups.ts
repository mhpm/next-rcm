import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllGroups,
  createGroup,
  deleteGroup,
  getGroupHierarchy,
  updateGroup,
  getGroupsList,
} from '../actions/groups.actions';
import type { GroupFormData, GroupsQueryOptions } from '../types/groups';

const withTimeout = <T>(promise: Promise<T>, timeout = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};

export const useGroups = (options?: GroupsQueryOptions) => {
  return useQuery({
    queryKey: ['groups', 'all', options],
    queryFn: () => withTimeout(getAllGroups(options)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GroupFormData) => createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useGroupsList = (excludeId?: string) => {
  return useQuery({
    queryKey: ['groups', 'list', excludeId ?? 'none'],
    queryFn: () => getGroupsList(excludeId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGroupHierarchy = () => {
  return useQuery({
    queryKey: ['groups', 'hierarchy'],
    queryFn: () => getGroupHierarchy(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', 'hierarchy'] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GroupFormData> }) =>
      updateGroup(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', 'hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['group', id] });
    },
  });
};
