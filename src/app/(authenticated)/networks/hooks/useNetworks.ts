import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNetworks,
  createNetwork,
  updateNetwork,
  deleteNetwork,
} from '@/app/(authenticated)/members/actions/networks.actions';

export const useNetworks = () => {
  return useQuery({
    queryKey: ['networks'],
    queryFn: getNetworks,
    staleTime: 5000, // 5 seconds
  });
};

export const useCreateNetwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createNetwork(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networks'] });
    },
  });
};

export const useUpdateNetwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateNetwork(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networks'] });
    },
  });
};

export const useDeleteNetwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNetwork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networks'] });
    },
  });
};
